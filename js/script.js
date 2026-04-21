/* =========================================================
   SERENA - SCRIPT PRINCIPAL
   ---------------------------------------------------------
   Este archivo contiene toda la lógica interactiva del sitio:
   1. Fondo animado en canvas
   2. Cursor personalizado
   3. Mensajes motivacionales
   4. Animaciones reveal al hacer scroll
   5. Modal de felicitación
   6. Sistema de pestañas
   7. Juego de respiración
   8. Juego "Toca la calma"
   9. Juego "Encuentra la paz"
   ========================================================= */

/* =========================================================
   1. REFERENCIAS GLOBALES DEL DOM
   ========================================================= */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const curEl = document.getElementById("cur");
const ringEl = document.getElementById("cur-ring");

const breathTrigger = document.getElementById("breathTrigger");
const breathResetButton = document.getElementById("breset");
const clickRestartButton = document.getElementById("clickRestart");
const findRestartButton = document.getElementById("findRestart");
const winCloseButton = document.getElementById("wclose");

const tabButtons = document.querySelectorAll(".tbtn");
const panels = document.querySelectorAll(".gpanel");

/* =========================================================
   2. FONDO ANIMADO EN CANVAS
   ---------------------------------------------------------
   Se dibuja un fondo vivo con:
   - Gradiente dinámico
   - Ondas suaves
   - Orbes flotantes
   - Estrellas
   - Partículas
   - Ondas expansivas al hacer clic
   ========================================================= */
let W;
let H;
let mouse = { x: -999, y: -999 };

const particles = [];
const stars = [];
const ripples = [];
const orbs = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* Estrellas decorativas de fondo */
for (let i = 0; i < 130; i += 1) {
  stars.push({
    x: Math.random() * 2000,
    y: Math.random() * 1400,
    r: 0.3 + Math.random() * 1.3,
    a: Math.random(),
    speed: 0.003 + Math.random() * 0.009,
    phase: Math.random() * Math.PI * 2,
  });
}

/* Orbes grandes con tonos de la marca */
const orbColors = [
  [168, 213, 186],
  [167, 199, 231],
  [74, 124, 89],
  [46, 94, 170],
  [130, 200, 160],
  [100, 180, 210],
];

for (let i = 0; i < 7; i += 1) {
  const color = orbColors[i % orbColors.length];

  orbs.push({
    x: Math.random() * 1600,
    y: Math.random() * 1000,
    r: 130 + Math.random() * 210,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.18,
    c: color,
    alpha: 0.04 + Math.random() * 0.07,
    phase: Math.random() * Math.PI * 2,
  });
}

/* Crea una partícula nueva */
function spawnParticle(x, y, vx, vy) {
  particles.push({
    x: x ?? Math.random() * W,
    y: y ?? Math.random() * H,
    vx: vx !== undefined ? vx : (Math.random() - 0.5) * 0.4,
    vy: vy !== undefined ? vy : -0.2 - Math.random() * 0.5,
    r: 0.7 + Math.random() * 2,
    life: 1,
    decay: 0.003 + Math.random() * 0.004,
    color: Math.random() > 0.5 ? [168, 213, 186] : [167, 199, 231],
  });
}

/* Población inicial de partículas */
for (let i = 0; i < 90; i += 1) {
  spawnParticle();
}

/* Efectos al hacer clic en la página */
document.addEventListener("click", (event) => {
  for (let i = 0; i < 3; i += 1) {
    ripples.push({
      rx: event.clientX,
      ry: event.clientY,
      r: 0,
      maxR: 110 + i * 65,
      speed: 1.8 + i * 1.4,
      alpha: 0.55 - i * 0.13,
      color: i % 2 === 0 ? [168, 213, 186] : [167, 199, 231],
    });
  }

  for (let i = 0; i < 14; i += 1) {
    const angle = (Math.PI * 2 * i) / 14;

    spawnParticle(
      event.clientX,
      event.clientY,
      Math.cos(angle) * (1 + Math.random() * 2.5),
      Math.sin(angle) * (1 + Math.random() * 2.5),
    );
  }

  showMotivationalMessage(event.clientX, event.clientY);
});

