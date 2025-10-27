import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/user-activities - Ghi nhận hoạt động của người dùng
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, activities } = data;
    
    if (!userId || !activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { error: 'Invalid request data. Required: userId and activities array' },
        { status: 400 }
      );
    }
    
    // Tìm người dùng
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Kiểm tra xem các activityId có tồn tại trong cơ sở dữ liệu không
    const existingActivities = await prisma.greenActivity.findMany({
      where: {
        id: {
          in: activities
        }
      }
    });
    
    // Lấy danh sách các ID hợp lệ
    const validActivityIds = existingActivities.map(activity => activity.id);
    
    if (validActivityIds.length === 0) {
      return NextResponse.json({ error: 'No valid activities found' }, { status: 400 });
    }
    
    // Tính tổng điểm từ các hoạt động hợp lệ
    const totalPoints = existingActivities.reduce((sum, activity) => sum + activity.points, 0);
    
    // Bắt đầu giao dịch để đảm bảo tính nhất quán của dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // Tạo các bản ghi UserActivity chỉ với các ID hợp lệ
      const userActivities = await Promise.all(
        validActivityIds.map(activityId => 
          tx.userActivity.create({
            data: {
              userId,
              activityId
            }
          })
        )
      );
      
      // Cập nhật điểm và có thể là cấp độ của người dùng
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: totalPoints
          }
        }
      });
      
      // Kiểm tra và cập nhật cấp độ dựa trên điểm
      let level = updatedUser.level;
      const newPoints = updatedUser.points;
      
      if (newPoints >= 50) {
        level = 'Chiến binh xanh';
      } else if (newPoints >= 30) {
        level = 'Nhà môi trường nhỏ';
      } else if (newPoints >= 10) {
        level = 'Người khởi đầu xanh';
      }
      
      // Nếu cấp độ thay đổi, cập nhật lại
      if (level !== updatedUser.level) {
        await tx.user.update({
          where: { id: userId },
          data: { level }
        });
      }
      
      // Kiểm tra xem người dùng có đạt được huy hiệu mới không
      const badges = await tx.badge.findMany();
      
      for (const badge of badges) {
        if (newPoints >= badge.points) {
          // Kiểm tra xem người dùng đã có huy hiệu này chưa
          const existingBadge = await tx.userBadge.findFirst({
            where: {
              userId,
              badgeId: badge.id
            }
          });
          
          // Nếu chưa có, tạo mới
          if (!existingBadge) {
            await tx.userBadge.create({
              data: {
                userId,
                badgeId: badge.id
              }
            });
          }
        }
      }
      
      return {
        userActivities,
        pointsEarned: totalPoints,
        newTotalPoints: newPoints,
        level
      };
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error recording user activities:', error);
    return NextResponse.json({ error: 'Failed to record activities' }, { status: 500 });
  }
}

// GET /api/user-activities - Lấy lịch sử hoạt động của người dùng
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    // Lấy lịch sử hoạt động của người dùng
    const userActivities = await prisma.userActivity.findMany({
      where: { userId },
      include: {
        activity: true
      },
      orderBy: {
        date: 'desc'
      },
      skip,
      take: limit
    });
    
    // Đếm tổng số bản ghi
    const total = await prisma.userActivity.count({
      where: { userId }
    });
    
    // Tổng hợp dữ liệu theo ngày
    const dailyActivities = {};
    
    userActivities.forEach(ua => {
      const dateStr = ua.date.toISOString().split('T')[0];
      
      if (!dailyActivities[dateStr]) {
        dailyActivities[dateStr] = {
          date: dateStr,
          activities: [],
          totalPoints: 0
        };
      }
      
      dailyActivities[dateStr].activities.push({
        id: ua.id,
        name: ua.activity.name,
        points: ua.activity.points,
        time: ua.date
      });
      
      dailyActivities[dateStr].totalPoints += ua.activity.points;
    });
    
    return NextResponse.json({ 
      activities: Object.values(dailyActivities),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}