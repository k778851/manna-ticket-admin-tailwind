import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdPeople, MdEvent, MdQrCode, MdRestaurantMenu, MdAnnouncement, MdFavorite, MdSettings, MdHelp } from 'react-icons/md';

const menus = [
  { key: 'dashboard', label: '대시보드', icon: <MdDashboard size={20}/>, path: '/dashboard' },
  { key: 'users', label: '사용자', icon: <MdPeople size={20}/>, path: '/users' },
  { key: 'reservations', label: '예약 현황', icon: <MdEvent size={20}/>, path: '/reservations' },
  { key: 'qr', label: 'QR 코드', icon: <MdQrCode size={20}/>, path: '/qr' },
  { key: 'menu', label: '식단 메뉴', icon: <MdRestaurantMenu size={20}/>, path: '/menu' },
  { key: 'notice', label: '공지사항', icon: <MdAnnouncement size={20}/>, path: '/notice' },
  { key: 'sponser', label: '후원 현황', icon: <MdFavorite size={20}/>, path: '/sponser' },
  { key: 'settings', label: '시스템 설정', icon: <MdSettings size={20}/>, path: '/settings' },
  { key: 'help', label: '도움말', icon: <MdHelp size={20}/>, path: '/help' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-60 bg-white border-r border-[var(--borderOutline)] flex flex-col py-8 px-4 min-h-screen shadow-sm">
      <nav className="flex-1 mt-2">
        <ul className="space-y-1 text-[15px]">
          {menus.map(menu => (
            <li key={menu.key}>
              <button
                className={`flex items-center gap-2 py-2 px-3 rounded-md w-full text-left transition font-semibold ${((menu.key === 'dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) || (menu.path !== '/dashboard' && location.pathname === menu.path)) ? 'bg-[var(--primaryBlue)] text-white' : 'text-[var(--contentMain)] hover:bg-[var(--bgTertiary)]'}`}
                onClick={() => navigate(menu.path)}
              >
                {menu.icon} {menu.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-xs text-[var(--contentCaption)] pt-8">Copyright © 2024 만나식권. All rights reserved.</div>
    </aside>
  );
} 