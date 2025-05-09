'use client';

import { useAppContext } from '@/context/AppContext';
import BadgeCard from '@/components/BadgeCard';

export default function Badges() {
  const { BADGES, getEarnedBadges, points } = useAppContext();
  
  const earnedBadges = getEarnedBadges();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Huy hiệu của bạn
        </h1>
        <p className="text-gray-600 mt-1">
          Thành tích sống xanh của bạn
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md text-center mb-6">
        <p className="text-lg text-gray-700">Tổng điểm xanh</p>
        <p className="text-4xl font-bold text-green-600 my-2">{points.total}</p>
        <p className="text-sm text-gray-500">
          {earnedBadges.length < BADGES.length 
            ? `Cần ${BADGES[earnedBadges.length].points - points.total} điểm để đạt huy hiệu tiếp theo`
            : 'Bạn đã đạt tất cả huy hiệu!'}
        </p>
      </div>
      
      <div className="space-y-4">
        {BADGES.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={points.total >= badge.points}
            progress={Math.min(100, (points.total / badge.points) * 100)}
          />
        ))}
      </div>
    </div>
  );
}