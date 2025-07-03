import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload,
  faQrcode,
  faMagnifyingGlass,
  faCheck,
  faXmark,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const regularReservations = [
  { id: 1, user: '김철수', department: '총무부', date: '2024-01-15', meal: '점심', status: '확정', qr: true, time: '12:30' },
  { id: 2, user: '박민수', department: '기획부', date: '2024-01-15', meal: '점심', status: '확정', qr: false, time: '-' },
];

const additionalReservations = [
  { id: 1, user: '이영희', department: '교육부', date: '2024-01-15', meal: '저녁', count: 2, reason: '회사 회식으로 인한 추가 인원 필요', status: '대기', qr: false },
  { id: 2, user: '정수진', department: '문화부', date: '2024-01-15', meal: '저녁', count: 1, reason: '갑작스런 업무로 인한 추가 식사 필요', status: '대기', qr: false },
  { id: 3, user: '최영호', department: '홍보부', date: '2024-01-15', meal: '점심', count: 3, reason: '외부 방문객 접대', status: '확정', qr: true },
];

// 일반 예약 점심/저녁 개수 계산
const regularLunchCount = regularReservations.filter(r => r.meal === '점심').length;
const regularDinnerCount = regularReservations.filter(r => r.meal === '저녁').length;
// 추가 예약 점심/저녁 개수 계산
const additionalLunchCount = additionalReservations.filter(r => r.meal === '점심').length;
const additionalDinnerCount = additionalReservations.filter(r => r.meal === '저녁').length;

const customTabs = [
  { label: `일반 신청 (${regularReservations.length})`, value: 0 },
  { label: `추가 신청 (${additionalReservations.length})`, value: 1 },
];

const statCards = [
  { label: '오늘 점심', value: 45 },
  { label: '오늘 저녁', value: 38 },
  { label: '일반 신청', value: `${regularLunchCount} / ${regularDinnerCount}` },
  { label: '추가 신청', value: `${additionalLunchCount} / ${additionalDinnerCount}` },
  { label: 'QR 미제출', value: 8 },
];

