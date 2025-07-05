# 만나 티켓 관리 시스템 - 스타일 시스템 가이드

## 개요

이 프로젝트는 체계적인 CSS 관리 시스템을 도입하여 일관된 디자인과 유지보수성을 제공합니다.

## 파일 구조

```
php_project/
├── assets/
│   ├── css/
│   │   └── common.css          # 공통 스타일시트
│   ├── js/
│   │   └── common.js           # 공통 JavaScript
│   └── images/
│       └── favicon.ico         # 파비콘
├── includes/
│   ├── header.php              # 공통 헤더
│   └── footer.php              # 공통 푸터
├── users.php                   # 사용자 관리 페이지
├── menu.php                    # 메뉴 관리 페이지
├── menu_today.php              # 오늘 메뉴 페이지
├── menu_week.php               # 주간 메뉴 페이지
└── README_STYLE_SYSTEM.md      # 이 파일
```

## CSS 변수 시스템

### 색상 팔레트

```css
:root {
  /* 주요 색상 */
  --primary-blue: #3182f6;
  --blue-700: #1d4ed8;
  
  /* 그레이 스케일 */
  --gray-900: #111827;
  --gray-800: #1f2937;
  --gray-700: #374151;
  --gray-600: #4b5563;
  --gray-500: #6b7280;
  --gray-400: #9ca3af;
  --gray-300: #d1d5db;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --gray-50: #f9fafb;
  
  /* 상태 색상 */
  --success-green: #28a745;
  --warning-yellow: #ffc107;
  --danger-red: #dc3545;
  --info-blue: #17a2b8;
  
  /* 배경 색상 */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f8fa;
  --bg-tertiary: #f1f3f4;
  
  /* 텍스트 색상 */
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-tertiary: #6b7280;
  --text-muted: #9ca3af;
  --text-white: #ffffff;
}
```

### 간격 시스템

```css
:root {
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
}
```

### 폰트 크기

```css
:root {
  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.875rem;      /* 14px */
  --text-base: 1rem;        /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.25rem;       /* 20px */
  --text-2xl: 1.5rem;       /* 24px */
  --text-3xl: 1.875rem;     /* 30px */
  --text-4xl: 2.25rem;      /* 36px */
}
```

## 컴포넌트 사용법

### 버튼

```html
<!-- 기본 버튼 -->
<button class="btn btn-primary">기본 버튼</button>
<button class="btn btn-secondary">보조 버튼</button>
<button class="btn btn-success">성공 버튼</button>
<button class="btn btn-danger">위험 버튼</button>
<button class="btn btn-warning">경고 버튼</button>
<button class="btn btn-ghost">고스트 버튼</button>

<!-- 크기 변형 -->
<button class="btn btn-primary btn-sm">작은 버튼</button>
<button class="btn btn-primary btn-lg">큰 버튼</button>
```

### 폼 요소

```html
<div class="form-group">
  <label class="form-label">이름 *</label>
  <input type="text" class="form-input" placeholder="이름을 입력하세요" required>
</div>

<div class="form-group">
  <label class="form-label">부서</label>
  <select class="form-select">
    <option value="">부서를 선택하세요</option>
    <option value="총무부">총무부</option>
    <option value="기획부">기획부</option>
  </select>
</div>

<div class="form-group">
  <label class="form-label">메모</label>
  <textarea class="form-textarea" placeholder="메모를 입력하세요"></textarea>
</div>
```

### 테이블

```html
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>이름</th>
        <th>부서</th>
        <th>직급</th>
        <th>작업</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>김철수</td>
        <td>총무부</td>
        <td>사원</td>
        <td>
          <button class="btn btn-secondary btn-sm">편집</button>
          <button class="btn btn-danger btn-sm">삭제</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 카드

```html
<div class="card">
  <div class="card-header">
    <h3>카드 제목</h3>
  </div>
  <div class="card-body">
    <p>카드 내용이 여기에 들어갑니다.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">확인</button>
  </div>
</div>
```

### 모달

```html
<div id="myModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">모달 제목</h3>
      <button class="close-btn" onclick="closeModal('myModal')">&times;</button>
    </div>
    <div class="modal-body">
      <p>모달 내용이 여기에 들어갑니다.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('myModal')">취소</button>
      <button class="btn btn-primary">확인</button>
    </div>
  </div>
</div>
```

### 탭

```html
<div class="tab-menu">
  <button class="tab-btn active" data-tab="tab1" onclick="switchTab('tab1')">탭 1</button>
  <button class="tab-btn" data-tab="tab2" onclick="switchTab('tab2')">탭 2</button>
</div>

<div id="tab1Content" class="tab-content active">
  <p>탭 1 내용</p>
</div>

<div id="tab2Content" class="tab-content">
  <p>탭 2 내용</p>
</div>
```

### 알림

```html
<div class="alert alert-success">
  성공 메시지입니다.
</div>

<div class="alert alert-warning">
  경고 메시지입니다.
</div>

<div class="alert alert-danger">
  오류 메시지입니다.
</div>

<div class="alert alert-info">
  정보 메시지입니다.
</div>
```

## 유틸리티 클래스

### 간격

```html
<!-- 마진 -->
<div class="m-0">마진 없음</div>
<div class="m-1">작은 마진</div>
<div class="m-2">중간 마진</div>
<div class="m-3">큰 마진</div>

<!-- 패딩 -->
<div class="p-0">패딩 없음</div>
<div class="p-1">작은 패딩</div>
<div class="p-2">중간 패딩</div>
<div class="p-3">큰 패딩</div>

