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

// 페이지 설정
$pageTitle = '대시보드';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

// 실시간 업데이트 기능
$inlineScript .= "
let updateInterval;
let lastUpdateTime = new Date();

function startRealTimeUpdates() {
  updateInterval = setInterval(updateDashboardData, 30000);
  showAlert('실시간 업데이트가 시작되었습니다.', 'info');
}

function stopRealTimeUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    showAlert('실시간 업데이트가 중지되었습니다.', 'warning');
  }
}

function updateDashboardData() {
  const cards = document.querySelectorAll('.card-value');
  cards.forEach((card, index) => {
    if (index === 0) {
      const currentValue = parseInt(card.textContent);
      const change = Math.floor(Math.random() * 10) - 5;
      card.textContent = Math.max(0, currentValue + change);
    } else if (index === 3) {
      const currentText = card.textContent;
      const values = currentText.split(' / ').map(v => parseInt(v));
      const newValues = values.map(v => Math.max(0, v + Math.floor(Math.random() * 3) - 1));
      card.textContent = `${newValues[0]} / ${newValues[1]}`;
    }
  });
  
  const qrCount = document.querySelector('.qr-section span');
  if (qrCount) {
    const currentCount = parseInt(qrCount.textContent);
    const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
    qrCount.textContent = newCount + '명';
  }
  
  const now = new Date();
  lastUpdateTime = now;
  updateLastUpdateTime();
  
  if (Math.random() > 0.7) {
    showAlert('새로운 예약이 등록되었습니다.', 'success');
  }
}

function updateLastUpdateTime() {
  const timeElement = document.getElementById('lastUpdateTime');
  if (timeElement) {
    timeElement.textContent = lastUpdateTime.toLocaleTimeString();
  }
}

function openQRModal() {
  openModal('qrModal');
}

// 페이지 초기화
function initPage() {
  startRealTimeUpdates();
  updateLastUpdateTime();
  
  window.addEventListener('beforeunload', stopRealTimeUpdates);
}
";

include 'includes/header.php';
?>

<?php include 'sidebar.php'; ?>

