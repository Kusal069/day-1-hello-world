// ==========================================================================
// HELLO WORLD INTERACTIVE SCRIPT
// ==========================================================================

// --- State & Configurations ---
const languages = [
  { word: "Hello, World!", lang: "English", emoji: "👋" },
  { word: "¡Hola, Mundo!", lang: "Spanish", emoji: "✨" },
  { word: "Bonjour, le Monde!", lang: "French", emoji: "🥐" },
  { word: "नमस्ते, संसार!", lang: "Nepali", emoji: "🙏" },
  { word: "こんにちは、世界！", lang: "Japanese", emoji: "🌸" },
  { word: "Hallo, Welt!", lang: "German", emoji: "⚡" },
  { word: "Ciao, Mondo!", lang: "Italian", emoji: "🍕" },
  { word: "你好，世界！", lang: "Chinese", emoji: "🏮" },
  { word: "नमस्ते, दुनिया!", lang: "Hindi", emoji: "🪔" },
  { word: "01001000 01101001!", lang: "Binary Code", emoji: "🤖" }
];

const quotes = [
  { text: "Every grand software journey starts with a single Hello, World.", author: "The Developer's Creed" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Any fool can write code that a computer understands. Good programmers write code that humans understand.", author: "Martin Fowler" }
];

const typewriterPhrases = [
  "Day 1 of building something extraordinary.",
  "Console.log('Hello World'); is just the start.",
  "Every master developer was once a beginner.",
  "Curiosity + Code = Infinite Possibilities.",
  "Turn coffee into code, and ideas into reality."
];

let langIndex = 0;
let clickCounter = 0;
let soundEnabled = true;
let audioCtx = null;

// --- Sound Synthesizer (Pure Web Audio API) ---
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playTone(freq = 440, type = 'sine', duration = 0.15, gainVal = 0.1) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted by browser policy before first interaction
  }
}

function playChirp() {
  if (!soundEnabled) return;
  playTone(587.33, 'triangle', 0.1, 0.08);
  setTimeout(() => playTone(880, 'sine', 0.15, 0.08), 80);
}

// --- DOM References ---
const greetingWord = document.getElementById('greetingWord');
const waveEmoji = document.getElementById('waveEmoji');
const langName = document.getElementById('langName');
const cycleLangBtn = document.getElementById('cycleLangBtn');
const mainGreeting = document.getElementById('mainGreeting');
const confettiBtn = document.getElementById('confettiBtn');
const clickCountBadge = document.getElementById('clickCount');
const inspireBtn = document.getElementById('inspireBtn');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const typewriterEl = document.getElementById('typewriter');
const soundToggle = document.getElementById('soundToggle');
const clockTimeEl = document.getElementById('clockTime');
const sessionTimerEl = document.getElementById('sessionTimer');
const timeGreetingEl = document.getElementById('greetingText');
const questProgress = document.getElementById('questProgress');
const checklist = document.getElementById('checklist');

// --- Language Switching ---
function setLanguage(index) {
  langIndex = index % languages.length;
  const current = languages[langIndex];

  // Visual pop animation
  greetingWord.style.opacity = '0';
  greetingWord.style.transform = 'translateY(8px) scale(0.96)';

  setTimeout(() => {
    greetingWord.textContent = current.word;
    langName.textContent = current.lang;
    waveEmoji.textContent = current.emoji;
    greetingWord.style.opacity = '1';
    greetingWord.style.transform = 'translateY(0) scale(1)';
  }, 120);

  playTone(520 + langIndex * 35, 'sine', 0.12, 0.08);
}

function nextLanguage() {
  setLanguage(langIndex + 1);
}

cycleLangBtn.addEventListener('click', nextLanguage);
mainGreeting.addEventListener('click', nextLanguage);

// --- Typewriter Effect ---
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function tickTypewriter() {
  const currentPhrase = typewriterPhrases[phraseIndex];
  
  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 65;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000; // Hold at the end of phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    delay = 400; // Pause before typing new phrase
  }

  setTimeout(tickTypewriter, delay);
}
tickTypewriter();

// --- Confetti Engine ---
const activeConfetti = [];
const confettiColors = ['#6366f1', '#a855f7', '#ec4899', '#00f5d4', '#ffd166', '#06d6a0', '#ff007f'];

function spawnConfetti(originX, originY, count = 45) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    activeConfetti.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }
}

// Button Click Event
confettiBtn.addEventListener('click', (e) => {
  clickCounter++;
  clickCountBadge.textContent = clickCounter;
  
  // Confetti burst from button position
  const rect = confettiBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  spawnConfetti(originX, originY, 40);
  playChirp();

  // Quest check trigger at 5 clicks
  if (clickCounter >= 5) {
    const task3 = document.querySelector('input[data-task="3"]');
    if (task3 && !task3.checked) {
      task3.checked = true;
      task3.closest('li').classList.add('checked');
      updateQuestProgress();
    }
  }
});

// --- Soundboard / Piano Keys ---
const pianoKeys = document.querySelectorAll('.piano-key');
const keyMap = {};

pianoKeys.forEach(btn => {
  const note = parseFloat(btn.dataset.note);
  const key = btn.dataset.key;
  keyMap[key] = { btn, note };

  btn.addEventListener('click', () => {
    triggerKey(btn, note);
  });
});

