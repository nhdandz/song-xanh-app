// 'use client';

// import { useState } from 'react';
// import { 
//   FaMapMarkerAlt, 
//   FaCalendarAlt, 
//   FaUsers, 
//   FaLeaf, 
//   FaStar, 
//   FaRegStar,
//   FaChevronRight
// } from 'react-icons/fa';

// // Dữ liệu mẫu cho các dự án
// const PROJECTS = [
//   {
//     id: 1,
//     title: 'Trồng cây xanh tại công viên',
//     location: 'Công viên Thống Nhất, Hà Nội',
//     date: '15/05/2025',
//     participants: 45,
//     maxParticipants: 50,
//     points: 50,
//     joined: true,
//     image: '/images/park-planting.jpg',
//     organizer: 'CLB Môi trường Trường THPT ABC',
//     description: 'Tham gia trồng cây xanh tại công viên để tăng không gian xanh cho thành phố. Mỗi người tham gia sẽ được hướng dẫn trồng ít nhất 2 cây.',
//     skills: ['Trồng cây', 'Làm việc nhóm', 'Bảo vệ môi trường'],
//   },
//   {
//     id: 2,
//     title: 'Dọn rác bãi biển Sầm Sơn',
//     location: 'Bãi biển Sầm Sơn, Thanh Hóa',
//     date: '22/05/2025',
//     participants: 28,
//     maxParticipants: 100,
//     points: 80,
//     joined: false,
//     image: '/images/beach-cleanup.jpg',
//     organizer: 'Tổ chức Keep Vietnam Clean',
//     description: 'Chiến dịch dọn rác tại bãi biển Sầm Sơn, giúp bảo vệ hệ sinh thái biển và nâng cao nhận thức cộng đồng về ô nhiễm rác thải nhựa.',
//     skills: ['Phân loại rác', 'Làm việc nhóm', 'Tuyên truyền'],
//   },
//   {
//     id: 3,
//     title: 'Workshop tái chế đồ nhựa',
//     location: 'Không gian sáng tạo S.Hub, Hà Nội',
//     date: '05/06/2025',
//     participants: 15,
//     maxParticipants: 30,
//     points: 30,
//     joined: false,
//     image: '/images/recycle-workshop.jpg',
//     organizer: 'Green Innovation',
//     description: 'Workshop hướng dẫn tái chế các đồ dùng nhựa thành sản phẩm hữu ích. Học viên sẽ được hướng dẫn cách biến chai nhựa thành chậu cây, túi ni-lông thành túi đeo chéo...',
//     skills: ['Tái chế', 'Thủ công', 'Sáng tạo'],
//   },
// ];

// export default function Projects() {
//   const [projects, setProjects] = useState(PROJECTS);
//   const [favoriteFilter, setFavoriteFilter] = useState(false);
  
//   // Lọc dự án đã tham gia
//   const filteredProjects = favoriteFilter 
//     ? projects.filter(project => project.joined) 
//     : projects;
  
//   // Xử lý tham gia dự án
//   const toggleJoinProject = (id) => {
//     setProjects(projects.map(project => 
//       project.id === id ? { ...project, joined: !project.joined } : project
//     ));
//   };
  
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold text-green-800">
//           Dự án môi trường
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Tham gia các hoạt động và nhận điểm xanh
//         </p>
//       </div>
      
//       {/* Bộ lọc */}
//       <div className="flex justify-between items-center">
//         <div className="flex space-x-2">
//           <button
//             className={`px-3 py-1.5 rounded-full text-sm font-medium ${
//               !favoriteFilter
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setFavoriteFilter(false)}
//           >
//             Tất cả
//           </button>
//           <button
//             className={`px-3 py-1.5 rounded-full text-sm font-medium ${
//               favoriteFilter
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setFavoriteFilter(true)}
//           >
//             Đã tham gia
//           </button>
//         </div>
        
//         <button className="text-sm text-green-600 font-medium">
//           Sắp xếp theo
//         </button>
//       </div>
      