<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar">
      <h1>대시보드</h1>
      <div class="flex items-center gap-3">
        <div class="text-sm text-muted">
          마지막 업데이트: <span id="lastUpdateTime"><?= date('H:i:s') ?></span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="updateDashboardData()">
          <i class="fas fa-sync-alt"></i> 새로고침
        </button>
      </div>
    </div>
    
    <form method="get" class="mb-4">
      <label class="form-label">기간:</label>
      <select name="period" class="form-select" style="width: auto;" onchange="this.form.submit()">
        <option value="today" <?= $statsPeriod==='today'?'selected':'' ?>>오늘</option>
        <option value="week" <?= $statsPeriod==='week'?'selected':'' ?>>주간</option>
        <option value="month" <?= $statsPeriod==='month'?'selected':'' ?>>월간</option>
      </select>
    </form>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card">
        <div class="card-body">
          <div class="text-sm text-muted mb-2">총 예약자</div>
          <div class="text-3xl font-bold text-primary"><?= number_format($stat['total']) ?>명</div>
          <div class="text-xs text-muted">점심 <?= $stat['lunch'] ?>명 / 저녁 <?= $stat['dinner'] ?>명</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="text-sm text-muted mb-2">QR 제출</div>
          <div class="text-3xl font-bold text-success"><?= number_format($stat['qrLunch'] + $stat['qrDinner']) ?>명</div>
          <div class="text-xs text-muted">점심 <?= $stat['qrLunch'] ?>명 / 저녁 <?= $stat['qrDinner'] ?>명</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="text-sm text-muted mb-2">QR 미제출</div>
          <div class="text-3xl font-bold text-warning"><?= number_format(($stat['lunch'] - $stat['qrLunch']) + ($stat['dinner'] - $stat['qrDinner'])) ?>명</div>
          <div class="text-xs text-muted">점심 <?= $stat['lunch'] - $stat['qrLunch'] ?>명 / 저녁 <?= $stat['dinner'] - $stat['qrDinner'] ?>명</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="text-sm text-muted mb-2">무임승차</div>
          <div class="text-3xl font-bold text-danger"><?= $stat['freeRiderLunch'] ?> / <?= $stat['freeRiderDinner'] ?></div>
          <div class="text-xs text-muted">점심 / 저녁</div>
        </div>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="text-lg font-semibold">QR 미제출자 현황</h3>
      </div>
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-warning">총 <span><?= count($notSubmitted) ?></span>명</span>
          <button class="btn btn-primary" onclick="openQRModal()">
            <i class="fas fa-qrcode"></i> QR 코드 생성
          </button>
        </div>
        
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>부서</th>
                <th>이름</th>
                <th>식사</th>
                <th>시간</th>
                <th>미제출 횟수</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($notSubmitted as $user): ?>
              <tr>
                <td><?= htmlspecialchars($user['department']) ?></td>
                <td><?= htmlspecialchars($user['name']) ?></td>
                <td>
                  <span class="px-2 py-1 rounded text-xs <?= $user['meal'] === '점심' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800' ?>">
                    <?= htmlspecialchars($user['meal']) ?>
                  </span>
                </td>
                <td><?= htmlspecialchars($user['time']) ?></td>
                <td>
                  <span class="font-semibold text-danger"><?= $user['count'] ?>회</span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="sendReminder('<?= htmlspecialchars($user['name']) ?>')">
                    <i class="fas fa-bell"></i> 알림
                  </button>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">최근 활동</h3>
        </div>
        <div class="card-body">
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">김철수님이 QR를 제출했습니다</div>
                <div class="text-xs text-muted">2분 전</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">새로운 예약이 등록되었습니다</div>
                <div class="text-xs text-muted">5분 전</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">이영희님이 QR 미제출 알림을 받았습니다</div>
                <div class="text-xs text-muted">10분 전</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">빠른 작업</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 gap-3">
            <button class="btn btn-primary" onclick="location.href='users.php'">
              <i class="fas fa-users"></i> 사용자 관리
            </button>
            <button class="btn btn-secondary" onclick="location.href='menu.php'">
              <i class="fas fa-utensils"></i> 메뉴 관리
            </button>
            <button class="btn btn-success" onclick="location.href='reservations.php'">
              <i class="fas fa-calendar"></i> 예약 관리
            </button>
            <button class="btn btn-warning" onclick="location.href='qr.php'">
              <i class="fas fa-qrcode"></i> QR 관리
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- QR 코드 모달 -->
<div id="qrModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">QR 코드 생성</h3>
      <button class="close-btn" onclick="closeModal('qrModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div class="text-center">
        <div class="mb-4">
          <div class="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center rounded">
            <div class="text-center">
              <i class="fas fa-qrcode text-6xl text-gray-400"></i>
              <div class="text-sm text-muted mt-2">QR 코드 이미지</div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="text-sm text-muted mb-2">QR 코드 URL</div>
          <div class="p-3 bg-gray-100 rounded text-sm font-mono">https://example.com/qr/12345</div>
        </div>
        <div class="flex gap-2 justify-center">
          <button class="btn btn-primary" onclick="downloadQR()">
            <i class="fas fa-download"></i> 다운로드
          </button>
          <button class="btn btn-secondary" onclick="copyQRUrl()">
            <i class="fas fa-copy"></i> URL 복사
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function sendReminder(name) {
  showConfirm(`${name}님에게 QR 제출 알림을 보내시겠습니까?`, function() {
    showAlert(`${name}님에게 알림이 전송되었습니다.`, 'success');
  });
}

function downloadQR() {
  showAlert('QR 코드가 다운로드되었습니다.', 'success');
}

function copyQRUrl() {
  navigator.clipboard.writeText('https://example.com/qr/12345').then(function() {
    showAlert('QR 코드 URL이 클립보드에 복사되었습니다.', 'success');
  });
}
</script>

<?php include 'includes/footer.php'; ?> 