import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function MainLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const isMobile = useIsMobile();

  // 모바일에서는 로그인 또는 대시보드만 전체화면으로 노출
  if (isMobile) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bgSecondary)]">
      {/* 로그인 페이지가 아니면 사이드바 노출 */}
      {!isLogin && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: isLogin ? 0 : isSidebarCollapsed ? 80 : 240 }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/qr" element={<QR />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/sponser" element={<Sponser />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}

export default App;
