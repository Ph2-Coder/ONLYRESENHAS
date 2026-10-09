/* ═══════════════════════════════════════════
   ONLY_RESENHA — jogo-termo.js
═══════════════════════════════════════════ */

function iniciarTermo(container) {
  const PALAVRAS = [
    'MEMES', 'VIRAL', 'REELS', 'TREND', 'CRINGE',
    'SHILL', 'FLEXO', 'SIMP0', 'RATIO', 'DELET',
    'FADES', 'SIGMA', 'SKBID', 'BASED', 'LOWKI',
    'SQUAD', 'GOATS', 'SAUDE', 'LAÇOS', 'COLOU',
    'PRINT', 'STORY', 'LIVES', 'BATER', 'ZUERA',
    'LACRA', 'FOTOS', 'CONTA', 'POSTE', 'CASAL',
  ];

  const TECLADO = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
  ];

  // Palavra do dia — baseada na data
  function palavraDoDia() {
    const inicio = new Date('2024-01-01');
    const hoje   = new Date();
    const diff   = Math.floor((hoje - inicio) / 86400000);
    return PALAVRAS[diff % PALAVRAS.length];
  }

  const PALAVRA = palavraDoDia();
  const MAX_TENTATIVAS = 6;
  const TAMANHO = 5;

  let tentativas   = [];
  let tentativaAtual = '';
  let linha        = 0;
  let jogoFim      = false;

  // ── BUILD HTML ──
  container.innerHTML = `
    <div class="termo-wrap">
      <div class="termo-titulo">TERMO</div>
      <div class="termo-sub">palavra do dia · tema: internet & memes</div>
      <div class="termo-grid" id="termo-grid"></div>
      <div class="termo-msg" id="termo-msg"></div>
      <div class="termo-teclado" id="termo-teclado"></div>
      <button class="termo-btn-novo hidden" id="termo-btn-novo" onclick="reiniciarTermo()">nova palavra →</button>
    </div>
  `;

  // ── GRID ──
  const grid = document.getElementById('termo-grid');
  for (let r = 0; r < MAX_TENTATIVAS; r++) {
    const row = document.createElement('div');
    row.className = 'termo-row';
    row.id = `termo-row-${r}`;
    for (let c = 0; c < TAMANHO; c++) {
      const cell = document.createElement('div');
      cell.className = 'termo-cell';
      cell.id = `termo-cell-${r}-${c}`;
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }

  // ── TECLADO ──
  const tecladoEl = document.getElementById('termo-teclado');
  TECLADO.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'termo-teclado-row';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'termo-key' + (key.length > 1 ? ' wide' : '');
      btn.textContent = key;
      btn.id = `termo-key-${key}`;
      btn.addEventListener('click', () => handleKey(key));
      rowEl.appendChild(btn);
    });
    tecladoEl.appendChild(rowEl);
  });

  // ── LÓGICA ──
  function handleKey(key) {
    if (jogoFim) return;

    if (key === '⌫' || key === 'Backspace') {
      tentativaAtual = tentativaAtual.slice(0, -1);
      atualizarGrid();
      return;
    }
    if (key === 'ENTER' || key === 'Enter') {
      submeter();
      return;
    }
    if (/^[A-Za-zÀ-ú]$/.test(key) && tentativaAtual.length < TAMANHO) {
      tentativaAtual += key.toUpperCase();
      atualizarGrid();
    }
  }

  function atualizarGrid() {
    for (let c = 0; c < TAMANHO; c++) {
      const cell = document.getElementById(`termo-cell-${linha}-${c}`);
      cell.textContent = tentativaAtual[c] || '';
      cell.className = 'termo-cell' + (c === tentativaAtual.length - 1 ? ' ativo' : '');
    }
  }

  function submeter() {
    if (tentativaAtual.length < TAMANHO) {
      mostrarMsg('palavra muito curta! 😬');
      return;
    }

    const resultado = avaliar(tentativaAtual, PALAVRA);
    tentativas.push({ palavra: tentativaAtual, resultado });

    // Anima e colore as células
    for (let c = 0; c < TAMANHO; c++) {
      const cell = document.getElementById(`termo-cell-${linha}-${c}`);
      setTimeout(() => {
        cell.classList.add('flip');
        setTimeout(() => {
          cell.className = `termo-cell ${resultado[c]}`;
        }, 250);
      }, c * 120);
    }

    // Atualiza teclado após animação
    setTimeout(() => atualizarTeclado(tentativaAtual, resultado), TAMANHO * 120 + 300);

    const acertou = tentativaAtual === PALAVRA;
    linha++;
    tentativaAtual = '';

    setTimeout(() => {
      if (acertou) {
        const msgs = ['GOAT! 🐐', 'Acertou em cheio! 🔥', 'BASEADO 💀', 'Você é o sigma! 👑'];
        mostrarMsg(msgs[Math.floor(Math.random() * msgs.length)]);
        jogoFim = true;
        document.getElementById('termo-btn-novo').classList.remove('hidden');
      } else if (linha >= MAX_TENTATIVAS) {
        mostrarMsg(`era: ${PALAVRA} 💀 tenta amanhã`);
        jogoFim = true;
        document.getElementById('termo-btn-novo').classList.remove('hidden');
        // Revela a palavra
        for (let c = 0; c < TAMANHO; c++) {
          document.getElementById(`termo-cell-${linha - 1}-${c}`).classList.add('correto');
        }
      }
    }, TAMANHO * 120 + 350);
  }

  function avaliar(tentativa, alvo) {
    const resultado = Array(TAMANHO).fill('ausente');
    const alvoArr   = alvo.split('');
    const tentArr   = tentativa.split('');

    // Primeiro passo: corretos
    for (let i = 0; i < TAMANHO; i++) {
      if (tentArr[i] === alvoArr[i]) {
        resultado[i] = 'correto';
        alvoArr[i]   = null;
        tentArr[i]   = null;
      }
    }
    // Segundo passo: presentes
    for (let i = 0; i < TAMANHO; i++) {
      if (tentArr[i] && alvoArr.includes(tentArr[i])) {
        resultado[i] = 'presente';
        alvoArr[alvoArr.indexOf(tentArr[i])] = null;
      }
    }
    return resultado;
  }

  function atualizarTeclado(palavra, resultado) {
    const prioridade = { correto: 3, presente: 2, ausente: 1 };
    for (let i = 0; i < TAMANHO; i++) {
      const key = document.getElementById(`termo-key-${palavra[i]}`);
      if (!key) continue;
      const atual = key.className.match(/correto|presente|ausente/)?.[0];
      if (!atual || prioridade[resultado[i]] > prioridade[atual]) {
        key.classList.remove('correto', 'presente', 'ausente');
        key.classList.add(resultado[i]);
      }
    }
  }

  function mostrarMsg(txt, dur = 2500) {
    const el = document.getElementById('termo-msg');
    el.textContent = txt;
    setTimeout(() => { el.textContent = ''; }, dur);
  }

  // Teclado físico
  function onKey(e) { handleKey(e.key); }
  document.addEventListener('keydown', onKey);

  // Expõe reinício global
  window.reiniciarTermo = () => iniciarTermo(container);

  return {
    destruir() {
      document.removeEventListener('keydown', onKey);
    }
  };
}