import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils,
  faPlus,
  faUpload,
  faDownload,
  faSun,
  faCloud,
  faWheatAlt,
  faSnowflake,
  faBowlFood,
  faPenToSquare,
  faXmark,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

const todayMenus = [
  {
    type: '점심',
    date: '2024-01-15 | 한식',
    main: '소불고기',
    sides: '밥, 계란말이, 시금치나물, 김치',
    soup: '국',
    allergy: '대두, 계란',
  },
  {
    type: '저녁',
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    type: '점심',
    date: '',
    main: '',
    sides: '',
    soup: '',
    allergy: '',
  });

  const [weekSameAsLunch, setWeekSameAsLunch] = useState([false, false, false, false, false]); // 각 요일별 체크박스 상태
  const [allWeekSameAsLunch, setAllWeekSameAsLunch] = useState(false); // 전체 주간 점심=저녁 체크박스 상태
  const [weekForm, setWeekForm] = useState([
    { day: '월', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '화', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '수', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '목', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    { day: '금', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
  ]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingWeekIndex, setEditingWeekIndex] = useState(null);

  // 오늘 날짜에 해당하는 메뉴를 주간 메뉴에서 가져오는 함수
  const getTodayMenusFromWeek = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
    const todayWeekMenus = weekMenusState.filter(menu => menu.date === todayStr);
    
    if (todayWeekMenus.length > 0) {
      const todayMenus = [];
      todayWeekMenus.forEach(menu => {
        // 점심 메뉴 추가
        if (menu.lunch.main) {
          todayMenus.push({
            type: '점심',
            date: menu.date,
            main: menu.lunch.main,
            sides: menu.lunch.sides,
            soup: '',
            allergy: ''
          });
        }
        // 저녁 메뉴 추가
        if (menu.dinner.main) {
          todayMenus.push({
            type: '저녁',
            date: menu.date,
            main: menu.dinner.main,
            sides: menu.dinner.sides,
            soup: '',
            allergy: ''
          });
        }
      });
      return todayMenus;
    }
    return todayMenusState; // 주간 메뉴에 오늘 날짜가 없으면 기존 오늘 메뉴 반환
  };

  // 현재 표시할 오늘 메뉴
  const currentTodayMenus = getTodayMenusFromWeek();

  // 메뉴 추가 핸들러
  const handleAddMenu = (e) => {
    e.preventDefault();
    if (isEditing) {
      // 수정 모드
      const updatedMenus = [...todayMenusState];
      updatedMenus[editingIndex] = { ...form };
      setTodayMenus(updatedMenus);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // 추가 모드
      if (form.type === '점심&저녁') {
        // 점심&저녁 선택시 두 개의 메뉴 생성
        const lunchMenu = { ...form, type: '점심' };
        const dinnerMenu = { ...form, type: '저녁' };
        setTodayMenus([
          ...todayMenusState,
          lunchMenu,
          dinnerMenu,
        ]);
      } else {
        // 점심 또는 저녁만 선택시 하나의 메뉴 생성
        setTodayMenus([
          ...todayMenusState,
          { ...form },
        ]);
      }
    }
    setForm({ type: '점심', date: '', main: '', sides: '', soup: '', allergy: '' });
    setModalOpen(false);
  };
  // 주간 메뉴 추가 핸들러
  const handleAddWeekMenu = (e) => {
    e.preventDefault();
    if (isEditing) {
      // 수정 모드
      if (editingWeekIndex !== null) {
        // 개별 행 수정 - 해당 주의 모든 메뉴를 업데이트
        const updatedMenus = [...weekMenusState];
        
        // 기존 주간 메뉴에서 해당 주의 메뉴들을 찾아서 업데이트
        const targetDate = weekForm[0].date;
        const targetWeekStart = new Date(targetDate);
        targetWeekStart.setDate(targetWeekStart.getDate() - targetWeekStart.getDay() + 1); // 월요일로 설정
        
        // 해당 주의 메뉴들을 필터링하고 업데이트
        const weekStartStr = targetWeekStart.toISOString().split('T')[0];
        const weekEnd = new Date(targetWeekStart);
        weekEnd.setDate(targetWeekStart.getDate() + 4); // 금요일
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        
        // 해당 주의 메뉴들을 제거
        const filteredMenus = updatedMenus.filter(menu => {
          const menuDate = new Date(menu.date);
          const menuDateStr = menuDate.toISOString().split('T')[0];
          return menuDateStr < weekStartStr || menuDateStr > weekEndStr;
        });
        
        // 새로운 주간 메뉴 추가
        const newWeekMenus = weekForm.filter(day => day.lunch.main || day.dinner.main);
        setWeekMenus([...filteredMenus, ...newWeekMenus]);
        setEditingWeekIndex(null);
      } else {
        // 전체 주간 메뉴 수정
        setWeekMenus(weekForm);
      }
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // 추가 모드
      setWeekMenus([...weekMenusState, ...weekForm]);
    }
    setWeekForm([
      { day: '월', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '화', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '수', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '목', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
      { day: '금', date: '', lunch: { main: '', type: '', sides: '' }, dinner: { main: '', type: '', sides: '' } },
    ]);
    setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
    setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
    setModalOpen(false);
  };

  // 템플릿 다운로드 함수
  const downloadTemplate = () => {
    // 주간 메뉴 템플릿만 제공
    const template = [
      {
        '요일': '월',
        '날짜': '2024-01-15',
        '점심메인요리': '소불고기',
        '점심종류': '한식',
        '점심반찬': '밥, 계란말이, 시금치나물',
        '저녁메인요리': '치킨까스',
        '저녁종류': '양식',
        '저녁반찬': '밥, 샐러드, 감자튀김'
      },
      {
        '요일': '화',
        '날짜': '2024-01-16',
        '점심메인요리': '짜장덮밥',
        '점심종류': '중식',
        '점심반찬': '단무지, 양파',
        '저녁메인요리': '제육볶음',
        '저녁종류': '한식',
        '저녁반찬': '밥, 콩나물'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "주간메뉴템플릿");
    
    // 컬럼 너비 설정
    ws['!cols'] = [
      { width: 8 },  // 요일
      { width: 12 }, // 날짜
      { width: 15 }, // 점심메인요리
      { width: 10 }, // 점심종류
      { width: 20 }, // 점심반찬
      { width: 15 }, // 저녁메인요리
      { width: 10 }, // 저녁종류
      { width: 20 }  // 저녁반찬
    ];

    XLSX.writeFile(wb, "주간메뉴_업로드_템플릿.xlsx");
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 주간 메뉴 업로드
        const validWeekMenus = jsonData.filter(row => 
          row['요일'] && row['날짜'] && row['점심메인요리'] && row['저녁메인요리']
        ).map(row => ({
          day: row['요일'],
          date: row['날짜'],
          lunch: { 
            main: row['점심메인요리'], 
            type: row['점심종류'] || '한식', 
            sides: row['점심반찬'] || '' 
          },
          dinner: { 
            main: row['저녁메인요리'], 
            type: row['저녁종류'] || '한식', 
            sides: row['저녁반찬'] || '' 
          }
        }));

        if (validWeekMenus.length > 0) {
          setWeekMenus([...weekMenusState, ...validWeekMenus]);
          alert(`${validWeekMenus.length}개의 주간 메뉴가 성공적으로 업로드되었습니다.`);
        } else {
          alert('유효한 주간 메뉴 데이터가 없습니다. 템플릿 형식을 확인해주세요.');
        }
      } catch (error) {
        alert('파일 처리 중 오류가 발생했습니다. 템플릿 형식을 확인해주세요.');
        console.error('File upload error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 주간 날짜 자동 계산 함수
  const calculateWeekDates = (mondayDate) => {
    if (!mondayDate) return;
    
    const monday = new Date(mondayDate);
    const weekDates = [];
    
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      weekDates.push(currentDate.toISOString().split('T')[0]);
    }
    
    return weekDates;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">식단 메뉴 관리</h1>
        <div className="flex gap-2">
          <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]" onClick={() => setUploadModalOpen(true)}>
            <FontAwesomeIcon icon={faUpload} size="lg" /> 주간메뉴 일괄 업로드
          </button>
          {tab === 0 && (
            <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={() => { 
              setModalType('today'); 
              setIsEditing(false);
              setEditingIndex(null);
              setForm({ type: '점심', date: '', main: '', sides: '', soup: '', allergy: '' });
              setModalOpen(true); 
            }}>
              <FontAwesomeIcon icon={faPlus} size="lg" /> 메뉴 추가
            </button>
          )}
          {tab === 1 && (
            <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={()=>{ 
              setModalType('week'); 
              setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
              setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
              setModalOpen(true); 
            }}>
              <FontAwesomeIcon icon={faPlus} size="lg" /> 주간 메뉴 생성
            </button>
          )}
        </div>
      </div>
      {/* 메뉴 등록 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--contentMain)]">
                {isEditing ? '메뉴 수정' : '메뉴 추가'}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setModalOpen(false);
                  setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
                  setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
                }}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            {modalType === 'today' ? (
              <form onSubmit={handleAddMenu} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    메뉴 타입 *
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="type-both" 
                        name="menuType" 
                        value="점심&저녁"
                        checked={form.type === '점심&저녁'} 
                        onChange={e => {
                          setForm({...form, type: e.target.value});
                        }}
                        className="w-4 h-4 text-[var(--primaryBlue)]"
                      />
                      <label htmlFor="type-both" className="text-sm text-[var(--contentMain)]">점심&저녁</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="type-lunch" 
                        name="menuType" 
                        value="점심"
                        checked={form.type === '점심'} 
                        onChange={e => {
                          setForm({...form, type: e.target.value});
                        }}
                        className="w-4 h-4 text-[var(--primaryBlue)]"
                      />
                      <label htmlFor="type-lunch" className="text-sm text-[var(--contentMain)]">점심</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="type-dinner" 
                        name="menuType" 
                        value="저녁"
                        checked={form.type === '저녁'} 
                        onChange={e => {
                          setForm({...form, type: e.target.value});
                        }}
                        className="w-4 h-4 text-[var(--primaryBlue)]"
                      />
                      <label htmlFor="type-dinner" className="text-sm text-[var(--contentMain)]">저녁</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    날짜 *
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                    value={form.date.split(' | ')[0] || ''} 
                    onChange={e => setForm({...form, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    메인요리 *
                  </label>
                  <input 
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                    placeholder="메인요리를 입력하세요" 
                    value={form.main} 
                    onChange={e => setForm({...form, main: e.target.value})} 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    반찬 *
                  </label>
                  <input 
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                    placeholder="반찬을 입력하세요" 
                    value={form.sides} 
                    onChange={e => setForm({...form, sides: e.target.value})} 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    국물
                  </label>
                  <input 
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                    placeholder="국물을 입력하세요" 
                    value={form.soup} 
                    onChange={e => setForm({...form, soup: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                    알레르기 정보
                  </label>
                  <input 
                    className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                    placeholder="알레르기 정보를 입력하세요" 
                    value={form.allergy} 
                    onChange={e => setForm({...form, allergy: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" 
                    onClick={() => {
                      setModalOpen(false);
                    }}
                  >
                    취소
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 rounded bg-[var(--primaryBlue)] text-white font-semibold hover:bg-[var(--blue700)]"
                  >
                    {isEditing ? '수정' : '저장'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddWeekMenu} className="space-y-4">
                {/* 주간 날짜 자동 설정 섹션 */}
                <div className="p-4 bg-[var(--bgTertiary)] rounded-lg">
                  <h4 className="font-semibold text-[var(--contentMain)] mb-3">주간 날짜 설정</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                          월요일 날짜 선택 (나머지 요일 자동 계산)
                        </label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]" 
                          value={weekForm[0].date} 
                          onChange={e => {
                            const mondayDate = e.target.value;
                            const weekDates = calculateWeekDates(mondayDate);
                            
                            if (weekDates) {
                              const updatedWeekForm = weekForm.map((day, idx) => ({
                                ...day,
                                date: weekDates[idx]
                              }));
                              setWeekForm(updatedWeekForm);
                            }
                          }}
                        />
                      </div>
                      <div className="text-sm text-[var(--contentCaption)]">
                        {isEditing ? '월요일 날짜를 변경하면 화~금요일이 자동으로 재계산됩니다.' : '월요일 날짜를 선택하면 화~금요일이 자동으로 설정됩니다.'}
                      </div>
                    </div>
                    
                    {/* 전체 주간 점심=저녁 체크박스 */}
                    <div className="flex items-center gap-2 p-3 bg-white rounded border border-[var(--borderOutline)]">
                      <input 
                        type="checkbox" 
                        id="allWeekSameAsLunch"
                        checked={allWeekSameAsLunch} 
                        onChange={(e) => {
                          setAllWeekSameAsLunch(e.target.checked);
                          
                          if (e.target.checked) {
                            // 모든 요일의 점심 메뉴를 저녁 메뉴에 복사
                            const updatedWeekForm = weekForm.map(day => ({
                              ...day,
                              dinner: { ...day.lunch }
                            }));
                            setWeekForm(updatedWeekForm);
                            
                            // 모든 요일의 체크박스를 활성화
                            setWeekSameAsLunch([true, true, true, true, true]);
                          } else {
                            // 모든 요일의 체크박스를 비활성화
                            setWeekSameAsLunch([false, false, false, false, false]);
                          }
                        }}
                      />
                      <label htmlFor="allWeekSameAsLunch" className="text-sm font-medium text-[var(--contentMain)]">
                        모든 요일 점심 메뉴와 저녁 메뉴 동일
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weekForm.map((row, idx) => (
                    <div key={row.day} className="border border-[var(--borderOutline)] rounded p-4">
                      <div className="font-bold text-[var(--contentMain)] mb-3 text-center">{row.day}</div>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-[var(--contentMain)] mb-1">
                          날짜 *
                        </label>
                        <input 
                          type="date"
                          className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                          value={row.date} 
                          onChange={e => {
                            const copy = [...weekForm]; 
                            copy[idx].date = e.target.value; 
                            setWeekForm(copy);
                          }} 
                          required
                        />
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-[var(--contentMain)] mb-2">점심</div>
                        <div className="space-y-2">
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="점심 메인요리" 
                            value={row.lunch.main} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].lunch.main = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                          />
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="점심 종류" 
                            value={row.lunch.type} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].lunch.type = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                          />
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="점심 반찬" 
                            value={row.lunch.sides} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].lunch.sides = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-[var(--contentMain)] mb-2">저녁</div>
                        
                        {/* 점심 메뉴와 동일 체크박스 */}
                        <div className="flex items-center gap-2 p-2 bg-[var(--bgTertiary)] rounded mb-2">
                          <input 
                            type="checkbox" 
                            id={`sameAsLunch-${idx}`}
                            checked={weekSameAsLunch[idx]} 
                            onChange={(e) => {
                              const newWeekSameAsLunch = [...weekSameAsLunch];
                              newWeekSameAsLunch[idx] = e.target.checked;
                              setWeekSameAsLunch(newWeekSameAsLunch);
                              
                              // 전체 체크박스 상태 업데이트
                              const allChecked = newWeekSameAsLunch.every(checked => checked);
                              setAllWeekSameAsLunch(allChecked);
                              
                              if (e.target.checked) {
                                // 점심 메뉴 내용을 저녁 메뉴에 복사
                                const copy = [...weekForm];
                                copy[idx].dinner.main = copy[idx].lunch.main;
                                copy[idx].dinner.type = copy[idx].lunch.type;
                                copy[idx].dinner.sides = copy[idx].lunch.sides;
                                setWeekForm(copy);
                              }
                            }}
                          />
                          <label htmlFor={`sameAsLunch-${idx}`} className="text-sm text-[var(--contentMain)]">점심 메뉴와 동일</label>
                        </div>
                        
                        <div className="space-y-2">
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="저녁 메인요리" 
                            value={row.dinner.main} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].dinner.main = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                            disabled={weekSameAsLunch[idx]}
                          />
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="저녁 종류" 
                            value={row.dinner.type} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].dinner.type = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                            disabled={weekSameAsLunch[idx]}
                          />
                          <input 
                            className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] text-sm" 
                            placeholder="저녁 반찬" 
                            value={row.dinner.sides} 
                            onChange={e => { 
                              const copy = [...weekForm]; 
                              copy[idx].dinner.sides = e.target.value; 
                              setWeekForm(copy); 
                            }} 
                            required
                            disabled={weekSameAsLunch[idx]}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" 
                    onClick={() => {
                      setModalOpen(false);
                      setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
                      setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
                    }}
                  >
                    취소
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 rounded bg-[var(--primaryBlue)] text-white font-semibold hover:bg-[var(--blue700)]"
                  >
                    {isEditing ? '수정' : '저장'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* 업로드 모달 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--contentMain)]">주간메뉴 일괄 업로드</h3>
              <button className="text-gray-400 hover:text-gray-700" onClick={() => setUploadModalOpen(false)}>
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[var(--contentMain)] mb-2">1. 템플릿 다운로드</h4>
                <button 
                  onClick={downloadTemplate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  주간메뉴 엑셀 템플릿 다운로드
                </button>
              </div>
              
              <div>
                <h4 className="font-semibold text-[var(--contentMain)] mb-2">2. 파일 업로드</h4>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="w-full p-2 border border-[var(--borderInput)] rounded"
                />
                <p className="text-xs text-[var(--contentCaption)] mt-1">
                  엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" 
                onClick={() => setUploadModalOpen(false)}
              >
                닫기
              </button>
            </div>
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
          {currentTodayMenus.map((menu, idx) => (
            <div key={idx} className="bg-white rounded-[var(--radius-l)] shadow-sm p-8 border border-[var(--borderOutline)] flex flex-col min-h-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUtensils} className="w-5 h-5 text-[var(--contentCaption)]" />
                <span className="font-bold text-lg text-[var(--contentMain)]">{menu.type}</span>
              </div>
              <div className="text-xs text-[var(--contentCaption)] mb-2">{menu.date.split(' | ')[0]}</div>
              <div className="border-b border-[var(--borderOutline)] mb-4"></div>
              <div className="mb-2">
                <div className="text-[var(--contentCaption)] text-sm font-medium">메인요리</div>
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
                <button 
                  className="px-4 py-2 rounded border border-[var(--borderOutline)] text-[var(--contentMain)] text-sm font-semibold hover:bg-[var(--bgTertiary)] transition"
                  onClick={() => {
                    setIsEditing(true);
                    setEditingIndex(idx);
                    setForm({ ...menu });
                    setModalOpen(true);
                  }}
                >
                  수정
                </button>
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
              <button className="px-4 py-2 rounded border border-[var(--borderOutline)] bg-white text-[var(--contentMain)] text-sm font-semibold flex items-center gap-1 shadow-sm hover:bg-[var(--bgTertiary)] transition" onClick={() => {
                setModalType('week');
                setIsEditing(true);
                setEditingIndex(null);
                
                // 기존 주간 메뉴 데이터로 폼 설정
                const existingWeekForm = weekMenusState.map(menu => ({
                  day: menu.day,
                  date: menu.date,
                  lunch: { ...menu.lunch },
                  dinner: { ...menu.dinner }
                }));
                setWeekForm(existingWeekForm);
                
                setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
                setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
                setModalOpen(true);
              }}>
                <FontAwesomeIcon icon={faPenToSquare} size="lg" /> <span>주간 메뉴 편집</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-[var(--radius-l)] shadow-sm border border-[var(--borderOutline)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bgTertiary)]">
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center" style={{width: '60px'}}>요일</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center" style={{width: '100px'}}>날짜</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">점심 메뉴</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">저녁 메뉴</th>
                  <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center" style={{width: '80px'}}>작업</th>
                </tr>
              </thead>
              <tbody>
                {weekMenusState.map((row, idx) => (
                  <tr key={row.day + row.date + idx} className="border-b last:border-b-0">
                    <td className="py-3 px-2 text-center font-bold text-[var(--contentMain)]">{row.day}</td>
                    <td className="py-3 px-2 text-center text-[var(--contentCaption)]">{row.date}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-[var(--contentMain)]">{row.lunch.main}</div>
                      <div className="text-[var(--contentSub)] text-xs">{row.lunch.sides}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-[var(--contentMain)]">{row.dinner.main}</div>
                      <div className="text-[var(--contentSub)] text-xs">{row.dinner.sides}</div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button 
                        className="p-2 hover:bg-[var(--bgTertiary)] rounded" 
                        title="수정"
                        onClick={() => {
                          setModalType('week');
                          setIsEditing(true);
                          setEditingWeekIndex(idx);
                          
                          // 개별 행을 5일치 주간 메뉴로 확장
                          const currentDate = new Date(row.date);
                          const weekDates = [];
                          for (let i = 0; i < 5; i++) {
                            const date = new Date(currentDate);
                            date.setDate(currentDate.getDate() - currentDate.getDay() + i + 1); // 월요일부터 시작
                            weekDates.push(date.toISOString().split('T')[0]);
                          }
                          
                          const weekDays = ['월', '화', '수', '목', '금'];
                          const expandedWeekForm = weekDays.map((day, dayIdx) => ({
                            day: day,
                            date: weekDates[dayIdx],
                            lunch: dayIdx === idx ? { ...row.lunch } : { main: '', type: '', sides: '' },
                            dinner: dayIdx === idx ? { ...row.dinner } : { main: '', type: '', sides: '' }
                          }));
                          
                          setWeekForm(expandedWeekForm);
                          setWeekSameAsLunch([false, false, false, false, false]); // 체크박스 상태 초기화
                          setAllWeekSameAsLunch(false); // 전체 체크박스 상태 초기화
                          setModalOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                      </button>
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