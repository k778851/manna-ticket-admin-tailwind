import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGaugeHigh, 
  faUsers, 
  faCalendarDays, 
  faQrcode, 
  faUtensils, 
  faBullhorn, 
  faHeart, 
  faGear, 
  faCircleQuestion, 
  faUser, 
  faRightFromBracket,
  faBars
} from '@fortawesome/free-solid-svg-icons';

const menus = [
  { path: '/', icon: faGaugeHigh, label: '대시보드' },
  { path: '/users', icon: faUsers, label: '회원 관리' },
  { path: '/reservations', icon: faCalendarDays, label: '예약 관리' },
  { path: '/qr', icon: faQrcode, label: 'QR 관리' },
  { path: '/menu', icon: faUtensils, label: '메뉴 관리' },
  { path: '/notice', icon: faBullhorn, label: '공지사항' },
  { path: '/sponser', icon: faHeart, label: '후원 관리' },
  { path: '/settings', icon: faGear, label: '설정' },
  { path: '/help', icon: faCircleQuestion, label: '도움말' },
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-[var(--borderOutline)] flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <div className="p-4 border-b border-[var(--borderOutline)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isCollapsed && <span className="text-lg font-semibold text-[var(--contentMain)]">만나식권 관리자</span>}
          </div>
          <button
            onClick={onToggle}
            className={`p-1 rounded-lg hover:bg-[var(--bgTertiary)] transition-colors ${isCollapsed ? 'flex justify-center items-center w-full' : ''}`}
            aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menus.map((menu) => (
            <li key={menu.path}>
              <button
                onClick={() => navigate(menu.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === menu.path
                    ? 'bg-[var(--primaryBlue)] text-white'
                    : 'text-[var(--contentMain)] hover:bg-[var(--bgTertiary)]'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <span className={`flex ${isCollapsed ? 'justify-center w-full' : ''}`}>
                  <FontAwesomeIcon icon={menu.icon} className="w-5 h-5" />
                </span>
                {!isCollapsed && <span className="text-sm font-medium">{menu.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--borderOutline)]">
        {!isCollapsed && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bgTertiary)]">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-[var(--contentMain)]" />
              <span className="text-sm font-medium text-[var(--contentMain)]">관리자</span>
            </div>
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-2 p-2 rounded-lg border border-[var(--borderOutline)] hover:bg-[var(--bgTertiary)] transition-colors"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-[var(--primaryBlue)]" />
              <span className="text-sm font-medium text-[var(--primaryBlue)]">로그아웃</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
} 