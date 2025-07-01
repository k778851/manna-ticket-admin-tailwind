import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog,
  faServer,
  faShieldHalved,
  faSave,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faDownload,
  faUpload,
  faEye,
  faPenToSquare,
  faTrash,
  faPlus,
  faRefresh,
  faNetworkWired,
  faKey,
  faLock,
  faGlobe,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [siteName, setSiteName] = useState('만나식권');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  
  // API 설정 상태
  const [apiBaseUrl, setApiBaseUrl] = useState('http://api.example.com');
  const [apiConnectionStatus, setApiConnectionStatus] = useState('success'); // 'success', 'connecting', 'fail'
  const [apiEndpoints, setApiEndpoints] = useState([
    { name: '로그인', method: 'POST', path: '/auth/login', status: 'success' },
    { name: '사용자 정보', method: 'GET', path: '/users', status: 'success' },
    { name: '예약 관리', method: 'GET/POST', path: '/reservations', status: 'success' },
    { name: '공지사항', method: 'GET/POST', path: '/notices', status: 'fail' },
    { name: '식단 관리', method: 'GET/POST', path: '/menus', status: 'success' },
  ]);
  const [systemVersion, setSystemVersion] = useState('v1.0.0');
  const [minVersion, setMinVersion] = useState('5호');
  const [maxCalls, setMaxCalls] = useState('1회');
  const [lastUpdate, setLastUpdate] = useState('2024. 5. 29');
  const [retryInterval, setRetryInterval] = useState('5분');

  const handleBasicSave = () => {
    console.log('기본 설정 저장됨:', { siteName, adminEmail, autoRefresh, refreshInterval });
    // 실제로는 API 호출하여 저장
    alert('기본 설정이 저장되었습니다.');
  };

  // API 기본 URL 연결 테스트
  const handleApiConnectionTest = async () => {
    setApiConnectionStatus('connecting');
    
    // 실제 API 연결 테스트 시뮬레이션
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% 성공 확률
      setApiConnectionStatus(isSuccess ? 'success' : 'fail');
      
      if (isSuccess) {
        alert('API 연결 테스트가 성공했습니다.');
      } else {
        alert('API 연결 테스트에 실패했습니다. URL을 확인해주세요.');
      }
    }, 2000);
  };

  // 개별 엔드포인트 테스트
  const handleEndpointTest = async (endpointIndex) => {
    const updatedEndpoints = [...apiEndpoints];
    updatedEndpoints[endpointIndex] = { ...updatedEndpoints[endpointIndex], status: 'connecting' };
    setApiEndpoints(updatedEndpoints);
    
    // 실제 엔드포인트 테스트 시뮬레이션
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% 성공 확률
      updatedEndpoints[endpointIndex] = { 
        ...updatedEndpoints[endpointIndex], 
        status: isSuccess ? 'success' : 'fail' 
      };
      setApiEndpoints(updatedEndpoints);
      
      if (isSuccess) {
        alert(`${updatedEndpoints[endpointIndex].name} 엔드포인트 테스트가 성공했습니다.`);
      } else {
        alert(`${updatedEndpoints[endpointIndex].name} 엔드포인트 테스트에 실패했습니다.`);
      }
    }, 1500);
  };

  // 엔드포인트 경로 수정
  const handleEndpointPathChange = (index, newPath) => {
    const updatedEndpoints = [...apiEndpoints];
    updatedEndpoints[index] = { ...updatedEndpoints[index], path: newPath };
    setApiEndpoints(updatedEndpoints);
  };

  // 엔드포인트 저장
  const handleEndpointSave = (index) => {
    const endpoint = apiEndpoints[index];
    console.log('엔드포인트 저장됨:', endpoint);
    alert(`${endpoint.name} 엔드포인트가 저장되었습니다.`);
  };

  // 시스템 설정 저장
  const handleSystemSave = () => {
    console.log('시스템 설정 저장됨:', { systemVersion, minVersion, maxCalls });
    setLastUpdate(new Date().toLocaleDateString('ko-KR'));
    alert('시스템 설정이 저장되었습니다.');
  };

  // 보안 설정 저장
  const handleSecuritySave = () => {
    console.log('보안 설정 저장됨');
    alert('보안 설정이 저장되었습니다.');
  };

  // 재시도 주기 변경
  const handleRetryIntervalChange = (newInterval) => {
    setRetryInterval(newInterval);
    console.log('재시도 주기가 변경되었습니다:', newInterval);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)] flex items-center gap-2">
          시스템 설정
        </h1>
      </div>
      <div className="flex justify-center gap-2 mb-6 px-10">
        <button
          onClick={() => setTab(0)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border flex items-center justify-center gap-2 ${tab===0 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
          기본 설정
        </button>
        <button
          onClick={() => setTab(1)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border flex items-center justify-center gap-2 ${tab===1 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          <FontAwesomeIcon icon={faServer} className="w-4 h-4" />
          API 연동
        </button>
        <button
          onClick={() => setTab(2)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border flex items-center justify-center gap-2 ${tab===2 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" />
          보안 설정
        </button>
      </div>
      {tab === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--borderOutline)] mx-10 mb-10">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-[var(--primaryBlue)]" />
            기본 설정
          </h2>
          <p className="text-sm text-[var(--contentCaption)] mb-4">시스템의 기본 정보를 설정할 수 있습니다.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
                사이트 이름
              </label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1 block w-full border border-[var(--borderInput)] rounded-md shadow-sm p-2 focus:outline-none focus:border-[var(--primaryBlue)]" />
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                관리자 이메일
              </label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-1 block w-full border border-[var(--borderInput)] rounded-md shadow-sm p-2 focus:outline-none focus:border-[var(--primaryBlue)]" />
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faRefresh} className="w-4 h-4" />
                자동 새로고침
              </label>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                새로고침 주기 (초)
              </label>
              <input type="number" value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))} className="mt-1 block w-full border border-[var(--borderInput)] rounded-md shadow-sm p-2 focus:outline-none focus:border-[var(--primaryBlue)]" />
            </div>
            <button onClick={handleBasicSave} className="bg-[var(--primaryBlue)] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[var(--blue700)] transition">
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              저장
            </button>
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="flex flex-col gap-6 px-10 mb-10">
          {/* API 연동 상태 */}
          <div className="font-bold text-[var(--contentMain)] mb-2 mt-2">API 연동 상태</div>
          
          {/* 동적 상태 표시 */}
          {apiConnectionStatus === 'success' && (
            <div className="bg-[#e6fffb] border border-[#87e8de] rounded-lg px-6 py-4 flex items-center gap-4 shadow-sm">
              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-[var(--contentMain)]">API 연동 성공</span>
              <span className="text-sm text-green-500 ml-4">API 서버와 정상적으로 연결되었습니다.</span>
            </div>
          )}
          
          {apiConnectionStatus === 'connecting' && (
            <div className="bg-[#f0f5ff] border border-[#adc6ff] rounded-lg px-6 py-4 flex items-center gap-4 shadow-sm">
              <FontAwesomeIcon icon={faRefresh} spin className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-[var(--contentMain)]">API 연동 시도중...</span>
              <span className="text-sm text-blue-500 ml-4">API 서버에 연결을 시도하고 있습니다.</span>
            </div>
          )}
          
          {apiConnectionStatus === 'fail' && (
            <div className="bg-[#fff7e6] border border-[#ffe58f] rounded-lg px-6 py-4 flex items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-[var(--contentMain)]">API 연동 실패</span>
              </div>
              <span className="text-sm text-[#faad14] ml-4">API 서버와의 연결에 실패했습니다. 서버 상태를 확인하거나 네트워크를 점검해 주세요.</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm">재시도 주기:</span>
                <select 
                  className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
                  value={retryInterval}
                  onChange={(e) => handleRetryIntervalChange(e.target.value)}
                >
                  <option>1분</option>
                  <option>5분</option>
                  <option>10분</option>
                </select>
              </div>
              <span className="ml-4 text-xs text-red-400 font-semibold">연결 실패</span>
            </div>
          )}

          {/* API 기본 URL 카드 */}
          <div className="bg-white rounded-lg shadow-sm border border-[var(--borderOutline)] p-6 flex flex-col gap-2">
            <div className="font-semibold text-[var(--contentMain)] mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faNetworkWired} className="w-5 h-5 text-[var(--primaryBlue)]" />
              API 기본 URL 설정
            </div>
            <div className="text-xs text-[var(--contentCaption)] mb-2">모든 API 요청의 기본 URL을 입력하세요.</div>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                className="flex-1 border border-[var(--borderInput)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--primaryBlue)]" 
                placeholder="http://api.example.com"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
              />
              <button 
                className="ml-2 px-3 py-2 bg-[var(--primaryBlue)] text-white rounded text-sm flex items-center gap-2 hover:bg-[var(--blue700)] transition"
                onClick={handleApiConnectionTest}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                연결 테스트
              </button>
            </div>
          </div>

          {/* API 엔드포인트 카드 */}
          <div className="bg-white rounded-lg shadow-sm border border-[var(--borderOutline)] p-6 flex flex-col gap-4">
            <div className="font-semibold text-[var(--contentMain)] mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faServer} className="w-5 h-5 text-[var(--primaryBlue)]" />
              API 엔드포인트별 설정
            </div>
            <div className="text-xs text-[var(--contentCaption)] mb-2">각 기능별 API 엔드포인트를 설정할 수 있습니다.</div>
            <div className="flex flex-col gap-3">
              {/* 엔드포인트 목록 */}
              {apiEndpoints.map((ep, idx) => (
                <div key={ep.name} className="flex items-center gap-2 border-b last:border-b-0 py-2">
                  <FontAwesomeIcon 
                    icon={ep.status === 'success' ? faCheckCircle : ep.status === 'connecting' ? faRefresh : faTimesCircle} 
                    className={`w-4 h-4 ${ep.status === 'success' ? 'text-green-500' : ep.status === 'connecting' ? 'text-blue-500' : 'text-red-500'}`}
                    spin={ep.status === 'connecting'}
                  />
                  <span className="text-xs font-semibold text-[var(--contentMain)] w-20">{ep.name}</span>
                  <span className="text-xs text-gray-500 w-16">{ep.method}</span>
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs" 
                    value={ep.path} 
                    onChange={(e) => handleEndpointPathChange(idx, e.target.value)}
                  />
                  <button 
                    className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition"
                    onClick={() => handleEndpointTest(idx)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                    테스트
                  </button>
                  <button 
                    className="ml-1 px-2 py-1 bg-[var(--primaryBlue)] text-white rounded text-xs flex items-center gap-1 hover:bg-[var(--blue700)] transition"
                    onClick={() => handleEndpointSave(idx)}
                  >
                    <FontAwesomeIcon icon={faSave} className="w-3 h-3" />
                    저장
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 시스템 관리 카드 */}
          <div className="bg-white rounded-lg shadow-sm border border-[var(--borderOutline)] p-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="font-semibold text-[var(--contentMain)] mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-[var(--primaryBlue)]" />
                시스템 관리
              </div>
              <div className="text-xs text-[var(--contentCaption)] mb-2">API 연동 이후 시스템 설정을 관리합니다.</div>
              <div className="flex gap-2 mb-2">
                <div>
                  <label className="block text-xs mb-1">시스템 버전</label>
                  <input 
                    type="text" 
                    className="border border-gray-200 rounded px-2 py-1 text-xs w-24" 
                    value={systemVersion} 
                    onChange={(e) => setSystemVersion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">최소요구버전</label>
                  <select 
                    className="border border-gray-200 rounded px-2 py-1 text-xs w-20"
                    value={minVersion}
                    onChange={(e) => setMinVersion(e.target.value)}
                  >
                    <option>5호</option>
                    <option>6호</option>
                    <option>7호</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">최대 호출 횟수</label>
                  <select 
                    className="border border-gray-200 rounded px-2 py-1 text-xs w-20"
                    value={maxCalls}
                    onChange={(e) => setMaxCalls(e.target.value)}
                  >
                    <option>1회</option>
                    <option>5회</option>
                    <option>10회</option>
                  </select>
                </div>
              </div>
              <button 
                className="mt-2 px-4 py-2 bg-[var(--primaryBlue)] text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-[var(--blue700)] transition"
                onClick={handleSystemSave}
              >
                <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                저장
              </button>
            </div>
            <div className="text-right min-w-[180px]">
              <div className="text-xs text-[var(--contentCaption)] mb-1">마지막 업데이트</div>
              <div className="font-semibold text-sm">2024. 5. 29</div>
            </div>
          </div>
        </div>
      )}
      {tab === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--borderOutline)] mx-10 mb-10">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 text-[var(--primaryBlue)]" />
            보안 설정
          </h2>
          <p className="text-sm text-[var(--contentCaption)] mb-4">시스템 보안 관련 설정을 관리합니다.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                비밀번호 변경 주기
              </label>
              <select className="mt-1 block w-full border border-[var(--borderInput)] rounded-md shadow-sm p-2 focus:outline-none focus:border-[var(--primaryBlue)]">
                <option value="30">30일</option>
                <option value="60">60일</option>
                <option value="90">90일</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faNetworkWired} className="w-4 h-4" />
                IP 접근 제한
              </label>
              <input type="text" placeholder="IP 주소 입력 (쉼표로 구분)" className="mt-1 block w-full border border-[var(--borderInput)] rounded-md shadow-sm p-2 focus:outline-none focus:border-[var(--primaryBlue)]" />
              <p className="text-xs text-[var(--contentCaption)] mt-1">접근을 허용할 IP 주소를 입력하세요. (예: 127.0.0.1, 192.168.0.1)</p>
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                2단계 인증 사용
              </label>
              <input type="checkbox" className="mt-1" />
            </div>
            <button 
              className="bg-[var(--primaryBlue)] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[var(--blue700)] transition"
              onClick={handleSecuritySave}
            >
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 