/* Seguimiento del mouse para iluminar el fondo */
document.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  if (Math.random() > 0.65) {
    spawnParticle(
      event.clientX,
      event.clientY,
      (Math.random() - 0.5) * 0.6,
      -0.3 - Math.random() * 0.4,
    );
  }
});

let animationTime = 0;

function drawCanvas() {
  animationTime += 0.007;

  /* Gradiente base del fondo */
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  const hue1 = 138 + Math.sin(animationTime * 0.28) * 12;
  const hue2 = 205 + Math.cos(animationTime * 0.19) * 18;

  gradient.addColorStop(0, `hsl(${hue1},48%,5%)`);
  gradient.addColorStop(0.45, `hsl(${(hue1 + hue2) / 2},42%,7%)`);
  gradient.addColorStop(1, `hsl(${hue2},44%,6%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  /* Ondas suaves en el fondo */
  for (let waveIndex = 0; waveIndex < 5; waveIndex += 1) {
    ctx.beginPath();

    const waveY = H * (0.15 + waveIndex * 0.16) + Math.sin(animationTime * 0.35 + waveIndex) * 45;
    ctx.moveTo(0, waveY);

    for (let x = 0; x <= W; x += 6) {
      const y =
        waveY +
        Math.sin(x * 0.005 + animationTime * (0.45 + waveIndex * 0.14) + waveIndex) *
          (28 + waveIndex * 16) +
        Math.cos(x * 0.0025 + animationTime * 0.28 + waveIndex * 1.3) *
          (18 + waveIndex * 9);

      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();

    const waveGradient = ctx.createLinearGradient(0, waveY - 70, 0, waveY + 90);
    const waveAlpha = 0.025 + waveIndex * 0.012;

    if (waveIndex % 2 === 0) {
      waveGradient.addColorStop(0, `rgba(168,213,186,${waveAlpha})`);
      waveGradient.addColorStop(1, "rgba(168,213,186,0)");
    } else {
      waveGradient.addColorStop(0, `rgba(167,199,231,${waveAlpha})`);
      waveGradient.addColorStop(1, "rgba(167,199,231,0)");
    }

    ctx.fillStyle = waveGradient;
    ctx.fill();
  }

  /* Orbes grandes con movimiento lento */
  orbs.forEach((orb) => {
    orb.x += orb.vx;
    orb.y += orb.vy;
    orb.phase += 0.004;

    if (orb.x < -orb.r) orb.x = W + orb.r;
    if (orb.x > W + orb.r) orb.x = -orb.r;
    if (orb.y < -orb.r) orb.y = H + orb.r;
    if (orb.y > H + orb.r) orb.y = -orb.r;

    const pulse = orb.alpha * (1 + Math.sin(orb.phase) * 0.35);
    const radial = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);

    radial.addColorStop(0, `rgba(${orb.c[0]},${orb.c[1]},${orb.c[2]},${pulse})`);
    radial.addColorStop(1, `rgba(${orb.c[0]},${orb.c[1]},${orb.c[2]},0)`);

    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fillStyle = radial;
    ctx.fill();
  });

  /* Halo alrededor del cursor */
  if (mouse.x > 0) {
    const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);

    mouseGradient.addColorStop(0, "rgba(168,213,186,.14)");
    mouseGradient.addColorStop(1, "rgba(168,213,186,0)");

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
    ctx.fillStyle = mouseGradient;
    ctx.fill();
  }

  /* Estrellas */
  stars.forEach((star) => {
    star.phase += star.speed;

    const alpha = (0.25 + Math.sin(star.phase) * 0.45) * star.a;

    ctx.beginPath();
    ctx.arc(star.x % W, star.y % H, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,237,220,${alpha})`;
    ctx.fill();
  });

  /* Ondas expansivas de clic */
  for (let i = ripples.length - 1; i >= 0; i -= 1) {
    const ripple = ripples[i];
    ripple.r += ripple.speed;

    const alpha = ripple.alpha * (1 - ripple.r / ripple.maxR);

    if (alpha <= 0 || ripple.r >= ripple.maxR) {
      ripples.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(ripple.rx, ripple.ry, ripple.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${ripple.color[0]},${ripple.color[1]},${ripple.color[2]},${alpha})`;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  /* Partículas pequeñas */
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];

    particle.x += particle.vx + Math.sin(animationTime + i * 0.4) * 0.18;
    particle.y += particle.vy;
    particle.life -= particle.decay;

    if (particle.life <= 0) {
      particles.splice(i, 1);
      spawnParticle();
      continue;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particle.color[0]},${particle.color[1]},${particle.color[2]},${particle.life * 0.65})`;
    ctx.fill();
  }

  /* Conexión visual entre partículas cercanas */
  const particlesCount = Math.min(particles.length, 45);

  for (let i = 0; i < particlesCount; i += 1) {
    for (let j = i + 1; j < particlesCount; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 85) {
        const alpha = (1 - distance / 85) * 0.055;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,213,186,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawCanvas);
}

drawCanvas();

/* =========================================================
   3. CURSOR PERSONALIZADO
   ---------------------------------------------------------
   Se dibuja un punto central y un anillo que sigue al mouse
   con un pequeño retraso para dar sensación de suavidad.
   ========================================================= */
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
let trailTime = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  curEl.style.left = `${mouseX}px`;
  curEl.style.top = `${mouseY}px`;

  spawnCursorTrail(mouseX, mouseY);
});

