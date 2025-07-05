<?php
// 임시 통계 및 게시글 데이터
$sponsorStats = [
  [ 'label'=>'전체 게시글', 'value'=>4 ],
  [ 'label'=>'고정 게시글', 'value'=>2 ],
];
$sponsorPosts = [
  [
    'id'=>1,
    'title'=>'1월 후원 목표 달성! 진심으로 감사드립니다',
    'content'=>'여러분의 따뜻한 마음 덕분에 1월 후원 목표를 달성할 수 있었습니다. 후원해주신 모든 분들께 깊은 감사의 말씀을 드립니다. 이번 달 후원금은 식재료 구입과 주방 시설 개선에 소중히 사용되었습니다.',
    'isNew'=>true,
    'isFixed'=>true,
    'category'=>'감사인사',
    'author'=>'관리자',
    'status'=>'게시중',
    'views'=>342,
    'date'=>'2024-01-15',
  ],
  [
    'id'=>2,
    'title'=>'후원금 사용 내역 투명 공개',
    'content'=>'지난달 후원금이 어떻게 사용되었는지 투명하게 공개합니다. 식재료 구입, 주방 시설 개선 등에 소중히 사용되었습니다. 모든 내역은 회계 감사를 거쳐 검증되었습니다.',
    'isNew'=>false,
    'isFixed'=>false,
    'category'=>'보고서',
    'author'=>'관리자',
    'status'=>'게시중',
    'views'=>156,
    'date'=>'2024-01-10',
  ],
  [
    'id'=>3,
    'title'=>'익명 후원자님께 특별한 감사글',
    'content'=>'큰 금액을 후원해주신 익명의 후원자님께 진심으로 감사드립니다. 더 나은 식사 환경을 만드는 데 소중히 사용하겠습니다. 여러분의 따뜻한 마음이 우리에게 큰 힘이 됩니다.',
    'isNew'=>false,
    'isFixed'=>true,
    'category'=>'감사인사',
    'author'=>'관리자',
    'status'=>'게시중',
    'views'=>289,
    'date'=>'2024-01-08',
  ],
  [
    'id'=>4,
    'title'=>'2월 후원 목표와 계획 안내',
    'content'=>'2월 후원 목표와 계획을 안내드립니다. 이번 달에는 새로운 식단 도입과 주방 시설 확장을 위한 후원을 받고자 합니다. 많은 관심과 참여 부탁드립니다.',
    'isNew'=>false,
    'isFixed'=>false,
    'category'=>'공지',
    'author'=>'관리자',
    'status'=>'게시중',
    'views'=>89,
    'date'=>'2024-01-05',
  ],
];

$pageTitle = '후원 관리';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar mb-6">
      <h1>후원 관리</h1>
      <div class="flex gap-2">
        <button class="btn btn-primary" onclick="showAlert('감사 게시글이 작성되었습니다.', 'success')">
          <i class="fas fa-plus"></i> 감사 게시글 작성
        </button>
        <button class="btn btn-secondary" onclick="downloadExcel()">
          <i class="fas fa-download"></i> 엑셀 다운로드
        </button>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="search-box-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="제목, 카테고리, 작성자로 검색..." />
        <span class="search-hint">실시간 검색</span>
      </div>
    </div>
    
    <div class="stats-grid mb-6">
      <?php foreach($sponsorStats as $stat): ?>
        <div class="stat-card">
          <div class="stat-label"><?= htmlspecialchars($stat['label']) ?></div>
          <div class="stat-value"><?= htmlspecialchars($stat['value']) ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold">후원 게시글 목록</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th>작성자</th>
                <th>상태</th>
                <th>조회수</th>
                <th>작성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($sponsorPosts as $p): ?>
              <tr>
                <td class="text-left">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold"><?= htmlspecialchars($p['title']) ?></span>
                    <?php if($p['isNew']): ?>
                      <span class="badge badge-danger">NEW</span>
                    <?php endif; ?>
                    <?php if($p['isFixed']): ?>
                      <span class="badge badge-primary">고정</span>
                    <?php endif; ?>
                  </div>
                </td>
                <td>
                  <?php
                  $categoryClass = $p['category'] === '감사인사' ? 'text-green-600' : ($p['category'] === '보고서' ? 'text-blue-600' : 'text-gray-600');
                  ?>
                  <span class="<?= $categoryClass ?> font-semibold"><?= htmlspecialchars($p['category']) ?></span>
                </td>
                <td><?= htmlspecialchars($p['author']) ?></td>
                <td>
                  <span class="badge badge-success"><?= htmlspecialchars($p['status']) ?></span>
                </td>
                <td><?= htmlspecialchars($p['views']) ?>회</td>
                <td><?= htmlspecialchars($p['date']) ?></td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-info btn-sm" onclick="showAlert('상세보기 기능입니다.', 'info')">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="showAlert('수정 기능입니다.', 'info')">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="showAlert('삭제 기능입니다.', 'warning')">
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

<script>
// 실시간 검색 기능
function performSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const tableRows = document.querySelectorAll('.table tbody tr');
  
  tableRows.forEach(row => {
    const title = row.cells[0].textContent.toLowerCase();
    const category = row.cells[1].textContent.toLowerCase();
    const author = row.cells[2].textContent.toLowerCase();
    
    if (title.includes(searchTerm) || category.includes(searchTerm) || author.includes(searchTerm)) {
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
      newRow.innerHTML = '<td colspan="7" class="text-center py-8 text-muted">검색 결과가 없습니다.</td>';
      tbody.appendChild(newRow);
    }
  } else if (noResultsRow) {
    noResultsRow.remove();
  }
}

// 엑셀 다운로드 기능
function downloadExcel() {
  const headers = ['제목', '카테고리', '작성자', '상태', '조회수', '작성일'];
  const data = [
    ['1월 후원 목표 달성! 진심으로 감사드립니다', '감사인사', '관리자', '게시중', '342', '2024-01-15'],
    ['후원금 사용 내역 투명 공개', '보고서', '관리자', '게시중', '156', '2024-01-10'],
    ['익명 후원자님께 특별한 감사글', '감사인사', '관리자', '게시중', '289', '2024-01-08'],
    ['2월 후원 목표와 계획 안내', '공지', '관리자', '게시중', '89', '2024-01-05']
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
  link.setAttribute('download', `후원관리_${new Date().toISOString().split('T')[0]}.csv`);
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