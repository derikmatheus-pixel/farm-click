const gameArea = document.getElementById('game-area');
const player   = document.getElementById('player');

const jogador = {
    x: 0,
    y: 0,
    destinoX: null,
    destinoY: null,
    velocidade: 200 // px/s
};

let ultimoTempo = null;

// Inicializa posição no centro do mapa
function inicializarJogador() {
    const startX = gameArea.clientWidth  / 2 - player.offsetWidth  / 2;
    const startY = gameArea.clientHeight / 2 - player.offsetHeight / 2;

    jogador.x = startX;
    jogador.y = startY;
    jogador.destinoX = startX;
    jogador.destinoY = startY;

    desenharJogador();
}

function atualizarJogador(delta) {
    if (jogador.destinoX === null || jogador.destinoY === null) return;

    const dx = jogador.destinoX - jogador.x;
    const dy = jogador.destinoY - jogador.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia < 1) {
        jogador.x = jogador.destinoX;
        jogador.y = jogador.destinoY;
        jogador.destinoX = null;
        jogador.destinoY = null;
        return;
    }

    const passo = jogador.velocidade * delta;

    if (passo >= distancia) {
        jogador.x = jogador.destinoX;
        jogador.y = jogador.destinoY;
        jogador.destinoX = null;
        jogador.destinoY = null;
    } else {
        jogador.x += (dx / distancia) * passo;
        jogador.y += (dy / distancia) * passo;
    }
}

function desenharJogador() {
    player.style.left = jogador.x + 'px';
    player.style.top  = jogador.y + 'px';
}

// Função global para definir destino (usada em interactions.js)
function definirDestinoJogador(x, y) {
    const maxX = gameArea.clientWidth  - player.offsetWidth;
    const maxY = gameArea.clientHeight - player.offsetHeight;

    let novoX = x;
    let novoY = y;

    if (novoX < 0)     novoX = 0;
    if (novoY < 0)     novoY = 0;
    if (novoX > maxX) novoX = maxX;
    if (novoY > maxY) novoY = maxY;

    jogador.destinoX = novoX;
    jogador.destinoY = novoY;
}

// Teleporte ao trocar de mapa
function definirPosicaoJogador(x, y) {
    jogador.x = x;
    jogador.y = y;
    jogador.destinoX = null;
    jogador.destinoY = null;
    desenharJogador();
}

// Retorna o centro do personagem dentro do game-area
function getPlayerCenter() {
    const centerX = jogador.x + player.offsetWidth / 2;
    const centerY = jogador.y + player.offsetHeight / 2;
    return { x: centerX, y: centerY };
}

// Expor as funções para outros arquivos
window.definirDestinoJogador = definirDestinoJogador;
window.definirPosicaoJogador = definirPosicaoJogador;
window.getPlayerCenter      = getPlayerCenter;

// Teleporte ao trocar de mapa
function definirPosicaoJogador(x, y) {
    jogador.x = x;
    jogador.y = y;
    jogador.destinoX = null;
    jogador.destinoY = null;
    desenharJogador();
}

// Expor as funções para outros arquivos
window.definirDestinoJogador = definirDestinoJogador;
window.definirPosicaoJogador = definirPosicaoJogador;

function loop(timestamp) {
    if (ultimoTempo === null) {
        ultimoTempo = timestamp;
    }

    const delta = (timestamp - ultimoTempo) / 1000;
    ultimoTempo = timestamp;

    atualizarJogador(delta);
    desenharJogador();

    requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
    inicializarJogador();
    requestAnimationFrame(loop);
});
