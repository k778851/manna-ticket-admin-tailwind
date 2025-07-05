<?php
// 임시 QR 데이터
$qrCodes = [
  [ 'id'=>1, 'name'=>'점심 QR 코드', 'type'=>'lunch', 'date'=>'2024-01-15', 'time'=>'12:00', 'status'=>'active', 'submissions'=>85, 'total'=>120 ],
  [ 'id'=>2, 'name'=>'저녁 QR 코드', 'type'=>'dinner', 'date'=>'2024-01-15', 'time'=>'18:00', 'status'=>'active', 'submissions'=>65, 'total'=>80 ],
  [ 'id'=>3, 'name'=>'점심 QR 코드', 'type'=>'lunch', 'date'=>'2024-01-16', 'time'=>'12:00', 'status'=>'pending', 'submissions'=>0, 'total'=>0 ],
  [ 'id'=>4, 'name'=>'저녁 QR 코드', 'type'=>'dinner', 'date'=>'2024-01-16', 'time'=>'18:00', 'status'=>'pending', 'submissions'=>0, 'total'=>0 ],
];

$currentTab = isset($_GET['tab']) ? $_GET['tab'] : 'codes';

// 페이지 설정
$pageTitle = 'QR 관리';
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

function generateQR(id, name, type, date, time) {
  document.getElementById('generateId').value = id;
  document.getElementById('generateName').value = name;
  document.getElementById('generateType').value = type;
  document.getElementById('generateDate').value = date;
  document.getElementById('generateTime').value = time;
  openModal('generateModal');
}

function editQR(id, name, type, date, time) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editType').value = type;
  document.getElementById('editDate').value = date;
  document.getElementById('editTime').value = time;
  openModal('editModal');
}

function deleteQR(id, name) {
  showConfirm(`${name}을 삭제하시겠습니까?`, function() {
    showAlert('QR 코드가 삭제되었습니다.', 'success');
  });
}

function toggleQRStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const statusText = newStatus === 'active' ? '활성화' : '비활성화';
  showAlert(`QR 코드가 ${statusText}되었습니다.`, 'success');
}

function viewSubmissions(id, name) {
  openModal('submissionsModal');
  // 실제 구현에서는 AJAX로 제출 데이터를 가져옴
}

function downloadQR(id, name) {
  showAlert(`${name}이 다운로드되었습니다.`, 'success');
}

function copyQRUrl(id, name) {
  const url = `https://example.com/qr/${id}`;
  navigator.clipboard.writeText(url).then(function() {
    showAlert('QR 코드 URL이 클립보드에 복사되었습니다.', 'success');
  });
}

function exportQRData() {
  showAlert('QR 데이터가 엑셀 파일로 내보내졌습니다.', 'success');
}

// 페이지 초기화
function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab') || 'codes';
  switchTab(currentTab);
}
";

include 'includes/header.php';
?>

<?php include 'sidebar.php'; ?>

