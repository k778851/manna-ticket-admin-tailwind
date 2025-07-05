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
?>
  <script>
    function showAlert(msg) { alert(msg); }
    
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
      
      // 검색 결과 없음 메시지 처리
      const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
      const noResultsRow = document.getElementById('noResults');
      
      if (visibleRows.length === 0 && searchTerm !== '') {
        if (!noResultsRow) {
          const tbody = document.querySelector('.user-table tbody');
          const newRow = document.createElement('tr');
          newRow.id = 'noResults';
          newRow.innerHTML = '<td colspan="7" style="text-align:center; padding:20px; color:#888;">검색 결과가 없습니다.</td>';
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
    
    function editUser(name, personalNumber, department) {
      document.getElementById('editName').value = name;
      document.getElementById('editPersonalNumber').value = personalNumber;
      document.getElementById('editDepartment').value = department;
      openModal('editModal');
    }
    
    function deleteUser(name) {
      if (confirm(`정말로 ${name} 사용자를 삭제하시겠습니까?`)) {
        showAlert('삭제 기능은 실제 동작하지 않습니다.');
      }
    }
    
    // 엑셀 다운로드 기능
    function downloadExcel() {
      // CSV 형식으로 데이터 생성
      const headers = ['부서', '이름', '고유번호', '점심 예약', '저녁 예약', 'QR 제출률'];
      const data = [
        ['총무부', '김철수', '00371210-00149', '12회', '11회', '95%'],
        ['기획부', '이영희', '00371210-00150', '8회', '7회', '87%'],
        ['교육부', '박민수', '00371210-00151', '16회', '15회', '100%']
      ];
      
      let csvContent = '\uFEFF'; // BOM for UTF-8
      csvContent += headers.join(',') + '\n';
      data.forEach(row => {
        csvContent += row.join(',') + '\n';
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
      
      let csvContent = '\uFEFF';
      csvContent += headers.join(',') + '\n';
      data.forEach(row => {
        csvContent += row.join(',') + '\n';
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
    
    // 고유번호 포맷팅 함수
    function formatPersonalNumber(value) {
      // 숫자와 하이픈만 허용
      let cleaned = value.replace(/[^\d-]/g, '');
      // 하이픈 제거
      let numbers = cleaned.replace(/-/g, '');
      // 8자리 이후 하이픈 추가
      if (numbers.length <= 8) {
        return numbers;
      } else {
        return numbers.slice(0, 8) + '-' + numbers.slice(8, 13);
      }
    }
    
    // 고유번호 입력 필드에 포맷팅 적용
    function applyPersonalNumberFormat(inputId) {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', function(e) {
          e.target.value = formatPersonalNumber(e.target.value);
        });
      }
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
          const lines = csv.split('\n');
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
    
    // 실시간 업데이트 기능
    let userUpdateInterval;
    
    function startUserUpdates() {
      // 60초마다 사용자 데이터 업데이트
      userUpdateInterval = setInterval(updateUserData, 60000);
    }
    
    function stopUserUpdates() {
      if (userUpdateInterval) {
        clearInterval(userUpdateInterval);
      }
    }
    
    function updateUserData() {
      // QR 제출률 업데이트
      const progressBars = document.querySelectorAll('.progress');
      progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width);
        const change = Math.floor(Math.random() * 6) - 3; // -3 ~ +3
        const newWidth = Math.max(0, Math.min(100, currentWidth + change));
        bar.style.width = newWidth + '%';
        
        // 퍼센트 텍스트도 업데이트
        const percentText = bar.parentElement.nextElementSibling.querySelector('span');
        if (percentText) {
          percentText.textContent = newWidth + '%';
        }
      });
      
      // 예약 횟수 업데이트
      const reservationCells = document.querySelectorAll('.user-table tbody tr td:nth-child(4), .user-table tbody tr td:nth-child(5)');
      reservationCells.forEach(cell => {
        const currentText = cell.textContent;
        const currentValue = parseInt(currentText);
        if (!isNaN(currentValue)) {
          const change = Math.floor(Math.random() * 2);
          cell.textContent = (currentValue + change) + '회';
        }
      });
      
      // 새로운 사용자 알림 (10% 확률)
      if (Math.random() > 0.9) {
        showUserNotification('새로운 사용자가 등록되었습니다.');
      }
    }
    
    function showUserNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
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
      
      // 고유번호 포맷팅 적용
      applyPersonalNumberFormat('addPersonalNumber');
      applyPersonalNumberFormat('editPersonalNumber');
      
      // 실시간 업데이트 시작
      startUserUpdates();
      
      // 페이지 떠날 때 업데이트 중지
      window.addEventListener('beforeunload', stopUserUpdates);
    });
  </script>
