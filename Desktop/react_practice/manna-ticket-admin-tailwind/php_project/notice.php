<?php
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
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>공지사항</title>
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
    .stat-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
    .stat-card { background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; padding:20px; text-align:center; }
    .btn { padding:6px 14px; border-radius:6px; border:none; font-weight:bold; cursor:pointer; margin:0 2px; }
    .btn-add { background:#3182f6; color:#fff; }
    .notice-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; overflow:hidden; margin-bottom:24px; }
    .notice-table th, .notice-table td { border:1px solid #eee; padding:10px 8px; text-align:center; }
    .notice-table th { background:#f7f8fa; color:#333; font-weight:bold; }
    .notice-table td { color:#444; }
    .badge-new { background:#f66570; color:#fff; border-radius:6px; padding:2px 8px; font-size:13px; font-weight:bold; margin-left:4px; }
    .badge-fixed { background:#3182f6; color:#fff; border-radius:6px; padding:2px 8px; font-size:13px; font-weight:bold; margin-left:4px; }
    .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; }
    .modal-content { background:#fff; border-radius:12px; padding:24px; min-width:500px; max-width:90%; max-height:90%; overflow-y:auto; }
    .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .modal-title { font-size:1.5rem; font-weight:bold; color:#222; }
    .close-btn { background:none; border:none; font-size:24px; color:#888; cursor:pointer; }
    .form-group { margin-bottom:16px; }
    .form-label { display:block; margin-bottom:6px; font-weight:bold; color:#333; }
    .form-input { width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
    .form-textarea { width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; resize:vertical; min-height:100px; }
    .form-select { width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
    .modal-buttons { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }
    .view-info { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
    .view-item { background:#f7f8fa; padding:12px; border-radius:6px; }
    .view-label { font-size:12px; color:#888; margin-bottom:4px; }
    .view-value { font-weight:bold; color:#222; }
  </style>
  <script>
    function showAlert(msg) { alert(msg); }
    
    // 실시간 검색 기능
    function performSearch() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const tableRows = document.querySelectorAll('.notice-table tbody tr');
      
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
          const tbody = document.querySelector('.notice-table tbody');
          const newRow = document.createElement('tr');
          newRow.id = 'noResults';
          newRow.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; color:#888;">검색 결과가 없습니다.</td>';
          tbody.appendChild(newRow);
        }
      } else if (noResultsRow) {
        noResultsRow.remove();
      }
    }
    
    // 모달 기능
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'flex';
    }
    
    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
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
        showAlert('삭제 기능은 실제 동작하지 않습니다.');
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
    
    // 실시간 업데이트 기능
    let noticeUpdateInterval;
    
    function startNoticeUpdates() {
      // 90초마다 공지사항 데이터 업데이트
      noticeUpdateInterval = setInterval(updateNoticeData, 90000);
    }
    
    function stopNoticeUpdates() {
      if (noticeUpdateInterval) {
        clearInterval(noticeUpdateInterval);
      }
    }
    
    function updateNoticeData() {
      // 조회수 업데이트
      const viewCells = document.querySelectorAll('.notice-table tbody tr td:nth-child(4)');
      viewCells.forEach(cell => {
        const currentText = cell.textContent;
        const currentValue = parseInt(currentText);
        if (!isNaN(currentValue)) {
          const change = Math.floor(Math.random() * 5);
          cell.textContent = (currentValue + change) + '회';
        }
      });
      
      // 통계 카드 업데이트
      const statCards = document.querySelectorAll('.stat-card div:last-child');
      statCards.forEach((card, index) => {
        if (index === 0) { // 전체 공지
          const currentValue = parseInt(card.textContent);
          const change = Math.floor(Math.random() * 2);
          card.textContent = currentValue + change;
        }
      });
      
      // 새로운 공지사항 알림 (5% 확률)
      if (Math.random() > 0.95) {
        showNoticeNotification('새로운 공지사항이 등록되었습니다.');
      }
    }
    
    function showNoticeNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
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
      startNoticeUpdates();
      
      // 페이지 떠날 때 업데이트 중지
      window.addEventListener('beforeunload', stopNoticeUpdates);
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
    <h1 style="font-size:2rem; font-weight:bold; margin-bottom:16px;">공지사항</h1>
    <div style="display:flex; gap:8px; margin-bottom:16px;">
      <button class="btn btn-add" onclick="openModal('addModal')">공지사항 추가</button>
      <button class="btn btn-download" onclick="downloadExcel()">엑셀 다운로드</button>
    </div>
    <div style="margin-bottom:16px;">
      <input type="text" id="searchInput" class="search-box" placeholder="제목으로 검색..." style="padding:8px 12px; border-radius:6px; border:1px solid #ccc; width:220px;" />
      <span style="margin-left:8px; color:#888; font-size:14px;">실시간 검색</span>
    </div>
    <div class="stat-cards">
      <?php foreach($noticeStats as $stat): ?>
        <div class="stat-card">
          <div style="color:#888; font-size:14px; margin-bottom:4px;"><?= htmlspecialchars($stat['label']) ?></div>
          <div style="font-size:1.5rem; font-weight:bold; color:#222;"><?= htmlspecialchars($stat['value']) ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    <table class="notice-table">
      <tr>
        <th>제목</th><th>중요도</th><th>상태</th><th>조회수</th><th>작성일</th><th>편집</th>
      </tr>
      <?php foreach($notices as $n): ?>
      <tr>
        <td style="text-align:left; font-weight:bold; color:#222;">
          <?= htmlspecialchars($n['title']) ?>
          <?php if($n['isNew']): ?><span class="badge-new">NEW</span><?php endif; ?>
          <?php if($n['isFixed']): ?><span class="badge-fixed">고정</span><?php endif; ?>
        </td>
        <td><?= htmlspecialchars($n['priority']) ?></td>
        <td><?= htmlspecialchars($n['status']) ?></td>
        <td><?= htmlspecialchars($n['views']) ?>회</td>
        <td><?= htmlspecialchars($n['date']) ?></td>
        <td>
          <button class="btn btn-edit" onclick="viewNotice('<?= htmlspecialchars($n['title']) ?>', '<?= htmlspecialchars($n['content']) ?>', '<?= htmlspecialchars($n['priority']) ?>', '<?= htmlspecialchars($n['status']) ?>', '<?= htmlspecialchars($n['views']) ?>', '<?= htmlspecialchars($n['date']) ?>')">상세</button>
          <button class="btn btn-edit" onclick="editNotice('<?= htmlspecialchars($n['title']) ?>', '<?= htmlspecialchars($n['content']) ?>', '<?= htmlspecialchars($n['priority']) ?>')">수정</button>
          <button class="btn btn-del" onclick="deleteNotice('<?= htmlspecialchars($n['title']) ?>')">삭제</button>
        </td>
      </tr>
      <?php endforeach; ?>
    </table>
  </div>

  <!-- 공지사항 추가 모달 -->
  <div id="addModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">공지사항 작성</div>
        <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
      </div>
      <form>
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
        <div class="modal-buttons">
          <button type="button" class="btn btn-edit" onclick="closeModal('addModal')">취소</button>
          <button type="submit" class="btn btn-add" onclick="showAlert('공지사항 추가는 실제 동작하지 않습니다.'); closeModal('addModal');">등록</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 공지사항 수정 모달 -->
  <div id="editModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">공지사항 수정</div>
        <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
      </div>
      <form>
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
        <div class="modal-buttons">
          <button type="button" class="btn btn-edit" onclick="closeModal('editModal')">취소</button>
          <button type="submit" class="btn btn-add" onclick="showAlert('공지사항 수정은 실제 동작하지 않습니다.'); closeModal('editModal');">수정</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 공지사항 상세보기 모달 -->
  <div id="viewModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">공지사항 상세보기</div>
        <button class="close-btn" onclick="closeModal('viewModal')">&times;</button>
      </div>
      <div class="view-info">
        <div class="view-item">
          <div class="view-label">중요도</div>
          <div class="view-value" id="viewPriority"></div>
        </div>
        <div class="view-item">
          <div class="view-label">상태</div>
          <div class="view-value" id="viewStatus"></div>
        </div>
        <div class="view-item">
          <div class="view-label">조회수</div>
          <div class="view-value" id="viewViews"></div>
        </div>
        <div class="view-item">
          <div class="view-label">작성일</div>
          <div class="view-value" id="viewDate"></div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">제목</label>
        <div style="padding:10px; background:#f7f8fa; border-radius:6px; font-weight:bold;" id="viewTitle"></div>
      </div>
      <div class="form-group">
        <label class="form-label">내용</label>
        <div style="padding:10px; background:#f7f8fa; border-radius:6px; min-height:100px; white-space:pre-wrap;" id="viewContent"></div>
      </div>
      <div class="modal-buttons">
        <button type="button" class="btn btn-edit" onclick="closeModal('viewModal')">닫기</button>
        </div>
      </div>
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