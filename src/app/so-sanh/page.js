'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaTrophy, FaUsers, FaSearch } from 'react-icons/fa';

// Dữ liệu mẫu cho các nhóm/lớp
const MOCK_GROUPS = [
  { id: 1, name: 'Lớp 10A1', totalPoints: 1250, members: 35, rank: 1 },
  { id: 2, name: 'Lớp 10A2', totalPoints: 980, members: 33, rank: 3 },
  { id: 3, name: 'Lớp 11A1', totalPoints: 1120, members: 32, rank: 2 },
  { id: 4, name: 'Lớp 11A2', totalPoints: 890, members: 34, rank: 4 },
  { id: 5, name: 'Lớp 12A1', totalPoints: 750, members: 30, rank: 5 },
  { id: 6, name: 'Lớp 12A2', totalPoints: 650, members: 31, rank: 6 },
  { id: 7, name: 'CLB Môi trường', totalPoints: 1520, members: 15, rank: 0 },
];

// Định nghĩa màu cho từng thứ hạng
const RANK_COLORS = {
  0: 'bg-green-700', // nhóm 
  1: 'bg-yellow-500', // hạng 1
  2: 'bg-gray-400', // hạng 2
  3: 'bg-yellow-800', // hạng 3
  default: 'bg-gray-200' // các hạng khác
};

export default function GroupComparison() {
  const { user, points } = useAppContext();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [userGroup, setUserGroup] = useState(MOCK_GROUPS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedGroups, setJoinedGroups] = useState([MOCK_GROUPS[0].id]);
  
  // Lọc nhóm theo từ khóa tìm kiếm
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Giả lập tham gia/rời nhóm
  const toggleJoinGroup = (groupId) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };
  
  // Tính điểm bình quân theo thành viên
  const getAveragePoints = (group) => {
    return Math.round(group.totalPoints / group.members);
  };
  
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
      <div className="bg-green-50 p-4 rounded-lg shadow-md border-2 border-green-500">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-3">
            <FaUsers className="text-green-700" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-green-800">{userGroup.name}</h2>
            <p className="text-sm text-green-700">Nhóm của bạn • {userGroup.members} thành viên</p>
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
          {points.total} điểm ({Math.round((points.total / userGroup.totalPoints) * 100)}% tổng điểm)
        </div>
      </div>
      
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
        
        <div className="space-y-3">
          {filteredGroups.map(group => (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center p-3">
                <div className={`w-8 h-8 rounded-full ${RANK_COLORS[group.rank] || RANK_COLORS.default} flex items-center justify-center text-white font-bold mr-3`}>
                  {group.rank === 0 ? <FaUsers size={14} /> : group.rank}
                </div>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-xs text-gray-500">{group.members} thành viên • {getAveragePoints(group)} điểm/thành viên</p>
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