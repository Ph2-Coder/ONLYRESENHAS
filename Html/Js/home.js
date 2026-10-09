/* ═══════════════════════════════════════════
   ONLY_RESENHA — home.js
═══════════════════════════════════════════ */

// ── TERMINAL LOADING ──────────────────────

const lines = [
  { text: 'only_resenha.exe — versão 29.1 (build: ontem de madrugada)', color: 'muted' },
  { text: '', color: 'white' },
  { text: '> Iniciando sistema de resenha...', color: 'green', delay: 300 },
  { text: '> Carregando banco de Fake News...  [████████] 100%', color: 'cyan', delay: 700 },
  { text: '> Verificando estoque de Resenha... OK', color: 'green', delay: 500 },
  { text: '> Procurando Verdades...', color: 'cyan', delay: 600 },
  { text: '  ERRO: verdades.exe não encontrado', color: 'error', delay: 400 },
  { text: '  Continuando sem ela mesmo.', color: 'muted', delay: 300 },
  { text: '', color: 'white' },
  { text: '> Calibrando nível de Lacração...', color: 'cyan', delay: 700 },
  { text: '  [AVISO] nível acima do recomendado. Normal aqui.', color: 'yellow', delay: 400 },
  { text: '> Carregando Satanás...  [██████░░] 75%', color: 'cyan', delay: 600 },
  { text: '  Ops. Graças a Deus deu errado. Ajustando.', color: 'error', delay: 300 },
  { text: '> Invadindo o servidor da Etecamp...  OK', color: 'green', delay: 700 },
  { text: '', color: 'white' },
  { text: '> Verificando 67 do criador de conteúdo...', color: 'cyan', delay: 600 },
  { text: '  [CRÍTICO] Downgrade underflow. 67 inexistente.', color: 'error', delay: 400 },
  { text: '  Iniciando farmar aura... falhou. Desistindo.', color: 'muted', delay: 300 },
  { text: '', color: 'white' },
  { text: '> Testando meu amigo...', color: 'cyan', delay: 700 },
  { text: '  Resultado: Eu acho que ele é. DELICIA😝​😝​😝​.', color: 'pink', delay: 400 },
  { text: '', color: 'white' },
  { text: '════════════════════════════════════════════', color: 'muted', delay: 500 },
  { text: '  SISTEMA CARREGADO — Bem-vindo ao Only_Resenhas_.', color: 'yellow', delay: 300 },
  { text: '  @Only_Resenha_ online e sem limites.', color: 'pink', delay: 200 },
  { text: '════════════════════════════════════════════', color: 'muted', delay: 300 },
  { text: '', color: 'white' },
  { text: '> Entrando na página... 🔥', color: 'green', delay: 600 },
];

const outputEl  = document.getElementById('terminal-output');
const loadingEl = document.getElementById('loading-screen');
const mainEl    = document.getElementById('main-content');

// ── CHECA SE JÁ PASSOU PELO LOADING ──────
if (sessionStorage.getItem('loadingJaExibido')) {
  loadingEl.style.display = 'none';
  mainEl.classList.remove('hidden');
  setTimeout(animateSkillBars, 400);
  initScrollObserver();
} else {
  let totalDelay = 400;

  lines.forEach((line) => {
    const lineDelay = line.delay || 250;
    totalDelay += lineDelay;

    setTimeout(() => {
      const span = document.createElement('span');
      span.className = `line ${line.color}`;
      span.textContent = line.text || ' ';
      outputEl.appendChild(span);

      const body = document.querySelector('.terminal-body');
      body.scrollTop = body.scrollHeight;
    }, totalDelay);
  });

  const entryDelay = totalDelay + 900;

  setTimeout(() => {
    loadingEl.style.transition = 'opacity 0.7s ease';
    loadingEl.style.opacity = '0';

    setTimeout(() => {
      loadingEl.style.display = 'none';
      mainEl.classList.remove('hidden');
      sessionStorage.setItem('loadingJaExibido', 'true');
      setTimeout(animateSkillBars, 400);
      initScrollObserver();
    }, 700);
  }, entryDelay);
}


// ── SKILL BARS ANIMADAS ───────────────────

function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach((fill) => {
    const target = fill.style.width;
    fill.style.width = '0';
    fill.getBoundingClientRect();

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fill.style.width = target;
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });

    obs.observe(fill);
  });
}


// ── SCROLL OBSERVER (entrada suave das seções) ──

function initScrollObserver() {
  const cards = document.querySelectorAll('.cv-card, .link-card');

  cards.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((el) => obs.observe(el));
}


// ── NAV: destaque do link ativo no scroll ──

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach((link) => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--text)';
    }
  });
}, { passive: true });


// ── EASTER EGG: Konami Code ──────────────

const konami   = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                   'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx  = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      konamiIdx = 0;
      showToast('🎮 Código secreto ativado! resenha sem fim');
      emojiRain(['🔥','😂','💀','🎉','👑'], 20);
    }
  } else {
    konamiIdx = 0;
  }
});

let footerClicks = 0;
document.querySelector('.footer')?.addEventListener('click', () => {
  footerClicks++;
  if (footerClicks >= 3) {
    footerClicks = 0;
    showToast('🤫 Encontrou o segredo do rodapé!');
  }
});


// ── HELPERS ──────────────────────────────

function showToast(msg) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
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

function emojiRain(emojis, count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      Object.assign(el.style, {
        position:      'fixed',
        left:          Math.random() * 100 + 'vw',
        top:           '-2rem',
        fontSize:      (1.5 + Math.random() * 1.5) + 'rem',
        pointerEvents: 'none',
        zIndex:        '9997',
        animation:     `fallDown ${1.5 + Math.random() * 2}s ease-in forwards`,
      });
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 100);
  }

  if (!document.getElementById('falldown-style')) {
    const style = document.createElement('style');
    style.id = 'falldown-style';
    style.textContent = `
      @keyframes fallDown {
        from { opacity: 1; transform: translateY(0) rotate(0deg); }
        to   { opacity: 0; transform: translateY(110vh) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}