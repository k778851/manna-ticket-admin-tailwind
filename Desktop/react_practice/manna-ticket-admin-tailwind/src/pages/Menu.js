import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils,
  faPlus,
  faUpload,
  faSun,
  faCloud,
  faWheatAlt,
  faSnowflake,
  faBowlFood,
  faPenToSquare,
  faXmark,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const todayMenus = [
  {
    type: '점심 메뉴',
    date: '2024-01-15 | 한식',
    main: '소불고기',
    sides: '밥, 계란말이, 시금치나물, 김치',
    soup: '국',
    allergy: '대두, 계란',
  },
  {
    type: '저녁 메뉴',
    date: '2024-01-15 | 양식',
    main: '치킨까스',
    sides: '밥, 샐러드, 감자튀김',
    soup: '스프',
    allergy: '밀, 계란, 우유',
  },
];

const weekMenus = [
  {
    day: '월', date: '2024-01-15',
    lunch: { main: '소불고기', type: '한식', sides: '밥, 계란말이 외' },
    dinner: { main: '치킨까스', type: '양식', sides: '밥, 샐러드 외' },
  },
  {
    day: '화', date: '2024-01-16',
    lunch: { main: '짜장덮밥', type: '중식', sides: '단무지, 양파 외' },
    dinner: { main: '제육볶음', type: '한식', sides: '밥, 콩나물 외' },
  },
  {
    day: '수', date: '2024-01-17',
    lunch: { main: '돈까스', type: '일식', sides: '밥, 미소시루 외' },
    dinner: { main: '스파게티', type: '양식', sides: '마늘빵, 샐러드' },
  },
  {
    day: '목', date: '2024-01-18',
    lunch: { main: '갈비찜', type: '한식', sides: '밥, 나물 외' },
    dinner: { main: '탕수육', type: '중식', sides: '밥, 짜장 외' },
  },
  {
    day: '금', date: '2024-01-19',
    lunch: { main: '함박스테이크', type: '양식', sides: '밥, 감자 외' },
    dinner: { main: '김치찌개', type: '한식', sides: '밥, 계란말이 외' },
  },
];

