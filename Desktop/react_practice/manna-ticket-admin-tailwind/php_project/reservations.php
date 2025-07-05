<?php
// 임시 데이터
$regularReservations = [
  [ 'id'=>1, 'user'=>'김철수', 'department'=>'총무부', 'date'=>'2024-01-15', 'meal'=>'점심', 'status'=>'확정', 'qr'=>true, 'time'=>'12:30' ],
  [ 'id'=>2, 'user'=>'박민수', 'department'=>'기획부', 'date'=>'2024-01-15', 'meal'=>'점심', 'status'=>'확정', 'qr'=>false, 'time'=>'-' ],
];
$additionalReservations = [
  [ 'id'=>1, 'user'=>'이영희', 'department'=>'교육부', 'date'=>'2024-01-15', 'meal'=>'저녁', 'count'=>2, 'reason'=>'회사 회식으로 인한 추가 인원 필요', 'status'=>'대기', 'qr'=>false ],
  [ 'id'=>2, 'user'=>'정수진', 'department'=>'문화부', 'date'=>'2024-01-15', 'meal'=>'저녁', 'count'=>1, 'reason'=>'갑작스런 업무로 인한 추가 식사 필요', 'status'=>'대기', 'qr'=>false ],
  [ 'id'=>3, 'user'=>'최영호', 'department'=>'홍보부', 'date'=>'2024-01-15', 'meal'=>'점심', 'count'=>3, 'reason'=>'외부 방문객 접대', 'status'=>'확정', 'qr'=>true ],
];
$tab = isset($_GET['tab']) ? intval($_GET['tab']) : 0;
$search = isset($_GET['search']) ? $_GET['search'] : '';
$mealFilter = isset($_GET['meal']) ? $_GET['meal'] : '전체';
$filtered = array_filter(($tab===0?$regularReservations:$additionalReservations), function($r) use ($search, $mealFilter) {
  return (!$search || strpos($r['user'], $search)!==false) && ($mealFilter==='전체' || $r['meal']===$mealFilter);
});
$regularLunchCount = count(array_filter($regularReservations, fn($r)=>$r['meal']==='점심'));
$regularDinnerCount = count(array_filter($regularReservations, fn($r)=>$r['meal']==='저녁'));
$additionalLunchCount = count(array_filter($additionalReservations, fn($r)=>$r['meal']==='점심'));
$additionalDinnerCount = count(array_filter($additionalReservations, fn($r)=>$r['meal']==='저녁'));
$statCards = [
  [ 'label'=>'오늘 점심', 'value'=>45 ],
  [ 'label'=>'오늘 저녁', 'value'=>38 ],
  [ 'label'=>'일반 신청', 'value'=>"$regularLunchCount / $regularDinnerCount" ],
  [ 'label'=>'추가 신청', 'value'=>"$additionalLunchCount / $additionalDinnerCount" ],
  [ 'label'=>'QR 미제출', 'value'=>8 ],
];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>예약 관리</title>
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
    .stat-cards { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:24px; }
    .stat-card { background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; padding:20px; text-align:center; }
    .tab-menu { display:flex; gap:4px; margin-bottom:16px; }
    .tab-btn { flex:1 1 120px; min-width:120px; padding:12px 0; border-radius:8px; border:1px solid #eee; background:#fff; color:#888; font-weight:bold; cursor:pointer; transition:0.2s; }
    .tab-btn.active { background:#3182f6; color:#fff; border-color:#3182f6; }
    .filter-bar { display:flex; gap:8px; margin-bottom:12px; }
    .search-box, .select-box { padding:8px 12px; border-radius:6px; border:1px solid #ccc; }
    .res-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; overflow:hidden; }
    .res-table th, .res-table td { border:1px solid #eee; padding:10px 8px; text-align:center; }
    .res-table th { background:#f7f8fa; color:#333; font-weight:bold; }
    .res-table td { color:#444; }
    .btn { padding:6px 14px; border-radius:6px; border:none; font-weight:bold; cursor:pointer; margin:0 2px; }
    .btn-approve { background:#3182f6; color:#fff; }
    .btn-reject { background:#f66570; color:#fff; }
    .btn-download { background:#fff; color:#3182f6; border:1px solid #3182f6; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
    
    // 실시간 검색 및 필터링 기능
    function performSearch() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const mealFilter = document.getElementById('mealFilter').value;
      const tableRows = document.querySelectorAll('.res-table tbody tr');
      
      tableRows.forEach(row => {
        const user = row.cells[1].textContent.toLowerCase();
        const department = row.cells[0].textContent.toLowerCase();
        const meal = row.cells[3].textContent.includes('O') ? '점심' : 
                    row.cells[4].textContent.includes('O') ? '저녁' : '';
        
        const matchesSearch = user.includes(searchTerm) || department.includes(searchTerm);
        const matchesMeal = mealFilter === '전체' || meal === mealFilter;
        
        if (matchesSearch && matchesMeal) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      
      // 검색 결과 없음 메시지 처리
      const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
      const noResultsRow = document.getElementById('noResults');
      
      if (visibleRows.length === 0 && (searchTerm !== '' || mealFilter !== '전체')) {
        if (!noResultsRow) {
          const tbody = document.querySelector('.res-table tbody');
          const newRow = document.createElement('tr');
          newRow.id = 'noResults';
          const colSpan = <?= $tab === 1 ? 12 : 9 ?>;
          newRow.innerHTML = `<td colspan="${colSpan}" style="text-align:center; padding:20px; color:#888;">검색 결과가 없습니다.</td>`;
          tbody.appendChild(newRow);
        }
      } else if (noResultsRow) {
        noResultsRow.remove();
      }
    }
    
    // 엑셀 다운로드 기능
    function downloadExcel() {
      const currentTab = <?= $tab ?>;
      const headers = currentTab === 0 ? 
        ['부서', '이름', '날짜', '점심', '저녁', 'QR제출(점심)', 'QR제출(저녁)', '제출시간(점심)', '제출시간(저녁)'] :
        ['부서', '이름', '날짜', '점심', '저녁', 'QR제출(점심)', 'QR제출(저녁)', '제출시간(점심)', '제출시간(저녁)', '추가 인원', '신청 사유'];
      
      const data = currentTab === 0 ? [
        ['총무부', '김철수', '2024-01-15', 'O', 'X', '제출', '미제출', '12:30', '-'],
        ['기획부', '박민수', '2024-01-15', 'O', 'X', '미제출', '미제출', '-', '-']
      ] : [
        ['교육부', '이영희', '2024-01-15', 'X', 'O', '미제출', '미제출', '-', '-', '+2명', '회사 회식으로 인한 추가 인원 필요'],
        ['문화부', '정수진', '2024-01-15', 'X', 'O', '미제출', '미제출', '-', '-', '+1명', '갑작스런 업무로 인한 추가 식사 필요'],
        ['홍보부', '최영호', '2024-01-15', 'O', 'X', '제출', '미제출', '12:15', '-', '+3명', '외부 방문객 접대']
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
      const fileName = currentTab === 0 ? '일반예약현황' : '추가예약현황';
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // 실시간 업데이트 기능
    let reservationUpdateInterval;
    
    function startReservationUpdates() {
      // 45초마다 예약 데이터 업데이트
      reservationUpdateInterval = setInterval(updateReservationData, 45000);
    }
    
    function stopReservationUpdates() {
      if (reservationUpdateInterval) {
        clearInterval(reservationUpdateInterval);
      }
    }
    
    function updateReservationData() {
      // 통계 카드 업데이트
      const statCards = document.querySelectorAll('.stat-card div:last-child');
      statCards.forEach((card, index) => {
        if (index === 0) { // 오늘 점심
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 5);
          card.textContent = currentValue + change;
        } else if (index === 1) { // 오늘 저녁
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 3);
          card.textContent = currentValue + change;
        } else if (index === 4) { // QR 미제출
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 3) - 1;
          card.textContent = Math.max(0, currentValue + change);
        }
      });
      
      // 새로운 예약 알림 (20% 확률)
      if (Math.random() > 0.8) {
        showReservationNotification('새로운 예약이 등록되었습니다.');
      }
    }
    
    function showReservationNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f6b100;
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
    
    // 페이지 로드 시 이벤트 리스너 추가
    document.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('searchInput');
      const mealFilter = document.getElementById('mealFilter');
      
      if (searchInput) {
        searchInput.addEventListener('input', performSearch);
      }
      if (mealFilter) {
        mealFilter.addEventListener('change', performSearch);
      }
      
      // 실시간 업데이트 시작
      startReservationUpdates();
      
      // 페이지 떠날 때 업데이트 중지
      window.addEventListener('beforeunload', stopReservationUpdates);
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
    <h1 style="font-size:2rem; font-weight:bold; margin-bottom:16px;">예약 관리</h1>
    <div class="stat-cards">
      <?php foreach($statCards as $card): ?>
        <div class="stat-card">
          <div style="color:#888; font-size:14px; margin-bottom:4px;"><?= htmlspecialchars($card['label']) ?></div>
          <div style="font-size:1.5rem; font-weight:bold; color:#222;"><?= htmlspecialchars($card['value']) ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="tab-menu">
      <a href="?tab=0"><button class="tab-btn<?= $tab===0?' active':'' ?>">일반 신청 (<?= count($regularReservations) ?>)</button></a>
      <a href="?tab=1"><button class="tab-btn<?= $tab===1?' active':'' ?>">추가 신청 (<?= count($additionalReservations) ?>)</button></a>
    </div>
    <div class="filter-bar">
      <input type="text" id="searchInput" class="search-box" placeholder="사용자, 부서로 검색..." />
      <select id="mealFilter" class="select-box">
        <option value="전체">전체</option>
        <option value="점심">점심</option>
        <option value="저녁">저녁</option>
      </select>
      <span style="margin-left:8px; color:#888; font-size:14px;">실시간 검색</span>
      <button type="button" class="btn btn-download" onclick="downloadExcel()">예약 현황 내보내기</button>
    </div>
    <table class="res-table">
      <tr>
        <th>부서</th><th>이름</th><th>날짜</th><th>점심</th><th>저녁</th><th>QR제출(점심)</th><th>QR제출(저녁)</th><th>제출시간(점심)</th><th>제출시간(저녁)</th>
        <?php if($tab===1): ?><th>추가 인원</th><th>신청 사유</th><th>작업</th><?php endif; ?>
      </tr>
      <?php foreach($filtered as $r): ?>
      <tr>
        <td><?= htmlspecialchars($r['department']) ?></td>
        <td><?= htmlspecialchars($r['user']) ?></td>
        <td><?= htmlspecialchars($r['date']) ?></td>
        <td><?= $r['meal']==='점심' ? '<span style="color:green;font-weight:bold;">O</span>' : '<span style="color:#aaa;">X</span>' ?></td>
        <td><?= $r['meal']==='저녁' ? '<span style="color:green;font-weight:bold;">O</span>' : '<span style="color:#aaa;">X</span>' ?></td>
        <td><?= $r['meal']==='점심' ? ($r['qr'] ? '<span style="color:#3182f6;font-weight:bold;">제출</span>' : '<span style="color:#f66570;font-weight:bold;">미제출</span>') : '-' ?></td>
        <td><?= $r['meal']==='저녁' ? ($r['qr'] ? '<span style="color:#3182f6;font-weight:bold;">제출</span>' : '<span style="color:#f66570;font-weight:bold;">미제출</span>') : '-' ?></td>
        <td><?= $r['meal']==='점심' ? ($r['time'] && $r['time']!=='-' ? htmlspecialchars($r['time']) : '-') : '-' ?></td>
        <td><?= $r['meal']==='저녁' ? ($r['time'] && $r['time']!=='-' ? htmlspecialchars($r['time']) : '-') : '-' ?></td>
        <?php if($tab===1): ?>
          <td style="color:#f6b100;font-weight:bold;">+<?= $r['count'] ?>명</td>
          <td><?= htmlspecialchars($r['reason']) ?></td>
          <td>
            <button class="btn btn-approve" onclick="showAlert('승인(실제 동작 아님)')">승인</button>
            <button class="btn btn-reject" onclick="showAlert('거절(실제 동작 아님)')">거절</button>
          </td>
        <?php endif; ?>
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