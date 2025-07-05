<?php
// 임시 사용자 데이터
$users = [
  [ 'id'=>1, 'name'=>'김철수', 'personalNumber'=>'00371210-00149', 'department'=>'총무부', 'lunchCount'=>12, 'dinnerCount'=>11, 'qr'=>95 ],
  [ 'id'=>2, 'name'=>'이영희', 'personalNumber'=>'00371210-00150', 'department'=>'기획부', 'lunchCount'=>8, 'dinnerCount'=>7, 'qr'=>87 ],
  [ 'id'=>3, 'name'=>'박민수', 'personalNumber'=>'00371210-00151', 'department'=>'교육부', 'lunchCount'=>16, 'dinnerCount'=>15, 'qr'=>100 ],
];
$search = isset($_GET['search']) ? $_GET['search'] : '';
$filteredUsers = array_filter($users, function($u) use ($search) {
  return !$search || strpos($u['name'], $search)!==false || strpos($u['personalNumber'], $search)!==false;
});

// 페이지 설정
$pageTitle = '사용자 관리';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

// 고유번호 포맷팅 함수
$inlineScript .= "
function formatPersonalNumber(value) {
  let cleaned = value.replace(/[^\\d-]/g, '');
  let numbers = cleaned.replace(/-/g, '');
  if (numbers.length <= 8) {
    return numbers;
  } else {
    return numbers.slice(0, 8) + '-' + numbers.slice(8, 13);
  }
}

function applyPersonalNumberFormat(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener('input', function(e) {
      e.target.value = formatPersonalNumber(e.target.value);
    });
  }
}

// 실시간 검색 기능
function performSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const tableRows = document.querySelectorAll('.user-table tbody tr');
  
  tableRows.forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const personalNumber = row.cells[2].textContent.toLowerCase();
    const department = row.cells[0].textContent.toLowerCase();
    
    if (name.includes(searchTerm) || personalNumber.includes(searchTerm) || department.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
  
  const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
  const noResultsRow = document.getElementById('noResults');
  
  if (visibleRows.length === 0 && searchTerm !== '') {
    if (!noResultsRow) {
      const tbody = document.querySelector('.user-table tbody');
      const newRow = document.createElement('tr');
      newRow.id = 'noResults';
      newRow.innerHTML = '<td colspan=\"7\" style=\"text-align:center; padding:20px; color:#888;\">검색 결과가 없습니다.</td>';
      tbody.appendChild(newRow);
    }
  } else if (noResultsRow) {
    noResultsRow.remove();
  }
}