(function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;

  ringEl.style.left = `${ringX}px`;
  ringEl.style.top = `${ringY}px`;

  requestAnimationFrame(animateCursorRing);
})();

document.addEventListener("mousedown", () => {
  curEl.style.transform = "translate(-50%,-50%) scale(.45)";
  ringEl.style.width = "54px";
  ringEl.style.height = "54px";
  ringEl.style.borderColor = "rgba(168,213,186,.9)";
});

document.addEventListener("mouseup", () => {
  curEl.style.transform = "translate(-50%,-50%) scale(1)";
  ringEl.style.width = "36px";
  ringEl.style.height = "36px";
  ringEl.style.borderColor = "rgba(168,213,186,.5)";
});

/* Rastro visual del cursor */
function spawnCursorTrail(x, y) {
  const now = Date.now();

  if (now - trailTime < 28) return;
  trailTime = now;

  const trail = document.createElement("div");
  trail.className = "trail";

  const size = 2.5 + Math.random() * 5;
  const useBlue = Math.random() > 0.55;

  trail.style.cssText = `
    left:${x}px;
    top:${y}px;
    width:${size}px;
    height:${size}px;
    background:rgba(${useBlue ? "167,199,231" : "168,213,186"},.65)
  `;

  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 1400);
}

/* =========================================================
   4. MENSAJES MOTIVACIONALES
   ---------------------------------------------------------
   Se muestran mensajes breves de forma ocasional:
   - Al hacer clic
   - Al hacer scroll
   - Automáticamente cada cierto tiempo
   ========================================================= */
const motivationalMessages = [
  '"La calma no es la ausencia de caos,\nes encontrar paz dentro de él."',
  '"Cada respiro es una oportunidad\nde comenzar de nuevo."',
  '"Eres más fuerte de lo que crees\ny más capaz de lo que imaginas."',
  '"El autocuidado no es egoísmo,\nes la base de todo lo que das."',
  '"Tu mente merece descanso\ncon la misma urgencia que tu cuerpo."',
  '"Pequeñas pausas crean\ngrandes transformaciones interiores."',
  '"Hoy bastó con intentarlo.\nMañana seguirás creciendo."',
  '"La ansiedad miente a veces.\nTú eres capaz, estás bien."',
  '"Fluye como el agua:\nadáptate, pero no te detengas."',
  '"Estás en el camino correcto.\nSigue, aunque sea lento."',
  '"La perfección es un mito.\nEl progreso es real y hermoso."',
  '"Respira hondo. Este momento\ntambién pasará, y estarás bien."',
  '"Tu presencia en el mundo\nimpacta más de lo que crees."',
  '"Mereces paz con la misma\nintensidad que mereces el éxito."',
];

let messageIndex = 0;
let messageCooldown = false;

