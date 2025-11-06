'use client';

import { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaLeaf, 
  FaStar, 
  FaRegStar,
  FaChevronRight
} from 'react-icons/fa';

// Dữ liệu mẫu cho các dự án
const PROJECTS = [
  {
    id: 1,
    title: 'Trồng cây xanh tại công viên',
    location: 'Công viên Thống Nhất, Hà Nội',
    date: '15/05/2025',
    participants: 45,
    maxParticipants: 50,
    points: 50,
    joined: true,
    image: '/images/park-planting.jpg',
    organizer: 'CLB Môi trường Trường THPT ABC',
    description: 'Tham gia trồng cây xanh tại công viên để tăng không gian xanh cho thành phố. Mỗi người tham gia sẽ được hướng dẫn trồng ít nhất 2 cây.',
    skills: ['Trồng cây', 'Làm việc nhóm', 'Bảo vệ môi trường'],
  },
  {
    id: 2,
    title: 'Dọn rác bãi biển Sầm Sơn',
    location: 'Bãi biển Sầm Sơn, Thanh Hóa',
    date: '22/05/2025',
    participants: 28,
    maxParticipants: 100,
    points: 80,
    joined: false,
    image: '/images/beach-cleanup.jpg',
    organizer: 'Tổ chức Keep Vietnam Clean',
    description: 'Chiến dịch dọn rác tại bãi biển Sầm Sơn, giúp bảo vệ hệ sinh thái biển và nâng cao nhận thức cộng đồng về ô nhiễm rác thải nhựa.',
    skills: ['Phân loại rác', 'Làm việc nhóm', 'Tuyên truyền'],
  },
  {
    id: 3,
    title: 'Workshop tái chế đồ nhựa',
    location: 'Không gian sáng tạo S.Hub, Hà Nội',
    date: '05/06/2025',
    participants: 15,
    maxParticipants: 30,
    points: 30,
    joined: false,
    image: '/images/recycle-workshop.jpg',
    organizer: 'Green Innovation',
    description: 'Workshop hướng dẫn tái chế các đồ dùng nhựa thành sản phẩm hữu ích. Học viên sẽ được hướng dẫn cách biến chai nhựa thành chậu cây, túi ni-lông thành túi đeo chéo...',
    skills: ['Tái chế', 'Thủ công', 'Sáng tạo'],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(PROJECTS);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  
  // Lọc dự án đã tham gia
  const filteredProjects = favoriteFilter 
    ? projects.filter(project => project.joined) 
    : projects;
  
  // Xử lý tham gia dự án
  const toggleJoinProject = (id) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, joined: !project.joined } : project
    ));
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Dự án môi trường
        </h1>
        <p className="text-gray-600 mt-1">
          Tham gia các hoạt động và nhận điểm xanh
        </p>
      </div>
      
      {/* Bộ lọc */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              !favoriteFilter
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFavoriteFilter(false)}
          >
            Tất cả
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              favoriteFilter
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFavoriteFilter(true)}
          >
            Đã tham gia
          </button>
        </div>
        
        <button className="text-sm text-green-600 font-medium">
          Sắp xếp theo
        </button>
      </div>
      
      {/* Danh sách dự án */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {/* Placeholder cho hình ảnh */}
                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                  <FaLeaf className="text-green-600 text-2xl mb-2" />
                  <span className="text-green-800 font-semibold">{project.title}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="font-bold text-green-800 text-lg mb-2">{project.title}</h2>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <span>{project.date}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="text-gray-400 mr-2" />
                    <span>{project.participants}/{project.maxParticipants} người tham gia</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    {project.points} điểm xanh
                  </div>
                  
                  <button onClick={() => toggleJoinProject(project.id)}>
                    {project.joined ? (
                      <FaStar className="text-yellow-500" />
                    ) : (
                      <FaRegStar className="text-gray-400" />
                    )}
                  </button>
                </div>
                
                <button
                  onClick={() => toggleJoinProject(project.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
                    project.joined
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {project.joined ? 'Đã tham gia' : 'Tham gia ngay'}
                  <FaChevronRight className="ml-1" size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có dự án nào phù hợp.</p>
          </div>
        )}
      </div>
      
      {/* Thông báo */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">Tổ chức dự án riêng?</h3>
        <p className="text-sm text-yellow-700 mb-3">
          Bạn có thể đề xuất dự án môi trường và kêu gọi mọi người tham gia
        </p>
        <button className="w-full py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700">
          Đề xuất dự án mới
        </button>
      </div>
    </div>
  );
}