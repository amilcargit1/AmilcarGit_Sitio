// AMILCARGIT OFICIAL — script del formulario de contacto (Formspree)

const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');

if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', () => {
    const isOpen = !menuPanel.hidden;
    menuPanel.hidden = isOpen;
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
  });
}

// Acordeón: cada categoría (Grupos WhatsApp, Bots, GitHub) se abre independiente
document.querySelectorAll('.menu-group-btn').forEach((btn) => {
  const list = document.getElementById(btn.getAttribute('aria-controls'));
  if (!list) return;
  btn.addEventListener('click', () => {
    const isOpen = !list.hidden;
    list.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        note.hidden = false;
        submitBtn.textContent = 'Enviado ✓';
        launchConfetti();
      } else {
        submitBtn.textContent = 'Reintentar envío';
      }
    } catch (err) {
      submitBtn.textContent = 'Reintentar envío';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Scroll reveal para secciones
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Botón volver arriba
const toTop = document.querySelector('.to-top');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
}

// ===== REPRODUCTOR DE AUDIO =====
// Para sumar audios nuevos, solo agregá un objeto acá:
// { title: 'Nombre', src: 'audio/archivo.mp3' }  ó una URL externa
const playlist = [
  { title: 'Presentación', src: 'audio/AUD-20260517-WA0021.mp3' },
  { title: 'Corazón Serrano Mix Poco Yo', src: 'audio/Corazón Serrano Mix Poco Yo.mp3' },
  { title: 'Que me está pasando', src: 'audio/Que me está pasando.mp3' },
  { title: 'Golaso', src: 'audio/Golaso.mp3' },
  { title: 'Corazón De Seda', src: 'audio/Corazon De Seda (MP3_160K).mp3' },
  { title: 'Bandido', src: 'audio/Bandido(MP3_160K).mp3' },
  { title: 'Ay Vamos', src: 'audio/Ay Vamos(MP3_160K).mp3' },
  { title: 'Cuando Florezca el Amor', src: 'audio/Cuando Florezca el Amor(MP3_160K).mp3' },
  { title: 'Qué Pasó', src: 'audio/Qué Pasó(MP3_160K).mp3' },
  { title: 'Sigues Con Él (Remix)', src: 'audio/Sigues Con Él (Remix) (MP3_160K).mp3' },
];

const bgAudio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const audioPrev = document.getElementById('audioPrev');
const audioNext = document.getElementById('audioNext');
const audioPlayer = document.getElementById('audioPlayer');
const audioIcon = audioToggle ? audioToggle.querySelector('.audio-icon') : null;
const audioTrackName = document.getElementById('audioTrackName');
const audioVolume = document.getElementById('audioVolume');
let trackIndex = 0;
let audioUnlocked = false;
let trackNameTimer = null;

function loadTrack(i) {
  if (!bgAudio || !playlist.length) return;
  bgAudio.src = playlist[i].src;
  showTrackName(playlist[i].title);
}

function showTrackName(title) {
  if (!audioTrackName) return;
  audioTrackName.textContent = title;
  audioTrackName.classList.add('is-visible');
  clearTimeout(trackNameTimer);
  trackNameTimer = setTimeout(() => audioTrackName.classList.remove('is-visible'), 3500);
}

function setPlayingUI(isPlaying) {
  if (!audioToggle || !audioIcon) return;
  audioToggle.classList.toggle('is-playing', isPlaying);
  audioToggle.setAttribute('aria-label', isPlaying ? 'Silenciar audio' : 'Reproducir audio');
  audioToggle.setAttribute('aria-pressed', String(isPlaying));
  audioIcon.textContent = isPlaying ? '🔊' : '🔇';
}

function playCurrentTrack() {
  bgAudio.muted = false;
  bgAudio.volume = audioVolume ? Number(audioVolume.value) / 100 : 0.35;
  bgAudio.play().catch(() => {});
  audioUnlocked = true;
  setPlayingUI(true);
}

function playNextTrack() {
  if (!playlist.length) return;
  trackIndex = (trackIndex + 1) % playlist.length;
  loadTrack(trackIndex);
  if (audioUnlocked) playCurrentTrack();
}

function playPrevTrack() {
  if (!playlist.length) return;
  trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(trackIndex);
  if (audioUnlocked) playCurrentTrack();
}

if (bgAudio && audioToggle && playlist.length) {
  loadTrack(trackIndex);
  if (audioTrackName) audioTrackName.classList.remove('is-visible'); // no mostrar el nombre hasta que el usuario active el sonido
  bgAudio.volume = 0;
  bgAudio.muted = true;
  bgAudio.addEventListener('ended', playNextTrack);

  // Intento de autoplay silencioso al cargar la página
  bgAudio.play().catch(() => { /* el navegador lo bloqueó, se activa con el botón */ });

  audioToggle.addEventListener('click', () => {
    if (!audioUnlocked) {
      playCurrentTrack();
      showTrackName(playlist[trackIndex].title);
    } else if (bgAudio.paused) {
      bgAudio.play().catch(() => {});
      setPlayingUI(true);
    } else {
      bgAudio.pause();
      setPlayingUI(false);
    }
  });

  if (audioPrev) audioPrev.addEventListener('click', playPrevTrack);
  if (audioNext) audioNext.addEventListener('click', playNextTrack);
  if (audioVolume) {
    audioVolume.addEventListener('input', () => {
      bgAudio.volume = Number(audioVolume.value) / 100;
    });
  }
} else if (audioPlayer) {
  // Sin audios cargados todavía: ocultar el reproductor
  audioPlayer.style.display = 'none';
}

// ===== MODO OSCURO / CLARO =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('amilcargit-theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}
function updateThemeButton() {
  if (!themeToggle) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.querySelector('span').textContent = isLight ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
}
updateThemeButton();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('amilcargit-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('amilcargit-theme', 'light');
    }
    updateThemeButton();
  });
}

