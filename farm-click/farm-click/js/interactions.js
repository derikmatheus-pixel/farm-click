const gameAreaInt = document.getElementById("game-area");

// Distância máxima de interação
const INTERACTION_RANGE = 80;

// Respawn baseado no tamanho do dia
const RESOURCE_RESPAWN_MS = {
    tree: (window.DAY_LENGTH_MS || 60000) * 0.5,  // metade de um dia
    stone: (window.DAY_LENGTH_MS || 60000) * 0.33 // um terço de um dia
};

function isWithinInteractionRange(element) {
    if (!window.getPlayerCenter) return true;

    const playerCenter = window.getPlayerCenter();
    const rectGame = gameAreaInt.getBoundingClientRect();
    const rectEl   = element.getBoundingClientRect();

    const centerElX = (rectEl.left - rectGame.left) + rectEl.width / 2;
    const centerElY = (rectEl.top  - rectGame.top)  + rectEl.height / 2;

    const dx = centerElX - playerCenter.x;
    const dy = centerElY - playerCenter.y;
    const dist = Math.hypot(dx, dy);

    return dist <= INTERACTION_RANGE;
}

function despawnAndRespawn(element, type) {
    const respawnMs = RESOURCE_RESPAWN_MS[type] || 5000;

    if (!element.dataset.originalDisplay) {
        const style = getComputedStyle(element);
        element.dataset.originalDisplay = style.display === "none" ? "block" : style.display;
    }

    element.style.display = "none";
    element.style.pointerEvents = "none";

    setTimeout(() => {
        element.style.display = element.dataset.originalDisplay || "block";
        element.style.pointerEvents = "auto";
    }, respawnMs);
}

// Clique para mover o personagem
gameAreaInt.addEventListener("click", (evento) => {
    const rect = gameAreaInt.getBoundingClientRect();

    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;

    const halfWidth  = document.getElementById("player").offsetWidth  / 2;
    const halfHeight = document.getElementById("player").offsetHeight / 2;

    window.definirDestinoJogador(x - halfWidth, y - halfHeight);
});

// CASA (abre menu)
const casa       = document.getElementById("house-main");
const menuCasa   = document.getElementById("house-menu");
const fecharMenu = document.getElementById("close-house-menu");

if (casa) {
    casa.addEventListener("click", (evento) => {
        evento.stopPropagation();
        if (!isWithinInteractionRange(casa)) {
            console.log("Muito longe da casa para interagir.");
            return;
        }
        menuCasa.classList.remove("hidden");
    });
}

if (fecharMenu) {
    fecharMenu.addEventListener("click", () => {
        menuCasa.classList.add("hidden");
    });
}

if (menuCasa) {
    menuCasa.addEventListener("click", (evento) => {
        if (evento.target === menuCasa) {
            menuCasa.classList.add("hidden");
        }
    });
}

// PORTAIS
const portalMap2 = document.getElementById("portal-map2");
const portalMap1 = document.getElementById("portal-map1");

function mudarMapa(idMapa) {
    const mapas = document.querySelectorAll(".map");
    mapas.forEach(m => m.classList.remove("active"));

    const alvo = document.getElementById(idMapa);
    if (!alvo) return;

    alvo.classList.add("active");

    if (idMapa === "map1") {
        window.definirPosicaoJogador(300, 360);
    } else if (idMapa === "map2") {
        window.definirPosicaoJogador(300, 420);
    }
}

if (portalMap2) {
    portalMap2.addEventListener("click", (evento) => {
        evento.stopPropagation();
        if (!isWithinInteractionRange(portalMap2)) {
            console.log("Muito longe para usar o portal.");
            return;
        }
        mudarMapa("map2");
    });
}

if (portalMap1) {
    portalMap1.addEventListener("click", (evento) => {
        evento.stopPropagation();
        if (!isWithinInteractionRange(portalMap1)) {
            console.log("Muito longe para usar o portal.");
            return;
        }
        mudarMapa("map1");
    });
}

// COLETA: PEDRA
const pedras = document.querySelectorAll(".stone");

pedras.forEach((pedra) => {
    pedra.addEventListener("click", (evento) => {
        evento.stopPropagation();

        if (!isWithinInteractionRange(pedra)) {
            console.log("Muito longe para coletar a pedra.");
            return;
        }

        if (window.addItemById) {
            window.addItemById("pedra", 1);
        }
        despawnAndRespawn(pedra, "stone");
    });
});

// COLETA: ÁRVORES
const arvores = document.querySelectorAll(".tree");

arvores.forEach((arvore) => {
    arvore.addEventListener("click", (evento) => {
        evento.stopPropagation();

        if (!isWithinInteractionRange(arvore)) {
            console.log("Muito longe para coletar da árvore.");
            return;
        }

        if (window.harvestTree) {
            window.harvestTree();
        }
        despawnAndRespawn(arvore, "tree");
    });
});

// INIMIGOS: ESPANTALHOS
const enemies = document.querySelectorAll(".enemy-espantalho");

enemies.forEach((enemy) => {
    enemy.addEventListener("click", (evento) => {
        evento.stopPropagation();

        if (!isWithinInteractionRange(enemy)) {
            console.log("Muito longe para iniciar a luta.");
            return;
        }

        if (window.startBattle) {
            const maxhp = parseInt(enemy.dataset.maxhp || "20", 10);
            const xp    = parseInt(enemy.dataset.xp || "10", 10);

            window.startBattle({
                enemyElement: enemy,
                enemyName: "Espantalho",
                enemyMaxHp: maxhp,
                enemyXp: xp
            });
        }
    });
});
