import React from 'react';
import { MdDownload, MdNotificationsNone, MdBlock } from 'react-icons/md';

const qrStats = {
  todaySubmit: 67,
  total: 83,
  rate: 81,
};

const notSubmitted = [
  { id: 1, user: '이영희', meal: '저녁', time: '18:00', count: 3, status: '경고' },
  { id: 2, user: '박민수', meal: '점심', time: '12:00', count: 1, status: '정상' },
];

export default function QR() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">QR 코드 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"><MdDownload size={18}/> QR 통계 내보내기</button>
        </div>
      </div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-10 pb-6">
        <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col border border-[var(--borderOutline)] min-h-[80px]">
          <div className="text-[var(--contentCaption)] text-sm">오늘 QR 제출</div>
          <div className="text-3xl font-bold text-[var(--contentMain)] mt-1">{qrStats.todaySubmit}</div>
          <div className="text-sm text-[var(--contentCaption)] mt-1">전체 {qrStats.total}명 중</div>
        </div>
        <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col border border-[var(--borderOutline)] min-h-[80px]">
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
      <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] mx-10 mb-10">
        <div className="font-bold text-[var(--contentMain)] mb-1">QR 미제출자 명단</div>
        <div className="text-sm text-[var(--contentCaption)] mb-3">식사 예약 후 QR 코드를 제출하지 않은 사용자 목록</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">사용자</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">예약 식사</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">예약 시간</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">미제출 횟수</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-center">상태</th>
                <th className="font-bold text-[var(--contentMain)] py-2 text-left">작업</th>
              </tr>
            </thead>
            <tbody>
              {notSubmitted.map(row => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2 text-center">{row.user}</td>
                  <td className="py-2 text-center">{row.meal}</td>
                  <td className="py-2 text-center">{row.time}</td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.count >= 3 ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--bgTertiary)] text-[var(--contentMain)]'}`}>{row.count}회</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === '경고' ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--green50)] text-[var(--green500)]'}`}>{row.status}</span>
                  </td>
                  <td className="py-2 text-left">
                    <div className="flex flex-row gap-2 items-center">
                      <button className="px-3 py-1 rounded border border-[var(--primaryBlue)] text-[var(--primaryBlue)] text-xs font-semibold inline-flex items-center gap-1 hover:bg-[var(--blue50)] transition min-w-[80px] justify-center"><MdNotificationsNone size={16}/> 알림 발송</button>
                      {row.status === '경고' && (
                        <button className="px-3 py-1 rounded border border-[var(--red500)] text-[var(--red500)] text-xs font-semibold inline-flex items-center gap-1 hover:bg-[var(--red50)] transition min-w-[60px] justify-center"><MdBlock size={16}/> 재제</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 