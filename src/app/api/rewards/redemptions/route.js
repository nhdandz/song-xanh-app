import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireSelfOrAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const { error } = await requireSelfOrAdmin(userId);

    if (error) return error;


    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const redemptions = await prisma.rewardRedemption.findMany({
      where: { userId },
      include: {
        reward: true,
      },
      orderBy: { redeemedAt: 'desc' },
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    );
  }
}
