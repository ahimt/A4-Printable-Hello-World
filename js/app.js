/**
 * A4 Printable Hello World Website - Vanilla JavaScript Logic
 * Standard HTML5 + Bootstrap 5.3 CDN + CSS3 + Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const a4Page = document.getElementById('a4Page');
  const pageScaleWrapper = document.getElementById('pageScaleWrapper');
  const overflowStatus = document.getElementById('overflowStatus');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const zoomLevelText = document.getElementById('zoomLevelText');

  // Input Controls
  const inputHeading = document.getElementById('inputHeading');
  const inputSubtitle = document.getElementById('inputSubtitle');
  const inputBody = document.getElementById('inputBody');
  const inputSender = document.getElementById('inputSender');
  const inputDate = document.getElementById('inputDate');
  const inputFooter = document.getElementById('inputFooter');
  const inputWatermark = document.getElementById('inputWatermark');

  // Style Controls
  const selectPreset = document.getElementById('selectPreset');
  const selectFont = document.getElementById('selectFont');
  const selectFontSize = document.getElementById('selectFontSize');
  const selectAlign = document.getElementById('selectAlign');
  const selectMargin = document.getElementById('selectMargin');
  const selectFrame = document.getElementById('selectFrame');
  const toggleGrid = document.getElementById('toggleGrid');

  // Target Print Elements inside A4 Sheet
  const printHeading = document.getElementById('printHeading');
  const printSubtitle = document.getElementById('printSubtitle');
  const printBody = document.getElementById('printBody');
  const printSender = document.getElementById('printSender');
  const printDate = document.getElementById('printDate');
  const printFooter = document.getElementById('printFooter');
  const printWatermark = document.getElementById('printWatermark');
  const printContentMain = document.getElementById('printContentMain');
  const printDivider = document.getElementById('printDivider');

  // Action Buttons
  const btnPrint = document.getElementById('btnPrint');
  const btnPrintNav = document.getElementById('btnPrintNav');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');

  let currentZoom = 0.85;

  // Set default current date if empty
  if (inputDate && !inputDate.value) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    inputDate.value = formattedDate;
    if (printDate) printDate.textContent = formattedDate;
  }

  // --- Real-time Text Binding ---
  function bindText(inputEl, targetEl) {
    if (!inputEl || !targetEl) return;
    inputEl.addEventListener('input', () => {
      targetEl.textContent = inputEl.value;
      checkOverflow();
    });
  }

  bindText(inputHeading, printHeading);
  bindText(inputSubtitle, printSubtitle);
  bindText(inputBody, printBody);
  bindText(inputSender, printSender);
  bindText(inputDate, printDate);
  bindText(inputFooter, printFooter);

  // Watermark Binding
  if (inputWatermark && printWatermark) {
    inputWatermark.addEventListener('input', () => {
      const val = inputWatermark.value.trim();
      printWatermark.textContent = val;
      printWatermark.style.display = val ? 'block' : 'none';
    });
  }

  // --- Typography & Layout Control Listeners ---
  if (selectFont) {
    selectFont.addEventListener('change', (e) => {
      a4Page.classList.remove('font-serif', 'font-sans', 'font-display', 'font-mono');
      a4Page.classList.add(e.target.value);
      checkOverflow();
    });
  }

  if (selectFontSize) {
    selectFontSize.addEventListener('change', (e) => {
      a4Page.classList.remove('size-sm', 'size-md', 'size-lg', 'size-hero');
      a4Page.classList.add(e.target.value);
      checkOverflow();
    });
  }

  if (selectAlign) {
    selectAlign.addEventListener('change', (e) => {
      const val = e.target.value;
      printHeading.className = `page-heading text-${val}`;
      printSubtitle.className = `page-subtitle text-${val}`;
      printBody.className = `page-body text-${val}`;
      
      if (printDivider) {
        if (val === 'center') {
          printDivider.classList.add('center');
        } else {
          printDivider.classList.remove('center');
        }
      }
    });
  }

  if (selectMargin) {
    selectMargin.addEventListener('change', (e) => {
      const marginMap = {
        compact: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        standard: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
        generous: { top: '30mm', bottom: '30mm', left: '25mm', right: '25mm' }
      };
      const m = marginMap[e.target.value] || marginMap.standard;
      a4Page.style.setProperty('--a4-margin-top', m.top);
      a4Page.style.setProperty('--a4-margin-bottom', m.bottom);
      a4Page.style.setProperty('--a4-margin-left', m.left);
      a4Page.style.setProperty('--a4-margin-right', m.right);
      checkOverflow();
    });
  }

  if (selectFrame) {
    selectFrame.addEventListener('change', (e) => {
      a4Page.classList.remove('frame-subtle', 'frame-double', 'frame-ornate', 'frame-corners');
      if (e.target.value !== 'none') {
        a4Page.classList.add(e.target.value);
      }
    });
  }

  if (toggleGrid) {
    toggleGrid.addEventListener('change', (e) => {
      if (e.target.checked) {
        a4Page.classList.add('show-grid');
      } else {
        a4Page.classList.remove('show-grid');
      }
    });
  }

  // --- Color Swatches ---
  const swatches = document.querySelectorAll('.color-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      const primary = btn.dataset.primary;
      const secondary = btn.dataset.secondary;
      const accent = btn.dataset.accent;
      const border = btn.dataset.border;

      a4Page.style.setProperty('--print-theme-primary', primary);
      a4Page.style.setProperty('--print-theme-secondary', secondary);
      a4Page.style.setProperty('--print-theme-accent', accent);
      a4Page.style.setProperty('--print-theme-border', border);
    });
  });

  // --- Preset Switcher ---
  const presets = {
    minimal: {
      heading: "Hello, World!",
      subtitle: "Simple, beautiful & pixel-perfect A4 printable document.",
      body: "Welcome to this clean A4 printable document. Designed with exact physical paper dimensions (210mm × 297mm), standard typographical hierarchy, and customizable themes.\n\nWhether printing to physical paper or exporting to PDF via your browser's native print engine, this template guarantees crisp vector rendering and exact margins.",
      sender: "Designed with Vanilla JS & Bootstrap 5.3",
      font: "font-serif",
      size: "size-md",
      align: "left",
      margin: "standard",
      frame: "none",
      colorIndex: 0
    },
    certificate: {
      heading: "HELLO WORLD",
      subtitle: "CERTIFICATE OF ELEGANT PRINTING",
      body: "This is to certify that this website renders a flawless single-page A4 document without external build tools or framework overhead.\n\nTested and verified for precision typography, high-contrast readability, and instant offline execution.",
      sender: "Certified Document Authority",
      font: "font-display",
      size: "size-lg",
      align: "center",
      margin: "generous",
      frame: "frame-double",
      colorIndex: 2 // Royal Navy
    },
    letterhead: {
      heading: "Hello World Notice",
      subtitle: "Official Document Release • Ref No: HW-2026-A4",
      body: "To whom it may concern,\n\nThis document demonstrates a formal A4 letterhead format. All spacing, paddings, and typographic line-heights are calculated to ensure zero overflow and precise alignment across all printer devices.\n\nYou can customize all fields using the editor on the left side of your screen.",
      sender: "Operations Team",
      font: "font-sans",
      size: "size-sm",
      align: "left",
      margin: "standard",
      frame: "frame-subtle",
      colorIndex: 1 // Deep Emerald
    },
    poster: {
      heading: "HELLO, WORLD!",
      subtitle: "CREATIVITY ON A4 CANVAS",
      body: "SIMPLE • ELEGANT • PRINTABLE",
      sender: "2026 Edition",
      font: "font-mono",
      size: "size-hero",
      align: "center",
      margin: "compact",
      frame: "frame-ornate",
      colorIndex: 4 // Crimson
    }
  };

  if (selectPreset) {
    selectPreset.addEventListener('change', (e) => {
      const presetKey = e.target.value;
      const p = presets[presetKey];
      if (!p) return;

      inputHeading.value = p.heading;
      printHeading.textContent = p.heading;

      inputSubtitle.value = p.subtitle;
      printSubtitle.textContent = p.subtitle;

      inputBody.value = p.body;
      printBody.textContent = p.body;

      inputSender.value = p.sender;
      printSender.textContent = p.sender;

      selectFont.value = p.font;
      selectFont.dispatchEvent(new Event('change'));

      selectFontSize.value = p.size;
      selectFontSize.dispatchEvent(new Event('change'));

      selectAlign.value = p.align;
      selectAlign.dispatchEvent(new Event('change'));

      selectMargin.value = p.margin;
      selectMargin.dispatchEvent(new Event('change'));

      selectFrame.value = p.frame;
      selectFrame.dispatchEvent(new Event('change'));

      if (swatches[p.colorIndex]) {
        swatches[p.colorIndex].click();
      }
    });
  }

  // --- Zoom Controls ---
  function updateZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, 0.4), 1.5);
    pageScaleWrapper.style.transform = `scale(${currentZoom})`;
    zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  if (btnZoomIn) btnZoomIn.addEventListener('click', () => updateZoom(currentZoom + 0.1));
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => updateZoom(currentZoom - 0.1));
  if (btnZoomReset) btnZoomReset.addEventListener('click', () => updateZoom(0.85));

  // Auto-fit zoom based on viewport width
  function autoFitZoom() {
    const stageWidth = document.querySelector('.workspace-stage').clientWidth - 64;
    // A4 width in px approx ~ 794px at 96dpi
    const a4Px = 794;
    if (stageWidth < a4Px) {
      const calculatedZoom = Math.max((stageWidth / a4Px) * 0.95, 0.45);
      updateZoom(calculatedZoom);
    } else {
      updateZoom(0.85);
    }
  }

  window.addEventListener('resize', autoFitZoom);
  autoFitZoom();

  // --- Overflow Detection ---
  function checkOverflow() {
    // Small delay to allow CSS layout reflow
    setTimeout(() => {
      const scrollH = a4Page.scrollHeight;
      const clientH = a4Page.clientHeight;

      if (scrollH > clientH + 2) {
        statusIndicator.className = 'status-indicator overflow';
        statusText.textContent = '⚠️ Content exceeds 1 A4 page (will spill onto page 2)';
      } else {
        statusIndicator.className = 'status-indicator valid';
        statusText.textContent = '✓ Fits 1 A4 Page Perfectly';
      }
    }, 50);
  }

  checkOverflow();

  // --- Print Trigger ---
  function triggerPrint() {
    window.print();
  }

  if (btnPrint) btnPrint.addEventListener('click', triggerPrint);
  if (btnPrintNav) btnPrintNav.addEventListener('click', triggerPrint);

  // Keyboard shortcut Ctrl+P or Cmd+P
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      triggerPrint();
    }
  });
});
