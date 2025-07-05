import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faPlus, 
  faPenToSquare, 
  faEye, 
  faTrash, 
  faMagnifyingGlass,
  faUpload,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';


const initialUsers = [
  { id: 1, name: '김철수', personalNumber: '00371210-00149', department: '총무부', lunchCount: 12, dinnerCount: 11, qr: 95 },
  { id: 2, name: '이영희', personalNumber: '00371210-00150', department: '기획부', lunchCount: 8, dinnerCount: 7, qr: 87 },
  { id: 3, name: '박민수', personalNumber: '00371210-00151', department: '교육부', lunchCount: 16, dinnerCount: 15, qr: 100 },
];

// 부서명 리스트 추가
const departmentList = [
  '총무부', '행정서무부', '내무부', '기획부', '재정부', '교육부', '신학부', '해외선교부', '전도부', '문화부', '출판부', '정보통신부', '찬양부', '섭외부', '국내선교부', '홍보부', '법무부', '감사부', '건설부', '체육부', '사업부', '보건후생복지부', '봉사교통부', '외교정책부',
  '자문회', '장년회', '부녀회', '청년회', '학생회', '유년회'
];

export default function Users() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', personalNumber: '', department: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', personalNumber: '', department: '' });

  // 고유번호 포맷팅 함수
  const formatPersonalNumber = (value) => {
    // 숫자와 하이픈만 허용
    const cleaned = value.replace(/[^\d-]/g, '');
    // 하이픈 제거
    const numbers = cleaned.replace(/-/g, '');
    // 8자리 이후 하이픈 추가
    if (numbers.length <= 8) {
      return numbers;
    } else {
      return numbers.slice(0, 8) + '-' + numbers.slice(8, 13);
    }
  };

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

  // 편집 모달 열기 함수
  const handleEditClick = (user) => {
    setEditForm({
      id: user.id,
      name: user.name,
      personalNumber: user.personalNumber,
      department: user.department
    });
    setEditModalOpen(true);
  };

  // 편집 저장 함수
  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.personalNumber || !editForm.department) return;
    
    setUsers(users.map(user => 
      user.id === editForm.id 
        ? { ...user, name: editForm.name, personalNumber: editForm.personalNumber, department: editForm.department }
        : user
    ));
    setEditModalOpen(false);
    setEditForm({ id: null, name: '', personalNumber: '', department: '' });
  };

  // 사용자 삭제 함수
  const handleDeleteUser = (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // 템플릿 다운로드 함수
  const downloadTemplate = () => {
    const template = [
      {
        '이름': '김철수',
        '부서': '총무부',
        '고유번호': '00371210-00149'
      },
      {
        '이름': '이영희',
        '부서': '기획부',
        '고유번호': '00371210-00150'
      },
      {
        '이름': '박민수',
        '부서': '교육부',
        '고유번호': '00371210-00151'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "사용자템플릿");
    
    // 컬럼 너비 설정
    ws['!cols'] = [
      { width: 15 }, // 이름
      { width: 20 }, // 부서
      { width: 20 }  // 고유번호
    ];

    XLSX.writeFile(wb, "사용자_업로드_템플릿.xlsx");
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

        // 데이터 검증 및 변환
        const validUsers = jsonData.filter(row => 
          row['이름'] && row['부서'] && row['고유번호']
        ).map((row, index) => ({
          id: users.length + index + 1,
          name: row['이름'],
          department: row['부서'],
          personalNumber: row['고유번호'],
          lunchCount: 0,
          dinnerCount: 0,
          qr: 0,
        }));

        if (validUsers.length > 0) {
          setUsers([...users, ...validUsers]);
          alert(`${validUsers.length}명의 사용자가 성공적으로 업로드되었습니다.`);
        } else {
          alert('유효한 사용자 데이터가 없습니다. 템플릿 형식을 확인해주세요.');
        }
      } catch (error) {
        alert('파일 처리 중 오류가 발생했습니다. 템플릿 형식을 확인해주세요.');
        console.error('File upload error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 사용자 목록 내보내기 함수
  const exportUsers = () => {
    const exportData = users.map(user => ({
      '이름': user.name,
      '부서': user.department,
      '고유번호': user.personalNumber,
      '점심 예약수': user.lunchCount,
      '저녁 예약수': user.dinnerCount,
      'QR 제출률': `${user.qr}%`
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "사용자목록");
    
    // 컬럼 너비 설정
    ws['!cols'] = [
      { width: 15 }, // 이름
      { width: 20 }, // 부서
      { width: 20 }, // 고유번호
      { width: 12 }, // 점심 예약수
      { width: 12 }, // 저녁 예약수
      { width: 12 }  // QR 제출률
    ];

    XLSX.writeFile(wb, `사용자목록_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀 + 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-10 pt-14 sm:pt-10 pb-2 sm:pb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--contentMain)] mb-2">사용자 관리</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"
            onClick={() => setUploadModalOpen(true)}
          >
            <FontAwesomeIcon icon={faUpload} className="w-5 h-5" /> 사용자 일괄 업로드
          </button>
          <button 
            className="button-tertiary-m flex items-center gap-1 px-4 py-2 border border-[var(--borderOutline)]"
            onClick={exportUsers}
          >
            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" /> 사용자 목록 내보내기
          </button>
          <button className="button-primary-m flex items-center gap-1 px-4 py-2" onClick={() => setModalOpen(true)}><FontAwesomeIcon icon={faPlus} className="w-5 h-5" /> 사용자 추가</button>
        </div>
      </div>
      {/* 검색창 */}
      <div className="px-4 sm:px-10 pb-2">
        <div className="flex gap-2 items-center mb-4">
          <div className="relative">
            <input type="text" className="w-full pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" style={{width:220}} placeholder="사용자 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
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
              placeholder="고유번호 (예: 00371210-00149)"
              type="text"
              value={form.personalNumber}
              onChange={e => setForm({ ...form, personalNumber: formatPersonalNumber(e.target.value) })}
              maxLength={14}
              required
            />
            {/* 부서 셀렉트 박스 */}
            <select
              className="border border-[var(--borderInput)] rounded px-3 py-2 text-sm"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="" disabled>부서 선택</option>
              {departmentList.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => setModalOpen(false)}>취소</button>
              <button type="submit" className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold">저장</button>
            </div>
          </form>
        </div>
      )}
      {/* 사용자 목록 */}
      <div className="px-2 sm:px-10 pb-10">
        {/* 테이블: 데스크톱 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="font-bold text-[var(--contentMain)] py-2">부서</th>
                <th className="font-bold text-[var(--contentMain)] py-2">이름</th>
                <th className="font-bold text-[var(--contentMain)] py-2">고유번호</th>
                <th className="font-bold text-[var(--contentMain)] py-2">점심 예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2">저녁 예약</th>
                <th className="font-bold text-[var(--contentMain)] py-2">QR 제출률</th>
                <th className="font-bold text-[var(--contentMain)] py-2">편집</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredUsers.map(row => (
                <tr key={row.id} className="border-b last:border-b-0 bg-white">
                  <td className="py-2 text-center">{row.department}</td>
                  <td className="py-2 text-center">{row.name}</td>
                  <td className="py-2 text-center">{row.personalNumber}</td>
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
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded" onClick={() => handleEditClick(row)}><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[var(--bgTertiary)] rounded" onClick={() => handleDeleteUser(row.id)}><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 카드형: 모바일 */}
        <div className="block sm:hidden space-y-2">
          {filteredUsers.map(user => (
            <div key={user.id} className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex justify-between mb-1"><span className="font-bold">{user.name}</span><span className="text-xs text-[var(--contentCaption)]">{user.department}</span></div>
              <div className="text-xs text-[var(--contentCaption)] mb-1">{user.personalNumber}</div>
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                <div><b>점심예약</b>: {user.lunchCount}회</div>
                <div><b>저녁예약</b>: {user.dinnerCount}회</div>
                <div><b>QR제출률</b>: <span className="font-bold text-blue-600">{user.qr}%</span></div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleEditClick(user)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleDeleteUser(user.id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 사용자 일괄 업로드 모달 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--contentMain)]">사용자 일괄 업로드</h3>
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
                  엑셀 템플릿 다운로드
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
      {/* 사용자 편집 모달 */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--contentMain)]">사용자 편집</h3>
              <button className="text-gray-400 hover:text-gray-700" onClick={() => setEditModalOpen(false)}>
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[var(--contentMain)] mb-2">이름</h4>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 border border-[var(--borderInput)] rounded"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--contentMain)] mb-2">고유번호</h4>
                <input
                  type="text"
                  value={editForm.personalNumber}
                  onChange={(e) => setEditForm({ ...editForm, personalNumber: formatPersonalNumber(e.target.value) })}
                  placeholder="고유번호 (예: 00371210-00149)"
                  maxLength={14}
                  className="w-full p-2 border border-[var(--borderInput)] rounded"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--contentMain)] mb-2">부서</h4>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full p-2 border border-[var(--borderInput)] rounded"
                >
                  <option value="" disabled>부서 선택</option>
                  {departmentList.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>
            
                         <div className="flex gap-2 mt-4">
               <button 
                 type="button"
                 className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" 
                 onClick={() => setEditModalOpen(false)}
               >
                 취소
               </button>
               <button 
                 type="submit"
                 className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold" 
                 onClick={handleEditSave}
               >
                 저장
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
} 