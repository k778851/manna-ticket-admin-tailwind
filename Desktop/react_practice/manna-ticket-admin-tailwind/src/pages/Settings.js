import React, { useState } from 'react';

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [siteName, setSiteName] = useState('만나식권');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const handleBasicSave = () => {
    console.log('저장됨:', { siteName, adminEmail, autoRefresh, refreshInterval });
  };

  return (
    <div className="p-4 bg-[var(--bgSecondary)] min-h-screen">
      <h1 className="text-2xl font-bold text-[var(--contentMain)] mb-4">시스템 설정</h1>
      <div className="flex justify-center gap-2 mb-6 px-10">
        <button
          onClick={() => setTab(0)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===0 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          기본 설정
        </button>
        <button
          onClick={() => setTab(1)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===1 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          API 연동
        </button>
        <button
          onClick={() => setTab(2)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===2 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          보안 설정
        </button>
      </div>
      {tab === 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">기본 설정</h2>
          <p className="text-sm text-[var(--contentCaption)] mb-4">시스템의 기본 정보를 설정할 수 있습니다.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">사이트 이름</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">관리자 이메일</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">자동 새로고침</label>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">새로고침 주기 (초)</label>
              <input type="number" value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button onClick={handleBasicSave} className="bg-[var(--primaryBlue)] text-white px-4 py-2 rounded">저장</button>
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="flex flex-col gap-6">
          {/* API 연동 상태 박스 */}
          <div className="bg-[#fff7e6] border border-[#ffe58f] rounded-lg px-6 py-4 flex items-center gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="font-semibold text-[var(--contentMain)]">API 연동 실패</span>
            </div>
            <span className="text-sm text-[#faad14] ml-4">API 서버와의 연결에 실패했습니다. 서버 상태를 확인하거나 네트워크를 점검해 주세요.</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm">재시도 주기:</span>
              <select className="border border-gray-300 rounded px-2 py-1 bg-white text-sm">
                <option>1분</option>
                <option selected>5분</option>
                <option>10분</option>
              </select>
            </div>
            <span className="ml-4 text-xs text-red-400 font-semibold">연결 실패</span>
          </div>

          {/* API 기본 URL 카드 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
            <div className="font-semibold text-[var(--contentMain)] mb-1">API 기본 URL 설정</div>
            <div className="text-xs text-[var(--contentCaption)] mb-2">모든 API 요청의 기본 URL을 입력하세요.</div>
            <div className="flex gap-2 items-center">
              <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" placeholder="http://api.example.com" />
              <button className="ml-2 px-3 py-2 bg-[var(--primaryBlue)] text-white rounded text-sm">연결 테스트</button>
            </div>
          </div>

          {/* API 엔드포인트 카드 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="font-semibold text-[var(--contentMain)] mb-1">API 엔드포인트별 설정</div>
            <div className="text-xs text-[var(--contentCaption)] mb-2">각 기능별 API 엔드포인트를 설정할 수 있습니다.</div>
            <div className="flex flex-col gap-3">
              {/* 엔드포인트 목록 */}
              {[
                { name: '로그인', method: 'POST', path: '/auth/login', status: 'success' },
                { name: '사용자 정보', method: 'GET', path: '/users', status: 'success' },
                { name: '예약 관리', method: 'GET/POST', path: '/reservations', status: 'success' },
                { name: '공지사항', method: 'GET/POST', path: '/notices', status: 'fail' },
                { name: '식단 관리', method: 'GET/POST', path: '/menus', status: 'success' },
              ].map((ep, idx) => (
                <div key={ep.name} className="flex items-center gap-2 border-b last:border-b-0 py-2">
                  <span className={`w-2 h-2 rounded-full ${ep.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-semibold text-[var(--contentMain)] w-20">{ep.name}</span>
                  <span className="text-xs text-gray-500 w-16">{ep.method}</span>
                  <input type="text" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs" value={ep.path} readOnly />
                  <button className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">테스트</button>
                  <button className="ml-1 px-2 py-1 bg-[var(--primaryBlue)] text-white rounded text-xs">저장</button>
                </div>
              ))}
            </div>
          </div>

          {/* 시스템 관리 카드 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="font-semibold text-[var(--contentMain)] mb-1">시스템 관리</div>
              <div className="text-xs text-[var(--contentCaption)] mb-2">API 연동 이후 시스템 설정을 관리합니다.</div>
              <div className="flex gap-2 mb-2">
                <div>
                  <label className="block text-xs mb-1">시스템 버전</label>
                  <input type="text" className="border border-gray-200 rounded px-2 py-1 text-xs w-24" value="v1.0.0" readOnly />
                </div>
                <div>
                  <label className="block text-xs mb-1">최소요구버전</label>
                  <select className="border border-gray-200 rounded px-2 py-1 text-xs w-20">
                    <option>5호</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">최대 호출 횟수</label>
                  <select className="border border-gray-200 rounded px-2 py-1 text-xs w-20">
                    <option>1회</option>
                  </select>
                </div>
              </div>
              <button className="mt-2 px-4 py-2 bg-[var(--primaryBlue)] text-white rounded text-sm font-semibold">저장</button>
            </div>
            <div className="text-right min-w-[180px]">
              <div className="text-xs text-[var(--contentCaption)] mb-1">마지막 업데이트</div>
              <div className="font-semibold text-sm">2024. 5. 29</div>
            </div>
          </div>
        </div>
      )}
      {tab === 2 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">보안 설정</h2>
          <p className="text-sm text-[var(--contentCaption)] mb-4">시스템 보안 관련 설정을 관리합니다.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">비밀번호 변경 주기</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="30">30일</option>
                <option value="60">60일</option>
                <option value="90">90일</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">IP 접근 제한</label>
              <input type="text" placeholder="IP 주소 입력 (쉼표로 구분)" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              <p className="text-xs text-[var(--contentCaption)] mt-1">접근을 허용할 IP 주소를 입력하세요. (예: 127.0.0.1, 192.168.0.1)</p>
            </div>
            <div>
              <label className="block text-sm font-medium">2단계 인증 사용</label>
              <input type="checkbox" className="mt-1" />
            </div>
            <button className="bg-[var(--primaryBlue)] text-white px-4 py-2 rounded">저장</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 