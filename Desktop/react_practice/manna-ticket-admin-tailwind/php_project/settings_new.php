<?php
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

$pageTitle = '설정';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container">
    <div class="page-header mb-6">
      <h1>설정</h1>
      <p class="text-muted">시스템 설정을 관리합니다.</p>
    </div>
    
    <form id="settingsForm">
      <!-- 시스템 설정 -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="text-lg font-semibold">시스템 설정</h3>
        </div>
        <div class="card-body">
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
                  <input type="number" class="form-input form-input-small" value="<?= htmlspecialchars($setting['value']) ?>">
                  <span class="unit"><?= htmlspecialchars($setting['unit']) ?></span>
                <?php else: ?>
                  <input type="<?= $setting['type'] ?>" class="form-input form-input-medium" value="<?= htmlspecialchars($setting['value']) ?>">
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
      
      <!-- 알림 설정 -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="text-lg font-semibold">알림 설정</h3>
        </div>
        <div class="card-body">
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
      </div>
      
      <!-- 예약 설정 -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="text-lg font-semibold">예약 설정</h3>
        </div>
        <div class="card-body">
          <?php foreach ($settings['reservation'] as $setting): ?>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name"><?= htmlspecialchars($setting['name']) ?></div>
                <div class="setting-description">예약 관련 설정입니다.</div>
              </div>
              <div class="setting-control">
                <?php if ($setting['type'] === 'number'): ?>
                  <input type="number" class="form-input form-input-small" value="<?= htmlspecialchars($setting['value']) ?>">
                  <span class="unit"><?= htmlspecialchars($setting['unit']) ?></span>
                <?php else: ?>
                  <input type="<?= $setting['type'] ?>" class="form-input form-input-small" value="<?= htmlspecialchars($setting['value']) ?>">
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
      
      <div class="flex gap-3 justify-end">
        <button type="button" class="btn btn-secondary" onclick="resetSettings()">
          <i class="fas fa-undo"></i> 초기화
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> 설정 저장
        </button>
      </div>
    </form>
  </div>
</div>

<script>
function resetSettings() {
  if (confirm('모든 설정을 초기값으로 되돌리시겠습니까?')) {
    showAlert('설정이 초기화되었습니다.', 'success');
  }
}

// 폼 제출 처리
document.getElementById('settingsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  showAlert('설정이 저장되었습니다.', 'success');
});
</script>

<?php include 'includes/footer.php'; ?> 