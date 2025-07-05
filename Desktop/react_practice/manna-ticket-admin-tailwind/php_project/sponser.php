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
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>후원 관리</title>
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
    .container { max-width: 900px; margin: 0 auto; padding: 32px 8px; }
    .stat-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
    .stat-card { background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; padding:20px; text-align:center; }
    .btn { padding:6px 14px; border-radius:6px; border:none; font-weight:bold; cursor:pointer; margin:0 2px; }
    .btn-add { background:#3182f6; color:#fff; }
    .sponser-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; overflow:hidden; margin-bottom:24px; }
    .sponser-table th, .sponser-table td { border:1px solid #eee; padding:10px 8px; text-align:center; }
    .sponser-table th { background:#f7f8fa; color:#333; font-weight:bold; }
    .sponser-table td { color:#444; }
    .badge-new { background:#f66570; color:#fff; border-radius:6px; padding:2px 8px; font-size:13px; font-weight:bold; margin-left:4px; }
    .badge-fixed { background:#3182f6; color:#fff; border-radius:6px; padding:2px 8px; font-size:13px; font-weight:bold; margin-left:4px; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
    
    // 실시간 검색 기능
    function performSearch() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const tableRows = document.querySelectorAll('.sponser-table tbody tr');
      
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
          const tbody = document.querySelector('.sponser-table tbody');
          const newRow = document.createElement('tr');
          newRow.id = 'noResults';
          newRow.innerHTML = '<td colspan="7" style="text-align:center; padding:20px; color:#888;">검색 결과가 없습니다.</td>';
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
    
    // 실시간 업데이트 기능
    let sponsorUpdateInterval;
    
    function startSponsorUpdates() {
      // 120초마다 후원 데이터 업데이트
      sponsorUpdateInterval = setInterval(updateSponsorData, 120000);
    }
    
    function stopSponsorUpdates() {
      if (sponsorUpdateInterval) {
        clearInterval(sponsorUpdateInterval);
      }
    }
    
    function updateSponsorData() {
      // 조회수 업데이트
      const viewCells = document.querySelectorAll('.sponser-table tbody tr td:nth-child(5)');
      viewCells.forEach(cell => {
        const currentText = cell.textContent;
        const currentValue = parseInt(currentText);
        if (!isNaN(currentValue)) {
          const change = Math.floor(Math.random() * 10);
          cell.textContent = (currentValue + change) + '회';
        }
      });
      
      // 통계 카드 업데이트
      const statCards = document.querySelectorAll('.stat-card div:last-child');
      statCards.forEach((card, index) => {
        if (index === 0) { // 전체 게시글
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 2);
          card.textContent = currentValue + change;
        }
      });
      
      // 새로운 후원 게시글 알림 (3% 확률)
      if (Math.random() > 0.97) {
        showSponsorNotification('새로운 후원 감사 게시글이 등록되었습니다.');
      }
    }
    
    function showSponsorNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #6f42c1;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      `;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
    
    // 검색 입력 필드에 이벤트 리스너 추가
    document.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('input', performSearch);
      }
      
      // 실시간 업데이트 시작
      startSponsorUpdates();
      
      // 페이지 떠날 때 업데이트 중지
      window.addEventListener('beforeunload', stopSponsorUpdates);
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
    <h1 style="font-size:2rem; font-weight:bold; margin-bottom:16px;">후원 관리</h1>
    <div style="display:flex; gap:8px; margin-bottom:16px;">
      <button class="btn btn-add" onclick="showAlert('감사 게시글 추가는 실제 동작하지 않습니다.')">감사 게시글 작성</button>
      <button class="btn btn-download" onclick="downloadExcel()">엑셀 다운로드</button>
    </div>
    <div style="margin-bottom:16px;">
      <input type="text" id="searchInput" class="search-box" placeholder="제목, 카테고리, 작성자로 검색..." style="padding:8px 12px; border-radius:6px; border:1px solid #ccc; width:280px;" />
      <span style="margin-left:8px; color:#888; font-size:14px;">실시간 검색</span>
    </div>
    <div class="stat-cards">
      <?php foreach($sponsorStats as $stat): ?>
        <div class="stat-card">
          <div style="color:#888; font-size:14px; margin-bottom:4px;"><?= htmlspecialchars($stat['label']) ?></div>
          <div style="font-size:1.5rem; font-weight:bold; color:#222;"><?= htmlspecialchars($stat['value']) ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    <table class="sponser-table">
      <tr>
        <th>제목</th><th>카테고리</th><th>작성자</th><th>상태</th><th>조회수</th><th>작성일</th><th>편집</th>
      </tr>
      <?php foreach($sponsorPosts as $p): ?>
      <tr>
        <td style="text-align:left; font-weight:bold; color:#222;">
          <?= htmlspecialchars($p['title']) ?>
          <?php if($p['isNew']): ?><span class="badge-new">NEW</span><?php endif; ?>
          <?php if($p['isFixed']): ?><span class="badge-fixed">고정</span><?php endif; ?>
        </td>
        <td><?= htmlspecialchars($p['category']) ?></td>
        <td><?= htmlspecialchars($p['author']) ?></td>
        <td><?= htmlspecialchars($p['status']) ?></td>
        <td><?= htmlspecialchars($p['views']) ?>회</td>
        <td><?= htmlspecialchars($p['date']) ?></td>
        <td>
          <button class="btn btn-edit" onclick="showAlert('상세보기(실제 동작 아님)')">상세</button>
          <button class="btn btn-edit" onclick="showAlert('수정(실제 동작 아님)')">수정</button>
          <button class="btn btn-del" onclick="showAlert('삭제(실제 동작 아님)')">삭제</button>
        </td>
      </tr>
      <?php endforeach; ?>
      </table>
    </div>
  </div>

  <script>
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
      setTimeout(updateMainContentMargin, 300); // 애니메이션 완료 후 여백 조정
  };
  
  // 초기 로드 시 여백 설정
  document.addEventListener('DOMContentLoaded', function() {
      updateMainContentMargin();
  });
  </script>
</body>
</html> 