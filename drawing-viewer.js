(() => {
  const PREVIEWS = {
    "RCC-NPC-ASR-ARC-DD-00017 - 02": "assets/projects/nupco/drawing-preview/floor-plans/RCC-NPC-ASR-ARC-DD-00017--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00018 - 02": "assets/projects/nupco/drawing-preview/floor-plans/RCC-NPC-ASR-ARC-DD-00018--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00035 - 02": "assets/projects/nupco/drawing-preview/floor-plans/RCC-NPC-ASR-ARC-DD-00035--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00036 - 02": "assets/projects/nupco/drawing-preview/floor-plans/RCC-NPC-ASR-ARC-DD-00036--02.jpg",
    "RCC-NPC-ASR-ARC-DD-08001 - 00": "assets/projects/nupco/drawing-preview/floor-plans/RCC-NPC-ASR-ARC-DD-08001--00.jpg",
    "RCC-NPC-ASR-ARC-DD-00076 - 02": "assets/projects/nupco/drawing-preview/elevations/RCC-NPC-ASR-ARC-DD-00076--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00077 - 02": "assets/projects/nupco/drawing-preview/elevations/RCC-NPC-ASR-ARC-DD-00077--02.jpg",
    "RCC-NPC-ASR-ARC-DD-01451 - 00": "assets/projects/nupco/drawing-preview/wall-sections/RCC-NPC-ASR-ARC-DD-01451--00.jpg",
    "RCC-NPC-ASR-ARC-DD-00143 - 01": "assets/projects/nupco/drawing-preview/wall-sections/RCC-NPC-ASR-ARC-DD-00143--01.jpg",
    "RCC-NPC-ASR-ARC-DD-00144 - 01": "assets/projects/nupco/drawing-preview/wall-sections/RCC-NPC-ASR-ARC-DD-00144--01.jpg",
    "RCC-NPC-ASR-ARC-DD-00145 - 01": "assets/projects/nupco/drawing-preview/wall-sections/RCC-NPC-ASR-ARC-DD-00145--01.jpg",
    "RCC-NPC-ASR-ARC-DD-00121 - 02": "assets/projects/nupco/drawing-preview/stair-plans-sections/RCC-NPC-ASR-ARC-DD-00121--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00122 - 02": "assets/projects/nupco/drawing-preview/stair-plans-sections/RCC-NPC-ASR-ARC-DD-00122--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00123 - 02": "assets/projects/nupco/drawing-preview/stair-plans-sections/RCC-NPC-ASR-ARC-DD-00123--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00124 - 02": "assets/projects/nupco/drawing-preview/stair-plans-sections/RCC-NPC-ASR-ARC-DD-00124--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00007 - 02": "assets/projects/nupco/drawing-preview/miscellaneous-details/RCC-NPC-ASR-ARC-DD-00007--02.jpg",
    "RCC-NPC-ASR-ARC-DD-00701 - 00": "assets/projects/nupco/drawing-preview/miscellaneous-details/RCC-NPC-ASR-ARC-DD-00701--00.jpg",
    "RCC-NPC-ASR-ARC-DD-00702 - 00": "assets/projects/nupco/drawing-preview/miscellaneous-details/RCC-NPC-ASR-ARC-DD-00702--00.jpg",
    "RCC-NPC-ASR-ARC-DD-00703 - 00": "assets/projects/nupco/drawing-preview/miscellaneous-details/RCC-NPC-ASR-ARC-DD-00703--00.jpg"
  };

  let sheets = [], index = 0, scale = 1, x = 0, y = 0, dragging = false, startX = 0, startY = 0;
  const safe = value => encodeURI(value);

  function buildViewer() {
    if (document.querySelector('#drawing-viewer')) return;
    const viewer = document.createElement('div');
    viewer.id = 'drawing-viewer';
    viewer.className = 'drawing-viewer';
    viewer.setAttribute('aria-hidden', 'true');
    viewer.innerHTML = `
      <div class="dv-top">
        <div class="dv-heading"><span id="dv-group"></span><strong id="dv-title"></strong></div>
        <div class="dv-tools">
          <button data-dv="out" aria-label="Zoom out">−</button><span id="dv-zoom">100%</span>
          <button data-dv="in" aria-label="Zoom in">+</button><button data-dv="reset">Reset</button>
          <button class="dv-close" data-dv="close">Close</button>
        </div>
      </div>
      <div id="dv-stage" class="dv-stage"><img id="dv-image" alt="Selected architectural drawing" draggable="false"></div>
      <div class="dv-bottom"><button data-dv="prev">← Previous</button><span id="dv-count"></span><button data-dv="next">Next →</button></div>`;
    document.body.appendChild(viewer);

    viewer.addEventListener('click', e => {
      const action = e.target.closest('[data-dv]')?.dataset.dv;
      if (!action) return;
      if (action === 'close') closeViewer();
      if (action === 'prev') change(-1);
      if (action === 'next') change(1);
      if (action === 'in') setScale(scale + .2);
      if (action === 'out') setScale(scale - .2);
      if (action === 'reset') reset();
    });

    const stage = viewer.querySelector('#dv-stage');
    const image = viewer.querySelector('#dv-image');
    image.addEventListener('contextmenu', e => e.preventDefault());
    stage.addEventListener('contextmenu', e => e.preventDefault());
    stage.addEventListener('wheel', e => { e.preventDefault(); setScale(scale + (e.deltaY < 0 ? .15 : -.15)); }, { passive: false });
    stage.addEventListener('pointerdown', e => {
      if (scale <= 1) return;
      dragging = true; startX = e.clientX - x; startY = e.clientY - y;
      stage.setPointerCapture(e.pointerId); stage.classList.add('dragging');
    });
    stage.addEventListener('pointermove', e => {
      if (!dragging) return;
      x = e.clientX - startX; y = e.clientY - startY; applyTransform();
    });
    const stop = e => {
      dragging = false; stage.classList.remove('dragging');
      if (e.pointerId !== undefined && stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    };
    stage.addEventListener('pointerup', stop); stage.addEventListener('pointercancel', stop);
  }

  function enhanceDrawings() {
    const section = document.querySelector('#dialog-content .drawing-section');
    if (!section || section.dataset.viewerReady === '1') return;
    section.dataset.viewerReady = '1';
    const note = section.querySelector('.drawing-note');
    if (note) note.textContent = 'Selected sample sheets from the larger LOD 400 architectural package. Drawings open inside the portfolio viewer; original project PDFs are not exposed through the portfolio interface.';

    section.querySelectorAll('.drawing-groups article').forEach((article, groupIndex) => {
      const groupTitle = article.querySelector('h3')?.textContent.trim() || 'Selected Drawings';
      const links = [...article.querySelectorAll('li a')];
      const groupSheets = links.map(link => {
        const title = link.querySelector('span')?.textContent.trim() || link.textContent.replace('View PDF ↗','').trim();
        return { title, preview: PREVIEWS[title], groupTitle };
      }).filter(item => item.preview);

      links.forEach(link => {
        const title = link.querySelector('span')?.textContent.trim() || link.textContent.replace('View PDF ↗','').trim();
        const preview = PREVIEWS[title];
        if (!preview) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'drawing-preview-link';
        button.innerHTML = `<span class="drawing-preview-thumb"><img src="${safe(preview)}" alt="${title}" loading="lazy" draggable="false"></span><span class="drawing-preview-name">${title}</span><span class="drawing-preview-action">View drawing ↗</span>`;
        button.addEventListener('click', () => {
          sheets = groupSheets; index = Math.max(0, groupSheets.findIndex(item => item.title === title)); openViewer();
        });
        link.replaceWith(button);
      });
      article.dataset.groupIndex = groupIndex;
    });
  }

  function openViewer() { buildViewer(); const v = document.querySelector('#drawing-viewer'); v.classList.add('open'); v.setAttribute('aria-hidden','false'); document.body.classList.add('drawing-viewer-open'); render(); }
  function closeViewer() { const v = document.querySelector('#drawing-viewer'); if (!v) return; v.classList.remove('open'); v.setAttribute('aria-hidden','true'); document.body.classList.remove('drawing-viewer-open'); reset(); }
  function change(step) { if (!sheets.length) return; index = (index + step + sheets.length) % sheets.length; render(); }
  function render() {
    const s = sheets[index], v = document.querySelector('#drawing-viewer'); if (!s || !v) return;
    v.querySelector('#dv-image').src = safe(s.preview); v.querySelector('#dv-image').alt = s.title;
    v.querySelector('#dv-group').textContent = s.groupTitle; v.querySelector('#dv-title').textContent = s.title;
    v.querySelector('#dv-count').textContent = `${index + 1} / ${sheets.length}`; reset();
  }
  function setScale(next) { scale = Math.min(4, Math.max(.6, next)); if (scale <= 1) { x = 0; y = 0; } applyTransform(); }
  function reset() { scale = 1; x = 0; y = 0; applyTransform(); }
  function applyTransform() {
    const img = document.querySelector('#dv-image'), label = document.querySelector('#dv-zoom'); if (!img || !label) return;
    img.style.transform = `translate(${x}px,${y}px) scale(${scale})`; label.textContent = `${Math.round(scale * 100)}%`;
  }

  const content = document.querySelector('#dialog-content');
  if (content) new MutationObserver(enhanceDrawings).observe(content, { childList: true, subtree: true });
  document.addEventListener('keydown', e => {
    const v = document.querySelector('#drawing-viewer'); if (!v?.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowLeft') change(-1); if (e.key === 'ArrowRight') change(1);
    if (e.key === '+' || e.key === '=') setScale(scale + .2); if (e.key === '-') setScale(scale - .2); if (e.key === '0') reset();
  });
})();
