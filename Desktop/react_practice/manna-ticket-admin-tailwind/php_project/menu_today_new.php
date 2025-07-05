<?php
// 임시 오늘 메뉴 데이터
$todayMenus = [
  [ 'type'=>'점심', 'date'=>'2024-01-15', 'main'=>'소불고기', 'sides'=>'밥, 계란말이, 시금치나물, 김치', 'soup'=>'국', 'allergy'=>'대두, 계란' ],
  [ 'type'=>'저녁', 'date'=>'2024-01-15', 'main'=>'치킨까스', 'sides'=>'밥, 샐러드, 감자튀김', 'soup'=>'스프', 'allergy'=>'밀, 계란, 우유' ],
];

$pageTitle = '오늘 메뉴';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container-sm">
    <div class="top-bar mb-6">
      <h1>오늘 메뉴</h1>
      <button class="btn btn-primary" onclick="openModal('addModal')">
        <i class="fas fa-plus"></i> 메뉴 추가
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <?php foreach($todayMenus as $menu): ?>
      <div class="card">
        <div class="card-header flex items-center gap-2">
          <i class="fas fa-utensils"></i>
          <span class="font-bold text-lg"><?= $menu['type'] ?></span>
        </div>
        <div class="card-body">
          <div class="text-xs text-muted mb-2"><?= $menu['date'] ?></div>
          <div class="mb-2">
            <div class="text-muted text-sm font-medium">메인요리</div>
            <div class="text-xl font-bold text-primary"><?= $menu['main'] ?></div>
          </div>
          <div class="mb-2">
            <div class="text-muted text-sm font-medium">반찬</div>
            <div class="text-primary"><?= $menu['sides'] ?></div>
          </div>
          <div class="mb-2">
            <div class="text-muted text-sm font-medium">국물</div>
            <div class="text-primary"><?= $menu['soup'] ?></div>
          </div>
          <div class="flex justify-between text-sm mt-4">
            <span>알레르기: <?= $menu['allergy'] ?></span>
          </div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>
<!-- 메뉴 추가 모달 예시 (실제 동작 X) -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">오늘 메뉴 추가</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">메뉴 타입 *</label>
          <select class="form-select" required>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">날짜 *</label>
          <input type="date" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">메인요리 *</label>
          <input type="text" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">반찬 *</label>
          <input type="text" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">국물</label>
          <input type="text" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">알레르기 정보</label>
          <input type="text" class="form-input">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('메뉴가 추가되었습니다.', 'success'); closeModal('addModal');">추가</button>
    </div>
  </div>
</div>
<?php include 'includes/footer.php'; ?> 