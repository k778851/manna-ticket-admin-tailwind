import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseIcon from '@mui/icons-material/Close';

const menus = [
  { path: '/', icon: <DashboardOutlinedIcon />, label: '대시보드' },
  { path: '/users', icon: <PeopleOutlineIcon />, label: '사용자 관리' },
  { path: '/reservations', icon: <CalendarTodayOutlinedIcon />, label: '예약 관리' },
  { path: '/qr', icon: <QrCode2OutlinedIcon />, label: 'QR 관리' },
  { path: '/menu', icon: <MenuBookOutlinedIcon />, label: '메뉴 관리' },
  { path: '/notice', icon: <CampaignOutlinedIcon />, label: '공지사항' },
  { path: '/sponser', icon: <FavoriteBorderOutlinedIcon />, label: '후원 관리' },
  { path: '/settings', icon: <SettingsOutlinedIcon />, label: '설정' },
  { path: '/help', icon: <HelpOutlineIcon />, label: '도움말' },
];

export default function Sidebar({ isCollapsed, onToggle, isMobile, isMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      onToggle(); // 모바일에서 메뉴 클릭 시 사이드바 닫기
    }
  };

  return (
    <>
      {/* 모바일 햄버거 메뉴 버튼 */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label="메뉴 열기"
        >
          <MenuOutlinedIcon style={{ fontSize: 24 }} />
        </button>
      )}

      {/* 사이드바 */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-[var(--borderOutline)] flex flex-col transition-all duration-300 shadow-md z-50
          ${isMobile 
            ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div className="p-4 border-b border-[var(--borderOutline)] bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(!isCollapsed || isMobile) && (
                <span className="text-xl font-bold text-[var(--primaryBlue)] tracking-tight">
                  만나식권 관리자
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg hover:bg-[var(--bgTertiary)] transition-colors"
                  aria-label="사이드바 닫기"
                >
                  <CloseIcon style={{ fontSize: 20 }} />
                </button>
              )}
              {!isMobile && (
                <button
                  onClick={onToggle}
                  className={`p-2 rounded-lg hover:bg-[var(--bgTertiary)] transition-colors ${isCollapsed ? 'flex justify-center items-center w-full' : ''}`}
                  aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
                >
                  <MenuOutlinedIcon style={{ fontSize: 20 }} />
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <ul className="space-y-1 px-2">
            {menus.map((menu) => (
              <li key={menu.path}>
                <button
                  onClick={() => handleMenuClick(menu.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group
                    ${location.pathname === menu.path
                      ? 'bg-blue-100 text-[var(--primaryBlue)] shadow-sm'
                      : 'text-[var(--contentMain)] hover:bg-blue-50 hover:text-[var(--primaryBlue)]'}
                    ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                  style={{ minHeight: '44px' }}
                >
                  <span className={`flex items-center justify-center ${isCollapsed && !isMobile ? 'w-full' : ''}`}>
                    {React.cloneElement(menu.icon, {
                      style: {
                        fontSize: 20,
                        color: location.pathname === menu.path
                          ? 'var(--primaryBlue)'
                          : 'gray',
                        transition: 'color 0.2s',
                      },
                      className: `group-hover:text-blue-400 ${location.pathname === menu.path ? '' : ''}`
                    })}
                  </span>
                  {(!isCollapsed || isMobile) && (
                    <span className="text-base font-medium whitespace-nowrap">{menu.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--borderOutline)] bg-white">
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bgTertiary)]">
                <AccountCircleOutlinedIcon style={{ fontSize: 20, color: 'var(--contentMain)' }} />
                <span className="text-sm font-medium text-[var(--contentMain)]">관리자</span>
              </div>
              <button 
                onClick={() => handleMenuClick('/login')} 
                className="flex items-center gap-2 p-2 rounded-lg border border-[var(--borderOutline)] hover:bg-blue-50 transition-colors"
              >
                <LogoutOutlinedIcon style={{ fontSize: 20, color: 'var(--primaryBlue)' }} />
                <span className="text-sm font-medium text-[var(--primaryBlue)]">로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
} 