function triggerKey(btn, note) {
  playTone(note, 'triangle', 0.35, 0.15);
  btn.classList.add('playing');
  setTimeout(() => btn.classList.remove('playing'), 200);

  // Complete quest task 4
  const task4 = document.querySelector('input[data-task="4"]');
  if (task4 && !task4.checked) {
    task4.checked = true;
    task4.closest('li').classList.add('checked');
    updateQuestProgress();
  }
}

window.addEventListener('keydown', (e) => {
  const keyUpper = e.key.toUpperCase();
  if (keyMap[keyUpper]) {
    triggerKey(keyMap[keyUpper].btn, keyMap[keyUpper].note);
  }
});

// --- Sound FX Toggle ---
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle('muted', !soundEnabled);
  soundToggle.querySelector('.icon').textContent = soundEnabled ? '🔊' : '🔇';
  if (soundEnabled) playTone(440, 'sine', 0.1, 0.05);
});

// --- Theme Selector ---
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.setTheme;
    document.body.setAttribute('data-theme', theme);
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('day1-theme', theme);
    playTone(660, 'sine', 0.08, 0.04);
  });
});

// Load saved theme
const savedTheme = localStorage.getItem('day1-theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
const activeThemeBtn = document.querySelector(`[data-set-theme="${savedTheme}"]`);
if (activeThemeBtn) {
  themeButtons.forEach(b => b.classList.remove('active'));
  activeThemeBtn.classList.add('active');
}

// --- Inspiring Quote Shuffle ---
let quoteIndex = 0;
inspireBtn.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  quoteCard.style.transform = 'scale(0.98)';
  setTimeout(() => {
    quoteText.textContent = `"${quotes[quoteIndex].text}"`;
    quoteAuthor.textContent = `— ${quotes[quoteIndex].author}`;
    quoteCard.style.transform = 'scale(1)';
  }, 150);
  playTone(550, 'sine', 0.1, 0.05);
});

// --- Checklist / Quest Tracker ---
function updateQuestProgress() {
  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
  const checked = checklist.querySelectorAll('input[type="checkbox"]:checked');
  questProgress.textContent = `${checked.length}/${checkboxes.length} Done`;

  if (checked.length === checkboxes.length) {
    questProgress.textContent = '🎉 All Done!';
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 3, 75);
    playTone(523.25, 'sine', 0.15, 0.1);
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.1), 120);
    setTimeout(() => playTone(783.99, 'sine', 0.25, 0.1), 240);
  }
}

checklist.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    e.target.closest('li').classList.toggle('checked', e.target.checked);
    updateQuestProgress();
    playTone(e.target.checked ? 600 : 350, 'sine', 0.08, 0.05);
  }
});
updateQuestProgress();

// --- Live Clock & Session Timer ---
function updateTimeAndGreeting() {
  const now = new Date();
  clockTimeEl.textContent = now.toLocaleTimeString();

  const hour = now.getHours();
  let greet = "Good Day, Creator";
  if (hour >= 5 && hour < 12) greet = "☀️ Good Morning, Explorer";
  else if (hour >= 12 && hour < 18) greet = "🌤️ Good Afternoon, Builder";
  else if (hour >= 18 && hour < 22) greet = "🌆 Good Evening, Maker";
  else greet = "🌙 Midnight Coding Session";

  timeGreetingEl.textContent = greet;
}
setInterval(updateTimeAndGreeting, 1000);
updateTimeAndGreeting();

let sessionSeconds = 0;
setInterval(() => {
  sessionSeconds++;
  if (sessionSeconds < 60) {
    sessionTimerEl.textContent = `${sessionSeconds}s`;
  } else {
    const mins = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    sessionTimerEl.textContent = `${mins}m ${secs}s`;
  }
}, 1000);

// --- Particle Canvas Background System ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000, radius: 100 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Subtle repulsion from mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius) {
      const force = (mouse.radius - dist) / mouse.radius;
      this.x -= (dx / dist) * force * 3;
      this.y -= (dy / dist) * force * 3;
    }
  }

  draw() {
    const style = getComputedStyle(document.body);
    ctx.fillStyle = style.getPropertyValue('--canvas-particle') || 'rgba(168, 85, 247, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 20), 65);
  const particleCountEl = document.getElementById('particleCount');
  if (particleCountEl) particleCountEl.textContent = count;

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const style = getComputedStyle(document.body);
  const lineColor = style.getPropertyValue('--canvas-line') || 'rgba(99, 102, 241, 0.15)';

  // Draw connecting lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 105) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 - dist / 105;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Update & draw particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Render Confetti if active
  for (let i = activeConfetti.length - 1; i >= 0; i--) {
    const c = activeConfetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.2; // Gravity
    c.vx *= 0.98; // Friction
    c.rotation += c.rotationSpeed;
    c.opacity -= 0.015;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((c.rotation * Math.PI) / 180);
    ctx.fillStyle = c.color;
    ctx.globalAlpha = Math.max(0, c.opacity);

    if (c.shape === 'rect') {
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.5);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (c.opacity <= 0 || c.y > canvas.height) {
      activeConfetti.splice(i, 1);
    }
  }

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();
