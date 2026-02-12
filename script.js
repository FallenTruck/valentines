const APP_CONFIG = {
  recipientName: "Pooja",
  nickname: "Pooh Bear",
  eventDate: "2026-02-14",
  eventTime: "10:00 AM",
  eventLocation: "Anywhere with you is perfect (but let's start it at Ya Kun!)",
  introLines: [
    "You make my world softer and make me feel special without even trying.",
    "I made you this tiny corner of the internet because you deserve sweet surprises.",
    "Can I officially steal you for Valentine’s Day, Pooju Ma?"
  ],
  finalMessage:
    "My love, thank you for saying yes. I cannot wait to make this date adorable, cozy, and full of us.",
  imagePaths: [
    "assets/images/6082483554924301689.jpg",
    "assets/images/6082483554924301690.jpg",
    "assets/images/6082483554924301691.jpg",
    "assets/images/6082483554924301692.jpg",
    "assets/images/6082483554924301694.jpg",
    "assets/images/6082483554924301699.jpg",
    "assets/images/6082483554924301700.jpg",
    "assets/images/6082483554924301701.jpg",
    "assets/images/6082483554924301702.jpg",
    "assets/images/6082483554924301703.jpg",
    "assets/images/6082483554924301704.jpg",
    "assets/images/6082483554924301705.jpg",
    "assets/images/6082483554924301706.jpg",
    "assets/images/6082483554924301707.jpg",
    "assets/images/6082483554924301708.jpg",
    "assets/images/6082483554924301709.jpg",
    "assets/images/6082483554924301710.jpg",
    "assets/images/6082483554924301711.jpg",
    "assets/images/6082483554924301712.jpg"
  ],
  audioPath: "assets/audio/Un-Vizhigalil.mp3",
  noButtonMaxDodges: 8
};

const introSection = document.querySelector("#intro-section");
const questionSection = document.querySelector("#question-section");
const celebrationSection = document.querySelector("#celebration-section");
const introLinesEl = document.querySelector("#intro-lines");
const yesBtn = document.querySelector("#yes-btn");
const noBtn = document.querySelector("#no-btn");
const ctaRow = document.querySelector("#cta-row");
const questionSubtext = document.querySelector("#question-subtext");
const finalMessageEl = document.querySelector("#final-message");
const dateValue = document.querySelector("#date-value");
const timeValue = document.querySelector("#time-value");
const locationValue = document.querySelector("#location-value");
const gallery = document.querySelector("#gallery");
const audio = document.querySelector("#bg-audio");
const musicToggle = document.querySelector("#music-toggle");
const audioStatus = document.querySelector("#audio-status");
const confettiCanvas = document.querySelector("#confetti-canvas");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const noMessages = [
  "Nope... that button romba shy today.",
  "Pooh Bear, I think your heart meant yes.",
  "That No is doing more cardio than us.",
  "You're too cute to reject me.",
  "Try again. The universe ships us.",
  "Still dodging. Low-key dramatic.",
  "That button has commitment issues.",
  "Okay okay... only yes works."
];

let dodgeCount = 0;
let confettiFrame = null;
let confettiParticles = [];
let audioLoaded = false;
let galleryPanFrame = null;
let galleryPanPaused = false;
let galleryPanControlsBound = false;

function setTitleAndQuestion() {
  document.title = `For ${APP_CONFIG.recipientName}, My ${APP_CONFIG.nickname}`;
  const titleEl = document.querySelector("#intro-title");
  const questionTitle = document.querySelector("#question-title");

  titleEl.textContent = `To ${APP_CONFIG.recipientName}, my ${APP_CONFIG.nickname}`;
  questionTitle.textContent = `Will you be my Valentine, ${APP_CONFIG.nickname}?`;
}

function renderIntroLines() {
  introLinesEl.innerHTML = "";

  APP_CONFIG.introLines.forEach((line, index) => {
    const p = document.createElement("p");
    p.className = "intro-line";
    p.textContent = line;
    p.style.animationDelay = `${index * 220}ms`;
    introLinesEl.appendChild(p);
  });
}

