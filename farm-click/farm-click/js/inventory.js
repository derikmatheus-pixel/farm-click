// ===== DEFINIÇÃO DOS ITENS =====
const ITEM_DEFS = {
    tronco: {
        id: "tronco",
        nome: "Tronco",
        cor: "#8d6e63",
        letra: "T"
    },
    folha: {
        id: "folha",
        nome: "Folha",
        cor: "#66bb6a",
        letra: "F"
    },
    galho: {
        id: "galho",
        nome: "Galho",
        cor: "#a1887f",
        letra: "G"
    },
    maca: {
        id: "maca",
        nome: "Maçã",
        cor: "#e53935",
        letra: "M"
    },
    pedra: {
        id: "pedra",
        nome: "Pedra lisa",
        cor: "#b0bec5",
        letra: "P"
    }
};

// Drops das árvores (já usados nas interações)
const TREE_DROP_TABLE = {
    tronco: { chance: 0.8, min: 1, max: 3 },
    folha:  { chance: 1.0, min: 1, max: 10 },
    galho:  { chance: 0.7, min: 1, max: 5 },
    maca:   { chance: 0.4, min: 0, max: 2 }
};

// Inventário em slots
const MAX_SLOTS = 12;
const slots = new Array(MAX_SLOTS).fill(null);

// Craft da espada
const SWORD_RECIPE = {
    tronco: 3,
    galho: 2,
    pedra: 2
};

let swordCrafted = false;

// Utils
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== INVENTÁRIO: ADIÇÃO DE ITENS =====
function addItemById(itemId, quantidade = 1) {
    const def = ITEM_DEFS[itemId];
    if (!def || quantidade <= 0) return;

    // tenta juntar em slot existente
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (slot && slot.id === itemId) {
            slot.quantidade += quantidade;
            renderInventorySlots();
            return;
        }
    }

    // senão, procura slot vazio
    for (let i = 0; i < slots.length; i++) {
        if (!slots[i]) {
            slots[i] = {
                id: def.id,
                nome: def.nome,
                cor: def.cor,
                letra: def.letra,
                quantidade: quantidade
            };
            renderInventorySlots();
            return;
        }
    }

    console.warn("Inventário cheio, não foi possível adicionar:", def.nome);
}

// Compatível com uso antigo (por nome)
function addItemToInventory(nome, quantidade = 1) {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes("pedra")) {
        addItemById("pedra", quantidade);
    }
}

// ===== INVENTÁRIO: CONTAGEM / CONSUMO PARA CRAFT =====
function countItemInSlots(itemId) {
    let total = 0;
    slots.forEach(slot => {
        if (slot && slot.id === itemId) {
            total += slot.quantidade;
        }
    });
    return total;
}

function hasItemsForRecipe(recipe) {
    return Object.keys(recipe).every(itemId => {
        const needed = recipe[itemId];
        return countItemInSlots(itemId) >= needed;
    });
}

function consumeItemsForRecipe(recipe) {
    if (!hasItemsForRecipe(recipe)) return false;

    // consumo efetivo
    Object.keys(recipe).forEach(itemId => {
        let toRemove = recipe[itemId];

        for (let i = 0; i < slots.length && toRemove > 0; i++) {
            const slot = slots[i];
            if (slot && slot.id === itemId) {
                const remove = Math.min(slot.quantidade, toRemove);
                slot.quantidade -= remove;
                toRemove -= remove;

                if (slot.quantidade <= 0) {
                    slots[i] = null;
                }
            }
        }
    });

    renderInventorySlots();
    return true;
}

// ===== RENDERIZAÇÃO DO INVENTÁRIO =====
function renderInventorySlots() {
    const grid = document.getElementById("inventory-grid");
    if (!grid) return;

    grid.innerHTML = "";

    for (let i = 0; i < slots.length; i++) {
        const slotData = slots[i];
        const slotEl = document.createElement("div");
        slotEl.classList.add("slot");

        if (!slotData) {
            slotEl.classList.add("empty");
        } else {
            const icon = document.createElement("div");
            icon.classList.add("item-icon");
            icon.style.backgroundColor = slotData.cor;
            icon.textContent = slotData.letra;

            const qty = document.createElement("div");
            qty.classList.add("item-qty");
            qty.textContent = "x" + slotData.quantidade;

            slotEl.title = `${slotData.nome} (${slotData.quantidade})`;

            slotEl.appendChild(icon);
            slotEl.appendChild(qty);

            // Clique no slot para usar item (ex: Maçã cura vida)
            slotEl.addEventListener("click", () => {
                onInventorySlotClick(i);
            });
        }

        grid.appendChild(slotEl);
    }
}

// Uso de itens clicando no slot
function onInventorySlotClick(index) {
    const slot = slots[index];
    if (!slot) return;

    // Maçã cura vida
    if (slot.id === "maca" && window.healPlayer) {
        const healed = window.healPlayer(10); // cura 10 de HP
        if (healed > 0) {
            slot.quantidade -= 1;
            if (slot.quantidade <= 0) {
                slots[index] = null;
            }
            renderInventorySlots();
        }
    }
}

// ===== CRAFT: ESPADA SIMPLES =====
function handleCraftSword() {
    const feedback = document.getElementById("craft-feedback");
    if (!feedback) return;

    if (swordCrafted) {
        feedback.textContent = "Você já forjou uma espada.";
        return;
    }

    if (!hasItemsForRecipe(SWORD_RECIPE)) {
        feedback.textContent = "Recursos insuficientes para forjar a espada.";
        return;
    }

    if (!consumeItemsForRecipe(SWORD_RECIPE)) {
        feedback.textContent = "Falha ao consumir recursos.";
        return;
    }

    swordCrafted = true;
    feedback.textContent = "Espada forjada! Novo golpe de corte liberado.";

    if (window.unlockSwordMove) {
        window.unlockSwordMove();
    }

    const btn = document.getElementById("btn-craft-sword");
    if (btn) {
        btn.disabled = true;
    }
}

// ===== COLETA DE ÁRVORE (usada em interactions.js) =====
function harvestTree() {
    Object.keys(TREE_DROP_TABLE).forEach((itemId) => {
        const cfg = TREE_DROP_TABLE[itemId];
        if (Math.random() <= cfg.chance) {
            const qtd = randomInt(cfg.min, cfg.max);
            if (qtd > 0) {
                addItemById(itemId, qtd);
            }
        }
    });
}

// Expor para outros scripts
window.addItemById = addItemById;
window.addItemToInventory = addItemToInventory;
window.harvestTree = harvestTree;

window.addEventListener("load", () => {
    const btnInventory   = document.getElementById("btn-inventory");
    const modalInventory = document.getElementById("inventory-modal");
    const closeInventory = document.getElementById("close-inventory");
    const btnCraftSword  = document.getElementById("btn-craft-sword");

    if (btnInventory && modalInventory) {
        btnInventory.addEventListener("click", () => {
            renderInventorySlots();
            modalInventory.classList.remove("hidden");
        });
    }

    if (closeInventory && modalInventory) {
        closeInventory.addEventListener("click", () => {
            modalInventory.classList.add("hidden");
        });
    }

    if (modalInventory) {
        modalInventory.addEventListener("click", (evento) => {
            if (evento.target === modalInventory) {
                modalInventory.classList.add("hidden");
            }
        });
    }

    // Botão de craft
    if (btnCraftSword) {
        btnCraftSword.addEventListener("click", handleCraftSword);
    }

    // Render inicial
    renderInventorySlots();
});
