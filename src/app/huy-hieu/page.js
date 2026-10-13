'use client';

import { useAppContext } from '@/context/AppContext';
import BadgeCard from '@/components/BadgeCard';

export default function Badges() {
  const { BADGES, getEarnedBadges, points } = useAppContext();
  
  const earnedBadges = getEarnedBadges();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-ink">
          Huy hiệu của bạn
        </h1>
        <p className="text-ink-soft mt-1">
          Thành tích sống xanh của bạn
        </p>
      </div>
      
      <div className="bg-paper p-4 rounded-card text-center mb-6">
        <p className="text-lg text-ink-soft">Tổng điểm xanh</p>
        <p className="text-4xl font-bold text-brand my-2">{points.total}</p>
        <p className="text-sm text-ink-faint">
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