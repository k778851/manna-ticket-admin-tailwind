<?php
// 오늘 메뉴 데이터
$todayMenus = [
  [ 'type'=>'점심', 'date'=>'2024-01-15 | 한식', 'main'=>'소불고기', 'sides'=>'밥, 계란말이, 시금치나물, 김치', 'soup'=>'국', 'allergy'=>'대두, 계란' ],
  [ 'type'=>'저녁', 'date'=>'2024-01-15 | 양식', 'main'=>'치킨까스', 'sides'=>'밥, 샐러드, 감자튀김', 'soup'=>'스프', 'allergy'=>'밀, 계란, 우유' ],
];

// 주간 메뉴 데이터
$weekMenus = [
  [ 'day'=>'월', 'date'=>'2024-01-15', 'lunch'=>['main'=>'소불고기', 'type'=>'한식', 'sides'=>'밥, 계란말이 외'], 'dinner'=>['main'=>'치킨까스', 'type'=>'양식', 'sides'=>'밥, 샐러드 외'] ],
  [ 'day'=>'화', 'date'=>'2024-01-16', 'lunch'=>['main'=>'짜장덮밥', 'type'=>'중식', 'sides'=>'단무지, 양파 외'], 'dinner'=>['main'=>'제육볶음', 'type'=>'한식', 'sides'=>'밥, 콩나물 외'] ],
  [ 'day'=>'수', 'date'=>'2024-01-17', 'lunch'=>['main'=>'돈까스', 'type'=>'일식', 'sides'=>'밥, 미소시루 외'], 'dinner'=>['main'=>'스파게티', 'type'=>'양식', 'sides'=>'마늘빵, 샐러드'] ],
  [ 'day'=>'목', 'date'=>'2024-01-18', 'lunch'=>['main'=>'갈비찜', 'type'=>'한식', 'sides'=>'밥, 나물 외'], 'dinner'=>['main'=>'탕수육', 'type'=>'중식', 'sides'=>'밥, 짜장 외'] ],
  [ 'day'=>'금', 'date'=>'2024-01-19', 'lunch'=>['main'=>'함박스테이크', 'type'=>'양식', 'sides'=>'밥, 감자 외'], 'dinner'=>['main'=>'김치찌개', 'type'=>'한식', 'sides'=>'밥, 계란말이 외'] ],
];

