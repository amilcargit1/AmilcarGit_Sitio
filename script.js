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
  { title: 'Corazón De Seda', src: 'audio/Corazon De Seda(MP3_160K).mp3' },
  { title: 'Bandido', src: 'audio/Bandido(MP3_160K).mp3' },
  { title: 'Ay Vamos', src: 'audio/Ay Vamos(MP3_160K).mp3' },
  { title: 'Cuando Florezca el Amor', src: 'audio/Cuando Florezca el Amor(MP3_160K).mp3' },
  { title: 'Qué Pasó', src: 'audio/Y Qué Pasó(MP3_160K).mp3' },
  { title: 'Sigues Con Él (Remix)', src: 'audio/Sigues Con Él (Remix) (MP3_160K).mp3' },
  { title: 'Sector 7 al mundial', src: 'audio/Sector 7 al mundial.mp3' },
  { title: 'Yo x Ti, Tu x Mi', src: 'audio/Yo x Ti_ Tu x Mi saxx ff.mp3' },
  { title: 'Solo de Mí', src: 'audio/Solo de Mí Benja OFC .mp3' },
  { title: 'HEIST', src: 'audio/HEIST Oficial .mp3' },
  { title: 'Música original de Gost', src: 'audio/Música original de Gost OFC .mp3' },
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

