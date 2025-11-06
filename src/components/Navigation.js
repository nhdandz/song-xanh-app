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
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-50 via-white to-emerald-50 border-r border-gray-200 z-40 shadow-sm">
        <div className="relative h-full">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-green-100 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-20 left-5 w-32 h-32 bg-emerald-100 rounded-full opacity-20 blur-2xl"></div>

          <div className="relative p-6">
            {/* Logo section with icon */}
            <div className="mb-8 flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <FaLeaf className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Sống Xanh
              </h1>
            </div>

            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === item.path
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className={pathname === item.path ? 'font-medium' : ''}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={onMenuClick}
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 w-full"
              >
                <FaBars className="mr-3" size={20} />
                <span>Tất cả menu</span>
              </button>
            </div>

            {/* Decorative bottom section */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Bảo vệ môi trường</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="container mx-auto">
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
    </>
  );
}