function showMotivationalMessage(x, y) {
  if (messageCooldown) return;

  messageCooldown = true;

  const box = document.createElement("div");
  box.className = "moti";
  box.textContent = motivationalMessages[messageIndex % motivationalMessages.length];
  messageIndex += 1;

  const popupWidth = Math.min(290, window.innerWidth - 40);
  const popupX = Math.min(
    Math.max((x || window.innerWidth / 2) - popupWidth / 2, 16),
    window.innerWidth - popupWidth - 16,
  );
  const popupY = Math.max((y || window.innerHeight / 2) - 90, 80);

  box.style.cssText += `left:${popupX}px;top:${popupY}px;width:${popupWidth}px`;

  document.body.appendChild(box);

  setTimeout(() => {
    box.remove();
    messageCooldown = false;
  }, 8000);
}

window.addEventListener(
  "scroll",
  () => {
    if (!messageCooldown && Math.random() > 0.58) {
      showMotivationalMessage(window.innerWidth / 2, window.innerHeight * 0.4);
    }
  },
  { passive: true },
);

setInterval(() => {
  if (!messageCooldown) {
    showMotivationalMessage(
      80 + Math.random() * (window.innerWidth - 200),
      80 + Math.random() * (window.innerHeight - 220),
    );
  }
}, 13000);

/* =========================================================
   5. EFECTO REVEAL AL HACER SCROLL
   ---------------------------------------------------------
   Los elementos con la clase .reveal aparecen suavemente
   cuando entran en el viewport.
   ========================================================= */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("on");
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

/* =========================================================
   6. MODAL DE FELICITACIÓN
   ---------------------------------------------------------
   Se usa al terminar correctamente una dinámica.
   ========================================================= */
const winMessages = [
  {
    e: "🌿",
    t: "¡Lo estás haciendo muy bien!",
    m: "Cada respiro es un pequeño acto de amor hacia ti mismo. Sigue así.",
  },
  {
    e: "✨",
    t: "Respira, todo está en calma",
    m: "Has encontrado tu espacio de paz. Llévalo contigo el resto del día.",
  },
  {
    e: "🌸",
    t: "¡Qué mente tan serena!",
    m: "Tu capacidad de enfocarte en lo que importa es tu mayor fortaleza.",
  },
  {
    e: "🌊",
    t: "Fluyes con gracia",
    m: "Como el agua que encuentra su camino, tú también encontrarás el tuyo.",
  },
  {
    e: "🦋",
    t: "Estás en el camino correcto",
    m: "Pequeñas pausas como esta transforman días difíciles en días posibles.",
  },
];

function showWinModal() {
  const randomWin = winMessages[Math.floor(Math.random() * winMessages.length)];

  document.getElementById("wemoji").textContent = randomWin.e;
  document.getElementById("wtitle").textContent = randomWin.t;
  document.getElementById("wmsg").textContent = randomWin.m;
  document.getElementById("wov").classList.add("show");
}

function closeWinModal() {
  document.getElementById("wov").classList.remove("show");
}

winCloseButton.addEventListener("click", closeWinModal);

/* =========================================================
   7. SISTEMA DE PESTAÑAS
   ---------------------------------------------------------
   Controla qué panel de juego está visible.
   ========================================================= */
function switchTab(id) {
  tabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  panels.forEach((panel) => {
    panel.classList.remove("active");
  });

  const activeButton = document.querySelector(`.tbtn[data-tab="${id}"]`);
  const activePanel = document.getElementById(`game-${id}`);

  if (activeButton) activeButton.classList.add("active");
  if (activePanel) activePanel.classList.add("active");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});

/* =========================================================
   8. JUEGO DE RESPIRACIÓN GUIADA
   ---------------------------------------------------------
   El usuario completa 4 ciclos:
   - Inhala
   - Sostén
   - Exhala
   ========================================================= */
let breathingActive = false;
let breathingPhase = "idle";
let breathingCycle = 0;
const breathingTotalCycles = 4;
let breathingTimer = null;

function updateBreathingProgress() {
  document.getElementById("bcnt").textContent = `${breathingCycle} / ${breathingTotalCycles}`;
  document.getElementById("bfill").style.width = `${(breathingCycle / breathingTotalCycles) * 100}%`;
}

