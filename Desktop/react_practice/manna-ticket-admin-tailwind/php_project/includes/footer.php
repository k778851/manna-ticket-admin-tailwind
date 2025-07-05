  <!-- 공통 JavaScript -->
  <script src="assets/js/common.js"></script>
  
  <!-- 페이지별 추가 JavaScript -->
  <?php if (isset($additionalJS)): ?>
    <?php foreach ($additionalJS as $js): ?>
      <script src="<?= $js ?>"></script>
    <?php endforeach; ?>
  <?php endif; ?>
  
  <!-- 인라인 스크립트 -->
  <?php if (isset($inlineScript)): ?>
    <script>
      <?= $inlineScript ?>
    </script>
  <?php endif; ?>
</body>
</html> 