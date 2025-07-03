import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart,
  faCheck,
  faUpload,
  faEye,
  faPenToSquare,
  faTrash,
  faPlus,
  faDownload,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

const sponsorStats = [
  { label: '전체 게시글', value: 4, icon: <FontAwesomeIcon icon={faHeart} className="text-[var(--contentCaption)]" /> },
  { label: '고정 게시글', value: 2, icon: <FontAwesomeIcon icon={faUpload} className="text-[var(--contentCaption)]" /> },
];

const posts = [
  { id: 1, title: '1월 후원 목표 달성! 진심으로 감사드립니다', content: '여러분의 따뜻한 마음 덕분에 1월 후원 목표를 달성할 수 있었습니다. 후원해주신 모든 분들께 깊은 감사의 말씀을 드립니다. 이번 달 후원금은 식재료 구입과 주방 시설 개선에 소중히 사용되었습니다.', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', isNew: true, isFixed: true, category: '감사인사', author: '관리자', status: '게시중', views: 342, date: '2024-01-15' },
  { id: 2, title: '후원금 사용 내역 투명 공개', content: '지난달 후원금이 어떻게 사용되었는지 투명하게 공개합니다. 식재료 구입, 주방 시설 개선 등에 소중히 사용되었습니다. 모든 내역은 회계 감사를 거쳐 검증되었습니다.', image: null, isNew: false, isFixed: false, category: '보고서', author: '관리자', status: '게시중', views: 156, date: '2024-01-10' },
  { id: 3, title: '익명 후원자님께 특별한 감사글', content: '큰 금액을 후원해주신 익명의 후원자님께 진심으로 감사드립니다. 더 나은 식사 환경을 만드는 데 소중히 사용하겠습니다. 여러분의 따뜻한 마음이 우리에게 큰 힘이 됩니다.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', isNew: false, isFixed: true, category: '감사인사', author: '관리자', status: '게시중', views: 289, date: '2024-01-08' },
  { id: 4, title: '2월 후원 목표와 계획 안내', content: '2월 후원 목표와 계획을 안내드립니다. 이번 달에는 새로운 식단 도입과 주방 시설 확장을 위한 후원을 받고자 합니다. 많은 관심과 참여 부탁드립니다.', image: null, isNew: false, isFixed: false, category: '공지', author: '관리자', status: '게시중', views: 89, date: '2024-01-05' },
];

const previewPosts = [
  { id: 1, title: '1월 후원 목표 달성! 진심으로 감사드립니다', isNew: true, isFixed: true, content: '여러분의 따뜻한 마음 덕분에 1월 후원 목표를 달성할 수 있었습니다. 후원해주신 모든 분들께 깊은 감사의 말씀을 드립니다.', category: '감사인사', views: 342, date: '2024-01-15' },
  { id: 2, title: '후원금 사용 내역 투명 공개', isNew: false, isFixed: false, content: '지난달 후원금이 어떻게 사용되었는지 투명하게 공개합니다. 식재료 구입, 주방 시설 개선 등에 소중히 사용되었습니다.', category: '보고서', views: 156, date: '2024-01-10' },
  { id: 3, title: '익명 후원자님께 특별한 감사글', isNew: false, isFixed: true, content: '큰 금액을 후원해주신 익명의 후원자님께 진심으로 감사드립니다. 더 나은 식사 환경을 만드는 데 소중히 사용하겠습니다.', category: '감사인사', views: 289, date: '2024-01-08' },
];

// 고정 게시글 먼저, 날짜 내림차순 정렬
const sortedPosts = [...posts].sort((a, b) => {
  if (a.isFixed && !b.isFixed) return -1;
  if (!a.isFixed && b.isFixed) return 1;
  return new Date(b.date) - new Date(a.date);
});

export default function Sponser() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [status, setStatus] = useState('전체');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [postsState, setPosts] = useState(posts);
  const [form, setForm] = useState({
    title: '',
    content: '',
    isFixed: false,
    isNew: true,
    image: null
  });
  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    content: '',
    isFixed: false,
    isNew: true,
    image: null
  });
  const [selectedPost, setSelectedPost] = useState(null);

  const filtered = postsState.filter(
    p => (!search || p.title.includes(search)) &&
      (category === '전체' || p.category === category) &&
      (status === '전체' || p.status === status)
  );

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    
    const newPost = {
      id: postsState.length + 1,
      title: form.title,
      content: form.content,
      isNew: form.isNew,
      isFixed: form.isFixed,
      category: '감사인사',
      author: '관리자',
      status: '게시중',
      views: 0,
      date: new Date().toISOString().split('T')[0],
      image: form.image
    };
    
    setPosts([newPost, ...postsState]);
    setForm({ title: '', content: '', isFixed: false, isNew: true, image: null });
    setModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({...form, image: file});
    }
  };

  // 상세보기 함수
  const handleViewClick = (post) => {
    setSelectedPost(post);
    setViewModalOpen(true);
  };

  // 편집 모달 열기 함수
  const handleEditClick = (post) => {
    setEditForm({
      id: post.id,
      title: post.title,
      content: post.content,
      isFixed: post.isFixed,
      isNew: post.isNew,
      image: post.image
    });
    setEditModalOpen(true);
  };

  // 편집 저장 함수
  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.content) return;
    
    setPosts(postsState.map(post => 
      post.id === editForm.id 
        ? { ...post, ...editForm }
        : post
    ));
    setEditModalOpen(false);
    setEditForm({ id: null, title: '', content: '', isFixed: false, isNew: true, image: null });
  };

  // 삭제 함수
  const handleDeletePost = (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(postsState.filter(post => post.id !== postId));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-10 pt-14 sm:pt-10 pb-2 sm:pb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--contentMain)] mb-2">후원 관리</h1>
        <div className="flex gap-2">
          <button 
            className="button-primary-m flex items-center gap-1 px-4 py-2"
            onClick={() => setModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" /> 감사 게시글 작성
          </button>
        </div>
      </div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-10 mb-8 w-full">
        {sponsorStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-[var(--radius-m)] shadow-sm p-4 sm:p-6 flex flex-col items-end md:items-start border border-[var(--borderOutline)] min-h-[80px]">
            <div className="flex items-center gap-1 text-[var(--contentCaption)] text-sm font-semibold w-full justify-between">
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold mt-1 w-full text-[var(--contentMain)]">{stat.value}</div>
          </div>
        ))}
      </div>
      {/* 게시글 목록 카드 */}
      <div className="bg-white rounded-[var(--radius-l)] shadow-sm border border-[var(--borderOutline)] mx-4 sm:mx-10 p-4 sm:p-8 mb-6">
        <div className="font-bold text-[var(--contentMain)] mb-1 text-lg">후원 감사 게시글</div>
        <div className="text-sm text-[var(--contentCaption)] mb-4">후원에 대한 감사 인사와 관련 소식을 관리할 수 있습니다.</div>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1 max-w-xs">
            <input type="text" className="w-full pl-9 pr-3 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" placeholder="게시글 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--contentCaption)]" />
          </div>
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--bgPrimary)] text-sm" value={category} onChange={e => setCategory(e.target.value)} style={{width:100}}>
            <option value="전체">전체</option>
            <option value="감사인사">감사인사</option>
            <option value="보고서">보고서</option>
            <option value="공지">공지</option>
          </select>
          <select className="px-3 py-2 rounded border border-[var(--borderInput)] bg-[var(--bgPrimary)] text-sm" value={status} onChange={e => setStatus(e.target.value)} style={{width:100}}>
            <option value="전체">전체</option>
            <option value="게시중">게시중</option>
            <option value="임시저장">임시저장</option>
          </select>
        </div>
        {/* 모바일 카드형 게시글 목록 */}
        <div className="block sm:hidden space-y-4">
          {filtered
            .sort((a, b) => {
              if (a.isFixed && !b.isFixed) return -1;
              if (!a.isFixed && b.isFixed) return 1;
              return new Date(b.date) - new Date(a.date);
            })
            .map(p => (
              <div key={p.id} className="bg-white rounded-[var(--radius-m)] shadow-sm border border-[var(--borderOutline)] p-4 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-bold text-[var(--contentMain)]">{p.title}</span>
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-0 sm:ml-2">
                    {p.isNew && <span className="inline-block bg-[var(--red100)] text-[var(--red500)] text-xs font-bold px-2 py-0.5 rounded">NEW</span>}
                    {p.isFixed && <span className="inline-block bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs font-bold px-2 py-0.5 rounded">고정</span>}
                  </div>
                </div>
                <div className="flex gap-2 text-xs flex-wrap">
                  <span className="text-[var(--contentCaption)]">{p.author}</span>
                  <span className="px-2 py-1 rounded font-bold bg-[var(--green100)] text-[var(--green500)]">{p.status}</span>
                  <span className="text-[var(--contentCaption)]">{p.views}회</span>
                  <span className="text-[var(--contentCaption)]">{p.date}</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="상세" onClick={() => handleViewClick(p)}><FontAwesomeIcon icon={faEye} className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="수정" onClick={() => handleEditClick(p)}><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="삭제" onClick={() => handleDeletePost(p.id)}><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
        </div>
        {/* 데스크탑 테이블형 게시글 목록 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bgTertiary)]">
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-left">제목</th>
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">작성자</th>
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">상태</th>
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">조회수</th>
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">작성일</th>
                <th className="py-3 px-2 font-bold text-[var(--contentMain)] text-center">편집</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => {
                  if (a.isFixed && !b.isFixed) return -1;
                  if (!a.isFixed && b.isFixed) return 1;
                  return new Date(b.date) - new Date(a.date);
                })
                .map(p => (
                  <tr key={p.id} className="border-b last:border-b-0">
                    <td className="py-3 px-2 text-left font-medium text-[var(--contentMain)]">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        {p.image && <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-[var(--primaryBlue)]" title="이미지 포함" />}
                        <span>{p.title}</span>
                        <div className="flex flex-wrap gap-1 mt-1 sm:mt-0 sm:ml-2">
                          {p.isNew && <span className="inline-block bg-[var(--red100)] text-[var(--red500)] text-xs font-bold px-2 py-0.5 rounded">NEW</span>}
                          {p.isFixed && <span className="inline-block bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs font-bold px-2 py-0.5 rounded">고정</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">{p.author}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-[var(--green100)] text-[var(--green500)]">{p.status}</span>
                    </td>
                    <td className="py-3 px-2 text-center">{p.views}회</td>
                    <td className="py-3 px-2 text-center">{p.date}</td>
                    <td className="py-3 px-2 text-center">
                      <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="상세" onClick={() => handleViewClick(p)}><FontAwesomeIcon icon={faEye} className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="수정" onClick={() => handleEditClick(p)}><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="삭제" onClick={() => handleDeletePost(p.id)}><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 최근 게시글 미리보기 카드 */}
      <div className="bg-white rounded-[var(--radius-l)] shadow-sm border border-[var(--borderOutline)] mx-4 sm:mx-10 p-4 sm:p-8 mb-10">
        <div className="font-bold text-[var(--contentMain)] mb-1 text-lg">최근 게시글 미리보기</div>
        <div className="text-sm text-[var(--contentCaption)] mb-4">최근 작성된 후원 감사 게시글을 확인할 수 있습니다.</div>
        <div className="flex flex-col gap-4">
          {previewPosts.map(post => (
            <div key={post.id} className="bg-[var(--bgTertiary)] rounded-[var(--radius-s)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {post.image && <FontAwesomeIcon icon={faUpload} className="w-3 h-3 text-[var(--primaryBlue)]" title="이미지 포함" />}
                  <span className="font-semibold text-[var(--contentMain)]">{post.title}</span>
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-0 sm:ml-2">
                    {post.isNew && <span className="inline-block bg-[var(--red100)] text-[var(--red500)] text-xs font-bold px-2 py-0.5 rounded">NEW</span>}
                    {post.isFixed && <span className="inline-block bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs font-bold px-2 py-0.5 rounded">고정</span>}
                  </div>
                </div>
                <div className="text-[var(--contentCaption)] text-sm mb-1 line-clamp-2">{post.content}</div>
                <div className="flex gap-3 text-xs text-[var(--contentCaption)]">
                  <span>{post.category}</span>
                  <span>조회수 {post.views}회</span>
                  <span>작성일 {post.date}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="상세" onClick={() => handleViewClick(post)}><FontAwesomeIcon icon={faEye} className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="수정" onClick={() => handleEditClick(post)}><FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-[var(--bgTertiary)] rounded" title="삭제" onClick={() => handleDeletePost(post.id)}><FontAwesomeIcon icon={faTrash} className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 감사 게시글 작성 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--contentMain)]">감사 게시글 작성</h3>
              <button 
                className="text-gray-400 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                  placeholder="게시글 제목을 입력하세요"
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
                  placeholder="감사 인사 내용을 입력하세요"
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                  이미지 첨부 (선택)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                />
                {form.image && (
                  <div className="mt-2">
                    <p className="text-xs text-[var(--contentCaption)] mb-2">선택된 파일: {form.image.name}</p>
                    <div className="border border-[var(--borderInput)] rounded p-2">
                      <img 
                        src={URL.createObjectURL(form.image)} 
                        alt="미리보기" 
                        className="w-full h-auto max-h-32 object-cover rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({...form, image: null})}
                      className="mt-2 text-sm text-[var(--red500)] hover:text-[var(--red700)]"
                    >
                      이미지 제거
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={form.isFixed}
                    onChange={(e) => setForm({...form, isFixed: e.target.checked})}
                  />
                  <label htmlFor="isFixed" className="text-sm text-[var(--contentMain)]">
                    고정 게시글로 설정
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
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

      {/* 상세보기 모달 */}
      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--contentMain)]">게시글 상세보기</h3>
              <button 
                className="text-gray-400 hover:text-gray-700"
                onClick={() => setViewModalOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
                         <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                   제목
                 </label>
                 <input
                   type="text"
                   className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                   value={selectedPost?.title}
                   readOnly
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                   내용
                 </label>
                 <textarea
                   className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)] resize-none"
                   rows="6"
                   value={selectedPost?.content}
                   readOnly
                 />
               </div>
               
               {selectedPost?.image && (
                 <div>
                   <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                     첨부 이미지
                   </label>
                   <div className="border border-[var(--borderInput)] rounded p-2">
                     <img 
                       src={selectedPost.image} 
                       alt="게시글 이미지" 
                       className="w-full h-auto max-h-64 object-cover rounded"
                     />
                   </div>
                 </div>
               )}
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                     카테고리
                   </label>
                   <input
                     type="text"
                     className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                     value={selectedPost?.category}
                     readOnly
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                     작성자
                   </label>
                   <input
                     type="text"
                     className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                     value={selectedPost?.author}
                     readOnly
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                     작성일
                   </label>
                   <input
                     type="text"
                     className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                     value={selectedPost?.date}
                     readOnly
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                     조회수
                   </label>
                   <input
                     type="text"
                     className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                     value={`${selectedPost?.views}회`}
                     readOnly
                   />
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* 편집 모달 */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--contentMain)]">게시글 편집</h3>
              <button 
                className="text-gray-400 hover:text-gray-700"
                onClick={() => setEditModalOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                  placeholder="게시글 제목을 입력하세요"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
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
                  placeholder="감사 인사 내용을 입력하세요"
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  required
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-[var(--contentMain)] mb-2">
                   이미지 관리
                 </label>
                 
                 {/* 기존 이미지 표시 */}
                 {editForm.image && typeof editForm.image === 'string' && (
                   <div className="mb-4">
                     <p className="text-sm text-[var(--contentCaption)] mb-2">현재 이미지:</p>
                     <div className="border border-[var(--borderInput)] rounded p-2">
                       <img 
                         src={editForm.image} 
                         alt="현재 이미지" 
                         className="w-full h-auto max-h-32 object-cover rounded"
                       />
                     </div>
                     <button
                       type="button"
                       onClick={() => setEditForm({...editForm, image: null})}
                       className="mt-2 text-sm text-[var(--red500)] hover:text-[var(--red700)]"
                     >
                       이미지 제거
                     </button>
                   </div>
                 )}
                 
                 {/* 새 이미지 업로드 */}
                 <div>
                   <p className="text-sm text-[var(--contentCaption)] mb-2">
                     {editForm.image && typeof editForm.image === 'string' ? '새 이미지로 교체:' : '이미지 첨부 (선택):'}
                   </p>
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => {
                       const file = e.target.files[0];
                       if (file) {
                         // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아야 함
                         // 여기서는 임시로 파일 객체를 저장
                         setEditForm({...editForm, image: file});
                       }
                     }}
                     className="w-full px-3 py-2 border border-[var(--borderInput)] rounded focus:outline-none focus:border-[var(--primaryBlue)]"
                   />
                   {editForm.image && typeof editForm.image === 'object' && (
                     <p className="text-xs text-[var(--contentCaption)] mt-1">
                       선택된 파일: {editForm.image.name}
                     </p>
                   )}
                 </div>
               </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={editForm.isFixed}
                    onChange={(e) => setEditForm({...editForm, isFixed: e.target.checked})}
                  />
                  <label htmlFor="isFixed" className="text-sm text-[var(--contentMain)]">
                    고정 게시글로 설정
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={editForm.isNew}
                    onChange={(e) => setEditForm({...editForm, isNew: e.target.checked})}
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
                  onClick={() => setEditModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-[var(--primaryBlue)] text-white font-semibold hover:bg-[var(--blue700)]"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 