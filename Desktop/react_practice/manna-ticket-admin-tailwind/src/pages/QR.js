import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload,
  faBell,
  faBan
} from '@fortawesome/free-solid-svg-icons';

const qrStats = {
  todaySubmit: 67,
  total: 83,
  rate: 81,
};

const notSubmitted = [
  { id: 1, department: '문화부', user: '이영희', meal: '저녁', time: '18:00', lunchCount: 0, dinnerCount: 3, status: '경고' },
  { id: 2, department: '홍보부', user: '박민수', meal: '점심', time: '12:00', lunchCount: 1, dinnerCount: 0, status: '정상' },
];

export default function QR() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-10 pt-14 sm:pt-10 pb-2 sm:pb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--contentMain)] mb-2">QR 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]">
            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" /> QR 통계 내보내기
          </button>
        </div>
      </div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 sm:px-10 pb-6">
        <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-4 flex flex-col border border-[var(--borderOutline)] min-h-[80px]">
          <div className="text-[var(--contentCaption)] text-sm">오늘 QR 제출</div>
          <div className="text-3xl font-bold text-[var(--contentMain)] mt-1">{qrStats.todaySubmit}</div>
          <div className="text-sm text-[var(--contentCaption)] mt-1">전체 {qrStats.total}명 중</div>
        </div>
        <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-4 flex flex-col border border-[var(--borderOutline)] min-h-[80px]">
          <div className="text-[var(--contentCaption)] text-sm mb-2">제출률</div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-[var(--contentMain)]">{qrStats.rate}%</div>
            <div className="flex-1 h-3 bg-[var(--bgTertiary)] rounded">
              <div className="h-3 rounded bg-[var(--primaryBlue)]" style={{width: qrStats.rate + '%'}}></div>
            </div>
          </div>
        </div>
      </div>
      {/* 미제출자 명단 */}
      <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-4 border border-[var(--borderOutline)] mx-4 sm:mx-10 mb-6">
        <div className="font-bold text-[var(--contentMain)] mb-1">QR 미제출자 명단</div>
        <div className="text-sm text-[var(--contentCaption)] mb-3">식사 예약 후 QR 코드를 제출하지 않은 사용자 목록</div>
        {/* 데스크톱: 표 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">부서</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">이름</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">점심예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">저녁예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">미제출 횟수</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {notSubmitted.map(row => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2 text-center">{row.department}</td>
                  <td className="py-2 text-center">{row.user}</td>
                  <td className="py-2 text-center">{row.lunchCount > 0 ? row.lunchCount : '-'}</td>
                  <td className="py-2 text-center">{row.dinnerCount > 0 ? row.dinnerCount : '-'}</td>
                  <td className="py-2 text-center">{row.lunchCount + row.dinnerCount}회</td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === '경고' ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--green50)] text-[var(--green500)]'}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 모바일: 카드형 */}
        <div className="block sm:hidden space-y-2">
          {notSubmitted.map(row => (
            <div key={row.id} className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex justify-between mb-1">
                <span className="font-bold">{row.user}</span>
                <span className="text-xs text-[var(--contentCaption)]">{row.department}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm mb-1">
                <div><b>점심예약</b>: {row.lunchCount > 0 ? row.lunchCount : '-'}</div>
                <div><b>저녁예약</b>: {row.dinnerCount > 0 ? row.dinnerCount : '-'}</div>
                <div><b>미제출 횟수</b>: {row.lunchCount + row.dinnerCount}회</div>
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === '경고' ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--green50)] text-[var(--green500)]'}`}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 