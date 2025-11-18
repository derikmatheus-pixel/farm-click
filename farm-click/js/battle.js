// ===== PROGRESSO DO JOGADOR (NÍVEL / XP / GOLPES) =====
const playerProgress = {
    level: 1,
    xp: 0,
    xpToNext: 20,
    movesUnlocked: ["soco"], // começa só com Soco
    hasSword: false
};

// Definição dos golpes
const MOVES = {
    soco: {
        id: "soco",
        nome: "Soco",
        minDano: 4,
        maxDano: 7,
        descricao: "Um soco simples, mas confiável."
    },
    chute: {
        id: "chute",
        nome: "Chute",
        minDano: 5,
        maxDano: 9,
        descricao: "Chute mais forte, mas exige mais prática."
    },
    investida: {
        id: "investida",
        nome: "Investida",
        minDano: 3,
        maxDano: 10,
        descricao: "Ataque arriscado, dano variável."
    },
    cabecada: {
        id: "cabecada",
        nome: "Cabeçada",
        minDano: 6,
        maxDano: 11,
        descricao: "Golpe pesado corpo a corpo."
    },
    espada: {
        id: "espada",
        nome: "Corte de Espada",
        minDano: 7,
        maxDano: 12,
        descricao: "Golpe usando a espada forjada na casa."
    }
};

// Desbloqueio por nível
function unlockMovesForLevel(level) {
    if (level >= 2 && !playerProgress.movesUnlocked.includes("chute")) {
        playerProgress.movesUnlocked.push("chute");
        addBattleLog("Você aprendeu um novo golpe: Chute!");
    }
    if (level >= 3 && !playerProgress.movesUnlocked.includes("investida")) {
        playerProgress.movesUnlocked.push("investida");
        addBattleLog("Você aprendeu um novo golpe: Investida!");
    }
    if (level >= 4 && !playerProgress.movesUnlocked.includes("cabecada")) {
        playerProgress.movesUnlocked.push("cabecada");
        addBattleLog("Você aprendeu um novo golpe: Cabeçada!");
    }
}

// Espada libera golpe de corte
function unlockSwordMove() {
    if (!playerProgress.movesUnlocked.includes("espada")) {
        playerProgress.movesUnlocked.push("espada");
        playerProgress.hasSword = true;
        addBattleLog("Você forjou uma espada! Novo golpe: Corte de Espada.");
        updateMoveButtons();
    }
}

// ===== ESTADO DA BATALHA =====
const battleState = {
    inBattle: false,
    playerMaxHp: 30,
    playerHp: null,   // vamos manter entre batalhas
    enemyMaxHp: 20,
    enemyHp: 20,
    enemyName: "Espantalho",
    enemyXpReward: 10,
    turn: "player",
    enemyElement: null
};

// Referências de UI
let battleScreen;
let playerHpBar, enemyHpBar;
let playerHpText, enemyHpText;
let playerLevelText, playerXpText;
let enemyNameText;
let battleLog;
let moveButtons = [];
let btnRun;
let hudXpElement;

// Utils
function battleRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== UI: HP / XP / NÍVEL =====
function updateHpUI() {
    if (!playerHpBar || !enemyHpBar) return;

    const pHp = battleState.playerHp == null ? battleState.playerMaxHp : battleState.playerHp;
    const pPerc = Math.max(0, pHp) / battleState.playerMaxHp * 100;
    const ePerc = Math.max(0, battleState.enemyHp) / battleState.enemyMaxHp * 100;

    playerHpBar.style.width = pPerc + "%";
    enemyHpBar.style.width  = ePerc + "%";

    if (playerHpText) {
        playerHpText.textContent = `${pHp}/${battleState.playerMaxHp} HP`;
    }
    if (enemyHpText) {
        enemyHpText.textContent = `${battleState.enemyHp}/${battleState.enemyMaxHp} HP`;
    }

    playerHpBar.style.background = pPerc < 30 ? "#ef5350" : "#66bb6a";
    enemyHpBar.style.background  = ePerc < 30 ? "#ef5350" : "#66bb6a";
}

function updateProgressUI() {
    if (playerLevelText) {
        playerLevelText.textContent = `(Nv. ${playerProgress.level})`;
    }
    if (playerXpText) {
        playerXpText.textContent = `XP: ${playerProgress.xp}/${playerProgress.xpToNext}`;
    }
    if (hudXpElement) {
        hudXpElement.textContent = `Nv. ${playerProgress.level} | XP ${playerProgress.xp}/${playerProgress.xpToNext}`;
    }
}

function setEnemyName(name) {
    battleState.enemyName = name || "Inimigo";
    if (enemyNameText) {
        enemyNameText.textContent = battleState.enemyName;
    }
}

// ===== UI: LOG =====
function setBattleLog(texto) {
    if (battleLog) {
        battleLog.textContent = texto;
    }
}

function addBattleLog(texto) {
    if (battleLog) {
        if (battleLog.textContent) {
            battleLog.textContent += " " + texto;
        } else {
            battleLog.textContent = texto;
        }
    }
}

// ===== UI: GOLPES =====
function updateMoveButtons() {
    if (!moveButtons.length) return;

    moveButtons.forEach(btn => {
        btn.textContent = "-";
        btn.disabled = true;
        btn.classList.add("locked");
        btn.dataset.moveId = "";
    });

    const unlocked = playerProgress.movesUnlocked.slice(0, moveButtons.length);

    unlocked.forEach((moveId, index) => {
        const def = MOVES[moveId];
        if (!def) return;

        const btn = moveButtons[index];
        btn.textContent = def.nome;
        btn.disabled = false;
        btn.classList.remove("locked");
        btn.dataset.moveId = moveId;
    });
}

