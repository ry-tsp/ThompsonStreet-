document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Background watermark fade-in (both pages) ─────────────────────
  const watermark = document.querySelector('.bg-watermark');
  if (watermark) {
    watermark.style.transition = 'opacity 2.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        watermark.style.opacity = '0.055';
      });
    });
  }

  // ── 2. Header mark draw-in (index.html only) ──────────────────────────
  const mark = document.querySelector('.header-mark svg');
  if (mark) {
    const els = Array.from(
      mark.querySelectorAll('path, line, ellipse, circle')
    );
    els.forEach(el => {
      const len = typeof el.getTotalLength === 'function'
        ? el.getTotalLength() : 80;
      el.style.strokeDasharray  = len;
      el.style.strokeDashoffset = len;
      el.style.opacity          = '0';
    });
    const container = document.querySelector('.header-mark');
    if (container) container.style.opacity = '1';
    els.forEach((el, i) => {
      const sw    = parseFloat(el.getAttribute('stroke-width') || '1');
      const dur   = sw >= 1.4 ? 1.2 : sw >= 0.6 ? 0.9 : 0.5;
      const delay = 0.1 + i * 0.045;
      el.style.transition = [
        `stroke-dashoffset ${dur}s ease ${delay}s`,
        `opacity 0.25s ease ${delay}s`
      ].join(', ');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = '0';
          el.style.opacity          = el.getAttribute('opacity') || '1';
        });
      });
    });
  }

  // ── 3. Writings filter (writings.html only) ───────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.writing-card');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const matches = filter === 'all' || card.dataset.category === filter;
          if (matches) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.2s ease';
              card.style.opacity    = '1';
            });
          } else {
            card.style.transition = 'opacity 0.15s ease';
            card.style.opacity    = '0';
            setTimeout(() => {
              if (card.style.opacity === '0') card.style.display = 'none';
            }, 160);
          }
        });
      });
    });
  }
});
