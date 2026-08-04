/**
 * NAIMUR RAHMAN CV - A4 Viewer Script
 */

function initApp() {
  const pageScaleWrapper = document.getElementById('pageScaleWrapper');
  const stage = document.querySelector('.workspace-stage');

  function autoFitZoom() {
    if (!stage || !pageScaleWrapper) return;
    const stageWidth = stage.clientWidth - 32;
    const a4Px = 794; // A4 width at 96 DPI
    if (stageWidth < a4Px) {
      const scale = Math.max((stageWidth / a4Px) * 0.96, 0.4);
      pageScaleWrapper.style.transform = `scale(${scale})`;
      pageScaleWrapper.style.transformOrigin = 'top center';
    } else {
      pageScaleWrapper.style.transform = 'scale(1)';
      pageScaleWrapper.style.transformOrigin = 'top center';
    }
  }

  window.addEventListener('resize', autoFitZoom);
  autoFitZoom();

  // Print shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      window.print();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