// ===== SELECTOR DE IDIOMA (ES/EN) =====
const translations = {
  navCredencial: { es: 'Credencial', en: 'Credential' },
  navAreas: { es: 'Áreas', en: 'Areas' },
  navContacto: { es: 'Contacto', en: 'Contact' },
  menuWpp: { es: 'Grupos de WhatsApp', en: 'WhatsApp Groups' },
  menuBotsTitle: { es: 'Bots de WhatsApp', en: 'WhatsApp Bots' },
  menuGithubTitle: { es: 'GitHub', en: 'GitHub' },
  menuSubBots: { es: 'Bots', en: 'Bots' },
  menuSubSites: { es: 'Sitios web', en: 'Websites' },
  heroEyebrow: { es: 'Documento de presentación · Identidad en construcción', en: 'Presentation document · Identity under construction' },
  heroSub: { es: 'Marca personal en proceso de registro. Este documento se irá completando a medida que el proyecto tome forma — por ahora, es la presentación oficial.', en: 'Personal brand currently being registered. This document will keep filling in as the project takes shape — for now, this is the official introduction.' },
  btnVerCredencial: { es: 'Ver credencial →', en: 'View credential →' },
  labelSobreMi: { es: 'Sobre mí', en: 'About me' },
  labelAreas: { es: 'Áreas registradas', en: 'Registered areas' },
  labelContacto: { es: 'Solicitud de contacto', en: 'Contact request' },
  dtRol: { es: 'Rol', en: 'Role' },
  dtSede: { es: 'Sede', en: 'Location' },
  dtRegistro: { es: 'N° de registro', en: 'Registration No.' },
  dtEstado: { es: 'Estado', en: 'Status' },
  ddRol: { es: 'Desarrollador 🐱 · Creador de contenido 📨', en: 'Developer 🐱 · Content creator 📨' },
  ddSede: { es: 'Marcabal Grande, Perú', en: 'Marcabal Grande, Peru' },
  badgeEstado: { es: 'En construcción', en: 'Under construction' },
  cardBio: { es: 'Cada día aprendiendo más 🦋', en: 'Learning a little more every day 🦋' },
  areasNote: { es: 'Se van a ir habilitando con el tiempo — la primera ya está en trámite ✅', en: "They'll open up over time — the first one is already in the works ✅" },
  labelContenido: { es: 'Contenido', en: 'Content' },
  labelServicios: { es: 'Servicios', en: 'Services' },
  labelProyectos: { es: 'Proyectos', en: 'Projects' },
  backContenido: { es: 'Videos, clips o lo que se me ocurra — todavía cocinándose 👨‍🍳', en: 'Videos, clips, whatever I come up with — still cooking 👨‍🍳' },
  backServicios: { es: 'Desarrollo, bots y algún que otro apaño técnico. En camino 🔧', en: 'Development, bots, and the occasional technical fix. On the way 🔧' },
  backProyectos: { es: 'Bot de WhatsApp con sistema de plugins.', en: 'WhatsApp bot with a plugin system.' },
  verRepo: { es: 'Ver repo →', en: 'View repo →' },
  contactoIntro: { es: 'Para consultas, propuestas o simplemente para saludar, completá los datos o escribí directo por estos medios:', en: "For questions, proposals, or just to say hi, fill out the form or write directly through these channels:" },
  btnCompartir: { es: '📤 Compartir por WhatsApp', en: '📤 Share on WhatsApp' },
  labelNombre: { es: 'Nombre', en: 'Name' },
  labelEmailForm: { es: 'Email', en: 'Email' },
  labelMensaje: { es: 'Mensaje', en: 'Message' },
  btnEnviar: { es: 'Enviar solicitud', en: 'Send request' },
  formNoteText: { es: 'Formulario enviado. Gracias por escribir.', en: 'Form sent. Thanks for writing.' },
  footerText: { es: 'AMILCARGIT OFICIAL — Documento generado en 2026. Todos los datos son provisorios hasta su validación final.', en: 'AMILCARGIT OFICIAL — Document generated in 2026. All data is provisional until final validation.' },
  visitorLabel: { es: 'Visitante N°', en: 'Visitor No.' },
  loadingText: { es: 'Sellando documento', en: 'Stamping document' },
  labelFirmas: { es: 'Libro de firmas', en: 'Guestbook' },
  firmasNote: { es: 'Dejá tu firma o un mensaje — queda registrado acá abajo, a la vista de todos.', en: 'Leave your signature or a message — it stays posted here, for everyone to see.' },
  labelComunidad: { es: 'Música de la comunidad', en: 'Community music' },
  comunidadNote: { es: 'Iniciá sesión con Google y sumá hasta 2 canciones (link directo al mp3) para que todos las escuchen acá.', en: 'Sign in with Google and add up to 2 songs (direct mp3 link) for everyone to listen to here.' },
  btnSignIn: { es: 'Iniciar sesión con Google', en: 'Sign in with Google' },
  btnSignOut: { es: 'Salir', en: 'Sign out' },
  phTitulo: { es: 'Título de la canción', en: 'Song title' },
  phLink: { es: 'Link directo al .mp3 (Catbox, Dropbox, etc.)', en: 'Direct link to the .mp3 (Catbox, Dropbox, etc.)' },
  btnSubirCancion: { es: 'Subir canción', en: 'Upload song' },
  labelAdmin: { es: '🔑 Panel de administrador', en: '🔑 Admin panel' },
};

const moodPhrasesByLang = {
  es: moodPhrases,
  en: [
    '📡 Status: online and in a good mood',
    '🦋 Feeling like creating new things today',
    '☕ This document was written with coffee involved',
    '🎧 Something is playing in the background, go ahead and turn on the audio',
    '🐱 Approved by a cat that walked by',
    '🔧 Constantly updating, like all good things',
  ],
};

let currentLang = localStorage.getItem('amilcargit-lang') || 'es';

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const entry = translations[key];
    if (entry && entry[lang]) el.textContent = entry[lang];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const entry = translations[key];
    if (entry && entry[lang]) el.setAttribute('placeholder', entry[lang]);
  });
  document.documentElement.lang = lang === 'en' ? 'en' : 'es';
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = lang === 'en' ? 'EN' : 'ES';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Cambiar a Español' : 'Switch to English');
  }
  if (moodChip) {
    const pool = moodPhrasesByLang[lang] || moodPhrasesByLang.es;
    moodChip.textContent = pool[Math.floor(Math.random() * pool.length)];
  }
  currentLang = lang;
}