function finishBreathingExercise() {
  breathingActive = false;
  clearTimeout(breathingTimer);

  document.getElementById("blabel").textContent = "¡Completado! Cuatro ciclos de respiración 🌿";
  document.getElementById("binner").textContent = "✓";
  breathResetButton.style.display = "inline-flex";

  setTimeout(showWinModal, 700);
}

function runBreathingCycle() {
  clearTimeout(breathingTimer);

  const innerCircle = document.getElementById("binner");
  const outerCircle = document.getElementById("bouter");
  const ringCircle = document.getElementById("bring");
  const label = document.getElementById("blabel");

  if (breathingPhase === "inhale") {
    label.textContent = "Inhala… expande tu pecho suavemente";
    innerCircle.style.transform = "scale(1.42)";
    outerCircle.style.transform = "scale(1.22)";
    ringCircle.style.transform = "scale(1.15)";
    innerCircle.style.boxShadow =
      "0 0 55px rgba(168,213,186,.85), inset 0 0 25px rgba(255,255,255,.12)";
    innerCircle.textContent = "Inhala";

    breathingTimer = setTimeout(() => {
      breathingPhase = "hold";
      runBreathingCycle();
    }, 4000);
  } else if (breathingPhase === "hold") {
    label.textContent = "Mantén… sostenlo suavemente";
    innerCircle.textContent = "Sostén";

    breathingTimer = setTimeout(() => {
      breathingPhase = "exhale";
      runBreathingCycle();
    }, 3000);
  } else {
    label.textContent = "Exhala lentamente… suelta la tensión";
    innerCircle.style.transform = "scale(1)";
    outerCircle.style.transform = "scale(1)";
    ringCircle.style.transform = "scale(1)";
    innerCircle.style.boxShadow =
      "0 0 30px rgba(168,213,186,.5), inset 0 0 20px rgba(255,255,255,.1)";
    innerCircle.textContent = "Exhala";

    breathingTimer = setTimeout(() => {
      breathingCycle += 1;
      updateBreathingProgress();

      if (breathingCycle >= breathingTotalCycles) {
        finishBreathingExercise();
      } else {
        breathingPhase = "inhale";
        runBreathingCycle();
      }
    }, 5000);
  }
}

function startBreathingExercise() {
  breathingActive = true;
  breathingCycle = 0;
  updateBreathingProgress();
  breathingPhase = "inhale";
  runBreathingCycle();
}

function handleBreathingStart() {
  if (!breathingActive) {
    startBreathingExercise();
  }
}

function resetBreathingExercise() {
  clearTimeout(breathingTimer);

  breathingActive = false;
  breathingCycle = 0;
  breathingPhase = "idle";

  const innerCircle = document.getElementById("binner");

  innerCircle.style.transform = "scale(1)";
  innerCircle.style.boxShadow =
    "0 0 30px rgba(168,213,186,.5), inset 0 0 20px rgba(255,255,255,.1)";
  innerCircle.textContent = "Toca";

  document.getElementById("bouter").style.transform = "scale(1)";
  document.getElementById("bring").style.transform = "scale(1)";
  document.getElementById("blabel").textContent = "Toca el círculo para comenzar";

  breathResetButton.style.display = "none";

  updateBreathingProgress();
}

/* Eventos del juego de respiración */
breathTrigger.addEventListener("click", handleBreathingStart);
breathTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleBreathingStart();
  }
});
breathResetButton.addEventListener("click", resetBreathingExercise);

/* =========================================================
   9. JUEGO "TOCA LA CALMA"
   ---------------------------------------------------------
   El jugador debe hacer clic en los elementos calmantes
   y evitar los distractores.
   ========================================================= */
const calmEmojis = ["🌿", "🍃", "🌱", "🌾", "🌲"];
const distractingEmojis = ["📚", "⏰", "📝", "💻", "📊", "🔋", "📌", "💾"];

let clickScore = 0;
let clickErrors = 0;
let clickTarget = 0;

function handleCalmClick(event) {
  const button = event.currentTarget;

  if (button.classList.contains("found")) return;

  if (button.dataset.c === "1") {
    button.classList.remove("calm");
    button.classList.add("found");

    clickScore += 1;
    document.getElementById("cscore").textContent = clickScore;

    if (clickScore >= clickTarget) {
      setTimeout(showWinModal, 450);
    }
  } else {
    clickErrors += 1;
    document.getElementById("cerrors").textContent = clickErrors;

    button.classList.add("wflash");
    setTimeout(() => {
      button.classList.remove("wflash");
    }, 350);
  }
}

