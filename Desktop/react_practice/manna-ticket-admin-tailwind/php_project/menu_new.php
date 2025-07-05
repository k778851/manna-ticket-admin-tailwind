<?php
// 임시 메뉴 데이터
$menus = [
  [ 'id'=>1, 'date'=>'2024-01-15', 'meal'=>'점심', 'main'=>'김치찌개', 'side1'=>'계란말이', 'side2'=>'김치', 'side3'=>'멸치볶음', 'soup'=>'미역국', 'status'=>'active' ],
  [ 'id'=>2, 'date'=>'2024-01-15', 'meal'=>'저녁', 'main'=>'제육볶음', 'side1'=>'시금치나물', 'side2'=>'단무지', 'side3'=>'깍두기', 'soup'=>'된장국', 'status'=>'active' ],
  [ 'id'=>3, 'date'=>'2024-01-16', 'meal'=>'점심', 'main'=>'된장찌개', 'side1'=>'고등어구이', 'side2'=>'무생채', 'side3'=>'김치', 'soup'=>'미역국', 'status'=>'draft' ],
  [ 'id'=>4, 'date'=>'2024-01-16', 'meal'=>'저녁', 'main'=>'닭볶음탕', 'side1'=>'시금치나물', 'side2'=>'단무지', 'side3'=>'깍두기', 'soup'=>'된장국', 'status'=>'draft' ],
];

$currentTab = isset($_GET['tab']) ? $_GET['tab'] : 'list';

// 페이지 설정
$pageTitle = '메뉴 관리';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

$inlineScript .= "
function switchTab(tabName) {
  // 모든 탭 버튼 비활성화
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 모든 탭 콘텐츠 숨김
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // 선택된 탭 활성화
  document.querySelector(`[data-tab='${tabName}']`).classList.add('active');
  document.getElementById(tabName + 'Content').classList.add('active');
  
  // URL 업데이트
  const url = new URL(window.location);
  url.searchParams.set('tab', tabName);
  window.history.pushState({}, '', url);
}

function editMenu(id, date, meal, main, side1, side2, side3, soup) {
  document.getElementById('editId').value = id;
  document.getElementById('editDate').value = date;
  document.getElementById('editMeal').value = meal;
  document.getElementById('editMain').value = main;
  document.getElementById('editSide1').value = side1;
  document.getElementById('editSide2').value = side2;
  document.getElementById('editSide3').value = side3;
  document.getElementById('editSoup').value = soup;
  openModal('editModal');
}

function deleteMenu(id, date, meal) {
  showConfirm(`${date} ${meal} 메뉴를 삭제하시겠습니까?`, function() {
    showAlert('메뉴가 삭제되었습니다.', 'success');
  });
}

function toggleMenuStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'draft' : 'active';
  showAlert(`메뉴 상태가 ${newStatus === 'active' ? '활성화' : '임시저장'}로 변경되었습니다.`, 'success');
}

function duplicateMenu(id) {
  showAlert('메뉴가 복제되었습니다. 편집 페이지에서 확인하세요.', 'success');
}

function exportMenu() {
  showAlert('메뉴 데이터가 엑셀 파일로 내보내졌습니다.', 'success');
}

function importMenu() {
  const fileInput = document.getElementById('menuFile');
  const file = fileInput.files[0];
  
  if (!file) {
    showAlert('파일을 선택해주세요.', 'warning');
    return;
  }
  
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
    showAlert('엑셀 파일(.xlsx) 또는 CSV 파일만 업로드 가능합니다.', 'warning');
    return;
  }
  
  showAlert('메뉴 데이터가 성공적으로 업로드되었습니다.', 'success');
  fileInput.value = '';
}