//       {/* Danh sách dự án */}
//       <div className="space-y-4">
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map(project => (
//             <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="h-48 bg-gray-200">
//                 {/* Placeholder cho hình ảnh */}
//                 <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
//                   <FaLeaf className="text-green-600 text-2xl mb-2" />
//                   <span className="text-green-800 font-semibold">{project.title}</span>
//                 </div>
//               </div>
              
//               <div className="p-4">
//                 <h2 className="font-bold text-green-800 text-lg mb-2">{project.title}</h2>
                
//                 <div className="space-y-1 mb-3">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <FaMapMarkerAlt className="text-gray-400 mr-2" />
//                     <span>{project.location}</span>
//                   </div>
                  
//                   <div className="flex items-center text-sm text-gray-600">
//                     <FaCalendarAlt className="text-gray-400 mr-2" />
//                     <span>{project.date}</span>
//                   </div>
                  
//                   <div className="flex items-center text-sm text-gray-600">
//                     <FaUsers className="text-gray-400 mr-2" />
//                     <span>{project.participants}/{project.maxParticipants} người tham gia</span>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
//                     {project.points} điểm xanh
//                   </div>
                  
//                   <button onClick={() => toggleJoinProject(project.id)}>
//                     {project.joined ? (
//                       <FaStar className="text-yellow-500" />
//                     ) : (
//                       <FaRegStar className="text-gray-400" />
//                     )}
//                   </button>
//                 </div>
                
//                 <button
//                   onClick={() => toggleJoinProject(project.id)}
//                   className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
//                     project.joined
//                       ? 'bg-red-50 text-red-600 border border-red-200'
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   {project.joined ? 'Đã tham gia' : 'Tham gia ngay'}
//                   <FaChevronRight className="ml-1" size={12} />
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">Không có dự án nào phù hợp.</p>
//           </div>
//         )}
//       </div>
      
//       {/* Thông báo */}
//       <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//         <h3 className="font-semibold text-yellow-800 mb-2">Tổ chức dự án riêng?</h3>
//         <p className="text-sm text-yellow-700 mb-3">
//           Bạn có thể đề xuất dự án môi trường và kêu gọi mọi người tham gia
//         </p>
//         <button className="w-full py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700">
//           Đề xuất dự án mới
//         </button>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaUsers,
//   FaLeaf,
//   FaStar,
//   FaRegStar,
//   FaChevronRight
// } from 'react-icons/fa';

// /* Mock data */
// const PROJECTS = [
//   {
//     id: 1,
//     title: 'Trồng cây xanh tại công viên',
//     location: 'Công viên Thống Nhất, Hà Nội',
//     date: '15/05/2025',
//     participants: 45,
//     maxParticipants: 50,
//     points: 50,
//     joined: true,
//     image: '/images/park-planting.jpg',
//     organizer: 'CLB Môi trường Trường THPT ABC',
//     description:
//       'Tham gia trồng cây xanh tại công viên để tăng không gian xanh cho thành phố. Mỗi người tham gia sẽ được hướng dẫn trồng ít nhất 2 cây.',
//     skills: ['Trồng cây', 'Làm việc nhóm', 'Bảo vệ môi trường']
//   },
//   {
//     id: 2,
//     title: 'Dọn rác bãi biển Sầm Sơn',
//     location: 'Bãi biển Sầm Sơn, Thanh Hóa',
//     date: '22/05/2025',
//     participants: 28,
//     maxParticipants: 100,
//     points: 80,
//     joined: false,
//     image: '/images/beach-cleanup.jpg',
//     organizer: 'Tổ chức Keep Vietnam Clean',
//     description:
//       'Chiến dịch dọn rác tại bãi biển Sầm Sơn, giúp bảo vệ hệ sinh thái biển và nâng cao nhận thức cộng đồng về ô nhiễm rác thải nhựa.',
//     skills: ['Phân loại rác', 'Làm việc nhóm', 'Tuyên truyền']
//   },
//   {
//     id: 3,
//     title: 'Workshop tái chế đồ nhựa',
//     location: 'Không gian sáng tạo S.Hub, Hà Nội',
//     date: '05/06/2025',
//     participants: 15,
//     maxParticipants: 30,
//     points: 30,
//     joined: false,
//     image: '/images/recycle-workshop.jpg',
//     organizer: 'Green Innovation',
//     description:
//       'Workshop hướng dẫn tái chế các đồ dùng nhựa thành sản phẩm hữu ích. Học viên sẽ được hướng dẫn cách biến chai nhựa thành chậu cây, túi ni-lông thành túi đeo chéo...',
//     skills: ['Tái chế', 'Thủ công', 'Sáng tạo']
//   }
// ];

// /* Helpers */
// // parse ngày: thử ISO rồi dd/mm/yyyy, nếu không parse được trả null
// function parseDateAuto(d) {
//   if (!d) return null;
//   if (d instanceof Date) return d;
//   const iso = new Date(d);
//   if (!Number.isNaN(iso.getTime())) return iso;
//   const m = String(d).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ T](\d{1,2}):?(\d{2}))?$/);
//   if (m) {
//     const dd = Number(m[1]), mm = Number(m[2]) - 1, yyyy = Number(m[3]);
//     const hh = m[4] ? Number(m[4]) : 0, min = m[5] ? Number(m[5]) : 0;
//     const dt = new Date(yyyy, mm, dd, hh, min);
//     if (!Number.isNaN(dt.getTime())) return dt;
//   }
//   return null;
// }

// /* Component con xử lý ảnh với fallback placeholder */
// function ProjectImage({ src, title }) {
//   const [ok, setOk] = useState(!!src);

//   useEffect(() => {
//     setOk(!!src);
//   }, [src]);

//   if (!ok) {
//     return (
//       <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
//         <FaLeaf className="text-green-600 text-2xl mb-2" />
//         <span className="text-green-800 font-semibold">{title}</span>
//       </div>
//     );
//   }

//   return (
//     <img
//       src={src}
//       alt={title}
//       className="h-full w-full object-cover"
//       onError={() => setOk(false)}
//       onLoad={() => setOk(true)}
//     />
//   );
// }

// /* Main component */
// export default function ProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [favoriteFilter, setFavoriteFilter] = useState(false);
//   const [busyIds, setBusyIds] = useState([]); // nếu cần disable tạm

//   useEffect(() => {
//     // khởi tạo bằng mock; nếu muốn fetch API thì thay ở đây
//     setProjects(PROJECTS);
//     setLoading(false);
//   }, []);

//   // join / leave local (UI): join chuyển sang "Đã tham gia" ngay,
//   // leave sẽ hỏi confirm trước khi rút.
//   function handleJoinClick(id) {
//     if (busyIds.includes(id)) return;

//     setProjects((prev) =>
//       prev.map((p) => {
//         if (p.id !== id) return p;
//         if (!p.joined) {
//           // join ngay
//           if (p.maxParticipants && p.participants >= p.maxParticipants) {
//             alert('Số lượng đã đạt tối đa, không thể tham gia.');
//             return p;
//           }
//           return { ...p, joined: true, participants: (p.participants || 0) + 1 };
//         } else {
//           // đã tham gia -> hỏi xác nhận rời
//           const ok = confirm('Bạn có chắc muốn rời không?');
//           if (ok) {
//             return { ...p, joined: false, participants: Math.max(0, (p.participants || 0) - 1) };
//           } else {
//             return p;
//           }
//         }
//       })
//     );
//   }

//   const filteredProjects = favoriteFilter ? projects.filter((p) => p.joined) : projects;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold text-green-800">Dự án môi trường</h1>
//         <p className="text-gray-600 mt-1">Tham gia các hoạt động và nhận điểm xanh</p>
//       </div>

//       {/* Bộ lọc */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex space-x-2">
//           <button
//             className={`px-3 py-1.5 rounded-full text-sm font-medium ${!favoriteFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             onClick={() => setFavoriteFilter(false)}
//           >
//             Tất cả
//           </button>
//           <button
//             className={`px-3 py-1.5 rounded-full text-sm font-medium ${favoriteFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             onClick={() => setFavoriteFilter(true)}
//           >
//             Đã tham gia
//           </button>
//         </div>

//         <button
//           className="text-sm text-green-600 font-medium"
//           onClick={() => {
//             setLoading(true);
//             // reset về mock hiện tại
//             setProjects(PROJECTS);
//             setLoading(false);
//           }}
//         >
//           Làm mới
//         </button>
//       </div>

//       {/* Danh sách */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
//             <p className="mt-4 text-gray-600">Đang tải danh sách dự án...</p>
//           </div>
//         ) : filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => {
//             const dt = parseDateAuto(project.date);
//             const dateLabel = dt ? dt.toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' }) : project.date || 'Chưa có ngày';
//             return (
//               <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="h-48 bg-gray-200">
//                   <ProjectImage src={project.image} title={project.title} />
//                 </div>

//                 <div className="p-4">
//                   <h2 className="font-bold text-green-800 text-lg mb-2">{project.title}</h2>

//                   <div className="space-y-1 mb-3">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <FaMapMarkerAlt className="text-gray-400 mr-2" />
//                       <span>{project.location}</span>
//                     </div>

//                     <div className="flex items-center text-sm text-gray-600">
//                       <FaCalendarAlt className="text-gray-400 mr-2" />
//                       <span>{dateLabel}</span>
//                     </div>

//                     <div className="flex items-center text-sm text-gray-600">
//                       <FaUsers className="text-gray-400 mr-2" />
//                       <span>
//                         {project.participants ?? 0}
//                         {project.maxParticipants ? ` / ${project.maxParticipants}` : ''} người tham gia
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center mb-4">
//                     <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
//                       {project.points ?? 0} điểm xanh
//                     </div>

//                     <button
//                       onClick={() => handleJoinClick(project.id)}
//                       disabled={busyIds.includes(project.id)}
//                       title={project.joined ? 'Rút khỏi dự án' : 'Tham gia dự án'}
//                       className="focus:outline-none"
//                     >
//                       {project.joined ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-400" />}
//                     </button>
//                   </div>

//                   <button
//                     onClick={() => handleJoinClick(project.id)}
//                     disabled={busyIds.includes(project.id)}
//                     className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center ${project.joined ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
//                   >
//                     {project.joined ? 'Đã tham gia' : 'Tham gia ngay'}
//                     <FaChevronRight className="ml-1" size={12} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">Không có dự án nào phù hợp.</p>
//           </div>
//         )}
//       </div>

//       {/* CTA */}
//       <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-8">
//         <h3 className="font-semibold text-yellow-800 mb-2">Tổ chức dự án riêng?</h3>
//         <p className="text-sm text-yellow-700 mb-3">Bạn có thể đề xuất dự án môi trường và kêu gọi mọi người tham gia.</p>
//         <button onClick={() => alert('Tính năng đề xuất dự án hiện đang tạm mock.')} className="w-full py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700">
//           Đề xuất dự án mới
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaLeaf,
  FaStar,
  FaRegStar,
  FaChevronRight
} from 'react-icons/fa';

/* Helpers */
// parse ngày: thử ISO rồi dd/mm/yyyy, nếu không parse được trả null
function parseDateAuto(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  const iso = new Date(d);
  if (!Number.isNaN(iso.getTime())) return iso;
  const m = String(d).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ T](\d{1,2}):?(\d{2}))?$/);
  if (m) {
    const dd = Number(m[1]), mm = Number(m[2]) - 1, yyyy = Number(m[3]);
    const hh = m[4] ? Number(m[4]) : 0, min = m[5] ? Number(m[5]) : 0;
    const dt = new Date(yyyy, mm, dd, hh, min);
    if (!Number.isNaN(dt.getTime())) return dt;
  }
  return null;
}

