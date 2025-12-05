// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAppContext } from '@/context/AppContext';
// import ActionCard from '@/components/ActionCard';
// import { useEffect, useRef } from 'react';
// import { FaLeaf } from 'react-icons/fa';

// export default function GreenActions() {
//   const router = useRouter();
//   const { todayActions, updateAction, saveActions, fetchGreenActivities, isAuthenticated } = useAppContext();
//   // Thêm một ref để đảm bảo fetchGreenActivities chỉ được gọi một lần
//   const activitiesFetchedRef = useRef(false);
  
//   // Sửa useEffect để ngăn gọi nhiều lần
//   useEffect(() => {
//     // Chỉ fetch một lần khi component mount và isAuthenticated = true
//     if (isAuthenticated && !activitiesFetchedRef.current) {
//       console.log('Fetching green activities from page component');
//       activitiesFetchedRef.current = true;
//       fetchGreenActivities();
//     }
//   }, [isAuthenticated, fetchGreenActivities]);
  
//   const handleSave = () => {
//     saveActions();
//     router.push('/');
//   };
  
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>
//         <div className="relative flex items-center">
//           <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4">
//             <FaLeaf className="text-green-600 text-xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Hành động xanh hôm nay
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Đánh dấu những hành động bạn đã thực hiện trong ngày
//             </p>
//           </div>
//         </div>
//       </div>

//       {todayActions.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
//           <div className="flex flex-col items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
//             <p className="text-gray-600">Đang tải danh sách hành động...</p>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="space-y-3">
//             {todayActions.map(action => (
//               <ActionCard
//                 key={action.id}
//                 action={action}
//                 onChange={(completed) => updateAction(action.id, completed)}
//               />
//             ))}
//           </div>

//           <div className="sticky bottom-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
//             <button
//               onClick={handleSave}
//               className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//             >
//               Lưu hành động
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import ActionCard from '@/components/ActionCard';
import { useEffect, useRef, useState } from 'react';
import { FaLeaf } from 'react-icons/fa';

export default function GreenActions() {
  const router = useRouter();
  const {
    todayActions,
    updateAction,
    saveActions,
    fetchGreenActivities,
    isAuthenticated,
    greenVideos, // nếu context trả về mảng link thì dùng, không có thì dùng default
  } = useAppContext();

  const activitiesFetchedRef = useRef(false);

  // Mảng link mặc định (thay bằng link của bạn)
  const defaultVideos = [
    'https://www.youtube.com/watch?si=wTOQlpOCn-CVYJHu&v=wiOmECm6kjI&feature=youtu.be',
    'https://youtu.be/wiOmECm6kjI?si=wTOQlpOCn-CVYJHu',
    'https://youtu.be/jdzhSu6dO24?si=y-AddEDQzsO8TVOh',
    'https://www.youtube.com/watch?si=y-AddEDQzsO8TVOh&v=jdzhSu6dO24&feature=youtu.be',
    'https://youtu.be/ANULMme_ecc?si=O4taKVTBnVC8MsmQ',
    'https://www.youtube.com/watch?si=O4taKVTBnVC8MsmQ&v=ANULMme_ecc&feature=youtu.be',
    'https://youtu.be/CKzsnAHcMYE?si=Au2jbXEQIXlNp9pZ',
    'https://www.youtube.com/watch?si=Au2jbXEQIXlNp9pZ&v=CKzsnAHcMYE&feature=youtu.be',
  ];

  // Helper: thử lấy id YouTube từ nhiều dạng URL
  const getYouTubeEmbed = (url) => {
    try {
      // youtube.com/watch?v=ID
      const ytMatch = url.match(
        /(?:youtube\.com\/.*v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
      );
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Helper: xác định loại và trả về object { kind, src }
  // kind: 'mp4' | 'youtube' | 'iframe'
  const normalizeVideo = (url) => {
    if (!url) return null;
    const trimmed = String(url).trim();
    // mp4/webm/ogg file
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
      return { kind: 'mp4', src: trimmed };
    }
    // youtube
    const yt = getYouTubeEmbed(trimmed);
    if (yt) return { kind: 'youtube', src: yt };
    // vimeo embed or direct iframe-able url
    return { kind: 'iframe', src: trimmed };
  };

  const poolLinks = Array.isArray(greenVideos) && greenVideos.length ? greenVideos : defaultVideos;
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    if (!poolLinks || poolLinks.length === 0) {
      setSelectedLink(null);
      return;
    }
    const pick = poolLinks[Math.floor(Math.random() * poolLinks.length)];
    setSelectedLink(pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(poolLinks)]); // khi poolLinks thay đổi thì pick lại

  const pickAnother = () => {
    if (!poolLinks || poolLinks.length <= 1) return;
    let next = poolLinks[Math.floor(Math.random() * poolLinks.length)];
    if (next === selectedLink) {
      // thử lại một lần
      next = poolLinks[Math.floor(Math.random() * poolLinks.length)];
    }
    setSelectedLink(next);
  };

  useEffect(() => {
    if (isAuthenticated && !activitiesFetchedRef.current) {
      activitiesFetchedRef.current = true;
      fetchGreenActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, fetchGreenActivities]);

  const handleSave = () => {
    saveActions();
    router.push('/');
  };

  const normalized = normalizeVideo(selectedLink);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4">
            <FaLeaf className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Hành động xanh hôm nay</h1>
            <p className="text-sm text-gray-600 mt-1">Đánh dấu những hành động bạn đã thực hiện trong ngày</p>
          </div>
        </div>
      </div>

      {/* Video random (chỉ hiển thị nếu có link) */}
      {normalized && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
            {normalized.kind === 'mp4' && (
              <video
                controls
                src={normalized.src}
                className="w-full h-full object-cover"
                playsInline
              />
            )}

            {normalized.kind === 'youtube' && (
              <iframe
                title="youtube-video"
                src={normalized.src}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {normalized.kind === 'iframe' && (
              <iframe
                title="embed-video"
                src={normalized.src}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {todayActions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách hành động...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {todayActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onChange={(completed) => updateAction(action.id, completed)}
              />
            ))}
          </div>

          <div className="sticky bottom-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Lưu hành động
            </button>
          </div>
        </>
      )}
    </div>
  );
}
