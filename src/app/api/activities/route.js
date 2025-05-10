import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/activities - Lấy danh sách hoạt động xanh
export async function GET(request) {
  try {
    const activities = await prisma.greenActivity.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST /api/activities - Tạo hoạt động xanh mới
export async function POST(request) {
  try {
    const data = await request.json();
    
    const activity = await prisma.greenActivity.create({
      data: {
        name: data.name,
        description: data.description,
        points: data.points,
        icon: data.icon
      }
    });
    
    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}