// ===== PROGRESSO: XP E NÍVEL =====
function gainXp(amount) {
    playerProgress.xp += amount;

    let leveledUp = false;
    while (playerProgress.xp >= playerProgress.xpToNext) {
        playerProgress.xp -= playerProgress.xpToNext;
        playerProgress.level++;
        playerProgress.xpToNext = 20 + (playerProgress.level - 1) * 10;
        leveledUp = true;
        unlockMovesForLevel(playerProgress.level);
    }

    updateProgressUI();

    if (leveledUp) {
        addBattleLog(` Você subiu para o nível ${playerProgress.level}!`);
        updateMoveButtons();
    }
}

// ===== HEAL GLOBAL (USADO PELA MAÇÃ) =====
function healPlayer(amount) {
    if (amount <= 0) return 0;

    if (battleState.playerMaxHp == null) {
        battleState.playerMaxHp = 30;
    }
    if (battleState.playerHp == null) {
        battleState.playerHp = battleState.playerMaxHp;
    }

    const before = battleState.playerHp;
    battleState.playerHp = Math.min(battleState.playerMaxHp, battleState.playerHp + amount);
    const healed = battleState.playerHp - before;

    if (healed > 0) {
        updateHpUI();
        if (battleState.inBattle) {
            addBattleLog(` Você recuperou ${healed} de HP.`);
        }
    }

    return healed;
}

// ===== FLUXO DA BATALHA =====
function endBattle(result) {
    battleState.inBattle = false;

    if (result === "win") {
        gainXp(battleState.enemyXpReward);
        addBattleLog(` Você ganhou ${battleState.enemyXpReward} XP!`);

        if (battleState.enemyElement) {
            battleState.enemyElement.style.display = "none";
            battleState.enemyElement.style.pointerEvents = "none";
        }
    }

    if (battleScreen) {
        setTimeout(() => {
            battleScreen.classList.add("hidden");
        }, 800);
    }
}

function enemyTurn() {
    if (!battleState.inBattle) return;
    battleState.turn = "enemy";

    const dano = battleRandomInt(2, 6);
    battleState.playerHp = battleState.playerHp == null ? battleState.playerMaxHp : battleState.playerHp;
    battleState.playerHp -= dano;
    updateHpUI();

    if (battleState.playerHp <= 0) {
        setBattleLog(`O ${battleState.enemyName} causou ${dano} de dano. Você foi derrotado...`);
        endBattle("lose");
        return;
    }

    setBattleLog(`O ${battleState.enemyName} causou ${dano} de dano. Sua vez!`);
    battleState.turn = "player";
}

function playerUseMove(moveId) {
    if (!battleState.inBattle) return;
    if (battleState.turn !== "player") return;

    const def = MOVES[moveId];
    if (!def) return;

    const dano = battleRandomInt(def.minDano, def.maxDano);
    battleState.enemyHp -= dano;
    updateHpUI();

    if (battleState.enemyHp <= 0) {
        setBattleLog(`Você usou ${def.nome} e causou ${dano} de dano. ${battleState.enemyName} foi derrotado!`);
        endBattle("win");
        return;
    }

    setBattleLog(`Você usou ${def.nome} e causou ${dano} de dano. Turno do inimigo...`);
    battleState.turn = "enemy";

    setTimeout(enemyTurn, 650);
}

function onClickMoveButton(e) {
    const moveId = e.currentTarget.dataset.moveId;
    if (!moveId) return;
    if (!battleState.inBattle) return;

    playerUseMove(moveId);
}

function onClickRun() {
    if (!battleState.inBattle) return;
    setBattleLog("Você fugiu da batalha.");
    endBattle("run");
}

// Iniciar a batalha (chamado pelo interactions.js)
function startBattle(config = {}) {
    battleState.inBattle = true;
    battleState.playerMaxHp = 30;

    if (battleState.playerHp == null) {
        battleState.playerHp = battleState.playerMaxHp;
    }

    battleState.enemyMaxHp = config.enemyMaxHp || 20;
    battleState.enemyHp    = battleState.enemyMaxHp;
    battleState.enemyXpReward = config.enemyXp || 10;
    battleState.enemyElement  = config.enemyElement || null;
    battleState.turn = "player";

    setEnemyName(config.enemyName || "Inimigo");
    updateHpUI();
    updateProgressUI();
    updateMoveButtons();

    setBattleLog("Um inimigo apareceu! Escolha um golpe.");

    if (battleScreen) {
        battleScreen.classList.remove("hidden");
    }
}

// Expor globalmente
window.startBattle = startBattle;
window.healPlayer = healPlayer;
window.unlockSwordMove = unlockSwordMove;

window.addEventListener("load", () => {
    battleScreen    = document.getElementById("battle-screen");
    playerHpBar     = document.getElementById("player-hp-bar");
    enemyHpBar      = document.getElementById("enemy-hp-bar");
    playerHpText    = document.getElementById("player-hp-text");
    enemyHpText     = document.getElementById("enemy-hp-text");
    playerLevelText = document.getElementById("player-level-text");
    playerXpText    = document.getElementById("player-xp-text");
    enemyNameText   = document.getElementById("enemy-name-text");
    battleLog       = document.getElementById("battle-log");
    btnRun          = document.getElementById("btn-run");
    hudXpElement    = document.getElementById("hud-xp");

    moveButtons = [
        document.getElementById("move-slot-1"),
        document.getElementById("move-slot-2"),
        document.getElementById("move-slot-3"),
        document.getElementById("move-slot-4")
    ];

    moveButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", onClickMoveButton);
        }
    });

    if (btnRun) {
        btnRun.addEventListener("click", onClickRun);
    }

    updateHpUI();
    updateProgressUI();
    updateMoveButtons();
});
