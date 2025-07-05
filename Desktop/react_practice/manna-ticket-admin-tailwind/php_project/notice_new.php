<?php
// 임시 공지사항 데이터
$noticeStats = [
  [ 'label'=>'전체 공지', 'value'=>2 ],
  [ 'label'=>'긴급 공지', 'value'=>1 ],
  [ 'label'=>'고정 공지', 'value'=>1 ],
];
$notices = [
  [
    'id'=>1,
    'title'=>'5월 식단 변경 안내',
    'content'=>'5월부터 점심 메뉴가 변경됩니다. 새로운 식단은 더욱 건강하고 맛있게 준비되었습니다. 많은 관심 부탁드립니다.',
    'isNew'=>true,
    'isFixed'=>true,
    'priority'=>'높음',
    'status'=>'게시중',
    'views'=>234,
    'date'=>'2024-04-28',
  ],
  [
    'id'=>2,
    'title'=>'시설 점검 안내',
    'content'=>'주방 시설 점검으로 인해 4월 30일 오후 2시부터 6시까지 식사 서비스가 중단됩니다. 불편을 끼쳐 죄송합니다.',
    'isNew'=>false,
    'isFixed'=>false,
    'priority'=>'보통',
    'status'=>'게시중',
    'views'=>156,
    'date'=>'2024-04-25',
  ],
];

$pageTitle = '공지사항';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar mb-6">
      <h1>공지사항</h1>
      <div class="flex gap-2">
        <button class="btn btn-primary" onclick="openModal('addModal')">
          <i class="fas fa-plus"></i> 공지사항 추가
        </button>
        <button class="btn btn-secondary" onclick="downloadExcel()">
          <i class="fas fa-download"></i> 엑셀 다운로드
        </button>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="search-box-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="제목으로 검색..." />
        <span class="search-hint">실시간 검색</span>
      </div>
    </div>
    
    <div class="stats-grid mb-6">
      <?php foreach($noticeStats as $stat): ?>
        <div class="stat-card">
          <div class="stat-label"><?= htmlspecialchars($stat['label']) ?></div>
          <div class="stat-value"><?= htmlspecialchars($stat['value']) ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold">공지사항 목록</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>중요도</th>
                <th>상태</th>
                <th>조회수</th>
                <th>작성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($notices as $n): ?>
              <tr>
                <td class="text-left">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold"><?= htmlspecialchars($n['title']) ?></span>
                    <?php if($n['isNew']): ?>
                      <span class="badge badge-danger">NEW</span>
                    <?php endif; ?>
                    <?php if($n['isFixed']): ?>
                      <span class="badge badge-primary">고정</span>
                    <?php endif; ?>
                  </div>
                </td>
                <td>
                  <?php
                  $priorityClass = $n['priority'] === '높음' ? 'text-red-600' : ($n['priority'] === '긴급' ? 'text-orange-600' : 'text-gray-600');
                  ?>
                  <span class="<?= $priorityClass ?> font-semibold"><?= htmlspecialchars($n['priority']) ?></span>
                </td>
                <td>
                  <span class="badge badge-success"><?= htmlspecialchars($n['status']) ?></span>
                </td>
                <td><?= htmlspecialchars($n['views']) ?>회</td>
                <td><?= htmlspecialchars($n['date']) ?></td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-info btn-sm" onclick="viewNotice('<?= htmlspecialchars($n['title']) ?>', '<?= htmlspecialchars($n['content']) ?>', '<?= htmlspecialchars($n['priority']) ?>', '<?= htmlspecialchars($n['status']) ?>', '<?= htmlspecialchars($n['views']) ?>', '<?= htmlspecialchars($n['date']) ?>')">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="editNotice('<?= htmlspecialchars($n['title']) ?>', '<?= htmlspecialchars($n['content']) ?>', '<?= htmlspecialchars($n['priority']) ?>')">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteNotice('<?= htmlspecialchars($n['title']) ?>')">
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
</div>