// 엑셀 다운로드 기능
function downloadExcel() {
  const headers = ['부서', '이름', '고유번호', '점심 예약', '저녁 예약', 'QR 제출률'];
  const data = [
    ['총무부', '김철수', '00371210-00149', '12회', '11회', '95%'],
    ['기획부', '이영희', '00371210-00150', '8회', '7회', '87%'],
    ['교육부', '박민수', '00371210-00151', '16회', '15회', '100%']
  ];
  
  let csvContent = '\\uFEFF';
  csvContent += headers.join(',') + '\\n';
  data.forEach(row => {
    csvContent += row.join(',') + '\\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `사용자목록_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 엑셀 템플릿 다운로드
function downloadTemplate() {
  const headers = ['이름', '부서', '고유번호'];
  const data = [
    ['김철수', '총무부', '00371210-00149'],
    ['이영희', '기획부', '00371210-00150'],
    ['박민수', '교육부', '00371210-00151']
  ];
  
  let csvContent = '\\uFEFF';
  csvContent += headers.join(',') + '\\n';
  data.forEach(row => {
    csvContent += row.join(',') + '\\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', '사용자_업로드_템플릿.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 파일 업로드 처리
function handleFileUpload() {
  const fileInput = document.getElementById('fileUpload');
  const file = fileInput.files[0];
  
  if (!file) {
    showAlert('파일을 선택해주세요.');
    return;
  }
  
  if (!file.name.endsWith('.csv')) {
    showAlert('CSV 파일만 업로드 가능합니다.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const csv = e.target.result;
      const lines = csv.split('\\n');
      const headers = lines[0].split(',');
      
      let validUsers = 0;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          if (values.length >= 3 && values[0] && values[1] && values[2]) {
            validUsers++;
          }
        }
      }
      
      showAlert(`${validUsers}명의 사용자가 성공적으로 업로드되었습니다.`);
      fileInput.value = '';
    } catch (error) {
      showAlert('파일 처리 중 오류가 발생했습니다. 템플릿 형식을 확인해주세요.');
    }
  };
  reader.readAsText(file, 'UTF-8');
}

// 페이지 초기화
function initPage() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
  }
  
  // 고유번호 포맷팅 적용
  applyPersonalNumberFormat('addPersonalNumber');
  applyPersonalNumberFormat('editPersonalNumber');
}
";

include 'includes/header.php';
?>

<?php include 'sidebar.php'; ?>

<div class="main-content" id="mainContent">
  <div class="container-sm">
    <div class="top-bar">
      <h1>사용자 관리</h1>
      <div>
        <button class="btn btn-secondary" onclick="openModal('uploadModal')">
          <i class="fas fa-upload"></i> 사용자 일괄 업로드
        </button>
        <button class="btn btn-secondary" onclick="downloadExcel()">
          <i class="fas fa-download"></i> 사용자 목록 내보내기
        </button>
        <button class="btn btn-primary" onclick="openModal('addModal')">
          <i class="fas fa-plus"></i> 사용자 추가
        </button>
      </div>
    </div>
    
    <div class="mb-3">
      <input type="text" id="searchInput" class="form-input" style="width: 220px;" placeholder="이름, 고유번호, 부서로 검색..." />
      <span class="text-sm text-muted ml-2">실시간 검색</span>
    </div>
    
    <div class="table-responsive">
      <table class="table user-table">
        <thead>
          <tr>
            <th>부서</th>
            <th>이름</th>
            <th>고유번호</th>
            <th>점심 예약</th>
            <th>저녁 예약</th>
            <th>QR 제출률</th>
            <th>편집</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach($filteredUsers as $row): ?>
          <tr>
            <td><?= htmlspecialchars($row['department']) ?></td>
            <td><?= htmlspecialchars($row['name']) ?></td>
            <td><?= htmlspecialchars($row['personalNumber']) ?></td>
            <td><?= $row['lunchCount'] ?>회</td>
            <td><?= $row['dinnerCount'] ?>회</td>
            <td>
              <div class="progress-bar">
                <div class="progress" style="width:<?= $row['qr'] ?>%;"></div>
              </div>
              <span class="font-bold text-primary"><?= $row['qr'] ?>%</span>
            </td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="editUser('<?= htmlspecialchars($row['name']) ?>', '<?= htmlspecialchars($row['personalNumber']) ?>', '<?= htmlspecialchars($row['department']) ?>')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser('<?= htmlspecialchars($row['name']) ?>')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- 사용자 추가 모달 -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">사용자 추가</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">이름 *</label>
          <input type="text" class="form-input" placeholder="사용자 이름을 입력하세요" required>
        </div>
        <div class="form-group">
          <label class="form-label">고유번호 *</label>
          <input type="text" id="addPersonalNumber" class="form-input" placeholder="고유번호 (예: 00371210-00149)" maxlength="14" required>
        </div>
        <div class="form-group">
          <label class="form-label">부서 *</label>
          <select class="form-select" required>
            <option value="">부서를 선택하세요</option>
            <option value="총무부">총무부</option>
            <option value="기획부">기획부</option>
            <option value="교육부">교육부</option>
            <option value="문화부">문화부</option>
            <option value="홍보부">홍보부</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('사용자 추가는 실제 동작하지 않습니다.'); closeModal('addModal');">추가</button>
    </div>
  </div>
</div>

<!-- 사용자 수정 모달 -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">사용자 수정</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">이름 *</label>
          <input type="text" id="editName" class="form-input" placeholder="사용자 이름을 입력하세요" required>
        </div>
        <div class="form-group">
          <label class="form-label">고유번호 *</label>
          <input type="text" id="editPersonalNumber" class="form-input" placeholder="고유번호 (예: 00371210-00149)" maxlength="14" required>
        </div>
        <div class="form-group">
          <label class="form-label">부서 *</label>
          <select id="editDepartment" class="form-select" required>
            <option value="">부서를 선택하세요</option>
            <option value="총무부">총무부</option>
            <option value="기획부">기획부</option>
            <option value="교육부">교육부</option>
            <option value="문화부">문화부</option>
            <option value="홍보부">홍보부</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('사용자 수정은 실제 동작하지 않습니다.'); closeModal('editModal');">수정</button>
    </div>
  </div>
</div>

<!-- 파일 업로드 모달 -->
<div id="uploadModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">사용자 일괄 업로드</h3>
      <button class="close-btn" onclick="closeModal('uploadModal')">&times;</button>
    </div>
    <div class="modal-body">
      <p class="text-muted mb-3">CSV 파일을 업로드하여 사용자를 일괄 등록할 수 있습니다.</p>
      <button type="button" class="btn btn-secondary mb-3" onclick="downloadTemplate()">
        <i class="fas fa-download"></i> 템플릿 다운로드
      </button>
      <form>
        <div class="form-group">
          <label class="form-label">CSV 파일 선택 *</label>
          <input type="file" id="fileUpload" accept=".csv" class="form-input" style="padding: 8px;">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('uploadModal')">취소</button>
      <button type="button" class="btn btn-primary" onclick="handleFileUpload()">업로드</button>
    </div>
  </div>
</div>

<script>
function editUser(name, personalNumber, department) {
  document.getElementById('editName').value = name;
  document.getElementById('editPersonalNumber').value = personalNumber;
  document.getElementById('editDepartment').value = department;
  openModal('editModal');
}

function deleteUser(name) {
  showConfirm(`정말로 ${name} 사용자를 삭제하시겠습니까?`, function() {
    showAlert('삭제 기능은 실제 동작하지 않습니다.');
  });
}
</script>

<?php include 'includes/footer.php'; ?> 