export default function Menu() {
  const [tab, setTab] = useState(0); // 0: 오늘 메뉴, 1: 주간 메뉴
  const [todayMenusState, setTodayMenus] = useState(todayMenus);
  const [weekMenusState, setWeekMenus] = useState(weekMenus);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('today'); // 'today' | 'week'
  const [form, setForm] = useState({
    type: '점심 메뉴',
    date: '',
    main: '',
    sides: '',
    soup: '',
    allergy: '',
  });
  const [weekForm, setWeekForm] = useState([
    { day: '월', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '화', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '수', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '목', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '금', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
  ]);

  // 메뉴 추가 핸들러
  const handleAddMenu = (e) => {
    e.preventDefault();
    setTodayMenus([
      ...todayMenusState,
      { ...form },
    ]);
    setForm({ type: '점심 메뉴', date: '', main: '', sides: '', soup: '', allergy: '' });
    setModalOpen(false);
  };
  // 주간 메뉴 추가 핸들러
  const handleAddWeekMenu = (e) => {
    e.preventDefault();
    setWeekMenus([...weekMenusState, ...weekForm]);
    setWeekForm([
      { day: '월', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '화', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '수', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '목', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '금', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    ]);
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">식단 메뉴 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"><FontAwesomeIcon icon={faUpload} size="lg" /> 메뉴 일괄 업로드</button>
          <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={() => { setModalType('today'); setModalOpen(true); }}><FontAwesomeIcon icon={faPlus} size="lg" /> 메뉴 추가</button>
        </div>
      </div>
      {/* 메뉴 등록 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-none flex flex-col gap-4 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setModalOpen(false)}><FontAwesomeIcon icon={faXmark} size="lg" /></button>
            <div className="flex gap-2 mb-2">
              <button className={`flex-1 py-2 rounded ${modalType==='today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setModalType('today')}>오늘의 메뉴 등록</button>
              <button className={`flex-1 py-2 rounded ${modalType==='week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setModalType('week')}>주간 메뉴 등록</button>
            </div>
            {modalType === 'today' ? (
              <form className="flex flex-col gap-3" onSubmit={handleAddMenu}>
                <select className="border rounded px-3 py-2 text-sm" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                  <option value="점심 메뉴">점심 메뉴</option>
                  <option value="저녁 메뉴">저녁 메뉴</option>
                </select>
                <input className="border rounded px-3 py-2 text-sm" placeholder="날짜 (예: 2024-01-15 | 한식)" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required/>
                <input className="border rounded px-3 py-2 text-sm" placeholder="주요리" value={form.main} onChange={e=>setForm({...form, main: e.target.value})} required/>
                <input className="border rounded px-3 py-2 text-sm" placeholder="반찬" value={form.sides} onChange={e=>setForm({...form, sides: e.target.value})} required/>
                <input className="border rounded px-3 py-2 text-sm" placeholder="국물" value={form.soup} onChange={e=>setForm({...form, soup: e.target.value})}/> 
                <input className="border rounded px-3 py-2 text-sm" placeholder="알레르기 정보" value={form.allergy} onChange={e=>setForm({...form, allergy: e.target.value})}/>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={()=>setModalOpen(false)}>취소</button>
                  <button type="submit" className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold">저장</button>
                </div>
              </form>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleAddWeekMenu}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weekForm.map((row, idx) => (
                    <div key={row.day} className="border rounded p-3 mb-2">
                      <div className="font-bold mb-1">{row.day}</div>
                      <input className="border rounded px-3 py-2 text-sm mb-1 w-full" placeholder="날짜 (예: 2024-01-15)" value={row.date} onChange={e=>{
                        const copy = [...weekForm]; copy[idx].date = e.target.value; setWeekForm(copy);
                      }} required/>
                      <div className="text-xs text-gray-500 mb-1 mt-2">점심</div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-1">
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="점심 주요리" value={row.lunch.main} onChange={e=>{ const copy = [...weekForm]; copy[idx].lunch.main = e.target.value; setWeekForm(copy); }} required/>
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="점심 종류" value={row.lunch.type} onChange={e=>{ const copy = [...weekForm]; copy[idx].lunch.type = e.target.value; setWeekForm(copy); }} required/>
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="점심 반찬" value={row.lunch.sides} onChange={e=>{ const copy = [...weekForm]; copy[idx].lunch.sides = e.target.value; setWeekForm(copy); }} required/>
                      </div>
                      <div className="text-xs text-gray-500 mb-1 mt-2">저녁</div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="저녁 주요리" value={row.dinner.main} onChange={e=>{ const copy = [...weekForm]; copy[idx].dinner.main = e.target.value; setWeekForm(copy); }} required/>
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="저녁 종류" value={row.dinner.type} onChange={e=>{ const copy = [...weekForm]; copy[idx].dinner.type = e.target.value; setWeekForm(copy); }} required/>
                        <input className="border rounded px-3 py-2 text-sm w-full" placeholder="저녁 반찬" value={row.dinner.sides} onChange={e=>{ const copy = [...weekForm]; copy[idx].dinner.sides = e.target.value; setWeekForm(copy); }} required/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={()=>setModalOpen(false)}>취소</button>
                  <button type="submit" className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold">저장</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* 탭 메뉴 */}
      <div className="flex justify-center gap-2 mb-6 px-10">
        <button
          onClick={() => setTab(0)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===0 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          오늘 메뉴
        </button>
        <button
          onClick={() => setTab(1)}
          className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===1 ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
          style={{minWidth:160}}
        >
          주간 메뉴
        </button>
      </div>
      {/* 오늘 메뉴 카드 */}
      {tab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 pb-10">
          {todayMenusState.map((menu, idx) => (
            <div key={idx} className="bg-white rounded-[var(--radius-l)] shadow-sm p-8 border border-[var(--borderOutline)] flex flex-col min-h-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUtensils} className="w-5 h-5 text-[var(--contentCaption)]" />
                <span className="font-bold text-lg text-[var(--contentMain)]">{menu.type}</span>
              </div>
              <div className="text-xs text-[var(--contentCaption)] mb-2">{menu.date}</div>
              <div className="border-b border-[var(--borderOutline)] mb-4"></div>
              <div className="mb-2">
                <div className="text-[var(--contentCaption)] text-sm font-medium">주요리</div>
                <div className="text-xl font-bold text-[var(--contentMain)]">{menu.main}</div>
              </div>
              <div className="mb-2">
                <div className="text-[var(--contentCaption)] text-sm font-medium">반찬</div>
                <div className="text-[var(--contentMain)]">{menu.sides}</div>
              </div>
              <div className="mb-2">
                <div className="text-[var(--contentCaption)] text-sm font-medium">국물</div>
                <div className="text-[var(--contentMain)]">{menu.soup}</div>
              </div>
              <div className="flex justify-between text-sm mt-auto">
                <span>알레르기: {menu.allergy}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded border border-[var(--borderOutline)] text-[var(--contentMain)] text-sm font-semibold hover:bg-[var(--bgTertiary)] transition">수정</button>
                <button className="px-4 py-2 rounded border border-[var(--borderOutline)] text-[var(--contentMain)] text-sm font-semibold hover:bg-[var(--bgTertiary)] transition">미리보기</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* 주간 메뉴 탭 */}
      {tab === 1 && (
        <div className="px-10 pb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-[var(--contentMain)]">주간 식단표 <span className="text-base font-normal ml-2 text-[var(--contentCaption)]">2024년 1월 3주차</span></div>
            <div className="flex gap-2 items-center">
              <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--bgPrimary)] text-sm" style={{width:120}} defaultValue="이번 주">
                <option value="이번 주">이번 주</option>
                <option value="다음 주">다음 주</option>
                <option value="지난 주">지난 주</option>
              </select>
              <button className="px-4 py-2 rounded border border-[var(--borderOutline)] bg-white text-[var(--contentMain)] text-sm font-semibold flex items-center gap-1 shadow-sm hover:bg-[var(--bgTertiary)] transition"><FontAwesomeIcon icon={faPenToSquare} size="lg" /> <span>주간 메뉴 편집</span></button>
              <button className="px-4 py-2 rounded bg-[var(--primaryBlue)] text-white text-sm font-semibold flex items-center gap-1 shadow-sm" onClick={()=>{ setModalType('week'); setModalOpen(true); }}><FontAwesomeIcon icon={faPlus} size="lg" /> <span>주간 메뉴 생성</span></button>
            </div>
          </div>
          <div className="bg-white rounded-[var(--radius-l)] shadow-sm border border-[var(--borderOutline)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bgTertiary)]">
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">요일</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">날짜</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">점심 메뉴</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">저녁 메뉴</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">작업</th>
                </tr>
              </thead>
              <tbody>
                {weekMenusState.map((row, idx) => (
                  <tr key={row.day + row.date + idx} className="border-b last:border-b-0">
                    <td className="py-3 px-2 text-center font-bold text-[var(--contentMain)]">{row.day}</td>
                    <td className="py-3 px-2 text-center text-[var(--contentCaption)]">{row.date}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-[var(--contentMain)] flex items-center gap-2">{row.lunch.main} <span className="badge bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs px-2 py-0.5 rounded">{row.lunch.type}</span></div>
                      <div className="text-[var(--contentSub)] text-xs">{row.lunch.sides}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-[var(--contentMain)] flex items-center gap-2">{row.dinner.main} <span className="badge bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs px-2 py-0.5 rounded">{row.dinner.type}</span></div>
                      <div className="text-[var(--contentSub)] text-xs">{row.dinner.sides}</div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="수정"><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="미리보기"><FontAwesomeIcon icon={faEye} className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 