/* ═══════════════════════════════════════════
   ONLY_RESENHA — jogo-dino.js
═══════════════════════════════════════════ */

function iniciarDino(container) {
  const W = 700, H = 180;
  const CHAO = H - 40;

  container.innerHTML = `
    <div class="dino-wrap">
      <div class="dino-hud">
        <span>PONTOS: <span id="dino-pts">0</span></span>
        <span>RECORDE: <span id="dino-rec">0</span></span>
      </div>
      <canvas id="dino-canvas" width="${W}" height="${H}"></canvas>
      <div class="dino-msg" id="dino-msg">ESPAÇO ou toque para começar</div>
      <div class="dino-controles">espaço / seta cima / toque para pular</div>
      <button class="dino-jump-btn" id="dino-jump-btn">PULAR 🦕</button>
    </div>
  `;

  const canvas = document.getElementById('dino-canvas');
  const ctx    = canvas.getContext('2d');
  const ptsEl  = document.getElementById('dino-pts');
  const recEl  = document.getElementById('dino-rec');
  const msgEl  = document.getElementById('dino-msg');

  let dino, obstaculos, pontos, recorde, velocidade, loop, rodando, animFrame;

  recorde = parseInt(localStorage.getItem('dino-recorde') || '0');
  recEl.textContent = recorde;

  function resetar() {
    dino = { x:60, y:CHAO, w:30, h:40, vy:0, pulando:false };
    obstaculos = [];
    pontos     = 0;
    velocidade = 4;
    rodando    = false;
    ptsEl.textContent = 0;
    cancelAnimationFrame(animFrame);
    desenhar();
    msgEl.textContent = 'ESPAÇO ou toque para começar';
    msgEl.style.animationPlayState = 'running';
  }

  function pular() {
    if (!rodando) { iniciar(); return; }
    if (!dino.pulando) {
      dino.vy = -13;
      dino.pulando = true;
    }
  }

  function iniciar() {
    if (rodando) return;
    rodando = true;
    msgEl.textContent = '';
    pontos = 0;
    obstaculos = [];
    velocidade = 4;
    tick();
  }

  let frameCount = 0;
  function tick() {
    frameCount++;
    pontos++;
    ptsEl.textContent = Math.floor(pontos/6);

    // Aumenta velocidade
    velocidade = 4 + Math.floor(pontos / 300) * 0.5;

    // Grava recorde
    const pts = Math.floor(pontos/6);
    if (pts > recorde) {
      recorde = pts;
      recEl.textContent = recorde;
      localStorage.setItem('dino-recorde', recorde);
    }

    // Física do dino
    dino.y += dino.vy;
    dino.vy += 0.7;
    if (dino.y >= CHAO) { dino.y = CHAO; dino.vy = 0; dino.pulando = false; }

    // Spawna obstáculos
    const minDist = Math.max(200, 350 - Math.floor(pontos/200)*10);
    const ultimo = obstaculos[obstaculos.length-1];
    if (!ultimo || canvas.width - ultimo.x > minDist + Math.random()*150) {
      const h = 30 + Math.floor(Math.random()*30);
      obstaculos.push({ x:canvas.width, y:CHAO+dino.h-h, w:20, h });
    }

    // Move obstáculos
    obstaculos.forEach(o => { o.x -= velocidade; });
    obstaculos = obstaculos.filter(o => o.x + o.w > 0);

    // Colisão
    for (const o of obstaculos) {
      if (
        dino.x + 4 < o.x + o.w &&
        dino.x + dino.w - 4 > o.x &&
        dino.y + 4 < o.y + o.h &&
        dino.y + dino.h > o.y
      ) { fim(); return; }
    }

    desenhar();
    animFrame = requestAnimationFrame(tick);
  }

  function desenhar() {
    ctx.clearRect(0,0,W,H);

    // Fundo
    ctx.fillStyle = '#050505';
    ctx.fillRect(0,0,W,H);

    // Chão
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,CHAO+dino.h+2); ctx.lineTo(W,CHAO+dino.h+2); ctx.stroke();

    // Dino (emoji-style retangular)
    ctx.fillStyle = '#00F5FF';
    ctx.shadowColor = '#00F5FF';
    ctx.shadowBlur  = 8;
    // Corpo
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    // Cabeça
    ctx.fillRect(dino.x+12, dino.y-14, 22, 16);
    // Olho
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 0;
    ctx.fillRect(dino.x+26, dino.y-12, 4, 4);
    // Pernas animadas
    ctx.fillStyle = '#00F5FF';
    ctx.shadowColor = '#00F5FF';
    ctx.shadowBlur = 4;
    if (!dino.pulando) {
      const leg = Math.floor(frameCount/6) % 2;
      ctx.fillRect(dino.x+4,  dino.y+dino.h, 8, leg===0?10:6);
      ctx.fillRect(dino.x+16, dino.y+dino.h, 8, leg===1?10:6);
    }
    ctx.shadowBlur = 0;

    // Obstáculos (cactos)
    ctx.fillStyle = '#FF3CAC';
    ctx.shadowColor = '#FF3CAC';
    ctx.shadowBlur = 6;
    obstaculos.forEach(o => {
      ctx.fillRect(o.x, o.y, o.w, o.h);
      // Braços do cacto
      ctx.fillRect(o.x-8, o.y+8, 8, 6);
      ctx.fillRect(o.x+o.w, o.y+12, 8, 6);
    });
    ctx.shadowBlur = 0;

    // Pontuação no canvas
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Share Tech Mono, monospace';
    ctx.fillText(`${Math.floor(pontos/6).toString().padStart(5,'0')}`, W-80, 24);
  }

  function fim() {
    rodando = false;
    cancelAnimationFrame(animFrame);
    msgEl.textContent = `💀 game over · ${Math.floor(pontos/6)} pts · toque para recomeçar`;
    canvas.style.borderColor = '#FF5F57';
    setTimeout(() => { canvas.style.borderColor='var(--border)'; }, 500);
  }

  // Controles
  function onKey(e) {
    if (e.code==='Space'||e.code==='ArrowUp') { e.preventDefault(); pular(); }
  }
  document.addEventListener('keydown', onKey);
  document.getElementById('dino-jump-btn').addEventListener('click', pular);
  canvas.addEventListener('click', pular);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); pular(); }, {passive:false});

  resetar();

  return {
    destruir() {
      cancelAnimationFrame(animFrame);
      document.removeEventListener('keydown', onKey);
    }
  };
}