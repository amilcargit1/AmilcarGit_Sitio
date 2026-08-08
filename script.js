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
