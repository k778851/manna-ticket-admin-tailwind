<?php
// 현재 페이지 URL을 가져와서 활성 메뉴 항목을 결정
$current_page = basename($_SERVER['PHP_SELF']);
$menus = [
    ['path' => 'dashboard.php', 'icon' => 'dashboard', 'label' => '대시보드'],
    ['path' => 'users.php', 'icon' => 'people', 'label' => '회원 관리'],
    ['path' => 'reservations.php', 'icon' => 'calendar_today', 'label' => '예약 관리'],
    ['path' => 'qr.php', 'icon' => 'qr_code_2', 'label' => 'QR 관리'],
    ['path' => 'menu.php', 'icon' => 'menu_book', 'label' => '메뉴 관리'],
    ['path' => 'notice.php', 'icon' => 'campaign', 'label' => '공지사항'],
    ['path' => 'sponser.php', 'icon' => 'favorite_border', 'label' => '후원 관리'],
    ['path' => 'settings.php', 'icon' => 'settings', 'label' => '설정'],
    ['path' => 'help.php', 'icon' => 'help_outline', 'label' => '도움말'],
];
?>

    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <style>
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        background: white;
        border-right: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        transition: all 0.3s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 50;
        width: 256px;
    }

.sidebar.collapsed {
    width: 80px;
}

.sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
}

.sidebar-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sidebar-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sidebar-title-text {
    font-size: 1.25rem;
    font-weight: bold;
    color: #2563eb;
    letter-spacing: -0.025em;
}

.sidebar-toggle {
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    border: none;
    background: none;
    cursor: pointer;
}

.sidebar-toggle .material-icons {
    font-size: 20px;
    color: #6b7280;
    transition: color 0.2s;
}

.sidebar-toggle:hover .material-icons {
    color: #374151;
}

.sidebar-toggle:hover {
    background-color: #f3f4f6;
}

.sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.sidebar-menu-item {
    margin: 0;
}

.sidebar-menu-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: none;
    color: #374151;
    font-size: 1rem;
    font-weight: 500;
    min-height: 44px;
}

.sidebar-menu-button:hover {
    background-color: #eff6ff;
    color: #2563eb;
}

.sidebar-menu-button.active {
    background-color: #dbeafe;
    color: #2563eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.sidebar-menu-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    color: #6b7280;
    transition: color 0.2s;
}

.sidebar-menu-button:hover .sidebar-menu-icon,
.sidebar-menu-button.active .sidebar-menu-icon {
    color: #2563eb;
}

.sidebar-menu-text {
    white-space: nowrap;
}

.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.sidebar-user {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f3f4f6;
}

.sidebar-user-icon {
    font-size: 20px;
    color: #374151;
}

.sidebar-user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.sidebar-logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
    color: #2563eb;
    font-size: 0.875rem;
    font-weight: 500;
}

.sidebar-logout:hover {
    background-color: #eff6ff;
}

.sidebar-logout-icon {
    font-size: 20px;
    color: #2563eb;
}

/* 모바일 햄버거 메뉴 */
.mobile-menu-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 60;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.mobile-menu-toggle .material-icons {
    font-size: 24px;
    color: #374151;
}

.mobile-menu-toggle:hover {
    background-color: #f9fafb;
}

/* 반응형 */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        width: 256px;
    }
    
    .sidebar.mobile-open {
        transform: translateX(0);
    }
    
    .mobile-menu-toggle {
        display: block;
    }
}

@media (min-width: 769px) {
    .mobile-menu-toggle {
        display: none;
    }
}

/* 접힌 상태에서 텍스트 숨기기 */
.sidebar.collapsed .sidebar-title-text,
.sidebar.collapsed .sidebar-menu-text,
.sidebar.collapsed .sidebar-user-name,
.sidebar.collapsed .sidebar-logout-text {
    display: none;
}

.sidebar.collapsed .sidebar-menu-button {
    justify-content: center;
}

.sidebar.collapsed .sidebar-user {
    align-items: center;
}

.sidebar.collapsed .sidebar-logout {
    justify-content: center;
}
</style>

<!-- 모바일 햄버거 메뉴 버튼 -->
<button class="mobile-menu-toggle" onclick="toggleMobileSidebar()" aria-label="메뉴 열기">
    <span class="material-icons">menu</span>
</button>

<!-- 사이드바 -->
<aside id="sidebar" class="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-header-content">
            <div class="sidebar-title">
                <span class="sidebar-title-text">만나식권 관리자</span>
            </div>
            <div class="sidebar-controls">
                <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="사이드바 접기">
                    <span class="material-icons">menu</span>
                </button>
            </div>
        </div>
    </div>

    <nav class="sidebar-nav">
        <ul class="sidebar-menu">
            <?php foreach ($menus as $menu): ?>
                <li class="sidebar-menu-item">
                    <a href="<?php echo $menu['path']; ?>" 
                       class="sidebar-menu-button <?php echo ($current_page === $menu['path']) ? 'active' : ''; ?>">
                        <span class="sidebar-menu-icon material-icons"><?php echo $menu['icon']; ?></span>
                        <span class="sidebar-menu-text"><?php echo $menu['label']; ?></span>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>

    <div class="sidebar-footer">
        <div class="sidebar-user">
            <div class="sidebar-user-info">
                <span class="sidebar-user-icon material-icons">account_circle</span>
                <span class="sidebar-user-name">관리자</span>
            </div>
            <a href="login.php" class="sidebar-logout">
                <span class="sidebar-logout-icon material-icons">logout</span>
                <span class="sidebar-logout-text">로그아웃</span>
            </a>
        </div>
    </div>
</aside>

<script>
let sidebarCollapsed = false;
let mobileSidebarOpen = false;

function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

function toggleMobileSidebar() {
    mobileSidebarOpen = !mobileSidebarOpen;
    const sidebar = document.getElementById('sidebar');
    
    if (mobileSidebarOpen) {
        sidebar.classList.add('mobile-open');
    } else {
        sidebar.classList.remove('mobile-open');
    }
}

// 모바일에서 메뉴 클릭 시 사이드바 닫기
document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.sidebar-menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileSidebarOpen = false;
                document.getElementById('sidebar').classList.remove('mobile-open');
            }
        });
    });
});

// 화면 크기 변경 시 사이드바 상태 조정
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        mobileSidebarOpen = false;
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
});
</script> 