// ===== CONTADOR DE VISITAS =====
// Usa CountAPI (countapi.xyz), un servicio gratuito sin necesidad de backend propio.
const visitorCountEl = document.getElementById('visitorCount');
if (visitorCountEl) {
  fetch('https://api.countapi.xyz/hit/amilcargit-oficial/visitas')
    .then((res) => res.json())
    .then((data) => {
      visitorCountEl.textContent = String(data.value).padStart(6, '0');
    })
    .catch(() => {
      const counter = document.getElementById('visitorCounter');
      if (counter) counter.style.display = 'none';
    });
}

// ===== PANTALLA DE CARGA =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;
  setTimeout(() => loadingScreen.classList.add('is-hidden'), 700);
});

// ===== FRASE CON PERSONALIDAD (cambia cada visita) =====
const moodPhrases = [
  '📡 Estado: en línea y de buen humor',
  '🦋 Hoy con ganas de crear cosas nuevas',
  '☕ Documento redactado con café de por medio',
  '🎧 Sonando algo de fondo, no seas tímido y activá el audio',
  '🐱 Aprobado por un gato que pasaba por ahí',
  '🔧 En constante actualización, como todo lo bueno',
];
const moodChip = document.getElementById('moodChip');
if (moodChip) {
  moodChip.textContent = moodPhrases[Math.floor(Math.random() * moodPhrases.length)];
}

// ===== CURSOR CON LUZ (solo compu) =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });
}

// ===== CONFETI AL ENVIAR EL FORMULARIO =====
function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#2E6BFF', '#FF3B3B', '#C9A227'];
  const count = 40;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.animationDelay = (Math.random() * 0.3) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// ===== SELLOS QUE SE DAN VUELTA (Áreas) =====
document.querySelectorAll('.mini-stamp-flip').forEach((flipCard) => {
  const toggleFlip = (e) => {
    // si el click vino del link del dorso, dejarlo navegar sin volver a girar la tarjeta
    if (e.target.closest('.mini-stamp-link')) return;
    flipCard.classList.toggle('is-flipped');
  };
  flipCard.addEventListener('click', toggleFlip);
  flipCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard.classList.toggle('is-flipped');
    }
  });
});

// ===== TARJETA CREDENCIAL: TILT 3D QUE SIGUE EL MOUSE =====
const tiltCard = document.querySelector('.card');
if (tiltCard
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0 a 1
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;   // -7deg a 7deg
    const rotateX = (0.5 - py) * 10;   // -5deg a 5deg
    tiltCard.style.transition = 'transform 0.08s ease-out';
    tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transition = 'transform 0.5s ease';
    tiltCard.style.transform = 'perspective(1000px)';
  });
}

// ===== PARALLAX DEL FONDO AL HACER SCROLL =====
const watermarkEl = document.querySelector('.watermark');
if (watermarkEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const drift = window.scrollY * 0.12;
      watermarkEl.style.transform = `translate(-50%, calc(-50% + ${drift}px)) rotate(-8deg)`;
      ticking = false;
    });
  }, { passive: true });
}
