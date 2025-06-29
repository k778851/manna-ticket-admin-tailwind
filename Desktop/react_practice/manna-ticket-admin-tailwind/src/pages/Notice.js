import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faEye,
  faPenToSquare,
  faTrash,
  faCircleExclamation,
  faThumbtack,
  faEyeSlash,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

const noticeStats = [
  { label: '전체 공지', value: 2 },
  { label: '긴급 공지', value: 1, icon: <FontAwesomeIcon icon={faCircleExclamation} className="text-[var(--red500)]" /> },
  { label: '고정 공지', value: 1, icon: <FontAwesomeIcon icon={faThumbtack} className="text-[var(--primaryBlue)]" /> },
];

const notices = [
  {
    id: 1,
    title: '5월 식단 변경 안내',
    isNew: true,
    isFixed: true,
    priority: '높음',
    status: '게시중',
    views: 234,
    date: '2024-04-28',
  },
  {
    id: 2,
    title: '시설 점검 안내',
    isNew: false,
    isFixed: false,
    priority: '보통',
    status: '게시중',
    views: 156,
    date: '2024-04-25',
  },
];

export default function Notice() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [modalOpen, setModalOpen] = useState(false);
  const [noticesState, setNotices] = useState(notices);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: '보통',
    isFixed: false,
    isNew: true
  });

  const filtered = noticesState.filter(n =>
    (!search || n.title.includes(search)) &&
    (filter === '전체' || (filter === '긴급' && n.priority === '높음') || (filter === '고정' && n.isFixed))
  );

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    
    const newNotice = {
      id: noticesState.length + 1,
      title: form.title,
      content: form.content,
      isNew: form.isNew,
      isFixed: form.isFixed,
      priority: form.priority,
      status: '게시중',
      views: 0,
      date: new Date().toISOString().split('T')[0],
    };
    
    setNotices([newNotice, ...noticesState]);
    setForm({ title: '', content: '', priority: '보통', isFixed: false, isNew: true });
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 추가 버튼 (버튼 오른쪽 끝 고정) */}
      <div className="flex items-center justify-between px-10 pt-10 pb-2 mb-6">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">공지사항 관리</h1>
        <button 
          className="button-primary-m flex items-center gap-1 px-5 py-3 whitespace-nowrap"
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" /> 공지사항 추가
        </button>
      </div>
      {/* 통계 카드 전체 너비, 한 줄 4개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 mb-8 w-full">
        {noticeStats.map((stat, idx) => (
          <div key={stat.label} className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col items-end md:items-start border border-[var(--borderOutline)] min-h-[80px]">
            <div className="flex items-center gap-1 text-[var(--contentCaption)] text-sm font-semibold w-full justify-between">
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold mt-1 w-full ${stat.label === '긴급 공지' ? 'text-[var(--red500)]' : 'text-[var(--contentMain)]'}`}>{stat.value}</div>
          </div>
        ))}
      </div>
      {/* 공지사항 목록 카드 */}
      <div className="bg-white rounded-[var(--radius-l)] shadow-sm border border-[var(--borderOutline)] mx-10 p-8">
        <div className="font-bold text-[var(--contentMain)] mb-1 text-lg">공지사항 목록</div>
        <div className="text-sm text-[var(--contentCaption)] mb-4">등록된 모든 공지사항을 관리할 수 있습니다.</div>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1 max-w-xs">
            <input type="text" className="w-full pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" placeholder="공지사항 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--bgPrimary)] text-sm" value={filter} onChange={e => setFilter(e.target.value)} style={{width:100}}>
            <option value="전체">전체</option>
            <option value="긴급">긴급</option>
            <option value="고정">고정</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bgTertiary)]">
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-left">제목</th>
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">중요도</th>
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">상태</th>
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">조회수</th>
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">작성일</th>
              <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">편집</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(n => (
              <tr key={n.id} className="border-b last:border-b-0">
                <td className="py-3 px-2 text-left font-medium text-[var(--contentMain)]">
                  {n.title}
                  {n.isNew && <span className="ml-2 bg-[var(--red100)] text-[var(--red500)] text-xs font-bold px-2 py-0.5 rounded">NEW</span>}
                  {n.isFixed && <span className="ml-2 bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs font-bold px-2 py-0.5 rounded">고정</span>}
                </td>
                <td className="py-3 px-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${n.priority === '높음' ? 'bg-[var(--red100)] text-[var(--red500)]' : 'bg-[var(--blue100)] text-[var(--primaryBlue)]'}`}>{n.priority}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-[var(--green100)] text-[var(--green500)]">{n.status}</span>
                </td>
                <td className="py-3 px-2 text-center">{n.views}회</td>
                <td className="py-3 px-2 text-center">{n.date}</td>
                <td className="py-3 px-2 text-center">
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="상세"><FontAwesomeIcon icon={faEye} className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="수정"><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="삭제"><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 공지사항 추가 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--contentMain)]">공지사항 추가</h3>
              <button 
                className="text-gray-400 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                  placeholder="공지사항 제목을 입력하세요"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                  내용 *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] resize-none"
                  rows="6"
                  placeholder="공지사항 내용을 입력하세요"
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    중요도
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                    value={form.priority}
                    onChange={(e) => setForm({...form, priority: e.target.value})}
                  >
                    <option value="보통">보통</option>
                    <option value="높음">높음</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={form.isFixed}
                    onChange={(e) => setForm({...form, isFixed: e.target.checked})}
                  />
                  <label htmlFor="isFixed" className="text-sm text-[var(--contentMain)]">
                    고정 공지로 설정
                  </label>
                </div>
                
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={form.isNew}
                    onChange={(e) => setForm({...form, isNew: e.target.checked})}
                  />
                  <label htmlFor="isNew" className="text-sm text-[var(--contentMain)]">
                    NEW 표시
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
                  onClick={() => setModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-[var(--primaryBlue)] text-white font-semibold hover:bg-[var(--blue700)]"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 