<?php
// 임시 QR 데이터
$qrData = [
    ['id' => 1, 'user' => '김철수', 'department' => '총무부', 'date' => '2024-01-15', 'meal' => '점심', 'status' => '제출완료', 'time' => '12:30', 'qr_code' => 'QR001'],
    ['id' => 2, 'user' => '이영희', 'department' => '기획부', 'date' => '2024-01-15', 'meal' => '점심', 'status' => '미제출', 'time' => '-', 'qr_code' => 'QR002'],
    ['id' => 3, 'user' => '박민수', 'department' => '교육부', 'date' => '2024-01-15', 'meal' => '저녁', 'status' => '제출완료', 'time' => '18:15', 'qr_code' => 'QR003'],
    ['id' => 4, 'user' => '정수진', 'department' => '문화부', 'date' => '2024-01-15', 'meal' => '저녁', 'status' => '미제출', 'time' => '-', 'qr_code' => 'QR004'],
];

$qrStats = [
    ['label' => '오늘 QR 제출률', 'value' => '75%'],
    ['label' => '점심 QR 제출', 'value' => '45/60'],
    ['label' => '저녁 QR 제출', 'value' => '30/40'],
    ['label' => '미제출자', 'value' => '25명'],
];

$search = isset($_GET['search']) ? $_GET['search'] : '';
$mealFilter = isset($_GET['meal']) ? $_GET['meal'] : '전체';
$statusFilter = isset($_GET['status']) ? $_GET['status'] : '전체';

$filtered = array_filter($qrData, function($qr) use ($search, $mealFilter, $statusFilter) {
    $matchesSearch = !$search || strpos($qr['user'], $search) !== false || strpos($qr['department'], $search) !== false;
    $matchesMeal = $mealFilter === '전체' || $qr['meal'] === $mealFilter;
    $matchesStatus = $statusFilter === '전체' || $qr['status'] === $statusFilter;
    
    return $matchesSearch && $matchesMeal && $matchesStatus;
});
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>QR 관리</title>
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
        .container { max-width: 1200px; margin: 0 auto; padding: 32px 8px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
        .stat-card h3 { color: #6b7280; font-size: 0.875rem; font-weight: 500; margin: 0 0 0.5rem 0; }
        .stat-value { color: #2563eb; font-size: 1.5rem; font-weight: 700; margin: 0; }
        .filter-bar { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
        .search-box, .select-box { padding: 8px 12px; border-radius: 6px; border: 1px solid #d1d5db; }
        .search-box { width: 200px; }
        .btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 500; cursor: pointer; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: white; color: #374151; border: 1px solid #d1d5db; }
        .qr-table { width: 100%; border-collapse: collapse; background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
        .qr-table th, .qr-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .qr-table th { background: #f9fafb; font-weight: 600; color: #374151; }
        .status-submitted { color: #059669; background: #d1fae5; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-not-submitted { color: #dc2626; background: #fee2e2; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .qr-code { font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <?php include 'sidebar.php'; ?>
    
    <div class="main-content" id="mainContent">
        <div class="container">
            <div class="header">
                <h1 style="font-size: 2rem; font-weight: bold; margin: 0;">QR 관리</h1>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary" onclick="downloadQRReport()">QR 현황 다운로드</button>
                    <button class="btn btn-primary" onclick="generateQRCode()">QR 코드 생성</button>
                </div>
            </div>
            
            <div class="stats-grid">
                <?php foreach ($qrStats as $stat): ?>
                    <div class="stat-card">
                        <h3><?= htmlspecialchars($stat['label']) ?></h3>
                        <p class="stat-value"><?= htmlspecialchars($stat['value']) ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <div class="filter-bar">
                <input type="text" id="searchInput" class="search-box" placeholder="사용자, 부서로 검색..." />
                <select id="mealFilter" class="select-box">
                    <option value="전체">전체</option>
                    <option value="점심">점심</option>
                    <option value="저녁">저녁</option>
                </select>
                <select id="statusFilter" class="select-box">
                    <option value="전체">전체</option>
                    <option value="제출완료">제출완료</option>
                    <option value="미제출">미제출</option>
                </select>
                <span style="color: #6b7280; font-size: 14px;">실시간 필터링</span>
            </div>
            
            <table class="qr-table">
                <thead>
                    <tr>
                        <th>QR 코드</th>
                        <th>부서</th>
                        <th>이름</th>
                        <th>날짜</th>
                        <th>식사</th>
                        <th>상태</th>
                        <th>제출 시간</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($filtered as $qr): ?>
                        <tr>
                            <td><span class="qr-code"><?= htmlspecialchars($qr['qr_code']) ?></span></td>
                            <td><?= htmlspecialchars($qr['department']) ?></td>
                            <td><?= htmlspecialchars($qr['user']) ?></td>
                            <td><?= htmlspecialchars($qr['date']) ?></td>
                            <td><?= htmlspecialchars($qr['meal']) ?></td>
                            <td>
                                <span class="<?= $qr['status'] === '제출완료' ? 'status-submitted' : 'status-not-submitted' ?>">
                                    <?= htmlspecialchars($qr['status']) ?>
                                </span>
                            </td>
                            <td><?= htmlspecialchars($qr['time']) ?></td>
                            <td>
                                <button class="btn btn-secondary" onclick="viewQR('<?= htmlspecialchars($qr['qr_code']) ?>')">상세</button>
                                <button class="btn btn-primary" onclick="resendQR('<?= htmlspecialchars($qr['qr_code']) ?>')">재전송</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function downloadQRReport() {
            alert('QR 현황 다운로드 기능은 실제 동작하지 않습니다.');
        }
        
        function generateQRCode() {
            alert('QR 코드 생성 기능은 실제 동작하지 않습니다.');
        }
        
        function viewQR(qrCode) {
            alert(`QR 코드 ${qrCode} 상세보기 기능은 실제 동작하지 않습니다.`);
        }
        
        function resendQR(qrCode) {
            alert(`QR 코드 ${qrCode} 재전송 기능은 실제 동작하지 않습니다.`);
        }
        
        // 실시간 검색 및 필터링
        function performSearch() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const mealFilter = document.getElementById('mealFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const tableRows = document.querySelectorAll('.qr-table tbody tr');
            
            tableRows.forEach(row => {
                const user = row.cells[2].textContent.toLowerCase();
                const department = row.cells[1].textContent.toLowerCase();
                const meal = row.cells[4].textContent;
                const status = row.cells[5].textContent;
                
                const matchesSearch = user.includes(searchTerm) || department.includes(searchTerm);
                const matchesMeal = mealFilter === '전체' || meal === mealFilter;
                const matchesStatus = statusFilter === '전체' || status === statusFilter;
                
                if (matchesSearch && matchesMeal && matchesStatus) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        // 이벤트 리스너 추가
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            const mealFilter = document.getElementById('mealFilter');
            const statusFilter = document.getElementById('statusFilter');
            
            searchInput.addEventListener('input', performSearch);
            mealFilter.addEventListener('change', performSearch);
            statusFilter.addEventListener('change', performSearch);
        });
        
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
            setTimeout(updateMainContentMargin, 300);
        };
        
        // 초기 로드 시 여백 설정
        document.addEventListener('DOMContentLoaded', function() {
            updateMainContentMargin();
        });
    </script>
</body>
</html> 