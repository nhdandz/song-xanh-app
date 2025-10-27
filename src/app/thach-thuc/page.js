'use client';

import { useState } from 'react';
import { FaFlag, FaTrophy, FaLock, FaCheck, FaClock } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

// Dữ liệu mẫu cho các thách thức
const CHALLENGES = [
  {
    id: 1,
    title: 'Tuần không túi ni-lông',
    description: 'Không sử dụng túi ni-lông trong 7 ngày liên tiếp.',
    points: 50,
    days: 7,
    difficulty: 'Trung bình',
    category: 'Giảm rác thải',
    status: 'in-progress', // completed, locked, in-progress
    progress: 3,
  },
  {
    id: 2,
    title: 'Người tiết kiệm điện',
    description: 'Tắt điện khi không sử dụng trong 5 ngày liên tiếp.',
    points: 30,
    days: 5,
    difficulty: 'Dễ',
    category: 'Tiết kiệm năng lượng',
    status: 'completed',
    progress: 5,
  },
  {
    id: 3,
    title: '30 ngày sống xanh',
    description: 'Thực hiện ít nhất 3 hành vi xanh mỗi ngày trong 30 ngày.',
    points: 200,
    days: 30,
    difficulty: 'Khó',
    category: 'Tổng hợp',
    status: 'locked',
    progress: 0,
    requiredPoints: 100,
  },
  {
    id: 4,
    title: 'Vận động viên xanh',
    description: 'Đi bộ hoặc đi xe đạp đến trường trong 10 ngày.',
    points: 80,
    days: 10,
    difficulty: 'Trung bình',
    category: 'Vận động',
    status: 'locked',
    progress: 0,
    requiredPoints: 50,
  },
];

// Dữ liệu mẫu cho nhiệm vụ hàng ngày
const DAILY_MISSIONS = [
  {
    id: 1,
    title: 'Hôm nay ăn chay',
    points: 10,
    completed: false,
    expiresIn: '12 giờ',
  },
  {
    id: 2,
    title: 'Dọn dẹp khu vực xung quanh',
    points: 15,
    completed: true,
    expiresIn: '8 giờ',
  },
  {
    id: 3,
    title: 'Tuyên truyền sống xanh với 2 bạn',
    points: 20,
    completed: false,
    expiresIn: '24 giờ',
  },
];

export default function Challenges() {
  const { points } = useAppContext();
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [dailyMissions, setDailyMissions] = useState(DAILY_MISSIONS);
  
  // Xử lý hoàn thành nhiệm vụ hàng ngày
  const completeDailyMission = (id) => {
    setDailyMissions(dailyMissions.map(mission => 
      mission.id === id ? { ...mission, completed: !mission.completed } : mission
    ));
  };
  
  return (
    <div className="space-y-6 pb-16">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Thách thức & Nhiệm vụ
        </h1>
        <p className="text-gray-600 mt-1">
          Hoàn thành thách thức để nhận thưởng
        </p>
      </div>
      
      {/* Nhiệm vụ hàng ngày */}
      <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
        <h2 className="font-bold text-yellow-800 flex items-center mb-3">
          <FaClock className="mr-2" />
          Nhiệm vụ hàng ngày
        </h2>
        
        <div className="space-y-3">
          {dailyMissions.map(mission => (
            <div 
              key={mission.id} 
              className={`p-3 rounded-lg border ${
                mission.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => completeDailyMission(mission.id)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-3 flex items-center justify-center ${
                    mission.completed 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {mission.completed && <FaCheck className="text-white text-xs" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${mission.completed ? 'text-green-800' : 'text-gray-800'}`}>
                    {mission.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Hết hạn trong {mission.expiresIn}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      +{mission.points} điểm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Thách thức */}
      <div className="space-y-4">
        <h2 className="font-bold text-green-800 flex items-center">
          <FaFlag className="mr-2" />
          Thách thức Sống Xanh
        </h2>
        
        {challenges.map(challenge => (
          <div 
            key={challenge.id} 
            className={`p-4 rounded-lg shadow-md border ${
              challenge.status === 'completed' 
                ? 'bg-green-50 border-green-200' 
                : challenge.status === 'locked' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-semibold ${
                challenge.status === 'locked' 
                  ? 'text-gray-500' 
                  : challenge.status === 'completed' 
                    ? 'text-green-800' 
                    : 'text-blue-800'
              }`}>
                {challenge.title}
              </h3>
              
              {challenge.status === 'locked' ? (
                <div className="bg-gray-200 rounded-full p-1.5">
                  <FaLock className="text-gray-500 text-xs" />
                </div>
              ) : challenge.status === 'completed' ? (
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                  Hoàn thành
                </div>
              ) : (
                <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  Đang thực hiện
                </div>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${
              challenge.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {challenge.description}
            </p>
            
            {challenge.status === 'locked' ? (
              <div className="text-xs text-gray-500 mb-2">
                Cần {challenge.requiredPoints} điểm để mở khóa
              </div>
            ) : (
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>{challenge.category}</span>
                <span>Độ khó: {challenge.difficulty}</span>
              </div>
            )}
            
            {challenge.status !== 'completed' && (
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${
                    challenge.status === 'locked' ? 'bg-gray-400' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(challenge.progress / challenge.days) * 100}%` }}
                ></div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              {challenge.status !== 'locked' && (
                <div className="text-sm">
                  {challenge.status === 'completed' ? (
                    <span className="text-green-700 font-medium">
                      <FaTrophy className="inline-block mr-1 text-yellow-500" />
                      Đã nhận {challenge.points} điểm
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      {challenge.progress}/{challenge.days} ngày
                    </span>
                  )}
                </div>
              )}
              
              <div className="font-semibold text-sm text-green-600">
                {challenge.points} điểm
              </div>
            </div>
            
            {challenge.status === 'locked' && (
              <button 
                className={`mt-3 w-full py-2 rounded-lg text-sm font-medium ${
                  points.total >= challenge.requiredPoints
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={points.total < challenge.requiredPoints}
              >
                {points.total >= challenge.requiredPoints ? 'Mở khóa ngay' : 'Chưa đủ điểm để mở khóa'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}