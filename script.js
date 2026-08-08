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
let trackIndex = 0;
let audioUnlocked = false;

function loadTrack(i) {
  if (!bgAudio || !playlist.length) return;
  bgAudio.src = playlist[i].src;
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
  bgAudio.volume = 0.35;
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
  bgAudio.volume = 0;
  bgAudio.muted = true;
  bgAudio.addEventListener('ended', playNextTrack);

  // Intento de autoplay silencioso al cargar la página
  bgAudio.play().catch(() => { /* el navegador lo bloqueó, se activa con el botón */ });

  audioToggle.addEventListener('click', () => {
    if (!audioUnlocked) {
      playCurrentTrack();
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
} else if (audioPlayer) {
  // Sin audios cargados todavía: ocultar el reproductor
  audioPlayer.style.display = 'none';
}
