/* ═══════════════════════════════════════════
   ONLY_RESENHA — jogo-cobra.js
═══════════════════════════════════════════ */

function iniciarCobra(container) {
  const TAM   = 20;
  const GRADE = 20;

  container.innerHTML = `
    <div class="cobra-wrap">
      <div class="cobra-hud">
        <span>PONTOS: <span id="cobra-pts">0</span></span>
        <span>RECORDE: <span id="cobra-rec">0</span></span>
      </div>
      <canvas id="cobra-canvas" width="${TAM*GRADE}" height="${TAM*GRADE}"></canvas>
      <div class="cobra-msg" id="cobra-msg">pressione ESPAÇO ou toque ▶ para começar</div>
      <div class="cobra-controles">setas do teclado ou D-Pad para mover</div>
      <div class="cobra-dpad">
        <div class="dpad-empty"></div>
        <button class="dpad-btn" id="dpad-up">▲</button>
        <div class="dpad-empty"></div>
        <button class="dpad-btn" id="dpad-left">◀</button>
        <button class="dpad-btn" id="dpad-center">▶</button>
        <button class="dpad-btn" id="dpad-right">▶</button>
        <div class="dpad-empty"></div>
        <button class="dpad-btn" id="dpad-down">▼</button>
        <div class="dpad-empty"></div>
      </div>
    </div>
  `;

  const canvas  = document.getElementById('cobra-canvas');
  const ctx     = canvas.getContext('2d');
  const ptsEl   = document.getElementById('cobra-pts');
  const recEl   = document.getElementById('cobra-rec');
  const msgEl   = document.getElementById('cobra-msg');

  let cobra, dir, proxDir, comida, pontos, recorde, loop, rodando, gameOver;

  recorde = parseInt(localStorage.getItem('cobra-recorde') || '0');
  recEl.textContent = recorde;

  function resetar() {
    cobra   = [{ x:10, y:10 }];
    dir     = { x:1, y:0 };
    proxDir = { x:1, y:0 };
    pontos  = 0;
    gameOver = false;
    rodando  = false;
    ptsEl.textContent = 0;
    novaComida();
    desenhar();
    msgEl.textContent = 'pressione ESPAÇO ou toque ▶ para começar';
  }

  function novaComida() {
    const livres = [];
    for (let x=0; x<GRADE; x++)
      for (let y=0; y<GRADE; y++)
        if (!cobra.find(s=>s.x===x&&s.y===y)) livres.push({x,y});
    comida = livres[Math.floor(Math.random()*livres.length)];
  }

  function mover() {
    dir = { ...proxDir };
    const cab = { x: cobra[0].x+dir.x, y: cobra[0].y+dir.y };

    // Colisão parede
    if (cab.x<0||cab.x>=GRADE||cab.y<0||cab.y>=GRADE) { fim(); return; }
    // Colisão corpo
    if (cobra.find(s=>s.x===cab.x&&s.y===cab.y)) { fim(); return; }

    cobra.unshift(cab);
    if (cab.x===comida.x && cab.y===comida.y) {
      pontos++;
      ptsEl.textContent = pontos;
      if (pontos > recorde) {
        recorde = pontos;
        recEl.textContent = recorde;
        localStorage.setItem('cobra-recorde', recorde);
      }
      novaComida();
    } else {
      cobra.pop();
    }
    desenhar();
  }

  function desenhar() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Grade sutil
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let i=0; i<=GRADE; i++) {
      ctx.beginPath(); ctx.moveTo(i*TAM,0); ctx.lineTo(i*TAM,canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i*TAM); ctx.lineTo(canvas.width,i*TAM); ctx.stroke();
    }

    // Comida
    ctx.fillStyle = '#FF3CAC';
    ctx.shadowColor = '#FF3CAC';
    ctx.shadowBlur  = 10;
    ctx.fillRect(comida.x*TAM+2, comida.y*TAM+2, TAM-4, TAM-4);
    ctx.shadowBlur = 0;

    // Cobra
    cobra.forEach((seg, i) => {
      ctx.fillStyle = i===0 ? '#00F5FF' : '#00c8d4';
      ctx.shadowColor = '#00F5FF';
      ctx.shadowBlur  = i===0 ? 8 : 0;
      ctx.fillRect(seg.x*TAM+1, seg.y*TAM+1, TAM-2, TAM-2);
    });
    ctx.shadowBlur = 0;
  }

  function fim() {
    rodando = false;
    gameOver = true;
    clearInterval(loop);
    msgEl.textContent = `💀 game over — ${pontos} ponto${pontos!==1?'s':''} · ESPAÇO para recomeçar`;
    // Pisca canvas
    canvas.style.borderColor = '#FF5F57';
    setTimeout(() => { canvas.style.borderColor = 'var(--border)'; }, 600);
  }

  function iniciar() {
    if (rodando) return;
    if (gameOver) resetar();
    rodando = true;
    msgEl.textContent = '';
    const velocidade = Math.max(80, 150 - pontos*2);
    clearInterval(loop);
    loop = setInterval(() => {
      mover();
      // Aumenta velocidade com pontos
      if (pontos > 0 && pontos % 5 === 0) {
        clearInterval(loop);
        loop = setInterval(mover, Math.max(80, 150 - pontos*2));
      }
    }, velocidade);
  }

  // Teclado
  function onKey(e) {
    if (e.code === 'Space') { e.preventDefault(); iniciar(); return; }
    const mapa = {
      ArrowUp:    {x:0,y:-1}, ArrowDown:  {x:0,y:1},
      ArrowLeft:  {x:-1,y:0}, ArrowRight: {x:1,y:0},
    };
    const nova = mapa[e.key];
    if (nova && !(nova.x===-dir.x&&nova.y===-dir.y)) proxDir = nova;
  }
  document.addEventListener('keydown', onKey);

  // D-Pad
  document.getElementById('dpad-up').onclick    = () => { if(!(dir.x===0&&dir.y===1))  proxDir={x:0,y:-1}; };
  document.getElementById('dpad-down').onclick  = () => { if(!(dir.x===0&&dir.y===-1)) proxDir={x:0,y:1}; };
  document.getElementById('dpad-left').onclick  = () => { if(!(dir.x===1&&dir.y===0))  proxDir={x:-1,y:0}; };
  document.getElementById('dpad-right').onclick = () => { if(!(dir.x===-1&&dir.y===0)) proxDir={x:1,y:0}; };
  document.getElementById('dpad-center').onclick = iniciar;

  resetar();

  return {
    destruir() {
      clearInterval(loop);
      document.removeEventListener('keydown', onKey);
    }
  };
}