<!-- 방향별 마진 -->
<div class="mt-3">상단 마진</div>
<div class="mb-3">하단 마진</div>
<div class="ml-3">좌측 마진</div>
<div class="mr-3">우측 마진</div>
```

### 텍스트 정렬

```html
<p class="text-left">좌측 정렬</p>
<p class="text-center">중앙 정렬</p>
<p class="text-right">우측 정렬</p>
```

### 플렉스박스

```html
<div class="flex items-center justify-between">
  <span>왼쪽</span>
  <span>오른쪽</span>
</div>

<div class="flex flex-col items-center">
  <span>세로 정렬</span>
  <span>중앙 정렬</span>
</div>
```

### 표시/숨김

```html
<div class="hidden">숨겨진 요소</div>
<div class="block">보이는 요소</div>
<div class="inline">인라인 요소</div>
```

## JavaScript 함수

### 알림

```javascript
// 기본 알림
showAlert('메시지입니다.');

// 타입별 알림
showAlert('성공 메시지', 'success');
showAlert('경고 메시지', 'warning');
showAlert('오류 메시지', 'danger');
showAlert('정보 메시지', 'info');
```

### 확인 대화상자

```javascript
showConfirm('정말 삭제하시겠습니까?', function() {
  // 확인 시 실행할 코드
  console.log('삭제되었습니다.');
});
```

### 모달

```javascript
// 모달 열기
openModal('modalId');

// 모달 닫기
closeModal('modalId');
```

### 폼 처리

```javascript
// 폼 데이터 수집
const formData = getFormData('formId');

// 폼 유효성 검사
if (validateForm('formId')) {
  // 폼 제출 처리
}

// 폼 리셋
resetForm('formId');
```

### 테이블 처리

```javascript
// 테이블 검색
filterTable('tableId', '검색어');

// 테이블 정렬
sortTable('tableId', 0); // 첫 번째 컬럼으로 정렬
```

### 로컬 스토리지

```javascript
// 데이터 저장
Storage.set('key', value);

// 데이터 읽기
const value = Storage.get('key', defaultValue);

// 데이터 삭제
Storage.remove('key');
```

## 새 페이지 생성 방법

### 1. PHP 파일 생성

```php
<?php
// 페이지 설정
$pageTitle = '페이지 제목';
$additionalCSS = ['assets/css/page-specific.css'];
$additionalJS = ['assets/js/page-specific.js'];
$inlineScript = '';

// 페이지 로직
$data = []; // 페이지 데이터

include 'includes/header.php';
?>

<!-- 페이지 내용 -->
<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar">
      <h1><?= $pageTitle ?></h1>
      <div>
        <button class="btn btn-primary">작업 버튼</button>
      </div>
    </div>
    
    <!-- 페이지 콘텐츠 -->
  </div>
</div>

<?php include 'includes/footer.php'; ?>
```

### 2. 페이지별 CSS (선택사항)

```css
/* assets/css/page-specific.css */

/* 페이지 특별 스타일 */
.page-specific-element {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

/* 페이지별 반응형 스타일 */
@media (max-width: 768px) {
  .page-specific-element {
    padding: var(--spacing-md);
  }
}
```

### 3. 페이지별 JavaScript (선택사항)

```javascript
// assets/js/page-specific.js

// 페이지 초기화 함수
function initPage() {
  // 페이지별 초기화 로직
  console.log('페이지가 로드되었습니다.');
}

// 페이지별 함수들
function pageSpecificFunction() {
  // 페이지 특별 기능
}
```

## 반응형 디자인

### 브레이크포인트

- **모바일**: 768px 이하
- **태블릿**: 769px ~ 1024px
- **데스크톱**: 1025px 이상

### 반응형 클래스

```html
<!-- 모바일에서 숨김 -->
<div class="hidden md:block">데스크톱에서만 보임</div>

<!-- 데스크톱에서 숨김 -->
<div class="block md:hidden">모바일에서만 보임</div>

<!-- 그리드 반응형 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 -->
</div>
```

## 성능 최적화

### CSS 최적화

1. **CSS 변수 사용**: 일관된 값 관리
2. **유틸리티 클래스**: 재사용 가능한 스타일
3. **미디어 쿼리**: 반응형 디자인
4. **애니메이션 최적화**: transform, opacity 사용

### JavaScript 최적화

1. **이벤트 위임**: 성능 향상
2. **디바운싱/쓰로틀링**: 과도한 이벤트 방지
3. **로컬 스토리지**: 데이터 캐싱
4. **비동기 처리**: API 요청 최적화

## 브라우저 지원

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 문제 해결

### 일반적인 문제

1. **스타일이 적용되지 않음**
   - CSS 파일 경로 확인
   - 브라우저 캐시 삭제
   - 개발자 도구에서 오류 확인

2. **JavaScript 오류**
   - 콘솔 오류 확인
   - 파일 경로 확인
   - 함수명 오타 확인

3. **반응형 문제**
   - 뷰포트 메타 태그 확인
   - 미디어 쿼리 브레이크포인트 확인

### 디버깅 팁

1. **개발자 도구 사용**
   - Elements 탭에서 스타일 확인
   - Console 탭에서 오류 확인
   - Network 탭에서 파일 로딩 확인

2. **CSS 변수 확인**
   ```javascript
   // 브라우저 콘솔에서 실행
   getComputedStyle(document.documentElement).getPropertyValue('--primary-blue');
   ```

3. **JavaScript 디버깅**
   ```javascript
   // 디버깅용 로그
   console.log('변수값:', variable);
   console.error('오류:', error);
   ```

## 업데이트 로그

### v1.0.0 (2024-01-15)
- 초기 스타일 시스템 구축
- 공통 컴포넌트 정의
- 반응형 디자인 적용
- JavaScript 유틸리티 함수 추가

---

이 가이드를 참고하여 일관되고 유지보수하기 쉬운 웹 애플리케이션을 개발하세요! 