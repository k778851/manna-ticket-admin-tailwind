/**
 * 만나 티켓 관리 시스템 - 공통 JavaScript
 */

// 전역 변수
window.MannaAdmin = {
  // 설정
  config: {
    apiBaseUrl: '/api',
    refreshInterval: 60000, // 1분
    animationDuration: 300
  },
  
  // 상태
  state: {
    sidebarCollapsed: false,
    currentPage: null,
    user: null
  }
};

/**
 * 유틸리티 함수들
 */

// 알림 표시
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} fade-in`;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;
  alertDiv.textContent = message;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// 확인 대화상자
function showConfirm(message, callback) {
  if (confirm(message)) {
    if (typeof callback === 'function') {
      callback();
    }
  }
}

// 로딩 표시
function showLoading(container = document.body) {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-overlay';
  loadingDiv.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <span>로딩 중...</span>
    </div>
  `;
  
  container.appendChild(loadingDiv);
  return loadingDiv;
}

// 로딩 숨기기
function hideLoading(loadingElement) {
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.remove();
  }
}

/**
 * 모달 관련 함수들
 */

// 모달 열기
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // ESC 키로 모달 닫기
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal(modalId);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 모달 외부 클릭으로 닫기
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modalId);
      }
    });
  }
}

// 모달 닫기
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

/**
 * 폼 관련 함수들
 */

// 폼 데이터 수집
function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

// 폼 유효성 검사
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  
  return isValid;
}

// 폼 리셋
function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    form.querySelectorAll('.error').forEach(field => {
      field.classList.remove('error');
    });
  }
}

/**
 * 테이블 관련 함수들
 */

// 테이블 검색
function filterTable(tableId, searchTerm) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr');
  const searchLower = searchTerm.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchLower)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// 테이블 정렬
function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();
    return aText.localeCompare(bText, 'ko');
  });
  
  rows.forEach(row => tbody.appendChild(row));
}

/**
 * 사이드바 관련 함수들
 */

// 사이드바 토글
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  if (sidebar && mainContent) {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    // 상태 저장
    MannaAdmin.state.sidebarCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', MannaAdmin.state.sidebarCollapsed);
  }
}

// 사이드바 상태 복원
function restoreSidebarState() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  if (sidebar && mainContent) {
    const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    if (collapsed) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('sidebar-collapsed');
      MannaAdmin.state.sidebarCollapsed = true;
    }
  }
}

/**
 * 데이터 관련 함수들
 */

// API 요청
async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(`${MannaAdmin.config.apiBaseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
    showAlert('데이터를 불러오는 중 오류가 발생했습니다.', 'danger');
    throw error;
  }
}

// 로컬 스토리지 관리
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('로컬 스토리지 읽기 실패:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지 삭제 실패:', error);
    }
  }
};

/**
 * 날짜/시간 관련 함수들
 */

// 날짜 포맷팅
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

// 현재 날짜 가져오기
function getCurrentDate() {
  return formatDate(new Date());
}

// 요일 가져오기
function getDayOfWeek(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(date).getDay()];
}

/**
 * 파일 관련 함수들
 */

// 파일 업로드
function uploadFile(file, endpoint) {
  const formData = new FormData();
  formData.append('file', file);
  
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  });
}

// 파일 다운로드
function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 이벤트 리스너들
 */

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 사이드바 상태 복원
  restoreSidebarState();
  
  // 전역 이벤트 리스너 등록
  setupGlobalEventListeners();
  
  // 페이지별 초기화 함수 호출
  if (typeof initPage === 'function') {
    initPage();
  }
});

// 전역 이벤트 리스너 설정
function setupGlobalEventListeners() {
  // 사이드바 토글 버튼
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  // 모달 닫기 버튼들
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-btn')) {
      const modal = e.target.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    }
  });
  
  // 폼 제출 처리
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('needs-validation')) {
      if (!validateForm(form.id)) {
        e.preventDefault();
        showAlert('필수 항목을 모두 입력해주세요.', 'warning');
      }
    }
  });
}

/**
 * 반응형 처리
 */

// 화면 크기 변경 감지
window.addEventListener('resize', function() {
  const width = window.innerWidth;
  
  // 모바일에서는 사이드바 자동 숨김
  if (width <= 768) {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('sidebar-collapsed');
    }
  }
});

/**
 * 성능 최적화
 */

// 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 쓰로틀 함수
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 전역 함수로 노출
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.openModal = openModal;
window.closeModal = closeModal;
window.getFormData = getFormData;
window.validateForm = validateForm;
window.resetForm = resetForm;
window.filterTable = filterTable;
window.sortTable = sortTable;
window.toggleSidebar = toggleSidebar;
window.apiRequest = apiRequest;
window.Storage = Storage;
window.formatDate = formatDate;
window.getCurrentDate = getCurrentDate;
window.getDayOfWeek = getDayOfWeek;
window.uploadFile = uploadFile;
window.downloadFile = downloadFile; 