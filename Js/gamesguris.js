/* ═══════════════════════════════════════════
   ONLY_RESENHA — jogos.js
   Controlador da tela de seleção
═══════════════════════════════════════════ */

const telaSelecao   = document.getElementById('tela-selecao');
const jogoContainer = document.getElementById('jogo-container');
const jogoArea      = document.getElementById('jogo-area');
const jogoNomeAtual = document.getElementById('jogo-nome-atual');

// Jogo ativo no momento (para pausar/destruir ao sair)
let jogoAtivo = null;

function abrirJogo(id) {
  telaSelecao.classList.add('hidden');
  jogoContainer.classList.remove('hidden');
  jogoArea.innerHTML = '';

  const nomes = {
    termo:   'TERMO',
    clicker: 'CLICKER DA RESENHA',
    cobra:   'COBRINHA',
    dino:    'DINOSSAURO',
  };
  jogoNomeAtual.textContent = nomes[id] || id.toUpperCase();

  // Inicializa o jogo correspondente
  if (id === 'termo')   jogoAtivo = iniciarTermo(jogoArea);
  if (id === 'clicker') jogoAtivo = iniciarClicker(jogoArea);
  if (id === 'cobra')   jogoAtivo = iniciarCobra(jogoArea);
  if (id === 'dino')    jogoAtivo = iniciarDino(jogoArea);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarSelecao() {
  // Para o jogo ativo se tiver um loop rodando
  if (jogoAtivo && jogoAtivo.destruir) jogoAtivo.destruir();
  jogoAtivo = null;

  jogoContainer.classList.add('hidden');
  jogoArea.innerHTML = '';
  telaSelecao.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}