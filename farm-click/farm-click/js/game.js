// assets/js/game.js

// Canvas principal do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ------------------------------------------------------
//  SISTEMA DE TILES / TEXTURAS DO MAPA
//  Usa TILE_SIZE e FARM_MAP_DATA definidos em farmMap.js
// ------------------------------------------------------

// Mapeia ID do tile -> caminho do PNG
const tileImagePaths = {
  0: "assets/tiles/grass.png",
  1: "assets/tiles/path.png",
  2: "assets/tiles/house_center.png",
  3: "assets/tiles/house_roof.png",
  4: "assets/tiles/field.png",
  5: "assets/tiles/lake.png",
  6: "assets/tiles/dock.png",
  7: "assets/tiles/tree.png",
  8: "assets/tiles/rock.png",
};

const tileImages = {};
let tilesLoaded = false;

// Retorna a imagem de um tile pelo ID
function getTileImage(id) {
  return tileImages[id];
}

// Opcional: mapa por nome para ficar mais fácil em outros arquivos
const TILE_NAME_TO_ID = {
  grass: 0,
  path: 1,
  house_center: 2,
  house_roof: 3,
  field: 4,
  lake: 5,
  dock: 6,
  tree: 7,
  rock: 8,
};

function getTexture(name) {
  const id = TILE_NAME_TO_ID[name];
  return tileImages[id];
}

// Carrega uma imagem e devolve uma Promise
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

// Carrega todas as texturas de tiles
async function loadTileImages() {
  const entries = Object.entries(tileImagePaths);

  const promises = entries.map(async ([id, path]) => {
    const img = await loadImage(path);
    tileImages[id] = img;
  });

  // IMPORTANTE: precisa esperar todas carregarem
  await Promise.all(promises);
  tilesLoaded = true;
}

// Desenha o mapa usando FARM_MAP_DATA
function drawMap() {
  if (!tilesLoaded) return;

  const rows = FARM_MAP_DATA.length;
  const cols = FARM_MAP_DATA[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tileId = FARM_MAP_DATA[y][x];
      const img = tileImages[tileId];

      const screenX = x * TILE_SIZE;
      const screenY = y * TILE_SIZE;

      if (img) {
        ctx.drawImage(img, screenX, screenY, TILE_SIZE, TILE_SIZE);
      } else {
        // fallback se tiver algum ID sem imagem
        ctx.fillStyle = "magenta";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) CENÁRIO
  drawMap(); // ← usa os tiles

  // 2) PERSONAGEM, NPC, ITENS
  if (typeof drawPlayer === "function") drawPlayer();
  if (typeof drawEnemies === "function") drawEnemies();
  if (typeof drawItems === "function") drawItems();

  // 3) HUD / UI
  if (typeof drawHUD === "function") drawHUD();
}

let lastTime = 0;

function updateGame(dt) {
  // aqui você mantém seu update atual:
  // mover player, checar colisão, interações, XP, etc.
  if (typeof updatePlayer === "function") updatePlayer(dt);
  if (typeof updateTime === "function") updateTime(dt);
  if (typeof updateBattle === "function") updateBattle(dt);
}

function gameLoop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (typeof updateGame === "function") updateGame(dt);

  renderGame();
  requestAnimationFrame(gameLoop);
}

// Função de setup geral
async function startGame() {
  try {
    // 1) Carrega as texturas do mapa
    await loadTileImages();

    // 2) Inicializa o resto do jogo
    if (typeof initPlayer === "function") initPlayer();
    if (typeof initInventory === "function") initInventory();
    if (typeof initTime === "function") initTime();
    if (typeof initBattle === "function") initBattle();

    // 3) Inicia o loop
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  } catch (err) {
    console.error("Erro ao iniciar o jogo:", err);
  }
}

window.addEventListener("load", startGame);

// ------------------------------------------------------
// A PARTIR DAQUI entram os códigos que você já tinha:
// - estado do player
// - cliques para mover
// - HUD, inventário, batalha, etc.
// ------------------------------------------------------

// ... (mantenha o restante do seu game.js a partir daqui)
