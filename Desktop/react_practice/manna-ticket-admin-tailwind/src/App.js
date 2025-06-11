import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Reservations from './pages/Reservations';
import QR from './pages/QR';
import Menu from './pages/Menu';
import Notice from './pages/Notice';
import Sponser from './pages/Sponser';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './pages/Login';

function MainLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/' || location.pathname === '/login';
  return (
    <div className="min-h-screen bg-[var(--bgSecondary)]">
      {/* 로그인 페이지가 아니면 헤더/사이드바 노출 */}
      {!isLogin && (
        <div className="fixed top-0 left-0 w-full z-20">
          <Header />
        </div>
      )}
      <div className={`flex flex-row ${!isLogin ? 'pt-16' : ''} min-h-screen`}>
        {/* 로그인 페이지가 아니면 사이드바 노출 */}
        {!isLogin && (
          <div className="fixed top-16 left-0 h-[calc(100vh-64px)] z-30">
            <Sidebar />
          </div>
        )}
        <div className={`flex-1 flex flex-col min-h-screen ${!isLogin ? 'ml-60' : ''}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/qr" element={<QR />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/sponser" element={<Sponser />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}
