<?php
// 임시 주간 메뉴 데이터
$weekMenus = [
  [ 'day'=>'월', 'date'=>'2024-01-15', 'lunch'=>['main'=>'소불고기', 'type'=>'한식', 'sides'=>'밥, 계란말이, 시금치나물'], 'dinner'=>['main'=>'치킨까스', 'type'=>'양식', 'sides'=>'밥, 샐러드, 감자튀김'] ],
  [ 'day'=>'화', 'date'=>'2024-01-16', 'lunch'=>['main'=>'짜장덮밥', 'type'=>'중식', 'sides'=>'단무지, 양파'], 'dinner'=>['main'=>'제육볶음', 'type'=>'한식', 'sides'=>'밥, 콩나물'] ],
  [ 'day'=>'수', 'date'=>'2024-01-17', 'lunch'=>['main'=>'돈까스', 'type'=>'일식', 'sides'=>'밥, 미소시루'], 'dinner'=>['main'=>'스파게티', 'type'=>'양식', 'sides'=>'마늘빵, 샐러드'] ],
  [ 'day'=>'목', 'date'=>'2024-01-18', 'lunch'=>['main'=>'갈비찜', 'type'=>'한식', 'sides'=>'밥, 나물'], 'dinner'=>['main'=>'탕수육', 'type'=>'중식', 'sides'=>'밥, 짜장'] ],
  [ 'day'=>'금', 'date'=>'2024-01-19', 'lunch'=>['main'=>'함박스테이크', 'type'=>'양식', 'sides'=>'밥, 감자'], 'dinner'=>['main'=>'김치찌개', 'type'=>'한식', 'sides'=>'밥, 계란말이'] ],
];

$pageTitle = '주간 메뉴';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container-sm">
    <div class="top-bar mb-6">
      <h1>주간 메뉴</h1>
      <button class="btn btn-primary" onclick="openModal('editModal')">
        <i class="fas fa-pen-to-square"></i> 주간 메뉴 편집
      </button>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold">주간 식단표</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>요일</th>
                <th>날짜</th>
                <th>점심 메뉴</th>
                <th>저녁 메뉴</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($weekMenus as $row): ?>
              <tr>
                <td class="font-bold text-primary text-center"><?= $row['day'] ?></td>
                <td class="text-center text-muted"><?= $row['date'] ?></td>
                <td>
                  <div class="font-bold text-primary"><?= $row['lunch']['main'] ?></div>
                  <div class="text-xs text-muted">종류: <?= $row['lunch']['type'] ?></div>
                  <div class="text-xs text-muted">반찬: <?= $row['lunch']['sides'] ?></div>
                </td>
                <td>
                  <div class="font-bold text-primary"><?= $row['dinner']['main'] ?></div>
                  <div class="text-xs text-muted">종류: <?= $row['dinner']['type'] ?></div>
                  <div class="text-xs text-muted">반찬: <?= $row['dinner']['sides'] ?></div>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 주간 메뉴 편집 모달 예시 (실제 동작 X) -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">주간 메뉴 편집</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <?php foreach($weekMenus as $row): ?>
          <div class="border rounded p-4 mb-2">
            <div class="font-bold mb-2"><?= $row['day'] ?> (<?= $row['date'] ?>)</div>
            <div class="form-group">
              <label class="form-label">점심 메인요리 *</label>
              <input type="text" class="form-input" value="<?= $row['lunch']['main'] ?>">
            </div>
            <div class="form-group">
              <label class="form-label">점심 종류 *</label>
              <input type="text" class="form-input" value="<?= $row['lunch']['type'] ?>">
            </div>
            <div class="form-group">
              <label class="form-label">점심 반찬 *</label>
              <input type="text" class="form-input" value="<?= $row['lunch']['sides'] ?>">
            </div>
            <div class="form-group">
              <label class="form-label">저녁 메인요리 *</label>
              <input type="text" class="form-input" value="<?= $row['dinner']['main'] ?>">
            </div>
            <div class="form-group">
              <label class="form-label">저녁 종류 *</label>
              <input type="text" class="form-input" value="<?= $row['dinner']['type'] ?>">
            </div>
            <div class="form-group">
              <label class="form-label">저녁 반찬 *</label>
              <input type="text" class="form-input" value="<?= $row['dinner']['sides'] ?>">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('주간 메뉴가 저장되었습니다.', 'success'); closeModal('editModal');">저장</button>
    </div>
  </div>
</div>
<?php include 'includes/footer.php'; ?> 