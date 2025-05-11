import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/groups - Lấy danh sách nhóm và xếp hạng
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Lấy tất cả nhóm cùng với số lượng thành viên
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: { members: true }
        },
        members: userId ? {
          where: { userId }
        } : false
      },
      orderBy: {
        totalPoints: 'desc'
      }
    });

    // Tính toán xếp hạng dựa trên tổng điểm
    let rankedGroups = groups.map((group, index) => {
      // CLB có xếp hạng 0, các lớp có xếp hạng từ 1 trở đi
      const rank = group.type === 'club' ? 0 : index + 1;
      return {
        ...group,
        rank,
        memberCount: group._count.members,
        isJoined: userId ? group.members.length > 0 : false,
        members: undefined,
        _count: undefined
      };
    });

    // Nếu có userId, xác định nhóm của người dùng
    let userGroups = [];
    if (userId) {
      userGroups = await prisma.groupMember.findMany({
        where: { userId },
        include: {
          group: true
        }
      });
    }

    return NextResponse.json({
      groups: rankedGroups,
      userGroups: userGroups.map(ug => ug.group.id)
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

// POST /api/groups - Tham gia nhóm
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, groupId, action } = data;

    if (!userId || !groupId) {
      return NextResponse.json({ error: 'Missing userId or groupId' }, { status: 400 });
    }

    // Số điểm thưởng/trừ khi tham gia/rời nhóm
    const GROUP_POINTS = 5;

    if (action === 'join') {
      // Kiểm tra xem đã tham gia chưa
      const existingMembership = await prisma.groupMember.findFirst({
        where: {
          userId,
          groupId
        }
      });

      if (existingMembership) {
        return NextResponse.json({ error: 'Already a member of this group' }, { status: 400 });
      }

      // Thực hiện giao dịch để đảm bảo tính nhất quán dữ liệu
      const result = await prisma.$transaction(async (tx) => {
        // Tham gia nhóm mới
        await tx.groupMember.create({
          data: {
            userId,
            groupId,
            role: 'member'
          }
        });

        // Lấy thông tin người dùng
        const user = await tx.user.findUnique({
          where: { id: userId }
        });

        // Cộng điểm cho người dùng
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: GROUP_POINTS
            }
          }
        });

        // Cập nhật tổng điểm của nhóm
        await tx.group.update({
          where: { id: groupId },
          data: {
            totalPoints: {
              increment: user.points + GROUP_POINTS  // Cộng toàn bộ điểm của người dùng (bao gồm GROUP_POINTS mới thêm)
            }
          }
        });

        return {
          message: 'Successfully joined the group',
          newPoints: updatedUser.points
        };
      });

      return NextResponse.json(result);
    } else if (action === 'leave') {
      // Tìm thông tin nhóm và thành viên
      const membership = await prisma.groupMember.findFirst({
        where: {
          userId,
          groupId
        }
      });

      if (!membership) {
        return NextResponse.json({ error: 'Not a member of this group' }, { status: 400 });
      }

      // Lấy thông tin người dùng
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      // Thực hiện giao dịch
      const result = await prisma.$transaction(async (tx) => {
        // Rời nhóm
        await tx.groupMember.deleteMany({
          where: {
            userId,
            groupId
          }
        });

        // Trừ điểm của người dùng
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            points: {
              decrement: GROUP_POINTS
            }
          }
        });

        // Cập nhật tổng điểm của nhóm
        await tx.group.update({
          where: { id: groupId },
          data: {
            totalPoints: {
              decrement: user.points  // Trừ toàn bộ điểm của người dùng trước khi trừ GROUP_POINTS
            }
          }
        });

        return {
          message: 'Successfully left the group',
          newPoints: updatedUser.points
        };
      });

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error joining/leaving group:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}