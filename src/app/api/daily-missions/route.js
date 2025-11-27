import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const missions = await prisma.dailyMission.findMany({
      where: { active: true },
      orderBy: { points: 'asc' },
    });

    if (!userId) {
      return NextResponse.json(missions);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedMissions = await prisma.userDailyMission.findMany({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
      select: {
        missionId: true,
      },
    });

    const completedIds = completedMissions.map((m) => m.missionId);

    const missionsWithStatus = missions.map((mission) => ({
      ...mission,
      completed: completedIds.includes(mission.id),
    }));

    return NextResponse.json(missionsWithStatus);
  } catch (error) {
    console.error('Error fetching daily missions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily missions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, missionId } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const mission = await prisma.dailyMission.findUnique({
      where: { id: missionId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCompletion = await prisma.userDailyMission.findFirst({
      where: {
        userId,
        missionId,
        date: {
          gte: today,
        },
      },
    });

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Mission already completed today' },
        { status: 400 }
      );
    }

    const [completion, updatedUser, transaction] = await prisma.$transaction([
      prisma.userDailyMission.create({
        data: {
          userId,
          missionId,
          date: new Date(),
        },
        include: {
          mission: true,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: mission.points } },
      }),
      prisma.pointTransaction.create({
        data: {
          userId,
          amount: mission.points,
          type: 'earn',
          source: 'daily_mission',
          sourceId: missionId,
          description: `Hoàn thành nhiệm vụ: ${mission.title}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      completion,
      points: updatedUser.points,
    });
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json(
      { error: 'Failed to complete mission' },
      { status: 500 }
    );
  }
}
