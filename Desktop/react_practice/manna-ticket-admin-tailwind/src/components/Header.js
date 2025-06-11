import React from 'react';
import { MdPerson, MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-[var(--borderOutline)] px-10 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold text-2xl text-[var(--contentMain)] tracking-tight">만나식권 관리자</span>
        <span className="text-xs text-[var(--contentCaption)] border border-[var(--borderOutline)] rounded px-4 py-2 ml-2 bg-[var(--bgTertiary)]">manna1.scpiet.net</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 text-[var(--contentMain)] text-sm hover:underline px-4 py-2 rounded border border-[var(--borderOutline)] transition"><MdPerson size={18}/> 관리자</button>
        <button onClick={() => navigate('/login')} className="flex items-center gap-1 text-[var(--primaryBlue)] text-sm hover:underline px-4 py-2 rounded border border-[var(--borderOutline)] transition"><MdLogout size={18}/> 로그아웃</button>
      </div>
    </header>
  );
} 