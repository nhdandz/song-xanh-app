'use client';

import { FaStar, FaSeedling, FaFire } from 'react-icons/fa';

const TILES = [
  {
    key: 'today',
    label: 'Hôm nay',
    unit: 'điểm',
    icon: FaStar,
    tint: 'bg-sun-wash',
    ink: 'text-sun',
  },
  {
    key: 'sum',
    label: 'Tổng điểm',
    unit: 'điểm',
    icon: FaSeedling,
    tint: 'bg-brand-wash',
    ink: 'text-brand',
  },
  {
    key: 'streak',
    label: 'Chuỗi ngày',
    unit: 'ngày',
    icon: FaFire,
    tint: 'bg-coral-wash',
    ink: 'text-coral',
  },
];

export default function PointDisplay({ todayPoints, sumPoints, streak }) {
  const values = { today: todayPoints ?? 0, sum: sumPoints ?? 0, streak: streak ?? 0 };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {TILES.map((tile, i) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.key}
            className="sx-card sx-enter p-3.5 sm:p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${tile.tint} ${tile.ink} mb-2.5`}
            >
              <Icon size={15} />
            </span>
            <p className="text-xs font-semibold text-ink-faint">{tile.label}</p>
            <p className="sx-figure text-2xl sm:text-3xl mt-1 text-ink">
              {values[tile.key].toLocaleString('vi-VN')}
              <span className="text-xs font-semibold text-ink-faint ml-1 tracking-normal">
                {tile.unit}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