</head>
<body>
  <?php include 'sidebar.php'; ?>
  
  <div class="main-content" id="mainContent">
    <div class="container">
    <div class="top-bar">
      <h1 style="font-size:2rem; font-weight:bold;">사용자 관리</h1>
      <div>
        <button class="btn btn-upload" onclick="openModal('uploadModal')">사용자 일괄 업로드</button>
        <button class="btn btn-download" onclick="downloadExcel()">사용자 목록 내보내기</button>
        <button class="btn btn-add" onclick="openModal('addModal')">사용자 추가</button>
      </div>
    </div>
    <div style="margin-bottom:16px;">
      <input type="text" id="searchInput" class="search-box" placeholder="이름, 고유번호, 부서로 검색..." />
      <span style="margin-left:8px; color:#888; font-size:14px;">실시간 검색</span>
    </div>
    <table class="user-table">
      <tr>
        <th>부서</th><th>이름</th><th>고유번호</th><th>점심 예약</th><th>저녁 예약</th><th>QR 제출률</th><th>편집</th>
      </tr>
      <?php foreach($filteredUsers as $row): ?>
      <tr>
        <td><?= htmlspecialchars($row['department']) ?></td>
        <td><?= htmlspecialchars($row['name']) ?></td>
        <td><?= htmlspecialchars($row['personalNumber']) ?></td>
        <td><?= $row['lunchCount'] ?>회</td>
        <td><?= $row['dinnerCount'] ?>회</td>
        <td>
          <div class="progress-bar"><div class="progress" style="width:<?= $row['qr'] ?>%;"></div></div>
          <span style="font-weight:bold; color:#222;"><?= $row['qr'] ?>%</span>
        </td>
        <td>
          <button class="btn btn-edit" onclick="editUser('<?= htmlspecialchars($row['name']) ?>', '<?= htmlspecialchars($row['personalNumber']) ?>', '<?= htmlspecialchars($row['department']) ?>')">편집</button>
          <button class="btn btn-del" onclick="deleteUser('<?= htmlspecialchars($row['name']) ?>')">삭제</button>
        </td>
      </tr>
      <?php endforeach; ?>
    </table>
  </div>

  <!-- 사용자 추가 모달 -->
  <div id="addModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">사용자 추가</div>
        <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
      </div>
      <form>
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
        <div class="modal-buttons">
          <button type="button" class="btn btn-edit" onclick="closeModal('addModal')">취소</button>
          <button type="submit" class="btn btn-add" onclick="showAlert('사용자 추가는 실제 동작하지 않습니다.'); closeModal('addModal');">추가</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 사용자 수정 모달 -->
  <div id="editModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">사용자 수정</div>
        <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
      </div>
      <form>
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
        <div class="modal-buttons">
          <button type="button" class="btn btn-edit" onclick="closeModal('editModal')">취소</button>
          <button type="submit" class="btn btn-add" onclick="showAlert('사용자 수정은 실제 동작하지 않습니다.'); closeModal('editModal');">수정</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 파일 업로드 모달 -->
  <div id="uploadModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">사용자 일괄 업로드</div>
        <button class="close-btn" onclick="closeModal('uploadModal')">&times;</button>
      </div>
      <div style="margin-bottom:20px;">
        <p style="color:#666; margin-bottom:12px;">CSV 파일을 업로드하여 사용자를 일괄 등록할 수 있습니다.</p>
        <button type="button" class="btn btn-download" onclick="downloadTemplate()">템플릿 다운로드</button>
      </div>
      <form>
        <div class="form-group">
          <label class="form-label">CSV 파일 선택 *</label>
          <input type="file" id="fileUpload" accept=".csv" class="form-input" style="padding:8px;">
        </div>
        <div class="modal-buttons">
          <button type="button" class="btn btn-edit" onclick="closeModal('uploadModal')">취소</button>
          <button type="button" class="btn btn-add" onclick="handleFileUpload()">업로드</button>
        </div>
      </form>
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