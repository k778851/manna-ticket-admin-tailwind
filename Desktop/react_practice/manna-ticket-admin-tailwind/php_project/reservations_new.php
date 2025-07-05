<?php
// 임시 예약 데이터
$reservations = [
  [ 'id'=>1, 'name'=>'김철수', 'department'=>'개발팀', 'date'=>'2024-01-15', 'meal'=>'점심', 'time'=>'12:00', 'status'=>'confirmed', 'qrSubmitted'=>true ],
  [ 'id'=>2, 'name'=>'이영희', 'department'=>'디자인팀', 'date'=>'2024-01-15', 'meal'=>'점심', 'time'=>'12:00', 'status'=>'confirmed', 'qrSubmitted'=>false ],
  [ 'id'=>3, 'name'=>'박민수', 'department'=>'기획팀', 'date'=>'2024-01-15', 'meal'=>'저녁', 'time'=>'18:00', 'status'=>'pending', 'qrSubmitted'=>false ],
  [ 'id'=>4, 'name'=>'최지영', 'department'=>'마케팅팀', 'date'=>'2024-01-16', 'meal'=>'점심', 'time'=>'12:00', 'status'=>'cancelled', 'qrSubmitted'=>false ],
];

$currentTab = isset($_GET['tab']) ? $_GET['tab'] : 'list';

// 페이지 설정
$pageTitle = '예약 관리';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

$inlineScript .= "
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  document.querySelector(`[data-tab='${tabName}']`).classList.add('active');
  document.getElementById(tabName + 'Content').classList.add('active');
  
  const url = new URL(window.location);
  url.searchParams.set('tab', tabName);
  window.history.pushState({}, '', url);
}

function editReservation(id, name, department, date, meal, time) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editDepartment').value = department;
  document.getElementById('editDate').value = date;
  document.getElementById('editMeal').value = meal;
  document.getElementById('editTime').value = time;
  openModal('editModal');
}

function deleteReservation(id, name) {
  showConfirm(`${name}님의 예약을 삭제하시겠습니까?`, function() {
    showAlert('예약이 삭제되었습니다.', 'success');
  });
}

function changeStatus(id, currentStatus) {
  const statusMap = {
    'pending': 'confirmed',
    'confirmed': 'cancelled',
    'cancelled': 'pending'
  };
  const newStatus = statusMap[currentStatus];
  const statusText = {
    'pending': '대기중',
    'confirmed': '확정',
    'cancelled': '취소'
  };
  showAlert(`예약 상태가 ${statusText[newStatus]}로 변경되었습니다.`, 'success');
}

function sendReminder(id, name) {
  showConfirm(`${name}님에게 예약 확인 알림을 보내시겠습니까?`, function() {
    showAlert(`${name}님에게 알림이 전송되었습니다.`, 'success');
  });
}

function exportReservations() {
  showAlert('예약 데이터가 엑셀 파일로 내보내졌습니다.', 'success');
}

function bulkAction() {
  const selectedReservations = document.querySelectorAll('input[name=\"reservationIds\"]:checked');
  if (selectedReservations.length === 0) {
    showAlert('선택된 예약이 없습니다.', 'warning');
    return;
  }
  
  const action = document.getElementById('bulkActionSelect').value;
  if (action === '') {
    showAlert('작업을 선택해주세요.', 'warning');
    return;
  }
  
  showConfirm(`${selectedReservations.length}개의 예약에 대해 ${action} 작업을 수행하시겠습니까?`, function() {
    showAlert('일괄 작업이 완료되었습니다.', 'success');
  });
}

// 페이지 초기화
function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab') || 'list';
  switchTab(currentTab);
}
";

include 'includes/header.php';
?>

<?php include 'sidebar.php'; ?>