$tab = isset($_GET['tab']) ? $_GET['tab'] : 'today';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>메뉴 관리</title>
  <style>
    body { font-family: 'Pretendard', sans-serif; background: #f7f8fa; margin:0; }
    .main-content {
        margin-left: 256px;
        transition: margin-left 0.3s;
    }
    
    .main-content.sidebar-collapsed {
        margin-left: 80px;
    }
    
    @media (max-width: 768px) {
        .main-content {
            margin-left: 0;
        }
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 32px 8px; }
    .top-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    .btn { padding:8px 16px; border-radius:6px; border:none; font-weight:bold; cursor:pointer; margin:0 4px; }
    .btn-primary { background:#3182f6; color:#fff; }
    .btn-secondary { background:#fff; color:#3182f6; border:1px solid #3182f6; }
    .btn-success { background:#28a745; color:#fff; }
    .tab-menu { display:flex; gap:4px; margin-bottom:24px; justify-content:center; }
    .tab-btn { flex:1; max-width:160px; padding:12px 0; border-radius:8px; border:1px solid #eee; background:#fff; color:#888; font-weight:bold; cursor:pointer; transition:0.2s; }
    .tab-btn.active { background:#3182f6; color:#fff; border-color:#3182f6; }
    .menu-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:24px; margin-bottom:24px; }
    .menu-card { background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 8px #0001; border:1px solid #eee; }
    .menu-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
    .menu-type { font-weight:bold; font-size:1.2rem; color:#333; }
    .menu-date { font-size:0.9rem; color:#888; }
    .menu-divider { border-bottom:1px solid #eee; margin:16px 0; }
    .menu-item { margin-bottom:12px; }
    .menu-label { font-size:0.9rem; color:#666; font-weight:bold; margin-bottom:4px; }
    .menu-value { font-size:1rem; color:#333; }
    .menu-main { font-size:1.3rem; font-weight:bold; color:#222; }
    .week-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; overflow:hidden; }
    .week-table th, .week-table td { border:1px solid #eee; padding:12px 8px; text-align:center; }
    .week-table th { background:#f7f8fa; color:#333; font-weight:bold; }
    .week-table td { color:#444; }
    .auto-refresh-status { background:#d4edda; border:1px solid #c3e6cb; border-radius:8px; padding:12px; margin-bottom:16px; }
    .auto-refresh-status.enabled { background:#d4edda; border-color:#c3e6cb; }
    .auto-refresh-status.disabled { background:#f8d7da; border-color:#f5c6cb; }
    .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; }
    .modal-content { background:#fff; border-radius:12px; padding:24px; min-width:400px; max-width:90%; max-height:90%; overflow-y:auto; }
    .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .modal-title { font-size:1.5rem; font-weight:bold; color:#222; }
    .close-btn { background:none; border:none; font-size:24px; color:#888; cursor:pointer; }
    .form-group { margin-bottom:16px; }
    .form-label { display:block; margin-bottom:6px; font-weight:bold; color:#333; }
    .form-input { width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
    .form-select { width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
    .modal-buttons { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }
    .week-form-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; }
    .week-day-card { border:1px solid #eee; border-radius:8px; padding:16px; }
    .week-day-title { font-weight:bold; text-align:center; margin-bottom:12px; color:#333; }
    .checkbox-group { display:flex; align-items:center; gap:8px; padding:8px; background:#f7f8fa; border-radius:6px; margin-bottom:8px; }
    .checkbox-group input[type="checkbox"] { margin:0; }
    .checkbox-group label { margin:0; font-size:0.9rem; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
    
    // 탭 전환
    function switchTab(tabName) {
      // URL 파라미터 업데이트
      const url = new URL(window.location);
      url.searchParams.set('tab', tabName);
      window.history.pushState({}, '', url);
      
      // 탭 버튼 상태 업데이트
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
      
      // 탭 콘텐츠 전환
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(`${tabName}Content`).style.display = 'block';
    }
    
    // 자동 갱신 설정
    let autoRefreshSettings = {
      enabled: false,
      time: '11:00',
      days: ['월', '화', '수', '목', '금']
    };
    let lastRefreshTime = null;
    let refreshInterval = null;
    
    // 설정 로드
    function loadAutoRefreshSettings() {
      const saved = localStorage.getItem('menuAutoRefreshSettings');
      if (saved) {
        autoRefreshSettings = JSON.parse(saved);
      }
      
      const savedTime = localStorage.getItem('menuLastRefreshTime');
      if (savedTime) {
        lastRefreshTime = new Date(savedTime);
      }
      
      updateAutoRefreshStatus();
    }
    
    // 설정 저장
    function saveAutoRefreshSettings() {
      localStorage.setItem('menuAutoRefreshSettings', JSON.stringify(autoRefreshSettings));
    }
    
    // 자동 갱신 상태 업데이트
    function updateAutoRefreshStatus() {
      const statusDiv = document.getElementById('autoRefreshStatus');
      if (statusDiv) {
        statusDiv.className = `auto-refresh-status ${autoRefreshSettings.enabled ? 'enabled' : 'disabled'}`;
        statusDiv.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:bold;">${autoRefreshSettings.enabled ? '자동 갱신 활성화됨' : '자동 갱신 비활성화됨'}</span>
            ${autoRefreshSettings.enabled ? `- 매일 ${autoRefreshSettings.time}에 갱신` : ''}
          </div>
          ${lastRefreshTime ? `<div style="font-size:0.9rem; margin-top:4px;">마지막 갱신: ${lastRefreshTime.toLocaleString('ko-KR')}</div>` : ''}
        `;
      }
    }
    
    // 메뉴 갱신 함수
    function refreshMenus() {
      const now = new Date();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
      
      if (!autoRefreshSettings.days.includes(dayOfWeek)) {
        return;
      }
      
      // 실제로는 서버에서 데이터를 가져와야 하지만, 여기서는 시뮬레이션
      showAlert('메뉴가 자동으로 갱신되었습니다.');
      lastRefreshTime = now;
      localStorage.setItem('menuLastRefreshTime', lastRefreshTime.toISOString());
      updateAutoRefreshStatus();
    }
    
    // 자동 갱신 스케줄러 시작
    function startAutoRefresh() {
      if (autoRefreshSettings.enabled) {
        refreshInterval = setInterval(() => {
          const now = new Date();
          const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          if (currentTime === autoRefreshSettings.time) {
            refreshMenus();
          }
        }, 60000); // 1분마다 체크
      }
    }
    
    // 자동 갱신 스케줄러 중지
    function stopAutoRefresh() {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    }
    
    // 모달 기능
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'flex';
    }
    
    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }
    
    // 자동 갱신 설정 변경
    function updateAutoRefreshSetting(setting, value) {
      if (setting === 'enabled') {
        autoRefreshSettings.enabled = value;
        if (value) {
          startAutoRefresh();
        } else {
          stopAutoRefresh();
        }
      } else if (setting === 'time') {
        autoRefreshSettings.time = value;
      } else if (setting === 'days') {
        if (autoRefreshSettings.days.includes(value)) {
          autoRefreshSettings.days = autoRefreshSettings.days.filter(d => d !== value);
        } else {
          autoRefreshSettings.days.push(value);
        }
      }
      
      saveAutoRefreshSettings();
      updateAutoRefreshStatus();
    }
    
    // 전체 요일 체크박스 처리
    function toggleAllDays(checked) {
      if (checked) {
        autoRefreshSettings.days = ['월', '화', '수', '목', '금'];
      } else {
        autoRefreshSettings.days = [];
      }
      
      // 체크박스 상태 업데이트
      document.querySelectorAll('input[name="dayCheckbox"]').forEach(checkbox => {
        checkbox.checked = checked;
      });
      
      saveAutoRefreshSettings();
      updateAutoRefreshStatus();
    }
    
    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', function() {
      loadAutoRefreshSettings();
      startAutoRefresh();
      
      // 현재 탭 설정
      const urlParams = new URLSearchParams(window.location.search);
      const currentTab = urlParams.get('tab') || 'today';
      switchTab(currentTab);
    });
    
    // 페이지 떠날 때 정리
    window.addEventListener('beforeunload', function() {
      stopAutoRefresh();
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
      <div class="top-bar">
        <h1 style="font-size:2rem; font-weight:bold;">메뉴 관리</h1>
        <div>
          <button class="btn btn-secondary" onclick="openModal('uploadModal')">주간메뉴 일괄 업로드</button>
          <button class="btn btn-success" onclick="openModal('autoRefreshModal')">자동갱신 설정</button>
          <button class="btn btn-primary" onclick="openModal('addMenuModal')">메뉴 추가</button>
        </div>
      </div>
      
      <div class="tab-menu">
        <button class="tab-btn active" data-tab="today" onclick="switchTab('today')">오늘 메뉴</button>
        <button class="tab-btn" data-tab="week" onclick="switchTab('week')">주간 메뉴</button>
      </div>
      
      <!-- 오늘 메뉴 탭 -->
      <div id="todayContent" class="tab-content">
        <div id="autoRefreshStatus" class="auto-refresh-status disabled"></div>
        
        <div class="menu-grid">
          <?php foreach($todayMenus as $menu): ?>
          <div class="menu-card">
            <div class="menu-header">
              <span class="menu-type"><?= htmlspecialchars($menu['type']) ?></span>
            </div>
            <div class="menu-date"><?= htmlspecialchars($menu['date']) ?></div>
            <div class="menu-divider"></div>
            
            <div class="menu-item">
              <div class="menu-label">메인요리</div>
              <div class="menu-value menu-main"><?= htmlspecialchars($menu['main']) ?></div>
            </div>
            
            <div class="menu-item">
              <div class="menu-label">반찬</div>
              <div class="menu-value"><?= htmlspecialchars($menu['sides']) ?></div>
            </div>
            
            <div class="menu-item">
              <div class="menu-label">국물</div>
              <div class="menu-value"><?= htmlspecialchars($menu['soup']) ?></div>
            </div>
            
            <div class="menu-item">
              <div class="menu-label">알레르기 정보</div>
              <div class="menu-value"><?= htmlspecialchars($menu['allergy']) ?></div>
            </div>
            
            <div style="margin-top:16px;">
              <button class="btn btn-secondary" onclick="showAlert('메뉴 수정 기능은 실제 동작하지 않습니다.')">수정</button>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
      
      <!-- 주간 메뉴 탭 -->
      <div id="weekContent" class="tab-content" style="display:none;">
        <div style="margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h2 style="font-size:1.5rem; font-weight:bold; margin:0;">주간 식단표</h2>
              <p style="color:#666; margin:4px 0 0 0;">2024년 1월 3주차</p>
            </div>
            <div>
              <select style="padding:8px; border:1px solid #ccc; border-radius:6px; margin-right:8px;">
                <option>이번 주</option>
                <option>다음 주</option>
                <option>지난 주</option>
              </select>
              <button class="btn btn-secondary" onclick="showAlert('주간 메뉴 편집 기능은 실제 동작하지 않습니다.')">주간 메뉴 편집</button>
            </div>
          </div>
        </div>
        
        <table class="week-table">
          <thead>
            <tr>
              <th style="width:60px;">요일</th>
              <th style="width:100px;">날짜</th>
              <th>점심 메뉴</th>
              <th>저녁 메뉴</th>
              <th style="width:80px;">작업</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach($weekMenus as $menu): ?>
            <tr>
              <td style="font-weight:bold;"><?= htmlspecialchars($menu['day']) ?></td>
              <td style="color:#666;"><?= htmlspecialchars($menu['date']) ?></td>
              <td>
                <div style="font-weight:bold;"><?= htmlspecialchars($menu['lunch']['main']) ?></div>
                <div style="font-size:0.9rem; color:#666;"><?= htmlspecialchars($menu['lunch']['sides']) ?></div>
              </td>
              <td>
                <div style="font-weight:bold;"><?= htmlspecialchars($menu['dinner']['main']) ?></div>
                <div style="font-size:0.9rem; color:#666;"><?= htmlspecialchars($menu['dinner']['sides']) ?></div>
              </td>
              <td>
                <button class="btn btn-secondary" onclick="showAlert('메뉴 수정 기능은 실제 동작하지 않습니다.')">수정</button>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 자동 갱신 설정 모달 -->
  <div id="autoRefreshModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">메뉴 자동 갱신 설정</div>
        <button class="close-btn" onclick="closeModal('autoRefreshModal')">&times;</button>
      </div>
      
      <div style="margin-bottom:20px;">
        <div class="checkbox-group">
          <input type="checkbox" id="autoRefreshEnabled" onchange="updateAutoRefreshSetting('enabled', this.checked)">
          <label for="autoRefreshEnabled">자동 갱신 활성화</label>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">갱신 시간</label>
        <input type="time" class="form-input" value="11:00" onchange="updateAutoRefreshSetting('time', this.value)">
      </div>
      
      <div class="form-group">
        <label class="form-label">갱신 요일</label>
        <div class="checkbox-group">
          <input type="checkbox" id="allDays" onchange="toggleAllDays(this.checked)">
          <label for="allDays">모든 요일</label>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px;">
          <?php foreach(['월', '화', '수', '목', '금'] as $day): ?>
          <div class="checkbox-group">
            <input type="checkbox" name="dayCheckbox" id="day<?= $day ?>" onchange="updateAutoRefreshSetting('days', '<?= $day ?>')">
            <label for="day<?= $day ?>"><?= $day ?></label>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
      
      <div class="modal-buttons">
        <button class="btn btn-secondary" onclick="closeModal('autoRefreshModal')">닫기</button>
        <button class="btn btn-primary" onclick="refreshMenus(); closeModal('autoRefreshModal');">지금 바로 갱신</button>
      </div>
    </div>
  </div>

  <!-- 메뉴 추가 모달 -->
  <div id="addMenuModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">메뉴 추가</div>
        <button class="close-btn" onclick="closeModal('addMenuModal')">&times;</button>
      </div>
      
      <form>
        <div class="form-group">
          <label class="form-label">메뉴 타입 *</label>
          <div style="display:flex; gap:16px;">
            <label><input type="radio" name="menuType" value="점심&저녁"> 점심&저녁</label>
            <label><input type="radio" name="menuType" value="점심" checked> 점심</label>
            <label><input type="radio" name="menuType" value="저녁"> 저녁</label>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">날짜 *</label>
          <input type="date" class="form-input" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">메인요리 *</label>
          <input type="text" class="form-input" placeholder="메인요리를 입력하세요" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">반찬 *</label>
          <input type="text" class="form-input" placeholder="반찬을 입력하세요" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">국물</label>
          <input type="text" class="form-input" placeholder="국물을 입력하세요">
        </div>
        
        <div class="form-group">
          <label class="form-label">알레르기 정보</label>
          <input type="text" class="form-input" placeholder="알레르기 정보를 입력하세요">
        </div>
        
        <div class="modal-buttons">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addMenuModal')">취소</button>
          <button type="submit" class="btn btn-primary" onclick="showAlert('메뉴 추가는 실제 동작하지 않습니다.'); closeModal('addMenuModal');">저장</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 파일 업로드 모달 -->
  <div id="uploadModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">주간메뉴 일괄 업로드</div>
        <button class="close-btn" onclick="closeModal('uploadModal')">&times;</button>
      </div>
      
      <div style="margin-bottom:20px;">
        <p style="color:#666; margin-bottom:12px;">엑셀 파일을 업로드하여 주간 메뉴를 일괄 등록할 수 있습니다.</p>
        <button class="btn btn-secondary" onclick="showAlert('템플릿 다운로드는 실제 동작하지 않습니다.')">템플릿 다운로드</button>
      </div>
      
      <form>
        <div class="form-group">
          <label class="form-label">엑셀 파일 선택 *</label>
          <input type="file" accept=".xlsx,.xls" class="form-input" style="padding:8px;">
        </div>
        
        <div class="modal-buttons">
          <button type="button" class="btn btn-secondary" onclick="closeModal('uploadModal')">취소</button>
          <button type="button" class="btn btn-primary" onclick="showAlert('파일 업로드는 실제 동작하지 않습니다.'); closeModal('uploadModal');">업로드</button>
        </div>
      </form>
    </div>
  </div>

  <script>
  // 사이드바 상태에 따라 메인 콘텐츠 여백 조정
  function updateMainContentMargin() {
      const sidebar = document.getElementById('sidebar');
      const mainContent = document.getElementById('mainContent');
      
      if (sidebar.classList.contains('collapsed')) {
          mainContent.classList.add('sidebar-collapsed');
      } else {
          mainContent.classList.remove('sidebar-collapsed');
      }
  }
  
  // 사이드바 토글 함수 재정의
  const originalToggleSidebar = window.toggleSidebar;
  window.toggleSidebar = function() {
      originalToggleSidebar();
      setTimeout(updateMainContentMargin, 300);
  };
  
  // 초기 로드 시 여백 설정
  document.addEventListener('DOMContentLoaded', function() {
      updateMainContentMargin();
  });
  </script>
</body>
</html> 