/* Component con xử lý ảnh với fallback placeholder */
function ProjectImage({ src, title }) {
  const [ok, setOk] = useState(!!src);

  useEffect(() => {
    setOk(!!src);
  }, [src]);

  if (!ok) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <FaLeaf className="text-green-600 text-2xl mb-2" />
        <span className="text-green-800 font-semibold">{title}</span>
      </div>
    );
  }

  return (
    // dùng thẻ img để đơn giản (nếu dùng next/image hãy chuyển)
    <img
      src={src}
      alt={title}
      className="h-full w-full object-cover"
      onError={() => setOk(false)}
      onLoad={() => setOk(true)}
    />
  );
}

/* Main page component */
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [busyIds, setBusyIds] = useState([]); // disable tạm cho nút nếu cần
  const [error, setError] = useState(null);

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/events');
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(`HTTP ${res.status} ${txt || ''}`);
      }
      const data = await res.json();

      // map dữ liệu server sang cấu trúc UI
      const mapped = Array.isArray(data)
        ? data.map((e) => ({
            id: e.id ?? e._id ?? Math.random().toString(36).slice(2, 9),
            title: e.title ?? 'Không có tiêu đề',
            location: e.location ?? e.place ?? 'Chưa cập nhật',
            date: e.date ?? e.scheduledAt ?? null,
            // prisma trả _count.participants theo route bạn cho
            participants: (e._count && typeof e._count.participants === 'number')
              ? e._count.participants
              : (typeof e.participants === 'number' ? e.participants : 0),
            maxParticipants: e.maxParticipants ?? null,
            points: e.points ?? 0,
            joined: false, // trạng thái join local; nếu muốn lưu lên server, cần endpoint
            image: e.image ?? null,
            organizer: e.organizer ?? ''
          }))
        : [];

      setProjects(mapped);
    } catch (err) {
      console.error('Lấy events thất bại:', err);
      setError('Lấy danh sách sự kiện thất bại. Vui lòng thử lại.');
      // tùy chọn: giữ projects rỗng
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // join / leave local (UI): join chuyển sang "Đã tham gia" ngay,
  // leave sẽ hỏi confirm trước khi rút.
  function handleJoinClick(id) {
    if (busyIds.includes(id)) return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (!p.joined) {
          // join ngay (tăng số người tham gia local)
          if (p.maxParticipants && p.participants >= p.maxParticipants) {
            alert('Số lượng đã đạt tối đa, không thể tham gia.');
            return p;
          }
          return { ...p, joined: true, participants: (p.participants || 0) + 1 };
        } else {
          // đã tham gia -> hỏi xác nhận rời
          const ok = confirm('Bạn có chắc muốn rời không?');
          if (ok) {
            return { ...p, joined: false, participants: Math.max(0, (p.participants || 0) - 1) };
          } else {
            return p;
          }
        }
      })
    );
  }

  const filteredProjects = favoriteFilter ? projects.filter((p) => p.joined) : projects;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Dự án / Sự kiện môi trường</h1>
        <p className="text-gray-600 mt-1">Tham gia các hoạt động và nhận điểm xanh</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${!favoriteFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFavoriteFilter(false)}
          >
            Tất cả
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${favoriteFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFavoriteFilter(true)}
          >
            Đã tham gia
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">{projects.length} sự kiện</div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách sự kiện...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <button onClick={() => fetchEvents()} className="px-4 py-2 bg-green-600 text-white rounded">Thử lại</button>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const dt = parseDateAuto(project.date);
            const dateLabel = dt ? dt.toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' }) : (project.date || 'Chưa có ngày');
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <ProjectImage src={project.image} title={project.title} />
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
                      <span>{dateLabel}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span>
                        {project.participants ?? 0}
                        {project.maxParticipants ? ` / ${project.maxParticipants}` : ''} người tham gia
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                      {project.points ?? 0} điểm xanh
                    </div>

                    <button
                      onClick={() => handleJoinClick(project.id)}
                      disabled={busyIds.includes(project.id)}
                      title={project.joined ? 'Rút khỏi dự án' : 'Tham gia dự án'}
                      className="focus:outline-none"
                    >
                      {project.joined ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-400" />}
                    </button>
                  </div>

                  <button
                    onClick={() => handleJoinClick(project.id)}
                    disabled={busyIds.includes(project.id)}
                    className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center ${project.joined ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {project.joined ? 'Đã tham gia' : 'Tham gia ngay'}
                    <FaChevronRight className="ml-1" size={12} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có sự kiện nào phù hợp.</p>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-8">
        <h3 className="font-semibold text-yellow-800 mb-2">Tổ chức sự kiện riêng?</h3>
        <p className="text-sm text-yellow-700 mb-3">Bạn có thể đề xuất sự kiện môi trường và kêu gọi mọi người tham gia.</p>
        <button onClick={() => alert('Tính năng đề xuất sự kiện đang tạm mock.')} className="w-full py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700">
          Đề xuất sự kiện mới
        </button>
      </div>
    </div>
  );
}
