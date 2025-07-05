<?php
$tab = isset($_GET['tab']) ? intval($_GET['tab']) : 0;
$siteName = '만나식권';
$adminEmail = 'admin@example.com';
$autoRefresh = true;
$refreshInterval = 30;
$apiBaseUrl = 'http://api.example.com';
$apiEndpoints = [
  [ 'name' => '로그인', 'method' => 'POST', 'path' => '/auth/login', 'status' => 'success' ],
  [ 'name' => '사용자 정보', 'method' => 'GET', 'path' => '/users', 'status' => 'success' ],
  [ 'name' => '예약 관리', 'method' => 'GET/POST', 'path' => '/reservations', 'status' => 'success' ],
  [ 'name' => '공지사항', 'method' => 'GET/POST', 'path' => '/notices', 'status' => 'fail' ],
  [ 'name' => '식단 관리', 'method' => 'GET/POST', 'path' => '/menus', 'status' => 'success' ],
];
$systemVersion = 'v1.0.0';
$minVersion = '5호';
$maxCalls = '1회';
$lastUpdate = '2024. 5. 29';
$retryInterval = '5분';

// 설정 데이터
$settings = [
    'system' => [
        ['name' => '사이트 제목', 'value' => '만나식권 관리자', 'type' => 'text'],
        ['name' => '관리자 이메일', 'value' => 'admin@manna.com', 'type' => 'email'],
        ['name' => '자동 로그아웃 시간', 'value' => '30', 'type' => 'number', 'unit' => '분'],
        ['name' => '실시간 업데이트', 'value' => 'true', 'type' => 'toggle'],
    ],
    'notification' => [
        ['name' => '이메일 알림', 'value' => 'true', 'type' => 'toggle'],
        ['name' => 'SMS 알림', 'value' => 'false', 'type' => 'toggle'],
        ['name' => '브라우저 알림', 'value' => 'true', 'type' => 'toggle'],
        ['name' => '알림 소리', 'value' => 'true', 'type' => 'toggle'],
    ],
    'reservation' => [
        ['name' => '예약 마감 시간', 'value' => '18:00', 'type' => 'time'],
        ['name' => '최대 예약 인원', 'value' => '100', 'type' => 'number', 'unit' => '명'],
        ['name' => 'QR 제출 마감 시간', 'value' => '20:00', 'type' => 'time'],
        ['name' => '자동 취소 시간', 'value' => '15', 'type' => 'number', 'unit' => '분'],
    ]
];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>설정</title>
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
    .container { max-width: 800px; margin: 0 auto; padding: 32px 8px; }
    .header { margin-bottom: 32px; }
    .settings-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
    .section-title { font-size: 1.25rem; font-weight: 600; color: #374151; margin-bottom: 20px; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; }
    .setting-item:last-child { border-bottom: none; }
    .setting-info { flex: 1; }
    .setting-name { font-weight: 500; color: #374151; margin-bottom: 4px; }
    .setting-description { font-size: 0.875rem; color: #6b7280; }
    .setting-control { display: flex; align-items: center; gap: 8px; }
    .form-input { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
    .form-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.3s; border-radius: 24px; }
    .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: #2563eb; }
    input:checked + .toggle-slider:before { transform: translateX(20px); }
    .btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 500; cursor: pointer; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-secondary { background: white; color: #374151; border: 1px solid #d1d5db; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .unit { color: #6b7280; font-size: 0.875rem; margin-left: 4px; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
      <div class="header">
        <h1 style="font-size: 2rem; font-weight: bold; margin: 0 0 8px 0;">설정</h1>
        <p style="color: #6b7280; margin: 0;">시스템 설정을 관리합니다.</p>
      </div>
      
      <form id="settingsForm">
        <!-- 시스템 설정 -->
        <div class="settings-section">
          <h2 class="section-title">시스템 설정</h2>
          <?php foreach ($settings['system'] as $setting): ?>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name"><?= htmlspecialchars($setting['name']) ?></div>
                <div class="setting-description">시스템 기본 설정입니다.</div>
              </div>
              <div class="setting-control">
                <?php if ($setting['type'] === 'toggle'): ?>
                  <label class="toggle-switch">
                    <input type="checkbox" <?= $setting['value'] === 'true' ? 'checked' : '' ?>>
                    <span class="toggle-slider"></span>
                  </label>
                <?php elseif ($setting['type'] === 'number'): ?>
                  <input type="number" class="form-input" value="<?= htmlspecialchars($setting['value']) ?>" style="width: 80px;">
                  <span class="unit"><?= htmlspecialchars($setting['unit']) ?></span>
                <?php else: ?>
                  <input type="<?= $setting['type'] ?>" class="form-input" value="<?= htmlspecialchars($setting['value']) ?>" style="width: 200px;">
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        
        <!-- 알림 설정 -->
        <div class="settings-section">
          <h2 class="section-title">알림 설정</h2>
          <?php foreach ($settings['notification'] as $setting): ?>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name"><?= htmlspecialchars($setting['name']) ?></div>
                <div class="setting-description">알림 관련 설정입니다.</div>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" <?= $setting['value'] === 'true' ? 'checked' : '' ?>>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        
        <!-- 예약 설정 -->
        <div class="settings-section">
          <h2 class="section-title">예약 설정</h2>
          <?php foreach ($settings['reservation'] as $setting): ?>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name"><?= htmlspecialchars($setting['name']) ?></div>
                <div class="setting-description">예약 관련 설정입니다.</div>
              </div>
              <div class="setting-control">
                <?php if ($setting['type'] === 'number'): ?>
                  <input type="number" class="form-input" value="<?= htmlspecialchars($setting['value']) ?>" style="width: 80px;">
                  <span class="unit"><?= htmlspecialchars($setting['unit']) ?></span>
                <?php else: ?>
                  <input type="<?= $setting['type'] ?>" class="form-input" value="<?= htmlspecialchars($setting['value']) ?>" style="width: 100px;">
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        
        <div class="actions">
          <button type="button" class="btn btn-secondary" onclick="resetSettings()">초기화</button>
          <button type="submit" class="btn btn-primary">설정 저장</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function resetSettings() {
      if (confirm('모든 설정을 초기값으로 되돌리시겠습니까?')) {
        alert('설정 초기화 기능은 실제 동작하지 않습니다.');
      }
    }
    
    // 폼 제출 처리
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('설정 저장 기능은 실제 동작하지 않습니다.');
    });
    
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