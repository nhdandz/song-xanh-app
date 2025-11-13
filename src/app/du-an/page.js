'use client';

import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaLeaf, 
  FaStar, 
  FaRegStar,
  FaChevronRight
} from 'react-icons/fa';

// Dữ liệu mẫu (fallback nếu API lỗi)
const PROJECTS = [
  {
    id: 1,
    title: 'Trồng cây xanh tại công viên',
    location: 'Công viên Thống Nhất, Hà Nội',
    date: '15/05/2025',
    participants: 45,
    maxParticipants: 50,
    points: 50,
    joined: false,
    image: '/images/park-planting.jpg',
    organizer: 'CLB Môi trường Trường THPT ABC',
    description: 'Tham gia trồng cây xanh tại công viên để tăng không gian xanh cho thành phố. Mỗi người tham gia sẽ được hướng dẫn trồng ít nhất 2 cây.',
    skills: ['Trồng cây', 'Làm việc nhóm', 'Bảo vệ môi trường'],
  },
  // ... (các mẫu khác)
];

function safeFormatDate(dateInput) {
  if (!dateInput) return '';
  // Nếu server trả ISO string (khuyến nghị), parse và format
  const d = new Date(dateInput);
  if (!isNaN(d)) {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  // Nếu không parse được (ví dụ "15/05/2025"), trả nguyên
  return dateInput;
}

export default function Projects() {
  const [projects, setProjects] = useState(PROJECTS);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tải dữ liệu từ API khi component mount
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/events');
        if (!res.ok) throw new Error('API trả về lỗi');
        const data = await res.json();

        // map dữ liệu từ API về cấu trúc mà component đang dùng
        const mapped = (Array.isArray(data) ? data : []).map(event => {
          return {
            id: event.id ?? event._id ?? Date.now(),
            title: event.title ?? event.name ?? 'Không có tiêu đề',
            location: event.location ?? event.place ?? '',
            date: safeFormatDate(event.date ?? event.datetime ?? event.createdAt),
            participants: event._count?.participants ?? event.participants ?? 0,
            maxParticipants: event.maxParticipants ?? event.max_participants ?? null,
            points: event.points ?? 0,
            joined: false, // trạng thái join lưu client-side (thay đổi tuỳ nhu cầu)
            image: event.image ?? '/images/placeholder.jpg',
            organizer: event.organizer ?? event.organizerName ?? '',
            description: event.description ?? '',
            skills: event.skills ?? []
          };
        });

        // Nếu API trả rỗng, giữ fallback PROJECTS
        if (mapped.length > 0) setProjects(mapped);
      } catch (err) {
        console.error('Không tải được events từ API:', err);
        // Nếu lỗi, giữ nguyên PROJECTS (fallback)
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
      <div className="flex justify-between items-center mb-4">
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
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải dự án...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {/* Nếu bạn muốn hiển thị ảnh thật: dùng <img src={project.image} /> */}
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
                      <span>{project.participants}{project.maxParticipants ? `/${project.maxParticipants}` : ''} người tham gia</span>
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
      )}

      {/* Thông báo */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
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
