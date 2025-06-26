import React from 'react';

export default function QRNotSubmittedTable({ notSubmitted }) {
  return (
    <div className="w-full max-h-64 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="bg-[var(--bgTertiary)]">
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">부서</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">이름</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">예약시간</th>
            <th className="font-bold text-[var(--contentMain)] py-2 text-center whitespace-nowrap">미제출 횟수</th>
          </tr>
        </thead>
        <tbody>
          {notSubmitted.map(row => (
            <tr key={row.id} className="border-b last:border-b-0">
              <td className="py-2 text-center whitespace-nowrap">{row.department}</td>
              <td className="py-2 text-center whitespace-nowrap">{row.name}</td>
              <td className="py-2 text-center whitespace-nowrap">{row.meal} {row.time}</td>
              <td className="py-2 text-center whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.count >= 3 ? 'bg-[var(--red50)] text-[var(--red500)]' : 'bg-[var(--bgTertiary)] text-[var(--contentMain)]'}`}>{row.count}회</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 