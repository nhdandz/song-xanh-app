'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaLeaf, FaChartBar, FaUsers, FaBars } from 'react-icons/fa';

export default function Navigation({ onMenuClick }) {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: <FaHome size={20} /> },
    { path: '/hanh-vi-xanh', label: 'Hành động', icon: <FaLeaf size={20} /> },
    { path: '/thong-ke', label: 'Thống kê', icon: <FaChartBar size={20} /> },
    { path: '/so-sanh', label: 'Cộng đồng', icon: <FaUsers size={20} /> },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-md">
        <ul className="flex justify-between">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1">
              <Link 
                href={item.path}
                className={`flex flex-col items-center py-2 ${
                  pathname === item.path ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="flex-1">
            <button
              onClick={onMenuClick}
              className="flex flex-col items-center py-2 text-gray-500 w-full"
            >
              <FaBars size={20} />
              <span className="text-xs mt-1">Menu</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}