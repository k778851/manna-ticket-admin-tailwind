import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': '대시보드',
  '/dashboard': '대시보드',
  '/users': '회원 관리',
  '/reservations': '예약 관리',
  '/qr': 'QR 관리',
  '/menu': '메뉴 관리',
  '/notice': '공지사항',
  '/sponser': '후원 관리',
  '/settings': '설정',
  '/help': '도움말',
  '/icons': '아이콘',
};

export default function PageHeader() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || '페이지';

  return (
    <div className="md:hidden bg-white border-b border-[var(--borderOutline)] px-4 py-3 sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-[var(--contentMain)]">{title}</h1>
    </div>
  );
} 