function initClickGame() {
  clickScore = 0;
  clickErrors = 0;
  clickTarget = 0;

  document.getElementById("cerrors").textContent = "0";
  document.getElementById("cscore").textContent = "0";

  const grid = document.getElementById("cgrid");
  grid.innerHTML = "";

  const calmPositions = new Set();

  while (calmPositions.size < 4) {
    calmPositions.add(Math.floor(Math.random() * 20));
  }

  clickTarget = 4;
  document.getElementById("ctarget").textContent = String(clickTarget);

  for (let i = 0; i < 20; i += 1) {
    const button = document.createElement("button");
    button.className = "citem";
    button.type = "button";

    if (calmPositions.has(i)) {
      button.classList.add("calm");
      button.textContent = calmEmojis[Math.floor(Math.random() * calmEmojis.length)];
      button.dataset.c = "1";
    } else {
      button.textContent = distractingEmojis[Math.floor(Math.random() * distractingEmojis.length)];
      button.dataset.c = "0";
    }

    button.addEventListener("click", handleCalmClick);
    grid.appendChild(button);
  }
}

clickRestartButton.addEventListener("click", initClickGame);

/* =========================================================
   10. JUEGO "ENCUENTRA LA PAZ"
   ---------------------------------------------------------
   El jugador debe encontrar, en orden, todos los elementos
   naturales indicados.
   ========================================================= */
const findTargets = ["🌿", "🌸", "🍃", "🌊", "🦋"];
const findDistractors = ["🍕", "🎮", "📱", "🎵", "🚗", "🌮", "🎲", "🔑", "🎪", "📦", "🧲", "🔭", "🎯", "🧩"];

let findQueue = [];
let findIndex = 0;

function updateFindTargetIndicator() {
  if (findIndex < findQueue.length) {
    document.getElementById("femoji").textContent = findQueue[findIndex];
  }
}

function buildFindProgressDots() {
  const row = document.getElementById("fdots");
  row.innerHTML = "";

  findQueue.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "fdot";
    dot.id = `fd${index}`;
    row.appendChild(dot);
  });
}

function handleFindClick(event) {
  const button = event.currentTarget;

  if (button.classList.contains("correct")) return;

  if (button.dataset.e === findQueue[findIndex]) {
    button.classList.add("correct");
    document.getElementById(`fd${findIndex}`).classList.add("done");

    findIndex += 1;

    if (findIndex >= findQueue.length) {
      setTimeout(showWinModal, 500);
      return;
    }

    updateFindTargetIndicator();
  } else {
    button.classList.add("wflash");
    setTimeout(() => {
      button.classList.remove("wflash");
    }, 400);
  }
}

function buildFindGrid() {
  const grid = document.getElementById("fgrid");
  grid.innerHTML = "";

  const items = [];

  findQueue.forEach((target) => {
    items.push({ e: target, t: true });
  });

  for (let i = items.length; i < 30; i += 1) {
    items.push({
      e: findDistractors[Math.floor(Math.random() * findDistractors.length)],
      t: false,
    });
  }

  items.sort(() => Math.random() - 0.5);

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "fitem";
    button.type = "button";
    button.textContent = item.e;
    button.dataset.e = item.e;
    button.dataset.t = item.t ? "1" : "0";

    button.addEventListener("click", handleFindClick);
    grid.appendChild(button);
  });
}

function initFindGame() {
  findQueue = [...findTargets].sort(() => Math.random() - 0.5);
  findIndex = 0;

  updateFindTargetIndicator();
  buildFindGrid();
  buildFindProgressDots();
}

findRestartButton.addEventListener("click", initFindGame);

/* =========================================================
   11. INICIALIZACIÓN GENERAL
   ---------------------------------------------------------
   Prepara el estado inicial de los juegos cuando la página
   termina de cargar.
   ========================================================= */
updateBreathingProgress();
initClickGame();
initFindGame();