export default function Reservations() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [mealFilter, setMealFilter] = useState('전체');
  const navigate = useNavigate();

  const filtered = (tab === 0 ? regularReservations : additionalReservations).filter(r =>
    (!search || r.user.includes(search)) &&
    (mealFilter === '전체' || r.meal === mealFilter)
  );

  // 엑셀 다운로드 함수
  const exportToExcel = () => {
    // 현재 탭에 따른 데이터 준비
    const currentData = tab === 0 ? regularReservations : additionalReservations;
    
    // 엑셀용 데이터 변환
    const excelData = currentData.map(item => {
      if (tab === 0) {
        // 일반 예약 데이터
        return {
          '부서': item.department,
          '이름': item.user,
          '날짜': item.date,
          '식사': item.meal,
          '상태': item.status,
          'QR제출': item.qr ? '제출' : '미제출',
          '제출시간': item.time || '-'
        };
      } else {
        // 추가 예약 데이터
        return {
          '부서': item.department,
          '이름': item.user,
          '날짜': item.date,
          '식사': item.meal,
          '추가인원': `${item.count}명`,
          '신청사유': item.reason,
          '상태': item.status,
          'QR제출': item.qr ? '제출' : '미제출'
        };
      }
    });

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 열 너비 자동 조정
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...excelData.map(row => String(row[key]).length)) + 2
    }));
    ws['!cols'] = colWidths;

    // 워크시트를 워크북에 추가
    const sheetName = tab === 0 ? '일반예약현황' : '추가예약현황';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 파일명 생성
    const today = new Date().toISOString().split('T')[0];
    const fileName = `${sheetName}_${today}.xlsx`;

    // 엑셀 파일 다운로드
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-10 pt-14 sm:pt-10 pb-2 sm:pb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--contentMain)] mb-2">예약 관리</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-wrap">
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--bgPrimary)] text-sm min-w-[100px] w-full sm:w-auto" defaultValue="오늘">
            <option value="오늘">오늘</option>
            <option value="이번주">이번주</option>
            <option value="이번달">이번달</option>
          </select>
          <button 
            className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)] hover:bg-[var(--bgTertiary)] transition w-full sm:w-auto"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" /> 예약 현황 내보내기
          </button>
          <button className="button-primary-m flex items-center gap-1 px-4 py-2 w-full sm:w-auto" onClick={() => navigate('/qr')}><FontAwesomeIcon icon={faQrcode} className="w-5 h-5" /> QR 미제출자 확인</button>
        </div>
      </div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 px-4 sm:px-10 pb-6">
        {statCards.map((card, idx) => (
          <div key={card.label} className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col items-center border border-[var(--borderOutline)] min-h-[80px]">
            <div className="text-[var(--contentCaption)] text-sm">{card.label}</div>
            <div className={`text-2xl font-bold mt-1 ${card.label.includes('일반') ? 'text-[var(--primaryBlue)]' : card.label.includes('추가') ? 'text-[var(--yellow500)]' : card.label.includes('QR') ? 'text-[var(--red500)]' : 'text-[var(--contentMain)]'}`}>{card.value}</div>
          </div>
        ))}
      </div>
      {/* 탭 메뉴 */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 mb-3 px-4 sm:px-10">
        {customTabs.map(tabItem => (
          <button
            key={tabItem.value}
            onClick={() => setTab(tabItem.value)}
            className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===tabItem.value ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
            style={{minWidth:120}}
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      {/* 예약 현황 테이블 카드 */}
      <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-4 sm:p-6 border border-[var(--borderOutline)] mx-2 sm:mx-10 mb-10">
        <div className="font-bold text-[var(--contentMain)] mb-1">{tab === 0 ? '일반 예약 현황' : '추가 예약 현황'}</div>
        <div className="text-sm text-[var(--contentCaption)] mb-3">{tab === 0 ? '정규 식사 예약을 확인하고 관리할 수 있습니다.' : '추가 식사 예약을 확인하고 관리할 수 있습니다.'}</div>
        {/* 검색/필터 */}
        <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
          <div className="relative w-full sm:w-auto">
            <input type="text" className="pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm w-full sm:w-[220px]" placeholder="사용자 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--white)] text-sm w-full sm:w-[100px]" value={mealFilter} onChange={e => setMealFilter(e.target.value)}>
            <option value="전체">전체</option>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
          </select>
        </div>
        {/* 테이블: 데스크톱 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">부서</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">이름</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">날짜</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">점심</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">저녁</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">QR제출(점심)</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">QR제출(저녁)</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">제출시간(점심)</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">제출시간(저녁)</th>
                {tab === 1 && <th className="font-bold text-[var(--contentMain)] py-2 text-center">추가 인원</th>}
                {tab === 1 && <th className="font-bold text-[var(--contentMain)] py-2 text-center">신청 사유</th>}
                {tab === 1 && <th className="font-bold text-[var(--contentMain)] py-2 text-center">작업</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="py-2 text-center">{r.department}</td>
                  <td className="py-2 font-bold text-[var(--contentMain)] text-center">{r.user}</td>
                  <td className="py-2 text-center">{r.date}</td>
                  <td className="py-2 text-center">{r.meal === '점심' ? <span className="text-[var(--green500)] font-bold">O</span> : <span className="text-[var(--contentCaption)]">X</span>}</td>
                  <td className="py-2 text-center">{r.meal === '저녁' ? <span className="text-[var(--green500)] font-bold">O</span> : <span className="text-[var(--contentCaption)]">X</span>}</td>
                  {/* QR제출(점심) */}
                  <td className="py-2 text-center">{r.meal === '점심' ? (r.qr ? <FontAwesomeIcon icon={faCheck} className="inline text-[var(--primaryBlue)]" /> : <FontAwesomeIcon icon={faXmark} className="inline text-[var(--red500)]" />) : '-'}</td>
                  {/* QR제출(저녁) */}
                  <td className="py-2 text-center">{r.meal === '저녁' ? (r.qr ? <FontAwesomeIcon icon={faCheck} className="inline text-[var(--primaryBlue)]" /> : <FontAwesomeIcon icon={faXmark} className="inline text-[var(--red500)]" />) : '-'}</td>
                  {/* 제출시간(점심) */}
                  <td className="py-2 text-center">{r.meal === '점심' ? (r.time && r.time !== '-' ? r.time : '-') : '-'}</td>
                  {/* 제출시간(저녁) */}
                  <td className="py-2 text-center">{r.meal === '저녁' ? (r.time && r.time !== '-' ? r.time : '-') : '-'}</td>
                  {tab === 1 && <td className="py-2 text-center text-[var(--yellow700)] font-bold">+{r.count}명</td>}
                  {tab === 1 && <td className="py-2 text-center">{r.reason}</td>}
                  {tab === 1 && (
                    <td className="py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 rounded bg-[var(--primaryBlue)] text-white text-xs font-semibold hover:bg-[var(--blue700)] transition">승인</button>
                        <button className="px-3 py-1 rounded bg-[var(--red100)] text-[var(--red500)] text-xs font-semibold hover:bg-[var(--red200)] transition">거절</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 카드형: 모바일 */}
        <div className="block sm:hidden space-y-2">
          {filtered.map(r => (
            <div key={r.id} className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex justify-between mb-1"><span className="font-bold">{r.user}</span><span className="text-xs text-[var(--contentCaption)]">{r.department}</span></div>
              <div className="text-xs text-[var(--contentCaption)] mb-1">{r.date}</div>
              {tab === 1 && (
                <>
                  <div className="text-xs mb-1"><b>신청 사유:</b> {r.reason}</div>
                  <div className="text-xs mb-1"><b>추가 인원:</b> {r.count}명</div>
                </>
              )}
              <div className="flex flex-wrap gap-2 text-sm">
                <div><b>점심</b>: {r.meal === '점심' ? <span className="text-green-600">O</span> : <span className="text-gray-400">X</span>}</div>
                <div><b>저녁</b>: {r.meal === '저녁' ? <span className="text-green-600">O</span> : <span className="text-gray-400">X</span>}</div>
                <div><b>QR(점심)</b>: {r.meal === '점심' ? (r.qr ? <span className="text-blue-600">제출</span> : <span className="text-red-500">미제출</span>) : '-'}</div>
                <div><b>QR(저녁)</b>: {r.meal === '저녁' ? (r.qr ? <span className="text-blue-600">제출</span> : <span className="text-red-500">미제출</span>) : '-'}</div>
                <div><b>제출시간(점심)</b>: {r.meal === '점심' ? (r.time && r.time !== '-' ? r.time : '-') : '-'}</div>
                <div><b>제출시간(저녁)</b>: {r.meal === '저녁' ? (r.time && r.time !== '-' ? r.time : '-') : '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 