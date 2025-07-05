<?php
$weekMenus = [
  [ 'day'=>'월', 'date'=>'2024-01-15', 'lunch'=>[ 'main'=>'소불고기', 'type'=>'한식', 'sides'=>'밥, 계란말이 외' ], 'dinner'=>[ 'main'=>'치킨까스', 'type'=>'양식', 'sides'=>'밥, 샐러드 외' ] ],
  [ 'day'=>'화', 'date'=>'2024-01-16', 'lunch'=>[ 'main'=>'짜장덮밥', 'type'=>'중식', 'sides'=>'단무지, 양파 외' ], 'dinner'=>[ 'main'=>'제육볶음', 'type'=>'한식', 'sides'=>'밥, 콩나물 외' ] ],
  [ 'day'=>'수', 'date'=>'2024-01-17', 'lunch'=>[ 'main'=>'돈까스', 'type'=>'일식', 'sides'=>'밥, 미소시루 외' ], 'dinner'=>[ 'main'=>'스파게티', 'type'=>'양식', 'sides'=>'마늘빵, 샐러드' ] ],
  [ 'day'=>'목', 'date'=>'2024-01-18', 'lunch'=>[ 'main'=>'갈비찜', 'type'=>'한식', 'sides'=>'밥, 나물 외' ], 'dinner'=>[ 'main'=>'탕수육', 'type'=>'중식', 'sides'=>'밥, 짜장 외' ] ],
  [ 'day'=>'금', 'date'=>'2024-01-19', 'lunch'=>[ 'main'=>'함박스테이크', 'type'=>'양식', 'sides'=>'밥, 감자 외' ], 'dinner'=>[ 'main'=>'김치찌개', 'type'=>'한식', 'sides'=>'밥, 계란말이 외' ] ],
];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>주간 메뉴</title>
  <style>
    body { font-family: 'Pretendard', sans-serif; background: #f7f8fa; margin:0; }
    .container { max-width: 900px; margin: 0 auto; padding: 32px 8px; }
    .tab-menu { display:flex; gap:4px; margin-bottom:24px; }
    .tab-btn { flex:1 1 120px; min-width:120px; padding:12px 0; border-radius:8px; border:1px solid #eee; background:#fff; color:#888; font-weight:bold; cursor:pointer; transition:0.2s; }
    .tab-btn.active { background:#3182f6; color:#fff; border-color:#3182f6; }
    .btn { padding:6px 14px; border-radius:6px; border:none; font-weight:bold; cursor:pointer; margin:0 2px; }
    .btn-add { background:#3182f6; color:#fff; }
    .btn-upload, .btn-download { background:#fff; color:#3182f6; border:1px solid #3182f6; }
    .menu-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; overflow:hidden; margin-bottom:24px; }
    .menu-table th, .menu-table td { border:1px solid #eee; padding:10px 8px; text-align:center; }
    .menu-table th { background:#f7f8fa; color:#333; font-weight:bold; }
    .menu-table td { color:#444; }
    .auto-refresh-status { background:#d4edda; border:1px solid #c3e6cb; border-radius:8px; padding:12px; margin-bottom:16px; }
    .auto-refresh-status.enabled { background:#d4edda; border-color:#c3e6cb; }
    .auto-refresh-status.disabled { background:#f8d7da; border-color:#f5c6cb; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
    
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
    
    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', function() {
      loadAutoRefreshSettings();
      startAutoRefresh();
    });
    
    // 페이지 떠날 때 정리
    window.addEventListener('beforeunload', function() {
      stopAutoRefresh();
    });
  </script>
</head>
<body>
  <div class="container">
    <h1 style="font-size:2rem; font-weight:bold; margin-bottom:16px;">주간 메뉴</h1>
    <div class="tab-menu">
      <a href="menu_today.php"><button class="tab-btn">오늘 메뉴</button></a>
      <a href="menu_week.php"><button class="tab-btn active">주간 메뉴</button></a>
      <a href="menu.php"><button class="tab-btn">통합 보기</button></a>
    </div>
    <div id="autoRefreshStatus" class="auto-refresh-status disabled"></div>
    <div style="margin-bottom:16px;">
      <button class="btn btn-add" onclick="showAlert('메뉴 추가/수정/삭제는 실제 동작하지 않습니다.')">메뉴 추가</button>
      <button class="btn btn-upload" onclick="showAlert('엑셀 업로드는 실제 동작하지 않습니다.')">엑셀 업로드</button>
      <button class="btn btn-download" onclick="showAlert('엑셀 다운로드는 실제 동작하지 않습니다.')">엑셀 다운로드</button>
      <button class="btn btn-edit" onclick="showAlert('주간 메뉴 복사는 실제 동작하지 않습니다.')">주간 복사</button>
      <button class="btn btn-edit" onclick="showAlert('영양 분석은 실제 동작하지 않습니다.')">영양 분석</button>
      <button class="btn btn-edit" onclick="showAlert('메뉴 평가는 실제 동작하지 않습니다.')">메뉴 평가</button>
    </div>
    <table class="menu-table">
      <tr><th>요일</th><th>날짜</th><th>점심(종류/메인/반찬)</th><th>저녁(종류/메인/반찬)</th><th>작업</th></tr>
      <?php foreach($weekMenus as $row): ?>
      <tr>
        <td><?= htmlspecialchars($row['day']) ?></td>
        <td><?= htmlspecialchars($row['date']) ?></td>
        <td><?= htmlspecialchars($row['lunch']['type']) ?>/<?= htmlspecialchars($row['lunch']['main']) ?>/<?= htmlspecialchars($row['lunch']['sides']) ?></td>
        <td><?= htmlspecialchars($row['dinner']['type']) ?>/<?= htmlspecialchars($row['dinner']['main']) ?>/<?= htmlspecialchars($row['dinner']['sides']) ?></td>
        <td>
          <button class="btn btn-edit" onclick="showAlert('수정(실제 동작 아님)')">수정</button>
          <button class="btn btn-del" onclick="showAlert('삭제(실제 동작 아님)')">삭제</button>
          <button class="btn btn-edit" onclick="showAlert('상세보기(실제 동작 아님)')">상세</button>
          <button class="btn btn-edit" onclick="showAlert('복사(실제 동작 아님)')">복사</button>
        </td>
      </tr>
      <?php endforeach; ?>
    </table>
  </div>
</body>
</html> 