<div class="main-content" id="mainContent">
  <div class="container">
    <div class="top-bar">
      <h1>QR 관리</h1>
      <div class="flex gap-2">
        <button class="btn btn-secondary" onclick="exportQRData()">
          <i class="fas fa-download"></i> 데이터 내보내기
        </button>
        <button class="btn btn-primary" onclick="openModal('addModal')">
          <i class="fas fa-plus"></i> QR 코드 생성
        </button>
      </div>
    </div>
    
    <div class="tab-menu">
      <button class="tab-btn active" data-tab="codes" onclick="switchTab('codes')">
        <i class="fas fa-qrcode"></i> QR 코드 관리
      </button>
      <button class="tab-btn" data-tab="submissions" onclick="switchTab('submissions')">
        <i class="fas fa-list-check"></i> 제출 현황
      </button>
      <button class="tab-btn" data-tab="analytics" onclick="switchTab('analytics')">
        <i class="fas fa-chart-line"></i> 통계
      </button>
    </div>
    
    <!-- QR 코드 관리 탭 -->
    <div id="codesContent" class="tab-content active">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">QR 코드 목록</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>QR 코드명</th>
                  <th>유형</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>상태</th>
                  <th>제출률</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach($qrCodes as $qr): ?>
                <tr>
                  <td><?= htmlspecialchars($qr['name']) ?></td>
                  <td>
                    <span class="px-2 py-1 rounded text-xs <?= $qr['type'] === 'lunch' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800' ?>">
                      <?= $qr['type'] === 'lunch' ? '점심' : '저녁' ?>
                    </span>
                  </td>
                  <td><?= htmlspecialchars($qr['date']) ?></td>
                  <td><?= htmlspecialchars($qr['time']) ?></td>
                  <td>
                    <?php
                    $statusClass = $qr['status'] === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
                    $statusText = $qr['status'] === 'active' ? '활성' : '대기';
                    ?>
                    <span class="px-2 py-1 rounded text-xs <?= $statusClass ?>">
                      <?= $statusText ?>
                    </span>
                  </td>
                  <td>
                    <?php if($qr['total'] > 0): ?>
                      <div class="flex items-center gap-2">
                        <div class="progress-bar" style="width: 60px;">
                          <div class="progress" style="width: <?= round($qr['submissions'] / $qr['total'] * 100) ?>%;"></div>
                        </div>
                        <span class="text-sm font-semibold"><?= round($qr['submissions'] / $qr['total'] * 100) ?>%</span>
                      </div>
                    <?php else: ?>
                      <span class="text-muted">-</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-secondary btn-sm" onclick="generateQR(<?= $qr['id'] ?>, '<?= htmlspecialchars($qr['name']) ?>', '<?= $qr['type'] ?>', '<?= $qr['date'] ?>', '<?= $qr['time'] ?>')">
                        <i class="fas fa-qrcode"></i>
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="editQR(<?= $qr['id'] ?>, '<?= htmlspecialchars($qr['name']) ?>', '<?= $qr['type'] ?>', '<?= $qr['date'] ?>', '<?= $qr['time'] ?>')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-info btn-sm" onclick="viewSubmissions(<?= $qr['id'] ?>, '<?= htmlspecialchars($qr['name']) ?>')">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="deleteQR(<?= $qr['id'] ?>, '<?= htmlspecialchars($qr['name']) ?>')">
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
    
    <!-- 제출 현황 탭 -->
    <div id="submissionsContent" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">QR 제출 현황</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card">
              <div class="card-body">
                <div class="text-sm text-muted mb-2">총 제출</div>
                <div class="text-3xl font-bold text-primary">150건</div>
                <div class="text-xs text-muted">오늘 기준</div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body">
                <div class="text-sm text-muted mb-2">점심 제출</div>
                <div class="text-3xl font-bold text-success">85건</div>
                <div class="text-xs text-muted">70.8%</div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body">
                <div class="text-sm text-muted mb-2">저녁 제출</div>
                <div class="text-3xl font-bold text-info">65건</div>
                <div class="text-xs text-muted">81.3%</div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body">
                <div class="text-sm text-muted mb-2">미제출</div>
                <div class="text-3xl font-bold text-warning">50건</div>
                <div class="text-xs text-muted">25%</div>
              </div>
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>QR 코드</th>
                  <th>유형</th>
                  <th>날짜</th>
                  <th>제출자</th>
                  <th>제출 시간</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>점심 QR 코드</td>
                  <td><span class="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">점심</span></td>
                  <td>2024-01-15</td>
                  <td>김철수</td>
                  <td>11:45</td>
                  <td><span class="text-green-600"><i class="fas fa-check"></i> 제출</span></td>
                </tr>
                <tr>
                  <td>점심 QR 코드</td>
                  <td><span class="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">점심</span></td>
                  <td>2024-01-15</td>
                  <td>이영희</td>
                  <td>12:15</td>
                  <td><span class="text-green-600"><i class="fas fa-check"></i> 제출</span></td>
                </tr>
                <tr>
                  <td>저녁 QR 코드</td>
                  <td><span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">저녁</span></td>
                  <td>2024-01-15</td>
                  <td>박민수</td>
                  <td>18:30</td>
                  <td><span class="text-red-600"><i class="fas fa-times"></i> 미제출</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 통계 탭 -->
    <div id="analyticsContent" class="tab-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold">일별 제출 현황</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span>2024-01-15</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 75%;"></div>
                  </div>
                  <span class="text-sm font-semibold">75%</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span>2024-01-14</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 82%;"></div>
                  </div>
                  <span class="text-sm font-semibold">82%</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span>2024-01-13</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 68%;"></div>
                  </div>
                  <span class="text-sm font-semibold">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold">부서별 제출률</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span>개발팀</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 90%;"></div>
                  </div>
                  <span class="text-sm font-semibold">90%</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span>디자인팀</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 75%;"></div>
                  </div>
                  <span class="text-sm font-semibold">75%</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span>기획팀</span>
                <div class="flex items-center gap-2">
                  <div class="progress-bar" style="width: 100px;">
                    <div class="progress" style="width: 85%;"></div>
                  </div>
                  <span class="text-sm font-semibold">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- QR 코드 생성 모달 -->