// 페이지 초기화
function initPage() {
  // 현재 탭 설정
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
      <h1>메뉴 관리</h1>
      <div class="flex gap-2">
        <button class="btn btn-secondary" onclick="openModal('importModal')">
          <i class="fas fa-upload"></i> 메뉴 업로드
        </button>
        <button class="btn btn-secondary" onclick="exportMenu()">
          <i class="fas fa-download"></i> 메뉴 내보내기
        </button>
        <button class="btn btn-primary" onclick="openModal('addModal')">
          <i class="fas fa-plus"></i> 메뉴 추가
        </button>
      </div>
    </div>
    
    <div class="tab-menu">
      <button class="tab-btn active" data-tab="list" onclick="switchTab('list')">
        <i class="fas fa-list"></i> 메뉴 목록
      </button>
      <button class="tab-btn" data-tab="calendar" onclick="switchTab('calendar')">
        <i class="fas fa-calendar"></i> 달력 보기
      </button>
      <button class="tab-btn" data-tab="templates" onclick="switchTab('templates')">
        <i class="fas fa-copy"></i> 메뉴 템플릿
      </button>
    </div>
    
    <!-- 메뉴 목록 탭 -->
    <div id="listContent" class="tab-content active">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">메뉴 목록</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>식사</th>
                  <th>메인</th>
                  <th>반찬</th>
                  <th>국</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach($menus as $menu): ?>
                <tr>
                  <td><?= htmlspecialchars($menu['date']) ?></td>
                  <td>
                    <span class="px-2 py-1 rounded text-xs <?= $menu['meal'] === '점심' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800' ?>">
                      <?= htmlspecialchars($menu['meal']) ?>
                    </span>
                  </td>
                  <td><?= htmlspecialchars($menu['main']) ?></td>
                  <td>
                    <div class="text-sm">
                      <?= htmlspecialchars($menu['side1']) ?><br>
                      <?= htmlspecialchars($menu['side2']) ?><br>
                      <?= htmlspecialchars($menu['side3']) ?>
                    </div>
                  </td>
                  <td><?= htmlspecialchars($menu['soup']) ?></td>
                  <td>
                    <span class="px-2 py-1 rounded text-xs <?= $menu['status'] === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' ?>">
                      <?= $menu['status'] === 'active' ? '활성' : '임시저장' ?>
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-secondary btn-sm" onclick="editMenu(<?= $menu['id'] ?>, '<?= $menu['date'] ?>', '<?= $menu['meal'] ?>', '<?= htmlspecialchars($menu['main']) ?>', '<?= htmlspecialchars($menu['side1']) ?>', '<?= htmlspecialchars($menu['side2']) ?>', '<?= htmlspecialchars($menu['side3']) ?>', '<?= htmlspecialchars($menu['soup']) ?>')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-warning btn-sm" onclick="duplicateMenu(<?= $menu['id'] ?>)">
                        <i class="fas fa-copy"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="deleteMenu(<?= $menu['id'] ?>, '<?= $menu['date'] ?>', '<?= $menu['meal'] ?>')">
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
    
    <!-- 메뉴 템플릿 탭 -->
    <div id="templatesContent" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">메뉴 템플릿</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="border rounded p-4">
              <h4 class="font-semibold mb-2">한식 세트</h4>
              <div class="text-sm text-muted">
                <div>메인: 김치찌개</div>
                <div>반찬: 계란말이, 김치, 멸치볶음</div>
                <div>국: 미역국</div>
              </div>
              <button class="btn btn-primary btn-sm mt-3 w-full">템플릿 사용</button>
            </div>
            
            <div class="border rounded p-4">
              <h4 class="font-semibold mb-2">양식 세트</h4>
              <div class="text-sm text-muted">
                <div>메인: 파스타</div>
                <div>반찬: 샐러드, 빵</div>
                <div>국: 수프</div>
              </div>
              <button class="btn btn-primary btn-sm mt-3 w-full">템플릿 사용</button>
            </div>
            
            <div class="border rounded p-4">
              <h4 class="font-semibold mb-2">중식 세트</h4>
              <div class="text-sm text-muted">
                <div>메인: 짜장면</div>
                <div>반찬: 탕수육, 깐풍기</div>
                <div>국: 계란국</div>
              </div>
              <button class="btn btn-primary btn-sm mt-3 w-full">템플릿 사용</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 메뉴 추가 모달 -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">메뉴 추가</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <div class="form-group">
          <label class="form-label">메인 요리 *</label>
          <input type="text" class="form-input" placeholder="예: 김치찌개" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">반찬 1</label>
            <input type="text" class="form-input" placeholder="예: 계란말이">
          </div>
          <div class="form-group">
            <label class="form-label">반찬 2</label>
            <input type="text" class="form-input" placeholder="예: 김치">
          </div>
          <div class="form-group">
            <label class="form-label">반찬 3</label>
            <input type="text" class="form-input" placeholder="예: 멸치볶음">
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">국</label>
          <input type="text" class="form-input" placeholder="예: 미역국">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('메뉴가 추가되었습니다.', 'success'); closeModal('addModal');">추가</button>
    </div>
  </div>
</div>

<!-- 메뉴 수정 모달 -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">메뉴 수정</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <input type="hidden" id="editId">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <div class="form-group">
          <label class="form-label">메인 요리 *</label>
          <input type="text" id="editMain" class="form-input" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">반찬 1</label>
            <input type="text" id="editSide1" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">반찬 2</label>
            <input type="text" id="editSide2" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">반찬 3</label>
            <input type="text" id="editSide3" class="form-input">
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">국</label>
          <input type="text" id="editSoup" class="form-input">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('메뉴가 수정되었습니다.', 'success'); closeModal('editModal');">수정</button>
    </div>
  </div>
</div>

<!-- 메뉴 업로드 모달 -->
<div id="importModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">메뉴 업로드</h3>
      <button class="close-btn" onclick="closeModal('importModal')">&times;</button>
    </div>
    <div class="modal-body">
      <p class="text-muted mb-4">엑셀 파일(.xlsx) 또는 CSV 파일을 업로드하여 메뉴를 일괄 등록할 수 있습니다.</p>
      <button type="button" class="btn btn-secondary mb-4" onclick="downloadTemplate()">
        <i class="fas fa-download"></i> 템플릿 다운로드
      </button>
      <form>
        <div class="form-group">
          <label class="form-label">파일 선택 *</label>
          <input type="file" id="menuFile" accept=".xlsx,.csv" class="form-input" style="padding: 8px;">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('importModal')">취소</button>
      <button type="button" class="btn btn-primary" onclick="importMenu()">업로드</button>
    </div>
  </div>
</div>

<script>
function downloadTemplate() {
  showAlert('메뉴 업로드 템플릿이 다운로드되었습니다.', 'success');
}
</script>

<?php include 'includes/footer.php'; ?> 