<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="만나 티켓 관리 시스템">
  <meta name="author" content="Manna Ticket Admin">
  
  <title><?= isset($pageTitle) ? $pageTitle . ' - 만나 티켓 관리' : '만나 티켓 관리' ?></title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="assets/css/common.css">
  
  <!-- 페이지별 추가 CSS -->
  <?php if (isset($additionalCSS)): ?>
    <?php foreach ($additionalCSS as $css): ?>
      <link rel="stylesheet" href="<?= $css ?>">
    <?php endforeach; ?>
  <?php endif; ?>
</head>
<body> 