<div id="addModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">QR 코드 생성</h3>
      <button class="close-btn" onclick="closeModal('addModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <div class="form-group">
          <label class="form-label">QR 코드명 *</label>
          <input type="text" class="form-input" placeholder="예: 점심 QR 코드" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">유형 *</label>
            <select class="form-select" required>
              <option value="">선택하세요</option>
              <option value="lunch">점심</option>
              <option value="dinner">저녁</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">날짜 *</label>
            <input type="date" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">시간 *</label>
            <input type="time" class="form-input" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">설명</label>
          <textarea class="form-textarea" placeholder="QR 코드에 대한 설명"></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('addModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('QR 코드가 생성되었습니다.', 'success'); closeModal('addModal');">생성</button>
    </div>
  </div>
</div>

<!-- QR 코드 수정 모달 -->
<div id="editModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">QR 코드 수정</h3>
      <button class="close-btn" onclick="closeModal('editModal')">&times;</button>
    </div>
    <div class="modal-body">
      <form class="needs-validation">
        <input type="hidden" id="editId">
        <div class="form-group">
          <label class="form-label">QR 코드명 *</label>
          <input type="text" id="editName" class="form-input" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">유형 *</label>
            <select id="editType" class="form-select" required>
              <option value="">선택하세요</option>
              <option value="lunch">점심</option>
              <option value="dinner">저녁</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">날짜 *</label>
            <input type="date" id="editDate" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">시간 *</label>
            <input type="time" id="editTime" class="form-input" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">설명</label>
          <textarea class="form-textarea" placeholder="QR 코드에 대한 설명"></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">취소</button>
      <button type="submit" class="btn btn-primary" onclick="showAlert('QR 코드가 수정되었습니다.', 'success'); closeModal('editModal');">수정</button>
    </div>
  </div>
</div>

<!-- QR 코드 생성 모달 -->
<div id="generateModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">QR 코드 생성</h3>
      <button class="close-btn" onclick="closeModal('generateModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div class="text-center">
        <div class="mb-4">
          <div class="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center rounded">
            <div class="text-center">
              <i class="fas fa-qrcode text-6xl text-gray-400"></i>
              <div class="text-sm text-muted mt-2">QR 코드 이미지</div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="text-sm text-muted mb-2">QR 코드 정보</div>
          <div class="p-3 bg-gray-100 rounded text-sm">
            <div><strong>이름:</strong> <span id="generateName"></span></div>
            <div><strong>유형:</strong> <span id="generateType"></span></div>
            <div><strong>날짜:</strong> <span id="generateDate"></span></div>
            <div><strong>시간:</strong> <span id="generateTime"></span></div>
          </div>
        </div>
        <div class="mb-4">
          <div class="text-sm text-muted mb-2">QR 코드 URL</div>
          <div class="p-3 bg-gray-100 rounded text-sm font-mono">https://example.com/qr/<span id="generateId"></span></div>
        </div>
        <div class="flex gap-2 justify-center">
          <button class="btn btn-primary" onclick="downloadQR(document.getElementById('generateId').value, document.getElementById('generateName').value)">
            <i class="fas fa-download"></i> 다운로드
          </button>
          <button class="btn btn-secondary" onclick="copyQRUrl(document.getElementById('generateId').value, document.getElementById('generateName').value)">
            <i class="fas fa-copy"></i> URL 복사
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 제출 현황 모달 -->
<div id="submissionsModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">제출 현황</h3>
      <button class="close-btn" onclick="closeModal('submissionsModal')">&times;</button>
    </div>
    <div class="modal-body">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>이름</th>
              <th>부서</th>
              <th>제출 시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>김철수</td>
              <td>개발팀</td>
              <td>11:45</td>
              <td><span class="text-green-600"><i class="fas fa-check"></i> 제출</span></td>
            </tr>
            <tr>
              <td>이영희</td>
              <td>디자인팀</td>
              <td>12:15</td>
              <td><span class="text-green-600"><i class="fas fa-check"></i> 제출</span></td>
            </tr>
            <tr>
              <td>박민수</td>
              <td>기획팀</td>
              <td>-</td>
              <td><span class="text-red-600"><i class="fas fa-times"></i> 미제출</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include 'includes/footer.php'; ?> 