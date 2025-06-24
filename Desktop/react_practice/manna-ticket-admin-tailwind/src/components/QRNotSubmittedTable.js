import React from 'react';

export default function QRNotSubmittedTable({ notSubmitted }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--bgTertiary)]">
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">사용자</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">예약 식사</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">예약 시간</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">미제출 횟수</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">상태</th>
          </tr>
        </thead>
        <tbody>
          {notSubmitted.map(row => (
            <tr key={row.id} className="border-b last:border-b-0">
              <td className="py-2 text-center whitespace-nowrap">{row.user}</td>
              <td className="py-2 text-center whitespace-nowrap">{row.meal}</td>
              <td className="py-2 text-center whitespace-nowrap">{row.time}</td>
              <td className="py-2 text-center whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.count >= 3 ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--bgTertiary)] text-[var(--contentMain)]'}`}>{row.count}회</span>
              </td>
              <td className="py-2 text-center whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === '경고' ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--green50)] text-[var(--green500)]'}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 