function formatDate(dateInput) {
  const fallback = dateInput;
  const date = new Date(`${dateInput}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function renderDetails() {
  finalMessageEl.textContent = APP_CONFIG.finalMessage;
  dateValue.textContent = formatDate(APP_CONFIG.eventDate);
  timeValue.textContent = APP_CONFIG.eventTime;
  locationValue.textContent = APP_CONFIG.eventLocation;
}

function makePlaceholderCard(path, index) {
  const figure = document.createElement("figure");
  figure.className = "gallery-item";

  const placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  placeholder.textContent = `Add photo ${index + 1}\n(${path})`;

  figure.appendChild(placeholder);
  return figure;
}

function renderGallery() {
  gallery.innerHTML = "";

  if (!APP_CONFIG.imagePaths.length) {
    gallery.hidden = true;
    stopGalleryPan();
    return;
  }

  gallery.hidden = false;
  gallery.scrollLeft = 0;

  APP_CONFIG.imagePaths.forEach((path, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const img = document.createElement("img");
    img.src = path;
    img.alt = `Memory ${index + 1} of ${APP_CONFIG.recipientName}`;
    img.loading = "lazy";

    img.addEventListener("error", () => {
      figure.replaceWith(makePlaceholderCard(path, index));
    });

    figure.appendChild(img);
    gallery.appendChild(figure);
  });

  bindGalleryPanControls();
  startGalleryPan();
}

function stopGalleryPan() {
  if (galleryPanFrame) {
    cancelAnimationFrame(galleryPanFrame);
    galleryPanFrame = null;
  }
}

function bindGalleryPanControls() {
  if (galleryPanControlsBound) {
    return;
  }

  const pause = () => {
    galleryPanPaused = true;
  };

  const resume = () => {
    galleryPanPaused = false;
  };

  gallery.addEventListener("mouseenter", pause);
  gallery.addEventListener("mouseleave", resume);
  gallery.addEventListener("focusin", pause);
  gallery.addEventListener("focusout", resume);
  gallery.addEventListener("touchstart", pause, { passive: true });
  gallery.addEventListener("touchend", resume, { passive: true });
  galleryPanControlsBound = true;
}

function startGalleryPan() {
  stopGalleryPan();

  if (reduceMotion) {
    return;
  }

  const maxScroll = gallery.scrollWidth - gallery.clientWidth;
  if (maxScroll <= 0) {
    return;
  }

  const speed = 1.2;
  let direction = 1;

  function tick() {
    if (!galleryPanPaused) {
      const latestMax = gallery.scrollWidth - gallery.clientWidth;
      if (latestMax <= 0) {
        gallery.scrollLeft = 0;
      } else {
        if (gallery.scrollLeft >= latestMax - 1) {
          direction = -1;
        } else if (gallery.scrollLeft <= 1) {
          direction = 1;
        }

        gallery.scrollLeft += speed * direction;
      }
    }

    galleryPanFrame = requestAnimationFrame(tick);
  }

  galleryPanFrame = requestAnimationFrame(tick);
}

function initAudio() {
  audio.src = APP_CONFIG.audioPath;
  audio.loop = true;

  audio.addEventListener("canplay", () => {
    audioLoaded = true;
  });

  audio.addEventListener("error", () => {
    audioLoaded = false;
    musicToggle.disabled = true;
    musicToggle.textContent = "Song unavailable";
    audioStatus.textContent = "No audio file found yet. Add your song in assets/audio.";
  });
}

async function toggleMusic() {
  if (!audioLoaded) {
    audioStatus.textContent = "Song is still loading or missing.";
    return;
  }

  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.textContent = "Pause song";
      musicToggle.setAttribute("aria-pressed", "true");
      audioStatus.textContent = "Playing your song.";
    } catch (_err) {
      audioStatus.textContent = "Tap Play again if your browser blocked autoplay.";
    }
  } else {
    audio.pause();
    musicToggle.textContent = "Play song";
    musicToggle.setAttribute("aria-pressed", "false");
    audioStatus.textContent = "Music paused.";
  }
}

async function tryAutoplayAfterYes() {
  if (!audioLoaded || musicToggle.disabled) {
    audioStatus.textContent = "Song is still loading or missing.";
    return;
  }

  if (!audio.paused) {
    return;
  }

  try {
    await audio.play();
    musicToggle.textContent = "Pause song";
    musicToggle.setAttribute("aria-pressed", "true");
    audioStatus.textContent = "Playing your song.";
  } catch (_err) {
    musicToggle.textContent = "Play song";
    musicToggle.setAttribute("aria-pressed", "false");
    audioStatus.textContent =
      "Your browser blocked auto-play after Yes. Tap Play song to start music.";
  }
}

function getNoButtonPosition() {
  const rowRect = ctaRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(0, rowRect.width - btnRect.width);
  const maxY = Math.max(0, rowRect.height - btnRect.height);

  const padding = 2;
  const x = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
  const y = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

  return { x, y };
}

function dodgeNoButton() {
  dodgeCount += 1;

  if (dodgeCount <= APP_CONFIG.noButtonMaxDodges) {
    const { x, y } = getNoButtonPosition();
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    questionSubtext.textContent = noMessages[Math.min(dodgeCount - 1, noMessages.length - 1)];
  } else {
    noBtn.disabled = true;
    noBtn.textContent = "Okay yes";
    noBtn.setAttribute("aria-hidden", "true");
    noBtn.style.opacity = "0.6";
    questionSubtext.textContent = "The No button retired. Destiny picked Yes.";
  }
}

function setupConfettiCanvas() {
  const ratio = window.devicePixelRatio || 1;
  confettiCanvas.width = Math.floor(window.innerWidth * ratio);
  confettiCanvas.height = Math.floor(window.innerHeight * ratio);
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
}

function spawnConfetti() {
  setupConfettiCanvas();
  const count = reduceMotion ? 40 : 140;

  confettiParticles = Array.from({ length: count }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20,
    w: 6 + Math.random() * 8,
    h: 6 + Math.random() * 8,
    vx: -1.2 + Math.random() * 2.4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    color: ["#9f2b38", "#d8656f", "#f4c8bf", "#f0a64a", "#fff"][
      Math.floor(Math.random() * 5)
    ]
  }));

  const ctx = confettiCanvas.getContext("2d");
  const durationMs = reduceMotion ? 900 : 2400;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      confettiFrame = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      cancelAnimationFrame(confettiFrame);
      confettiFrame = null;
    }
  }

  if (confettiFrame) {
    cancelAnimationFrame(confettiFrame);
  }

  confettiFrame = requestAnimationFrame(frame);
}

function showCelebration() {
  questionSection.hidden = true;
  celebrationSection.hidden = false;
  celebrationSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  spawnConfetti();
  startGalleryPan();
}

function initialize() {
  setTitleAndQuestion();
  renderIntroLines();
  renderDetails();
  renderGallery();
  initAudio();

  yesBtn.addEventListener("click", async () => {
    showCelebration();
    await tryAutoplayAfterYes();
  });

  noBtn.addEventListener("mouseenter", dodgeNoButton);
  noBtn.addEventListener("click", dodgeNoButton);

  musicToggle.addEventListener("click", toggleMusic);

  window.addEventListener("resize", () => {
    if (confettiFrame) {
      setupConfettiCanvas();
    }

    startGalleryPan();
  });
}

initialize();

window.APP_CONFIG = APP_CONFIG;
