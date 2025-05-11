import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/activities - Lấy danh sách hoạt động xanh
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Lấy danh sách tất cả hoạt động xanh
    const activities = await prisma.greenActivity.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    // Nếu có userId, lấy thêm các hoạt động mà người dùng đã hoàn thành trong ngày hôm nay
    if (userId) {
      // Lấy ngày hôm nay (đầu ngày)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Lấy hoạt động của người dùng trong ngày hôm nay
      const userActivitiesToday = await prisma.userActivity.findMany({
        where: {
          userId: userId,
          date: {
            gte: today
          }
        },
        select: {
          activityId: true
        }
      });
      
      // Tạo một Set các activityId mà người dùng đã hoàn thành
      const completedActivityIds = new Set(
        userActivitiesToday.map(activity => activity.activityId)
      );
      
      // Đánh dấu hoạt động nào đã hoàn thành
      return NextResponse.json(
        activities.map(activity => ({
          ...activity,
          completed: completedActivityIds.has(activity.id)
        }))
      );
    }
    
    // Nếu không có userId, trả về danh sách hoạt động không có trạng thái hoàn thành
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