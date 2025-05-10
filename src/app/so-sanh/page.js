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
];

export default function GroupComparison() {
  const { user, points, userId, isAuthenticated } = useAppContext();
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
    <div className="space-y-6 pb-16">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          So sánh nhóm
        </h1>
        <p className="text-gray-600 mt-1">
          So sánh điểm xanh giữa các lớp và nhóm
        </p>
      </div>
      
      {/* Nhóm của người dùng */}
      {userGroup ? (
        <div className="bg-green-50 p-4 rounded-lg shadow-md border-2 border-green-500">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-3">
              <FaUsers className="text-green-700" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-green-800">{userGroup.name}</h2>
              <p className="text-sm text-green-700">
                Nhóm của bạn • {userGroup.memberCount} thành viên
              </p>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-green-700">Hạng</div>
              <div className="text-2xl font-bold text-green-700">#{userGroup.rank}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded p-2 text-center">
              <div className="text-sm text-gray-500">Tổng điểm</div>
              <div className="text-xl font-bold text-green-600">{userGroup.totalPoints}</div>
            </div>
            <div className="bg-white rounded p-2 text-center">
              <div className="text-sm text-gray-500">Điểm/thành viên</div>
              <div className="text-xl font-bold text-green-600">{getAveragePoints(userGroup)}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-700">Bạn đóng góp: </span> 
            {points.total} điểm ({calculateContribution()}% tổng điểm)
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg shadow-md border-2 border-yellow-400">
          <p className="text-center text-yellow-700">
            Bạn chưa tham gia nhóm nào. Hãy tham gia một nhóm để theo dõi thành tích của nhóm!
          </p>
        </div>
      )}
      
      {/* Tìm kiếm nhóm */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm lớp hoặc nhóm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <FaSearch />
        </div>
      </div>
      
      {/* Bảng xếp hạng */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-bold text-green-800 mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Bảng xếp hạng
        </h2>
        
        {filteredGroups.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Không tìm thấy nhóm nào phù hợp với từ khóa tìm kiếm
          </p>
        )}
        
        <div className="space-y-3">
          {filteredGroups.map(group => (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center p-3">
                <div className={`w-8 h-8 rounded-full ${RANK_COLORS[group.rank] || RANK_COLORS.default} flex items-center justify-center text-white font-bold mr-3`}>
                  {group.rank === 0 ? <FaUsers size={14} /> : group.rank}
                </div>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-xs text-gray-500">
                    {group.memberCount} thành viên • {getAveragePoints(group)} điểm/thành viên
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="text-lg font-bold text-green-600">{group.totalPoints}</div>
                  <div className="text-xs text-gray-500">tổng điểm</div>
                </div>
              </div>
              
              <div className="px-3 pb-3">
                <button
                  onClick={() => toggleJoinGroup(group.id)}
                  className={`w-full py-1.5 rounded text-sm font-medium ${
                    joinedGroups.includes(group.id)
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}
                >
                  {joinedGroups.includes(group.id) ? 'Đã tham gia' : 'Tham gia nhóm'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Thông tin thêm */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Điểm xanh nhóm hoạt động như thế nào?</h3>
        <p className="text-sm text-blue-700">
          Mỗi thành viên trong nhóm sống xanh sẽ đóng góp điểm vào tổng điểm của nhóm. 
          Hãy mời bạn bè cùng tham gia để nâng hạng nhóm của bạn!
        </p>
      </div>
    </div>
  );
}