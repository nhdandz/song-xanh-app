import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    const where = {};
    if (category) where.category = category;
    if (available !== null) where.available = available === 'true';

    const rewards = await prisma.reward.findMany({
      where,
      orderBy: { points: 'asc' },
    });

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, rewardId } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (!reward.available || reward.stock <= 0) {
      return NextResponse.json(
        { error: 'Reward not available' },
        { status: 400 }
      );
    }

    if (user.points < reward.points) {
      return NextResponse.json(
        { error: 'Not enough points' },
        { status: 400 }
      );
    }

    const [redemption, updatedUser, updatedReward, transaction] = await prisma.$transaction([
      prisma.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          pointsUsed: reward.points,
          status: 'pending',
        },
        include: {
          reward: true,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: reward.points } },
      }),
      prisma.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      }),
      prisma.pointTransaction.create({
        data: {
          userId,
          amount: -reward.points,
          type: 'redemption',
          source: 'reward',
          sourceId: rewardId,
          description: `Đổi quà: ${reward.title}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      redemption,
      points: updatedUser.points,
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return NextResponse.json(
      { error: 'Failed to redeem reward' },
      { status: 500 }
    );
  }
}
