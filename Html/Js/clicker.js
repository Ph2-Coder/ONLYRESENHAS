/* ═══════════════════════════════════════════
   ONLY_RESENHA — jogo-clicker.js
═══════════════════════════════════════════ */

function iniciarClicker(container) {
  const upgrades = [
    { id:'cafe',   nome:'Cafezinho', desc:'energia pra falar besteira', custo:10,  mult:2,  emoji:'☕', comprado:false },
    { id:'meme',   nome:'Meme Pronto', desc:'copy-paste de qualidade',  custo:50,  mult:4,  emoji:'🐸', comprado:false },
    { id:'micro',  nome:'Microfone', desc:'joga pra galera ouvir',      custo:150, mult:8,  emoji:'🎤', comprado:false },
    { id:'viral',  nome:'Post Viral', desc:'10k de views de bobagem',   custo:400, mult:20, emoji:'🚀', comprado:false },
  ];

  const milestones = [
    { em:10,   msg:'🔥 tá começando a pegar fogo!' },
    { em:50,   msg:'😂 metade da galera caiu na gargalhada' },
    { em:100,  msg:'💀 seu humor é crime em 12 estados' },
    { em:250,  msg:'👑 nível: mito local reconhecido' },
    { em:500,  msg:'🌐 influencer do caos certificado' },
    { em:1000, msg:'🏆 LENDA. você desbloqueou o infinito.' },
  ];

  const msgs = [
    'HAUAHUAHAU','kkkkkkkk','Não para não!','Tô na correria!',
    'Isso aí!','Vamo que vamo!','Mó resenha!','Caos aprovado ✅',
    'Lascou geral 💀','TA DOIDO','Bença mãe!','Só resenha mesmo',
  ];

  let score    = 0;
  let perClick = 1;
  const proxMilestones = [...milestones];
  let msgTimeout;

  container.innerHTML = `
    <div class="clicker-wrap">
      <div class="clicker-score" id="ck-score">0</div>
      <div class="clicker-label">resenhas geradas</div>
      <div class="clicker-milestone-bar">
        <div class="clicker-milestone-fill" id="ck-mbar" style="width:0%"></div>
      </div>
      <div class="clicker-milestone-txt" id="ck-mtxt">próximo marco: 10</div>
      <button class="clicker-btn" id="ck-btn">
        <span class="clicker-btn-emoji">🔥</span>
        <span style="font-family:var(--font-display);font-size:1.3rem">CLICA</span>
        <span class="clicker-btn-sub" id="ck-per">+1 resenha</span>
      </button>
      <div class="clicker-msg" id="ck-msg">&nbsp;</div>
      <div class="clicker-upgrades-title">⚡ Upgrades</div>
      <div class="clicker-upgrades" id="ck-upgrades"></div>
    </div>
  `;

  const scoreEl = document.getElementById('ck-score');
  const mbar    = document.getElementById('ck-mbar');
  const mtxt    = document.getElementById('ck-mtxt');
  const btn     = document.getElementById('ck-btn');
  const msgEl   = document.getElementById('ck-msg');
  const upgGrid = document.getElementById('ck-upgrades');

  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(1).replace('.0','')+'k' : n; }

  function addScore(n) {
    score += n;
    scoreEl.textContent = fmt(score);
    scoreEl.classList.remove('bump');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('bump');
    setTimeout(() => scoreEl.classList.remove('bump'), 100);
    updateMilestone();
    buildUpgrades();
  }

  function updateMilestone() {
    if (!proxMilestones.length) {
      mbar.style.width = '100%';
      mtxt.textContent = '🏆 máximo atingido!';
      return;
    }
    const next  = proxMilestones[0];
    const idx   = milestones.indexOf(next);
    const prev  = idx > 0 ? milestones[idx-1].em : 0;
    const pct   = Math.min(((score - prev) / (next.em - prev)) * 100, 100);
    mbar.style.width = pct + '%';
    mtxt.textContent = `próximo marco: ${next.em}`;
    if (score >= next.em) {
      proxMilestones.shift();
      showMsg(next.msg, 3000);
    }
  }

  function showMsg(txt, dur=1800) {
    clearTimeout(msgTimeout);
    msgEl.textContent = txt;
    msgTimeout = setTimeout(() => { msgEl.innerHTML = '&nbsp;'; }, dur);
  }

  function buildUpgrades() {
    upgGrid.innerHTML = '';
    upgrades.forEach(u => {
      const el = document.createElement('button');
      el.className = 'clicker-upg' + (u.comprado ? ' bought' : '');
      el.disabled  = u.comprado || score < u.custo;
      el.innerHTML = u.comprado
        ? `<span class="upg-name">${u.emoji} ${u.nome}</span>
           <span class="upg-ativo">✓ ativo — x${u.mult}/clique</span>`
        : `<span class="upg-name">${u.emoji} ${u.nome}</span>
           <span class="upg-desc">${u.desc}</span>
           <span class="upg-cost">${u.custo} resenhas</span>`;
      if (!u.comprado) {
        el.addEventListener('click', () => {
          if (score >= u.custo) {
            score     -= u.custo;
            perClick  *= u.mult;
            u.comprado = true;
            scoreEl.textContent = fmt(score);
            document.getElementById('ck-per').textContent = `+${perClick} resenha${perClick>1?'s':''}`;
            showMsg(`${u.emoji} ${u.nome} ativado! x${u.mult} por clique!`, 2500);
            buildUpgrades();
          }
        });
      }
      upgGrid.appendChild(el);
    });
  }

  btn.addEventListener('click', (e) => {
    addScore(perClick);
    if (Math.random() < 0.3) showMsg(msgs[Math.floor(Math.random()*msgs.length)]);
    spawnEmoji(['🔥','😂','💀'][Math.floor(Math.random()*3)], e.clientX, e.clientY);
  });

  function spawnEmoji(emoji, x, y) {
    const el = document.createElement('div');
    el.textContent = emoji;
    Object.assign(el.style, {
      position:'fixed', left:(x-12)+'px', top:(y-12)+'px',
      fontSize:'1.4rem', pointerEvents:'none', zIndex:'9997',
      animation:'floatUpClick 1.2s ease-out forwards',
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
    if (!document.getElementById('float-click-style')) {
      const s = document.createElement('style');
      s.id = 'float-click-style';
      s.textContent = `@keyframes floatUpClick {
        from { opacity:1; transform:translateY(0) scale(1); }
        to   { opacity:0; transform:translateY(-70px) scale(0.5); }
      }`;
      document.head.appendChild(s);
    }
  }

  buildUpgrades();
  updateMilestone();

  return { destruir() {} };
}