// Duração de um "dia" em milissegundos (aqui: 60 segundos para testar)
const DAY_LENGTH_MS = 5 * 60 * 1000; // 5 minutos

// Expor para outros scripts (respawn etc.)
window.DAY_LENGTH_MS = DAY_LENGTH_MS;

let dayStartTimestamp = null;

function updateDayNight(timestamp) {
    if (dayStartTimestamp === null) {
        dayStartTimestamp = timestamp;
    }

    const elapsed = timestamp - dayStartTimestamp;
    const t = (elapsed % DAY_LENGTH_MS) / DAY_LENGTH_MS; // 0..1

    const overlay = document.getElementById("day-night-overlay");
    if (!overlay) {
        requestAnimationFrame(updateDayNight);
        return;
    }

    let color = "0,0,0";
    let alpha = 0;

    // Manhã (0.0 - 0.25): clareando do escuro para o dia
    if (t < 0.25) {
        const f = 1 - (t / 0.25);   // 1 -> 0
        alpha = 0.6 * f;            // 0.6 -> 0
    }
    // Dia (0.25 - 0.7): luz total (sem overlay)
    else if (t < 0.7) {
        alpha = 0;
    }
    // Entardecer (0.7 - 0.85): laranja levemente escuro
    else if (t < 0.85) {
        const f = (t - 0.7) / 0.15; // 0 -> 1
        color = "255,140,0";        // laranja
        alpha = 0.4 * f;            // 0 -> 0.4
    }
    // Noite (0.85 - 1.0): escuro
    else {
        alpha = 0.6;
    }

    overlay.style.background = `rgba(${color}, ${alpha})`;

    requestAnimationFrame(updateDayNight);
}

window.addEventListener("load", () => {
    requestAnimationFrame(updateDayNight);
});
