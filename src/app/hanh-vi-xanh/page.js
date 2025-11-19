"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ActionCard from "@/components/ActionCard";
import { useEffect, useRef, useState } from "react";
import { FaLeaf } from "react-icons/fa";

export default function GreenActions() {
  const router = useRouter();
  const { todayActions, updateAction, saveActions, fetchGreenActivities, isAuthenticated } = useAppContext();
  // ensure fetchGreenActivities only runs once
  const activitiesFetchedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !activitiesFetchedRef.current) {
      activitiesFetchedRef.current = true;
      fetchGreenActivities();
    }
  }, [isAuthenticated, fetchGreenActivities]);

  const handleSave = () => {
    saveActions();
    router.push("/");
  };

  // ===== list video (bạn có thể thêm link khác) =====
  const videos = [
    "/videos/Animation001.mp4",
    "/videos/Animation002.mp4",
    "/videos/Animation003.mp4",
    "/videos/Animation004.mp4",
    "https://youtu.be/nLCBnLuBGqU?si=UveCWLY3IraqUg-c",
    "https://youtu.be/rPcy-QSCf54?si=Iy9f47PzEFB__j7x",
  ];

  // utility: pick random element
  const pickRandom = (arr, avoid = null) => {
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    let idx;
    do {
      idx = Math.floor(Math.random() * arr.length);
    } while (avoid !== null && arr[idx] === avoid);
    return arr[idx];
  };

  // pick random on initial render
  const [selected, setSelected] = useState(() => pickRandom(videos));

  // helpers
  const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url);
  const isDirectVideoFile = (url) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  const toYouTubeEmbed = (url) => {
    try {
      const short = url.match(/youtu\.be\/([^\?&/]+)/);
      if (short && short[1]) return `https://www.youtube.com/embed/${short[1]}?rel=0`;

      const u = new URL(url);
      const vid = u.searchParams.get("v");
      if (vid) return `https://www.youtube.com/embed/${vid}?rel=0`;

      const embedMatch = url.match(/embed\/([^\?&/]+)/);
      if (embedMatch && embedMatch[1]) return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0`;
    } catch (e) {
      // fallback to original url
    }
    return url;
  };

  const shuffleVideo = () => {
    const next = pickRandom(videos, selected);
    setSelected(next);
  };

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

      {/* Video area (mình đặt ngay dưới header) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="mx-auto w-full max-w-3xl">
          {selected ? (
            isYouTube(selected) ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm">
                <iframe
                  className="w-full h-full"
                  src={toYouTubeEmbed(selected)}
                  title="Video hướng dẫn hành vi xanh"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : isDirectVideoFile(selected) ? (
              <video
                controls
                preload="metadata"
                className="w-full rounded-lg shadow-sm"
                playsInline
              >
                <source src={selected} />
                Trình duyệt của bạn không hỗ trợ video. <a href={selected}>Mở link</a>
              </video>
            ) : (
              <div className="p-4 rounded-lg border border-gray-200 text-left">
                <p className="mb-2">Không nhận diện được kiểu video — mở link bên dưới:</p>
                <a href={selected} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                  Mở video
                </a>
              </div>
            )
          ) : (
            <div className="text-gray-600">Không có video để hiển thị.</div>
          )}
        </div>
      </div>

      {/* Actions */}
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

          <div className="sticky bottom-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
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