applyLanguage(currentLang);

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const next = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('amilcargit-lang', next);
    applyLanguage(next);
    playClickSound();
  });
}

// ===== SONIDO DE SELLO EN LOS CLICS =====
let audioCtx = null;
function playClickSound() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) { /* Web Audio no disponible, seguimos sin sonido */ }
}
document.querySelectorAll(
  '.btn, .to-top, .theme-toggle, .lang-toggle, .menu-btn, .menu-group-btn, .mini-stamp-flip, .audio-toggle, .audio-btn'
).forEach((el) => {
  el.addEventListener('click', () => playClickSound());
});

// ===== MODO LOGROS (según canciones escuchadas) =====
const ACHIEVEMENT_TIERS = [
  { count: 5, es: '🏅 ¡Sello desbloqueado! Escuchaste 5 canciones', en: '🏅 Badge unlocked! You listened to 5 songs' },
  { count: 10, es: '🥈 ¡Sello de plata! 10 canciones escuchadas', en: '🥈 Silver badge! 10 songs listened to' },
  { count: 15, es: '🏆 ¡Visitante VIP! Escuchaste toda la playlist', en: '🏆 VIP visitor! You listened to the whole playlist' },
];
let playedTracks = new Set(JSON.parse(localStorage.getItem('amilcargit-played') || '[]'));
let unlockedTiers = new Set(JSON.parse(localStorage.getItem('amilcargit-achievements') || '[]'));

function showAchievementToast(tier) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.textContent = tier[currentLang] || tier.es;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 500);
  }, 3600);
}

function registerTrackPlayed(index) {
  if (playedTracks.has(index)) return;
  playedTracks.add(index);
  localStorage.setItem('amilcargit-played', JSON.stringify([...playedTracks]));
  ACHIEVEMENT_TIERS.forEach((tier) => {
    if (playedTracks.size >= tier.count && !unlockedTiers.has(tier.count)) {
      unlockedTiers.add(tier.count);
      localStorage.setItem('amilcargit-achievements', JSON.stringify([...unlockedTiers]));
      showAchievementToast(tier);
    }
  });
}

if (bgAudio) {
  bgAudio.addEventListener('play', () => registerTrackPlayed(trackIndex));
}

