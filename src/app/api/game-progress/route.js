import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameType = searchParams.get('gameType');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const where = { userId };
    if (gameType) where.gameType = gameType;

    if (gameType) {
      const progress = await prisma.gameProgress.findUnique({
        where: {
          userId_gameType: {
            userId,
            gameType,
          },
        },
      });
      return NextResponse.json(progress || null);
    }

    const allProgress = await prisma.gameProgress.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(allProgress);
  } catch (error) {
    console.error('Error fetching game progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game progress' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, gameType, data, pointsEarned } = body;

    if (!userId || !gameType || !data) {
      return NextResponse.json(
        { error: 'userId, gameType, and data are required' },
        { status: 400 }
      );
    }

    const existingProgress = await prisma.gameProgress.findUnique({
      where: {
        userId_gameType: {
          userId,
          gameType,
        },
      },
    });

    const progress = await prisma.gameProgress.upsert({
      where: {
        userId_gameType: {
          userId,
          gameType,
        },
      },
      update: {
        data,
        points: existingProgress ? existingProgress.points + (pointsEarned || 0) : pointsEarned || 0,
      },
      create: {
        userId,
        gameType,
        data,
        points: pointsEarned || 0,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error saving game progress:', error);
    return NextResponse.json(
      { error: 'Failed to save game progress' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, gameType, pointsEarned, data } = body;

    if (!userId || !gameType || !pointsEarned) {
      return NextResponse.json(
        { error: 'userId, gameType, and pointsEarned are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [updatedUser, transaction, progress] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: pointsEarned } },
      }),
      prisma.pointTransaction.create({
        data: {
          userId,
          amount: pointsEarned,
          type: 'earn',
          source: 'game',
          sourceId: gameType,
          description: `Kiếm điểm từ game: ${gameType}`,
        },
      }),
      prisma.gameProgress.upsert({
        where: {
          userId_gameType: {
            userId,
            gameType,
          },
        },
        update: {
          data: data || {},
          points: { increment: pointsEarned },
        },
        create: {
          userId,
          gameType,
          data: data || {},
          points: pointsEarned,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      points: updatedUser.points,
      progress,
    });
  } catch (error) {
    console.error('Error awarding game points:', error);
    return NextResponse.json(
      { error: 'Failed to award game points' },
      { status: 500 }
    );
  }
}
