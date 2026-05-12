document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Background watermark fade-in (both pages) ─────────────────────
  const watermark = document.querySelector('.bg-watermark');
  if (watermark) {
    // Brush-stroke mist texture (home + team pages)
    const isHome = !!document.getElementById('who-we-are');
    const isTeam = !!document.querySelector('.team-main');
    if (isHome || isTeam) {
      const SVG_NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 1000 1600');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');

      // Seeded random so the texture is stable across reloads
      let seed = 42;
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('stroke', '#1A1A18');
      g.setAttribute('stroke-linecap', 'round');
      g.setAttribute('fill', 'none');

      // Bands of horizontal dashes — denser in upper half, sparser below
      const bands = [
        { top:   60, bottom:  280, density: 90, lenMin: 18, lenMax: 70, opMin: 0.35, opMax: 0.75 },
        { top:  280, bottom:  520, density: 130, lenMin: 24, lenMax: 90, opMin: 0.45, opMax: 0.85 },
        { top:  520, bottom:  780, density: 100, lenMin: 20, lenMax: 80, opMin: 0.30, opMax: 0.70 },
        { top:  780, bottom: 1100, density: 70, lenMin: 16, lenMax: 60, opMin: 0.20, opMax: 0.55 },
        { top: 1100, bottom: 1500, density: 45, lenMin: 14, lenMax: 50, opMin: 0.15, opMax: 0.40 }
      ];

      bands.forEach(b => {
        for (let i = 0; i < b.density; i++) {
          const x = rand() * 1000;
          const y = b.top + rand() * (b.bottom - b.top);
          const len = b.lenMin + rand() * (b.lenMax - b.lenMin);
          const op = b.opMin + rand() * (b.opMax - b.opMin);
          const sw = 0.8 + rand() * 1.2;
          const line = document.createElementNS(SVG_NS, 'line');
          line.setAttribute('x1', x.toFixed(1));
          line.setAttribute('y1', y.toFixed(1));
          line.setAttribute('x2', (x + len).toFixed(1));
          line.setAttribute('y2', y.toFixed(1));
          line.setAttribute('opacity', op.toFixed(2));
          line.setAttribute('stroke-width', sw.toFixed(2));
          g.appendChild(line);
        }
      });

      svg.appendChild(g);
      watermark.appendChild(svg);
      watermark.classList.add('bg-watermark--texture');
    }

    watermark.style.transition = 'opacity 2.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        watermark.style.opacity = watermark.classList.contains('bg-watermark--texture') ? '0.18' : '0.055';
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
