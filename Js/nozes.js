/* ═══════════════════════════════════════════
   ONLY_RESENHA — equipe.js
═══════════════════════════════════════════ */

// ── FACTORY DE CARROSSEL ──────────────────
// Recebe os IDs do HTML e monta o carrossel automaticamente

function criarCarrossel({ trackId, prevId, nextId, dotsId, visiveis }) {
  const track  = document.getElementById(trackId);
  const prev   = document.getElementById(prevId);
  const next   = document.getElementById(nextId);
  const dotsEl = document.getElementById(dotsId);

  if (!track) return;

  const cards      = Array.from(track.children);
  const total      = cards.length;
  let atual        = 0;

  // Quantos cards mostrar por vez (2 no desktop, 1 no mobile)
  function getVisiveis() {
    return window.innerWidth <= 640 ? 1 : visiveis;
  }

  // ── DOTS ──
  function buildDots() {
    dotsEl.innerHTML = '';
    const totalDots = Math.ceil(total / getVisiveis());
    for (let i = 0; i < totalDots; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot-item' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Ir para página ${i + 1}`);
      btn.addEventListener('click', () => irPara(i));
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    const dotBtns   = dotsEl.querySelectorAll('.dot-item');
    const dotAtual  = Math.floor(atual / getVisiveis());
    dotBtns.forEach((d, i) => d.classList.toggle('active', i === dotAtual));
  }

  // ── MOVER ──
  function irPara(index) {
    const vis    = getVisiveis();
    const maxIdx = Math.max(0, total - vis);
    atual        = Math.min(Math.max(index, 0), maxIdx);

    // Calcula largura real de um card + gap
    const cardWidth = cards[0].offsetWidth + 19; // 19px ≈ gap de 1.2rem
    track.style.transform = `translateX(-${atual * cardWidth}px)`;

    prev.disabled = atual === 0;
    next.disabled = atual >= maxIdx;
    updateDots();
  }

  // ── EVENTOS DOS BOTÕES ──
  prev.addEventListener('click', () => irPara(atual - getVisiveis()));
  next.addEventListener('click', () => irPara(atual + getVisiveis()));

  // ── SWIPE (mobile) ──
  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? irPara(atual + 1) : irPara(atual - 1);
    }
  }, { passive: true });

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    buildDots();
    irPara(0);
  }, { passive: true });

  // ── INIT ──
  buildDots();
  irPara(0);
}

// ── INICIALIZA OS DOIS CARROSSÉIS ────────

criarCarrossel({
  trackId: 'trackCriadores',
  prevId:  'prevCriador',
  nextId:  'nextCriador',
  dotsId:  'dotsCriadores',
  visiveis: 2,
});

criarCarrossel({
  trackId: 'trackContrib',
  prevId:  'prevContrib',
  nextId:  'nextContrib',
  dotsId:  'dotsContrib',
  visiveis: 2,
});

// ── ANIMAÇÃO DE ENTRADA DOS CARDS ────────

function initScrollObserver() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((el) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 100);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((el) => obs.observe(el));
}

initScrollObserver();

// ── EASTER EGG: triplo clique no footer ──

let footerClicks = 0;
document.querySelector('.footer')?.addEventListener('click', () => {
  footerClicks++;
  if (footerClicks >= 3) {
    footerClicks = 0;
    showToast('👽 Você achou a equipe secreta!');
  }
});

// ── HELPER: TOAST ─────────────────────────

function showToast(msg) {
  let toast = document.getElementById('equipe-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'equipe-toast';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '2rem',
      left:         '50%',
      transform:    'translateX(-50%) translateY(80px)',
      background:   'var(--purple)',
      color:        '#fff',
      fontFamily:   'var(--font-body)',
      fontWeight:   '700',
      fontSize:     '0.85rem',
      padding:      '0.75rem 1.5rem',
      borderRadius: '100px',
      zIndex:       '9998',
      transition:   'transform 0.4s cubic-bezier(.34,1.56,.64,1)',
      whiteSpace:   'nowrap',
      pointerEvents:'none',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 3200);
}