// ===== FIREBASE: LOGIN + MÚSICA DE LA COMUNIDAD =====
const firebaseConfig = {
  apiKey: "AIzaSyCm8Mcc0pON47JvC7XaMk3gqDc6WYYXoLs",
  authDomain: "mi-proyecto-wep.firebaseapp.com",
  projectId: "mi-proyecto-wep",
  storageBucket: "mi-proyecto-wep.firebasestorage.app",
  messagingSenderId: "378580405119",
  appId: "1:378580405119:web:87689495bfcf304857e84a",
};
const ADMIN_EMAIL = "amilkarurquiagaramos1@gmail.com";

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const authLoggedOut = document.getElementById('authLoggedOut');
  const authLoggedIn = document.getElementById('authLoggedIn');
  const userPhoto = document.getElementById('userPhoto');
  const userName = document.getElementById('userName');
  const signInBtn = document.getElementById('googleSignInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const songForm = document.getElementById('songUploadForm');
  const songLimitNote = document.getElementById('songLimitNote');
  const adminPanel = document.getElementById('adminPanel');
  const comunidadList = document.getElementById('comunidadList');

  let mySongCount = 0;
  let currentUser = null;

  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      auth.signInWithPopup(googleProvider).catch((err) => {
        console.error('Error de login:', err);
      });
    });
  }
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => auth.signOut());
  }

  auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
      authLoggedOut.hidden = true;
      authLoggedIn.hidden = false;
      userPhoto.src = user.photoURL || '';
      userName.textContent = user.displayName || user.email;
      adminPanel.hidden = user.email !== ADMIN_EMAIL;

      db.collection('userMeta').doc(user.uid).get().then((doc) => {
        mySongCount = doc.exists ? (doc.data().count || 0) : 0;
        updateLimitNote();
      });
    } else {
      authLoggedOut.hidden = false;
      authLoggedIn.hidden = true;
      adminPanel.hidden = true;
    }
  });

  function updateLimitNote() {
    if (!songLimitNote) return;
    const left = Math.max(0, 2 - mySongCount);
    songLimitNote.textContent = left > 0
      ? `Te quedan ${left} canción${left === 1 ? '' : 'es'} por subir.`
      : 'Ya subiste tus 2 canciones. ¡Gracias por sumar! 🎶';
    if (songForm) {
      songForm.querySelector('button[type="submit"]').disabled = left <= 0;
    }
  }

  if (songForm) {
    songForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;
      const title = document.getElementById('songTitle').value.trim();
      const url = document.getElementById('songUrl').value.trim();
      if (!title || !url) return;

      const submitBtn = songForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subiendo...';

      try {
        const metaRef = db.collection('userMeta').doc(currentUser.uid);
        const songRef = db.collection('communitySongs').doc();
        await db.runTransaction(async (tx) => {
          const metaDoc = await tx.get(metaRef);
          const count = metaDoc.exists ? (metaDoc.data().count || 0) : 0;
          if (count >= 2) throw new Error('LIMIT_REACHED');
          tx.set(metaRef, { count: count + 1 });
          tx.set(songRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Anónimo',
            title,
            url,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
        mySongCount += 1;
        updateLimitNote();
        songForm.reset();
        playClickSound();
      } catch (err) {
        songLimitNote.textContent = err.message === 'LIMIT_REACHED'
          ? 'Ya subiste el máximo de 2 canciones.'
          : 'No se pudo subir. Probá de nuevo.';
      } finally {
        submitBtn.disabled = mySongCount >= 2;
        submitBtn.textContent = 'Subir canción';
      }
    });
  }

  if (comunidadList) {
    db.collection('communitySongs').orderBy('createdAt', 'desc').limit(50)
      .onSnapshot((snapshot) => {
        comunidadList.innerHTML = '';
        if (snapshot.empty) {
          comunidadList.innerHTML = '<li class="comunidad-empty">Todavía no hay canciones subidas — ¡sé el primero!</li>';
          return;
        }
        snapshot.forEach((doc) => {
          const song = doc.data();
          const li = document.createElement('li');
          li.className = 'comunidad-item';
          const isOwner = currentUser && song.uid === currentUser.uid;
          const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
          li.innerHTML = `
            <div class="comunidad-item-head">
              <span class="comunidad-item-title">${escapeHtml(song.title || 'Sin título')}</span>
              ${(isOwner || isAdmin) ? `<button type="button" class="comunidad-delete" data-id="${doc.id}" data-uid="${song.uid}">✕</button>` : ''}
            </div>
            <span class="comunidad-item-by">Subida por ${escapeHtml(song.name || 'Anónimo')}</span>
            <audio controls src="${escapeAttr(song.url || '')}"></audio>
          `;
          comunidadList.appendChild(li);
        });
        comunidadList.querySelectorAll('.comunidad-delete').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const songId = btn.getAttribute('data-id');
            const ownerUid = btn.getAttribute('data-uid');
            try {
              await db.collection('communitySongs').doc(songId).delete();
              if (currentUser && currentUser.uid === ownerUid) {
                const metaRef = db.collection('userMeta').doc(ownerUid);
                await db.runTransaction(async (tx) => {
                  const metaDoc = await tx.get(metaRef);
                  const count = metaDoc.exists ? (metaDoc.data().count || 0) : 0;
                  tx.set(metaRef, { count: Math.max(0, count - 1) });
                });
                mySongCount = Math.max(0, mySongCount - 1);
                updateLimitNote();
              }
            } catch (err) {
              console.error('No se pudo borrar:', err);
            }
          });
        });
      });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}
