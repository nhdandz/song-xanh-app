'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaTrophy, FaUsers, FaSearch, FaSpinner } from 'react-icons/fa';

// Định nghĩa màu cho từng thứ hạng
const RANK_COLORS = {
  0: 'bg-green-700', // nhóm CLB
  1: 'bg-yellow-500', // hạng 1
  2: 'bg-gray-400', // hạng 2
  3: 'bg-yellow-800', // hạng 3
  default: 'bg-gray-200' // các hạng khác
};

// Fallback cho lỗi không kết nối được dữ liệu
const FALLBACK_GROUPS = [
  { id: '1', name: 'Lớp 10A1', totalPoints: 1250, memberCount: 35, rank: 1, type: 'class' },
  { id: '2', name: 'CLB Môi trường', totalPoints: 1520, memberCount: 15, rank: 0, type: 'club' },

   // Các lớp chuyên k36
  // { id: '3', name: 'Chuyên Tin - K36', totalPoints: 1100, memberCount: 40, rank: 2, type: 'class' },
  // { id: '4', name: 'Chuyên Anh1 - K36', totalPoints: 980, memberCount: 38, rank: 3, type: 'class' },
  // { id: '5', name: 'Chuyên Anh2 - K36', totalPoints: 950, memberCount: 37, rank: 4, type: 'class' },
  // { id: '6', name: 'Chuyên Văn - K36', totalPoints: 870, memberCount: 35, rank: 5, type: 'class' },
  // { id: '7', name: 'Chuyên Sử - K36', totalPoints: 820, memberCount: 32, rank: 6, type: 'class' },
  // { id: '8', name: 'Chuyên Địa - K36', totalPoints: 790, memberCount: 33, rank: 7, type: 'class' },
  // { id: '9', name: 'Chuyên Nga - K36', totalPoints: 770, memberCount: 30, rank: 8, type: 'class' },
  // { id: '10', name: 'Chuyên Pháp - K36', totalPoints: 760, memberCount: 28, rank: 9, type: 'class' },
  // { id: '11', name: 'Chuyên Trung - K36', totalPoints: 740, memberCount: 29, rank: 10, type: 'class' },
  // { id: '12', name: 'Chuyên Toán - K36', totalPoints: 1300, memberCount: 45, rank: 1, type: 'class' },
  // { id: '13', name: 'Chuyên Lý - K36', totalPoints: 1150, memberCount: 42, rank: 2, type: 'class' },
  // { id: '14', name: 'Chuyên Hóa - K36', totalPoints: 1120, memberCount: 41, rank: 3, type: 'class' },
];

