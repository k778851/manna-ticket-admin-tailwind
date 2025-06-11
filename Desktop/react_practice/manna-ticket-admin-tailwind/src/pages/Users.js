import React, { useState } from 'react';
import { MdDownload, MdAdd, MdEdit, MdVisibility, MdDelete, MdSearch } from 'react-icons/md';

const statCards = [
  { label: '전체 사용자', value: 156 },
  { label: '활성 사용자', value: 142 },
  { label: '비활성 사용자', value: 14 },
  { label: '이번 주 신규', value: 8 },
];

const initialUsers = [
  { id: 1, name: '김철수', email: 'kim@example.com', status: '활성', count: 23, qr: 95, lastLogin: '2024-01-15' },
  { id: 2, name: '이영희', email: 'lee@example.com', status: '비활성', count: 15, qr: 87, lastLogin: '2024-01-10' },
  { id: 3, name: '박민수', email: 'park@example.com', status: '활성', count: 31, qr: 100, lastLogin: '2024-01-14' },
];

export default function Users() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', status: '활성' });

  const filteredUsers = users.filter(
    (u) =>
      (filter === '전체' || u.status === filter) &&
      (!search || u.name.includes(search) || u.email.includes(search))
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: form.name,
        email: form.email,
        status: form.status,
        count: 0,
        qr: 0,
        lastLogin: '-',
      },
    ]);
    setForm({ name: '', email: '', status: '활성' });
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">사용자 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"><MdDownload size={18}/> 사용자 목록 내보내기</button>
          <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={() => setModalOpen(true)}><MdAdd size={18}/> 사용자 추가</button>
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
              placeholder="이메일"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <select
              className="border border-[var(--borderInput)] rounded px-3 py-2 text-sm"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => setModalOpen(false)}>취소</button>
              <button type="submit" className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold">저장</button>
            </div>
          </form>
        </div>
      )}
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 px-10 pb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col items-center border border-[var(--borderOutline)] min-h-[80px]">
            <div className="text-[var(--contentCaption)] text-sm">{card.label}</div>
            <div className="text-2xl font-bold text-[var(--contentMain)] mt-1">{card.value}</div>
          </div>
        ))}
      </div>
      {/* 사용자 목록 */}
      <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] mx-10 mb-10">
        <div className="font-bold text-[var(--contentMain)] mb-1">사용자 목록</div>
        <div className="text-sm text-[var(--contentCaption)] mb-3">등록된 모든 사용자를 관리할 수 있습니다.</div>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative">
            <input type="text" className="w-full pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" style={{width:220}} placeholder="사용자 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <MdSearch size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--white)] text-sm" value={filter} onChange={e => setFilter(e.target.value)} style={{width:100}}>
            <option value="전체">전체</option>
            <option value="활성">활성</option>
            <option value="비활성">비활성</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2">이름</th>
                <th className="font-bold text-[var(--contentMain)] py-2">이메일</th>
                <th className="font-bold text-[var(--contentMain)] py-2">상태</th>
                <th className="font-bold text-[var(--contentMain)] py-2">예약 횟수</th>
                <th className="font-bold text-[var(--contentMain)] py-2">QR 제출률</th>
                <th className="font-bold text-[var(--contentMain)] py-2">최근 로그인</th>
                <th className="font-bold text-[var(--contentMain)] py-2">작업</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredUsers.map(row => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2 text-center">{row.name}</td>
                  <td className="py-2 text-center">{row.email}</td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === '활성' ? 'bg-[var(--green100)] text-[var(--green500)]' : 'bg-[var(--bgTertiary)] text-[var(--contentCaption)]'}`}>{row.status}</span>
                  </td>
                  <td className="py-2">{row.count}회</td>
                  <td className="py-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-20 h-2 bg-[var(--bgTertiary)] rounded">
                        <div className="h-2 rounded bg-[var(--primaryBlue)]" style={{width: row.qr + '%'}}></div>
                      </div>
                      <span className="font-bold text-[var(--contentMain)] min-w-[36px]">{row.qr}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-center">{row.lastLogin}</td>
                  <td className="py-2 text-center">
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded"><MdEdit size={18}/></button>
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded"><MdVisibility size={18}/></button>
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded"><MdDelete size={18}/></button>
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