<!-- 공지사항 추가 모달 -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">공지사항 작성</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">제목 *</label>
          <input type="text" class="form-input" placeholder="공지사항 제목을 입력하세요" required>
        </div>
        <div class="form-group">
          <label class="form-label">내용 *</label>
          <textarea class="form-textarea" placeholder="공지사항 내용을 입력하세요" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">중요도</label>
          <select class="form-select">
            <option value="보통">보통</option>
            <option value="높음">높음</option>
            <option value="긴급">긴급</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('공지사항이 추가되었습니다.', 'success'); closeModal('addModal');">등록</button>
    </div>
  </div>
</div>

<!-- 공지사항 수정 모달 -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">공지사항 수정</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">제목 *</label>
          <input type="text" id="editTitle" class="form-input" placeholder="공지사항 제목을 입력하세요" required>
        </div>
        <div class="form-group">
          <label class="form-label">내용 *</label>
          <textarea id="editContent" class="form-textarea" placeholder="공지사항 내용을 입력하세요" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">중요도</label>
          <select id="editPriority" class="form-select">
            <option value="보통">보통</option>
            <option value="높음">높음</option>
            <option value="긴급">긴급</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('공지사항이 수정되었습니다.', 'success'); closeModal('editModal');">수정</button>
    </div>
  </div>
</div>

<!-- 공지사항 상세보기 모달 -->
<div id="viewModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">공지사항 상세보기</h3>
      <button class="close-btn" onclick="closeModal('viewModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div class="info-grid mb-4">
        <div class="info-item">
          <div class="info-label">중요도</div>
          <div class="info-value" id="viewPriority"></div>
        </div>
        <div class="info-item">
          <div class="info-label">상태</div>
          <div class="info-value" id="viewStatus"></div>
        </div>
        <div class="info-item">
          <div class="info-label">조회수</div>
          <div class="info-value" id="viewViews"></div>
        </div>
        <div class="info-item">
          <div class="info-label">작성일</div>
          <div class="info-value" id="viewDate"></div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">제목</label>
        <div class="form-display" id="viewTitle"></div>
      </div>
      <div class="form-group">
        <label class="form-label">내용</label>
        <div class="form-display form-display-large" id="viewContent"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('viewModal')">닫기</button>
    </div>
  </div>
</div>

<script>
// 실시간 검색 기능
function performSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const tableRows = document.querySelectorAll('.table tbody tr');
  
  tableRows.forEach(row => {
    const title = row.cells[0].textContent.toLowerCase();
    
    if (title.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
  
  // 검색 결과 없음 메시지 처리
  const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
  const noResultsRow = document.getElementById('noResults');
  
  if (visibleRows.length === 0 && searchTerm !== '') {
    if (!noResultsRow) {
      const tbody = document.querySelector('.table tbody');
      const newRow = document.createElement('tr');
      newRow.id = 'noResults';
      newRow.innerHTML = '<td colspan="6" class="text-center py-8 text-muted">검색 결과가 없습니다.</td>';
      tbody.appendChild(newRow);
    }
  } else if (noResultsRow) {
    noResultsRow.remove();
  }
}

function editNotice(title, content, priority) {
  document.getElementById('editTitle').value = title;
  document.getElementById('editContent').value = content;
  document.getElementById('editPriority').value = priority;
  openModal('editModal');
}

function viewNotice(title, content, priority, status, views, date) {
  document.getElementById('viewTitle').textContent = title;
  document.getElementById('viewContent').textContent = content;
  document.getElementById('viewPriority').textContent = priority;
  document.getElementById('viewStatus').textContent = status;
  document.getElementById('viewViews').textContent = views + '회';
  document.getElementById('viewDate').textContent = date;
  openModal('viewModal');
}

function deleteNotice(title) {
  if (confirm(`정말로 "${title}" 공지사항을 삭제하시겠습니까?`)) {
    showAlert('공지사항이 삭제되었습니다.', 'success');
  }
}

// 엑셀 다운로드 기능
function downloadExcel() {
  const headers = ['제목', '중요도', '상태', '조회수', '작성일'];
  const data = [
    ['5월 식단 변경 안내', '높음', '게시중', '234', '2024-04-28'],
    ['시설 점검 안내', '보통', '게시중', '156', '2024-04-25']
  ];
  
  let csvContent = '\uFEFF';
  csvContent += headers.join(',') + '\n';
  data.forEach(row => {
    csvContent += row.join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `공지사항_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 검색 입력 필드에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
  }
});
</script>

<?php include 'includes/footer.php'; ?> 