<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar">
      <h1>예약 관리</h1>
      <div class="flex gap-2">
        <button class="btn btn-secondary" onclick="exportReservations()">
          <i class="fas fa-download"></i> 예약 내보내기
        </button>
        <button class="btn btn-primary" onclick="openModal('addModal')">
          <i class="fas fa-plus"></i> 예약 추가
        </button>
      </div>
    </div>
    
    <div class="tab-menu">
      <button class="tab-btn active" data-tab="list" onclick="switchTab('list')">
        <i class="fas fa-list"></i> 예약 목록
      </button>
      <button class="tab-btn" data-tab="calendar" onclick="switchTab('calendar')">
        <i class="fas fa-calendar"></i> 달력 보기
      </button>
      <button class="tab-btn" data-tab="analytics" onclick="switchTab('analytics')">
        <i class="fas fa-chart-bar"></i> 통계
      </button>
    </div>
    
    <!-- 예약 목록 탭 -->
    <div id="listContent" class="tab-content active">
      <div class="card">
        <div class="card-header">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">예약 목록</h3>
            <div class="flex gap-2">
              <select id="bulkActionSelect" class="form-select" style="width: auto;">
                <option value="">일괄 작업 선택</option>
                <option value="confirm">확정</option>
                <option value="cancel">취소</option>
                <option value="delete">삭제</option>
              </select>
              <button class="btn btn-warning btn-sm" onclick="bulkAction()">
                <i class="fas fa-tasks"></i> 실행
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onclick="toggleAllReservations(this)">
                  </th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>날짜</th>
                  <th>식사</th>
                  <th>시간</th>
                  <th>상태</th>
                  <th>QR 제출</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach($reservations as $reservation): ?>
                <tr>
                  <td>
                    <input type="checkbox" name="reservationIds" value="<?= $reservation['id'] ?>">
                  </td>
                  <td><?= htmlspecialchars($reservation['name']) ?></td>
                  <td><?= htmlspecialchars($reservation['department']) ?></td>
                  <td><?= htmlspecialchars($reservation['date']) ?></td>
                  <td>
                    <span class="px-2 py-1 rounded text-xs <?= $reservation['meal'] === '점심' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800' ?>">
                      <?= htmlspecialchars($reservation['meal']) ?>
                    </span>
                  </td>
                  <td><?= htmlspecialchars($reservation['time']) ?></td>
                  <td>
                    <?php
                    $statusClass = '';
                    $statusText = '';
                    switch($reservation['status']) {
                      case 'confirmed':
                        $statusClass = 'bg-green-100 text-green-800';
                        $statusText = '확정';
                        break;
                      case 'pending':
                        $statusClass = 'bg-yellow-100 text-yellow-800';
                        $statusText = '대기중';
                        break;
                      case 'cancelled':
                        $statusClass = 'bg-red-100 text-red-800';
                        $statusText = '취소';
                        break;
                    }
                    ?>
                    <span class="px-2 py-1 rounded text-xs <?= $statusClass ?>">
                      <?= $statusText ?>
                    </span>
                  </td>
                  <td>
                    <?php if($reservation['qrSubmitted']): ?>
                      <span class="text-green-600"><i class="fas fa-check"></i> 제출</span>
                    <?php else: ?>
                      <span class="text-red-600"><i class="fas fa-times"></i> 미제출</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-secondary btn-sm" onclick="editReservation(<?= $reservation['id'] ?>, '<?= htmlspecialchars($reservation['name']) ?>', '<?= htmlspecialchars($reservation['department']) ?>', '<?= $reservation['date'] ?>', '<?= $reservation['meal'] ?>', '<?= $reservation['time'] ?>')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-warning btn-sm" onclick="sendReminder(<?= $reservation['id'] ?>, '<?= htmlspecialchars($reservation['name']) ?>')">
                        <i class="fas fa-bell"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="deleteReservation(<?= $reservation['id'] ?>, '<?= htmlspecialchars($reservation['name']) ?>')">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 달력 보기 탭 -->
    <div id="calendarContent" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">달력 보기</h3>
        </div>
        <div class="card-body">
          <div class="text-center text-muted">
            <i class="fas fa-calendar-alt text-4xl mb-4"></i>
            <p>달력 뷰는 추후 구현 예정입니다.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 통계 탭 -->
    <div id="analyticsContent" class="tab-content">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-muted mb-2">총 예약</div>
            <div class="text-3xl font-bold text-primary"><?= count($reservations) ?>건</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-muted mb-2">확정 예약</div>
            <div class="text-3xl font-bold text-success"><?= count(array_filter($reservations, function($r) { return $r['status'] === 'confirmed'; })) ?>건</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-muted mb-2">대기 예약</div>
            <div class="text-3xl font-bold text-warning"><?= count(array_filter($reservations, function($r) { return $r['status'] === 'pending'; })) ?>건</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="text-sm text-muted mb-2">QR 제출률</div>
            <div class="text-3xl font-bold text-info"><?= round(count(array_filter($reservations, function($r) { return $r['qrSubmitted']; })) / count($reservations) * 100) ?>%</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold">부서별 예약 현황</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span>개발팀</span>
                <span class="font-semibold">1건</span>
              </div>
              <div class="flex justify-between items-center">
                <span>디자인팀</span>
                <span class="font-semibold">1건</span>
              </div>
              <div class="flex justify-between items-center">
                <span>기획팀</span>
                <span class="font-semibold">1건</span>
              </div>
              <div class="flex justify-between items-center">
                <span>마케팅팀</span>
                <span class="font-semibold">1건</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold">식사별 예약 현황</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span>점심</span>
                <span class="font-semibold">3건</span>
              </div>
              <div class="flex justify-between items-center">
                <span>저녁</span>
                <span class="font-semibold">1건</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 예약 추가 모달 -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">예약 추가</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">이름 *</label>
            <input type="text" class="form-input" placeholder="예약자 이름" required>
          </div>
          <div class="form-group">
            <label class="form-label">부서 *</label>
            <select class="form-select" required>
              <option value="">부서 선택</option>
              <option value="개발팀">개발팀</option>
              <option value="디자인팀">디자인팀</option>
              <option value="기획팀">기획팀</option>
              <option value="마케팅팀">마케팅팀</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">날짜 *</label>
            <input type="date" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">식사 *</label>
            <select class="form-select" required>
              <option value="">선택하세요</option>
              <option value="점심">점심</option>
              <option value="저녁">저녁</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">시간 *</label>
            <input type="time" class="form-input" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-textarea" placeholder="예약 관련 메모"></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('예약이 추가되었습니다.', 'success'); closeModal('addModal');">추가</button>
    </div>
  </div>
</div>

<!-- 예약 수정 모달 -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">예약 수정</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <input type="hidden" id="editId">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">이름 *</label>
            <input type="text" id="editName" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">부서 *</label>
            <select id="editDepartment" class="form-select" required>
              <option value="">부서 선택</option>
              <option value="개발팀">개발팀</option>
              <option value="디자인팀">디자인팀</option>
              <option value="기획팀">기획팀</option>
              <option value="마케팅팀">마케팅팀</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">날짜 *</label>
            <input type="date" id="editDate" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">식사 *</label>
            <select id="editMeal" class="form-select" required>
              <option value="">선택하세요</option>
              <option value="점심">점심</option>
              <option value="저녁">저녁</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">시간 *</label>
            <input type="time" id="editTime" class="form-input" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">메모</label>
          <textarea class="form-textarea" placeholder="예약 관련 메모"></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('예약이 수정되었습니다.', 'success'); closeModal('editModal');">수정</button>
    </div>
  </div>
</div>

<script>
function toggleAllReservations(checkbox) {
  const checkboxes = document.querySelectorAll('input[name=\"reservationIds\"]');
  checkboxes.forEach(cb => {
    cb.checked = checkbox.checked;
  });
}
</script>

<?php include 'includes/footer.php'; ?> 