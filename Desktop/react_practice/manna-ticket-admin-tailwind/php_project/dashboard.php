<?php
// 임시 데이터 (실제 DB 연동 시 교체)
$statsPeriod = isset($_GET['period']) ? $_GET['period'] : 'today';
$statData = [
  'today' => [
    'total' => 200, 'lunch' => 120, 'dinner' => 80, 'qrLunch' => 110, 'qrDinner' => 70, 'freeRiderLunch' => 5, 'freeRiderDinner' => 2
  ],
  'week' => [
    'total' => 1200, 'lunch' => 700, 'dinner' => 500, 'qrLunch' => 650, 'qrDinner' => 430, 'freeRiderLunch' => 18, 'freeRiderDinner' => 7
  ],
  'month' => [
    'total' => 4800, 'lunch' => 2800, 'dinner' => 2000, 'qrLunch' => 2600, 'qrDinner' => 1800, 'freeRiderLunch' => 60, 'freeRiderDinner' => 22
  ]
];
$stat = $statData[$statsPeriod];
$notSubmitted = [
  [ 'department' => '개발팀', 'name' => '김철수', 'meal' => '저녁', 'time' => '18:00', 'count' => 3 ],
  [ 'department' => '디자인팀', 'name' => '이영희', 'meal' => '점심', 'time' => '12:00', 'count' => 1 ],
  [ 'department' => '기획팀', 'name' => '박민수', 'meal' => '저녁', 'time' => '18:00', 'count' => 2 ],
];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>대시보드</title>
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
    .container { max-width: 900px; margin: 0 auto; padding: 32px 8px; }
    .summary-cards { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 24px; flex: 1 1 200px; min-width: 180px; }
    .card-title { color: #888; font-size: 13px; margin-bottom: 8px; }
    .card-value { font-size: 2rem; font-weight: bold; color: #222; }
    .card-desc { font-size: 12px; color: #888; }
    .period-select { margin-bottom: 24px; }
    .qr-section { background: linear-gradient(90deg,#fff7ec,#fff); border-left: 4px solid orange; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .qr-modal-bg { position: fixed; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:none; align-items:center; justify-content:center; z-index:100; }
    .qr-modal { background:#fff; border-radius:12px; box-shadow:0 2px 16px #0003; padding:24px; min-width:320px; max-width:90vw; }
    .qr-table { width:100%; border-collapse:collapse; margin-top:12px; }
    .qr-table th, .qr-table td { border:1px solid #eee; padding:8px 12px; text-align:center; }
    .close-btn { float:right; font-size:20px; color:#888; background:none; border:none; cursor:pointer; }
    @media (max-width:600px) { .summary-cards { flex-direction:column; } .qr-section { flex-direction:column; gap:12px; } }
  </style>
  <script>
    function openQRModal() {
      document.getElementById('qrModalBg').style.display = 'flex';
    }
    function closeQRModal() {
      document.getElementById('qrModalBg').style.display = 'none';
    }
    
    // 실시간 업데이트 기능
    let updateInterval;
    let lastUpdateTime = new Date();
    
    function startRealTimeUpdates() {
      // 30초마다 데이터 업데이트
      updateInterval = setInterval(updateDashboardData, 30000);
      
      // 실시간 알림 표시
      showRealTimeNotification('실시간 업데이트가 시작되었습니다.');
    }
    
    function stopRealTimeUpdates() {
      if (updateInterval) {
        clearInterval(updateInterval);
        showRealTimeNotification('실시간 업데이트가 중지되었습니다.');
      }
    }
    
    function updateDashboardData() {
      // 실제 구현에서는 AJAX로 서버에서 최신 데이터를 가져옴
      // 여기서는 시뮬레이션으로 랜덤하게 데이터 변경
      const cards = document.querySelectorAll('.card-value');
      cards.forEach((card, index) => {
        if (index === 0) { // 총 예약자
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 10) - 5; // -5 ~ +5
          card.textContent = Math.max(0, currentValue + change);
        } else if (index === 3) { // 무임승차
          const currentText = card.textContent;
          const values = currentText.split(' / ').map(v => parseInt(v));
          const newValues = values.map(v => Math.max(0, v + Math.floor(Math.random() * 3) - 1));
          card.textContent = `${newValues[0]} / ${newValues[1]}`;
        }
      });
      
      // QR 미제출자 수 업데이트
      const qrCount = document.querySelector('.qr-section span');
      if (qrCount) {
        const currentCount = parseInt(qrCount.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        qrCount.textContent = newCount + '명';
      }
      
      // 업데이트 시간 표시
      const now = new Date();
      lastUpdateTime = now;
      updateLastUpdateTime();
      
      // 변경사항이 있을 때 알림
      if (Math.random() > 0.7) { // 30% 확률로 알림
        showRealTimeNotification('새로운 예약이 등록되었습니다.');
      }
    }
    
    function updateLastUpdateTime() {
      const timeElement = document.getElementById('lastUpdateTime');
      if (timeElement) {
        timeElement.textContent = lastUpdateTime.toLocaleTimeString();
      }
    }
    
    function showRealTimeNotification(message) {
      // 알림 요소 생성
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3182f6;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      `;
      notification.textContent = message;
      
      // CSS 애니메이션 추가
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // 3초 후 자동 제거
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
    
    // 페이지 로드 시 실시간 업데이트 시작
    document.addEventListener('DOMContentLoaded', function() {
      startRealTimeUpdates();
      updateLastUpdateTime();
      
      // 페이지 떠날 때 업데이트 중지
      window.addEventListener('beforeunload', stopRealTimeUpdates);
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h1 style="font-size:2rem; font-weight:bold;">대시보드</h1>
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="font-size:12px; color:#888;">
          마지막 업데이트: <span id="lastUpdateTime"><?= date('H:i:s') ?></span>
        </div>
        <button onclick="updateDashboardData()" style="padding:6px 12px; border-radius:6px; border:1px solid #3182f6; background:#fff; color:#3182f6; font-size:12px; cursor:pointer;">새로고침</button>
      </div>
    </div>
    <form method="get" class="period-select">
      <label>기간:
        <select name="period" onchange="this.form.submit()">
          <option value="today" <?= $statsPeriod==='today'?'selected':'' ?>>오늘</option>
          <option value="week" <?= $statsPeriod==='week'?'selected':'' ?>>주간</option>
          <option value="month" <?= $statsPeriod==='month'?'selected':'' ?>>월간</option>
        </select>
      </label>
    </form>
    <div class="summary-cards">
      <div class="card">
        <div class="card-title">총 예약자</div>
        <div class="card-value"><?= $stat['total'] ?></div>
        <div class="card-desc"><?= $statsPeriod==='today'?'오늘 전체 예약자':($statsPeriod==='week'?'이번 주 전체 예약자':'이번 달 전체 예약자') ?></div>
      </div>
      <div class="card">
        <div class="card-title">점심/저녁 예약자</div>
        <div class="card-value"><?= $stat['lunch'] ?> / <?= $stat['dinner'] ?></div>
        <div class="card-desc">점심 / 저녁</div>
      </div>
      <div class="card">
        <div class="card-title">QR 제출자(점심/저녁)</div>
        <div class="card-value"><?= $stat['qrLunch'] ?> / <?= $stat['qrDinner'] ?></div>
        <div class="card-desc">점심 / 저녁 QR</div>
      </div>
      <div class="card">
        <div class="card-title">무임승차(점심/저녁)</div>
        <div class="card-value" style="color:#f66570;">
          <?= $stat['freeRiderLunch'] ?> / <?= $stat['freeRiderDinner'] ?>
        </div>
        <div class="card-desc">점심 / 저녁 무임승차</div>
      </div>
    </div>
    <div class="qr-section">
      <div>
        <div style="font-weight:bold; font-size:1.1rem;">QR 미제출자 <span style="color:#f66570; font-size:1.3rem; font-weight:bold;">8명</span></div>
        <div style="font-size:12px; color:#888;">오늘 식사 예약 중 QR 미제출 / 식사 예약을 하지 않고 QR코드 제출한 사용자</div>
      </div>
      <button onclick="openQRModal()" style="padding:8px 20px; border-radius:8px; border:1px solid orange; background:#fff; color:orange; font-weight:bold; cursor:pointer;">미제출자 확인</button>
    </div>
    <!-- 차트는 간단 표로 대체 -->
    <div class="card" style="margin-bottom:24px;">
      <div class="card-title">예약/QR 현황 (<?= $statsPeriod==='today'?'오늘':($statsPeriod==='week'?'이번 주':'이번 달') ?>)</div>
      <table style="width:100%; border-collapse:collapse;">
        <tr style="background:#f7f8fa;"><th>구분</th><th>예약자</th><th>QR 제출</th></tr>
        <tr><td>점심</td><td><?= $stat['lunch'] ?></td><td><?= $stat['qrLunch'] ?></td></tr>
        <tr><td>저녁</td><td><?= $stat['dinner'] ?></td><td><?= $stat['qrDinner'] ?></td></tr>
      </table>
    </div>
  </div>
  <!-- QR 미제출자 모달 -->
  <div class="qr-modal-bg" id="qrModalBg">
    <div class="qr-modal">
      <button class="close-btn" onclick="closeQRModal()">&times;</button>
      <h2 style="margin-bottom:8px;">QR 미제출자 명단</h2>
      <table class="qr-table">
        <tr><th>부서</th><th>이름</th><th>예약시간</th><th>미제출 횟수</th></tr>
        <?php foreach($notSubmitted as $row): ?>
        <tr>
          <td><?= htmlspecialchars($row['department']) ?></td>
          <td><?= htmlspecialchars($row['name']) ?></td>
          <td><?= htmlspecialchars($row['meal'].' '.$row['time']) ?></td>
          <td><?= htmlspecialchars($row['count']) ?>회</td>
        </tr>
        <?php endforeach; ?>
      </table>
      <div style="text-align:right; margin-top:12px;">
        <button onclick="closeQRModal()" style="padding:6px 18px; border-radius:8px; border:1px solid #ccc; background:#fff; color:#333; cursor:pointer;">닫기</button>
      </div>
    </div>
        </div>
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
      setTimeout(updateMainContentMargin, 300); // 애니메이션 완료 후 여백 조정
  };
  
  // 초기 로드 시 여백 설정
  document.addEventListener('DOMContentLoaded', function() {
      updateMainContentMargin();
  });
  </script>
</body>
</html> 