<?php
// 도움말 데이터
$helpSections = [
    'getting-started' => [
        'title' => '시작하기',
        'items' => [
            ['title' => '시스템 소개', 'content' => '만나식권 관리자는 식사 예약과 QR 코드 관리를 위한 통합 관리 시스템입니다.'],
            ['title' => '첫 로그인', 'content' => '관리자 계정으로 로그인하여 대시보드를 확인하고 시스템을 둘러보세요.'],
            ['title' => '기본 설정', 'content' => '설정 메뉴에서 시스템 기본값을 확인하고 필요에 따라 조정하세요.']
        ]
    ],
    'reservation' => [
        'title' => '예약 관리',
        'items' => [
            ['title' => '예약 확인', 'content' => '예약 관리 페이지에서 일반 예약과 추가 예약을 확인할 수 있습니다.'],
            ['title' => '예약 승인/거절', 'content' => '추가 예약 신청에 대해 승인 또는 거절 처리를 할 수 있습니다.'],
            ['title' => '예약 통계', 'content' => '대시보드에서 예약 현황과 통계를 실시간으로 확인할 수 있습니다.']
        ]
    ],
    'qr-management' => [
        'title' => 'QR 관리',
        'items' => [
            ['title' => 'QR 코드 생성', 'content' => 'QR 관리 페이지에서 개별 또는 일괄 QR 코드를 생성할 수 있습니다.'],
            ['title' => 'QR 제출 현황', 'content' => '사용자별 QR 코드 제출 현황을 확인하고 미제출자에게 알림을 보낼 수 있습니다.'],
            ['title' => 'QR 재전송', 'content' => 'QR 코드를 받지 못한 사용자에게 재전송할 수 있습니다.']
        ]
    ],
    'user-management' => [
        'title' => '사용자 관리',
        'items' => [
            ['title' => '사용자 등록', 'content' => '개별 사용자 등록 또는 CSV 파일을 통한 일괄 등록이 가능합니다.'],
            ['title' => '사용자 정보 수정', 'content' => '사용자 정보를 수정하고 부서 변경 등을 처리할 수 있습니다.'],
            ['title' => '사용자 통계', 'content' => '사용자별 예약 횟수와 QR 제출률을 확인할 수 있습니다.']
        ]
    ],
    'menu-management' => [
        'title' => '메뉴 관리',
        'items' => [
            ['title' => '메뉴 등록', 'content' => '새로운 메뉴를 등록하고 카테고리별로 관리할 수 있습니다.'],
            ['title' => '메뉴 상태 관리', 'content' => '메뉴의 활성/비활성 상태를 변경하여 예약 가능 여부를 제어합니다.'],
            ['title' => '메뉴 인기도', 'content' => '메뉴별 주문 현황과 인기도를 확인할 수 있습니다.']
        ]
    ],
    'notifications' => [
        'title' => '공지사항',
        'items' => [
            ['title' => '공지사항 작성', 'content' => '중요한 공지사항을 작성하고 사용자들에게 전달할 수 있습니다.'],
            ['title' => '공지사항 관리', 'content' => '기존 공지사항을 수정하거나 삭제할 수 있습니다.'],
            ['title' => '공지사항 고정', 'content' => '중요한 공지사항을 상단에 고정하여 항상 보이도록 할 수 있습니다.']
        ]
    ]
];

$faqs = [
    ['question' => '예약 마감 시간은 언제인가요?', 'answer' => '기본적으로 오후 6시까지 예약을 받고 있습니다. 설정에서 변경 가능합니다.'],
    ['question' => 'QR 코드는 언제 생성되나요?', 'answer' => '예약이 확정되면 자동으로 QR 코드가 생성됩니다.'],
    ['question' => '사용자 정보를 일괄 등록하려면?', 'answer' => 'CSV 파일을 준비하여 사용자 관리 페이지에서 일괄 업로드할 수 있습니다.'],
    ['question' => '예약 취소는 어떻게 하나요?', 'answer' => '예약 관리 페이지에서 해당 예약을 선택하고 취소 처리할 수 있습니다.'],
    ['question' => '시스템 백업은 어떻게 하나요?', 'answer' => '설정 페이지에서 데이터 백업 기능을 사용할 수 있습니다.']
];

$currentSection = isset($_GET['section']) ? $_GET['section'] : 'getting-started';

$pageTitle = '도움말';
$additionalCSS = [];
$additionalJS = [];
$inlineScript = '';

include 'includes/header.php';
?>
<?php include 'sidebar.php'; ?>
<div class="main-content" id="mainContent">
  <div class="container">
    <div class="page-header mb-6">
      <h1>도움말</h1>
      <p class="text-muted">시스템 사용법과 자주 묻는 질문을 확인하세요.</p>
    </div>
    
    <div class="help-layout">
      <!-- 사이드바 네비게이션 -->
      <div class="help-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">목차</h3>
          <div class="search-box-wrapper">
            <input type="text" class="search-input" placeholder="도움말 검색..." id="helpSearch">
          </div>
        </div>
        <nav class="help-nav">
          <?php foreach ($helpSections as $key => $section): ?>
            <a href="?section=<?= $key ?>" class="nav-item <?= $currentSection === $key ? 'active' : '' ?>">
              <?= htmlspecialchars($section['title']) ?>
            </a>
          <?php endforeach; ?>
        </nav>
      </div>
      
      <!-- 메인 콘텐츠 -->
      <div class="help-content">
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-semibold"><?= htmlspecialchars($helpSections[$currentSection]['title']) ?></h2>
          </div>
          <div class="card-body">
            <?php foreach ($helpSections[$currentSection]['items'] as $item): ?>
              <div class="help-item">
                <h3 class="help-item-title"><?= htmlspecialchars($item['title']) ?></h3>
                <p class="help-item-content"><?= htmlspecialchars($item['content']) ?></p>
              </div>
            <?php endforeach; ?>
            
            <!-- FAQ 섹션 -->
            <div class="faq-section mt-8">
              <h3 class="text-lg font-semibold mb-4">자주 묻는 질문</h3>
              <?php foreach ($faqs as $faq): ?>
                <div class="faq-item">
                  <div class="faq-question">Q: <?= htmlspecialchars($faq['question']) ?></div>
                  <div class="faq-answer">A: <?= htmlspecialchars($faq['answer']) ?></div>
                </div>
              <?php endforeach; ?>
            </div>
            
            <!-- 추가 도움말 -->
            <div class="info-box mt-8">
              <h4 class="text-base font-semibold mb-3">추가 도움이 필요하신가요?</h4>
              <p class="text-sm text-muted">
                더 자세한 도움이 필요하시면 관리자에게 문의하거나 
                <a href="mailto:support@manna.com" class="text-primary hover:underline">support@manna.com</a>으로 이메일을 보내주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// 도움말 검색 기능
function performHelpSearch() {
  const searchTerm = document.getElementById('helpSearch').value.toLowerCase();
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('helpSearch');
  if (searchInput) {
    searchInput.addEventListener('input', performHelpSearch);
  }
});
</script>

<?php include 'includes/footer.php'; ?> 