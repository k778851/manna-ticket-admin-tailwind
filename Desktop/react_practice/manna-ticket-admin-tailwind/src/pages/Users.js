import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faPlus, 
  faPenToSquare, 
  faEye, 
  faTrash, 
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';


const initialUsers = [
  { id: 1, name: '김철수', personalNumber: '00371210-00149', department: '총무팀', lunchCount: 12, dinnerCount: 11, qr: 95 },
  { id: 2, name: '이영희', personalNumber: '00371210-00150', department: '기획팀', lunchCount: 8, dinnerCount: 7, qr: 87 },
  { id: 3, name: '박민수', personalNumber: '00371210-00151', department: '영업팀', lunchCount: 16, dinnerCount: 15, qr: 100 },
];

export default function Users() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', personalNumber: '', department: '' });

  const filteredUsers = users.filter(
    (u) =>
      (!search || u.name.includes(search) || u.personalNumber.includes(search))
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.name || !form.personalNumber || !form.department) return;
    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: form.name,
        personalNumber: form.personalNumber,
        department: form.department,
        lunchCount: 0,
        dinnerCount: 0,
        qr: 0,
      },
    ]);
    setForm({ name: '', personalNumber: '', department: '' });
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">사용자 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"><FontAwesomeIcon icon={faDownload} className="w-5 h-5" /> 사용자 목록 내보내기</button>
          <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={() => setModalOpen(true)}><FontAwesomeIcon icon={faPlus} className="w-5 h-5" /> 사용자 추가</button>
        </div>
      </div>
      {/* 사용자 추가 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs flex flex-col gap-4" onSubmit={handleAddUser}>
            <div className="text-lg font-bold text-[var(--contentMain)] mb-2">사용자 추가</div>
            <input
              className="border border-[var(--borderInput)] rounded px-3 py-2 text-sm"
              placeholder="이름"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="border border-[var(--borderInput)] rounded px-3 py-2 text-sm"
              placeholder="고유번호"
              type="text"
              value={form.personalNumber}
              onChange={e => setForm({ ...form, personalNumber: e.target.value })}
              required
            />
            <input
              className="border border-[var(--borderInput)] rounded px-3 py-2 text-sm"
              placeholder="부서"
              type="text"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              required
            />
            <div className="flex gap-2 mt-2">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => setModalOpen(false)}>취소</button>
              <button type="submit" className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold">저장</button>
            </div>
          </form>
        </div>
      )}
      {/* 사용자 목록 */}
      <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] mx-10 mb-10">
        <div className="font-bold text-[var(--contentMain)] mb-1">사용자 목록</div>
        <div className="text-sm text-[var(--contentCaption)] mb-3">등록된 모든 사용자를 관리할 수 있습니다.<br/>점심/저녁 예약수는 매월 1일 자동 초기화됩니다.</div>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative">
            <input type="text" className="w-full pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" style={{width:220}} placeholder="사용자 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2">이름</th>
                <th className="font-bold text-[var(--contentMain)] py-2">고유번호</th>
                <th className="font-bold text-[var(--contentMain)] py-2">부서</th>
                <th className="font-bold text-[var(--contentMain)] py-2">점심 예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2">저녁 예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2">QR 제출률</th>
                <th className="font-bold text-[var(--contentMain)] py-2">작업</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredUsers.map(row => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2 text-center">{row.name}</td>
                  <td className="py-2 text-center">{row.personalNumber}</td>
                  <td className="py-2 text-center">{row.department}</td>
                  <td className="py-2">{row.lunchCount}회</td>
                  <td className="py-2">{row.dinnerCount}회</td>
                  <td className="py-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-20 h-2 bg-[var(--bgTertiary)] rounded">
                        <div className="h-2 rounded bg-[var(--primaryBlue)]" style={{width: row.qr + '%'}}></div>
                      </div>
                      <span className="font-bold text-[var(--contentMain)] min-w-[36px]">{row.qr}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded"><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded"><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
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