export default function GroupComparison() {
  const { user, points, userId, isAuthenticated, initializeUser } = useAppContext();
  const [groups, setGroups] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu nhóm từ API
  useEffect(() => {
    const fetchGroups = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/groups?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        
        const data = await response.json();
        
        // Cập nhật danh sách nhóm
        setGroups(data.groups || []);
        
        // Cập nhật danh sách nhóm đã tham gia
        setJoinedGroups(data.userGroups || []);
        
        // Tìm nhóm của người dùng (nhóm đầu tiên trong danh sách đã tham gia)
        if (data.userGroups && data.userGroups.length > 0) {
          const userGroupId = data.userGroups[0];
          const foundGroup = data.groups.find(g => g.id === userGroupId);
          setUserGroup(foundGroup || data.groups[0]);
        } else if (data.groups.length > 0) {
          // Nếu chưa tham gia nhóm nào, mặc định lấy nhóm đầu tiên
          setUserGroup(data.groups[0]);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.message);
        
        // Fallback khi có lỗi
        setGroups(FALLBACK_GROUPS);
        setUserGroup(FALLBACK_GROUPS[0]);
        setJoinedGroups([FALLBACK_GROUPS[0].id]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [userId, isAuthenticated]);

  // Lọc nhóm theo từ khóa tìm kiếm
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý tham gia/rời nhóm
  const toggleJoinGroup = async (groupId) => {
    if (!userId) return;
    
    try {
      const action = joinedGroups.includes(groupId) ? 'leave' : 'join';
      
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          groupId,
          action
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join/leave group');
      }
      
      // Lấy kết quả từ API
      const result = await response.json();
      
      // Cập nhật thông tin người dùng để cập nhật điểm
      if (result.newPoints !== undefined) {
        await initializeUser(userId);
      }
      
      // Cập nhật UI sau khi thành công
      if (action === 'join') {
        setJoinedGroups([...joinedGroups, groupId]);
        
        // Nếu chưa có nhóm nào, đặt nhóm mới tham gia làm nhóm mặc định
        if (!userGroup) {
          const joinedGroup = groups.find(g => g.id === groupId);
          if (joinedGroup) setUserGroup(joinedGroup);
        }
      } else {
        setJoinedGroups(joinedGroups.filter(id => id !== groupId));
        
        // Nếu rời nhóm đang được chọn, đặt nhóm khác làm mặc định
        if (userGroup && userGroup.id === groupId) {
          const otherJoinedGroups = joinedGroups.filter(id => id !== groupId);
          if (otherJoinedGroups.length > 0) {
            const newDefaultGroup = groups.find(g => g.id === otherJoinedGroups[0]);
            setUserGroup(newDefaultGroup || null);
          } else {
            setUserGroup(null);
          }
        }
      }
      
      // Cập nhật danh sách nhóm với điểm mới
      const fetchGroups = async () => {
        try {
          const response = await fetch(`/api/groups?userId=${userId}`);
          
          if (!response.ok) {
            throw new Error('Failed to refresh groups');
          }
          
          const data = await response.json();
          setGroups(data.groups || []);
        } catch (error) {
          console.error('Error refreshing groups:', error);
        }
      };
      
      // Tải lại danh sách nhóm để cập nhật điểm
      fetchGroups();
      
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Tính điểm bình quân theo thành viên
  const getAveragePoints = (group) => {
    if (!group || !group.memberCount || group.memberCount === 0) return 0;
    return Math.round(group.totalPoints / group.memberCount);
  };

  // Tính tỷ lệ đóng góp của người dùng vào nhóm
  const calculateContribution = () => {
    if (!userGroup || !userGroup.totalPoints || userGroup.totalPoints === 0) return 0;
    return Math.round((points.total / userGroup.totalPoints) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-green-500 text-4xl mb-4" />
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          So sánh cộng đồng
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Theo dõi và so sánh thành tích giữa các nhóm
        </p>
      </div>

      {/* User's Group Card */}
      {userGroup ? (
        <div className="bg-white rounded-lg shadow-sm border-2 border-green-600 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                <FaUsers className="text-green-700" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{userGroup.name}</h2>
                <p className="text-sm text-gray-600">
                  {userGroup.memberCount} thành viên
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Xếp hạng</div>
              <div className="text-2xl font-semibold text-gray-900">#{userGroup.rank}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Tổng điểm</div>
              <div className="text-xl font-semibold text-gray-900">{userGroup.totalPoints}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">TB/thành viên</div>
              <div className="text-xl font-semibold text-gray-900">{getAveragePoints(userGroup)}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Đóng góp của bạn:</span>{' '}
              {points.total} điểm ({calculateContribution()}%)
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6">
          <p className="text-center text-amber-900">
            Bạn chưa tham gia nhóm nào. Tham gia nhóm để theo dõi thành tích cùng mọi người!
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm nhóm..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 top-3.5 text-gray-400">
          <FaSearch />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FaTrophy className="text-amber-500 mr-2" />
          Bảng xếp hạng
        </h2>

        {filteredGroups.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Không tìm thấy nhóm nào
          </p>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(group => (
              <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                <div className="flex items-center p-4">
                  <div className={`w-10 h-10 rounded-lg ${RANK_COLORS[group.rank] || RANK_COLORS.default} flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0`}>
                    {group.rank === 0 ? <FaUsers size={16} /> : `#${group.rank}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                    <p className="text-xs text-gray-500">
                      {group.memberCount} thành viên · TB {getAveragePoints(group)} điểm
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-semibold text-gray-900">{group.totalPoints}</div>
                    <div className="text-xs text-gray-500">điểm</div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                      joinedGroups.includes(group.id)
                        ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {joinedGroups.includes(group.id) ? 'Đã tham gia' : 'Tham gia'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-5">
        <h3 className="font-medium text-blue-900 mb-2">Cách hoạt động</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Điểm của mỗi thành viên sẽ được cộng vào tổng điểm nhóm.
          Mời thêm bạn bè tham gia để nâng cao thứ hạng!
        </p>
      </div>
    </div>
  );
}