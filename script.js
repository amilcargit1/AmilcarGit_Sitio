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
];

const bgAudio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = audioToggle ? audioToggle.querySelector('.audio-icon') : null;
let trackIndex = 0;
let audioUnlocked = false;

function loadTrack(i) {
  if (!bgAudio || !playlist.length) return;
  bgAudio.src = playlist[i].src;
}

function playNextTrack() {
  if (!playlist.length) return;
  trackIndex = (trackIndex + 1) % playlist.length;
  loadTrack(trackIndex);
  bgAudio.play().catch(() => {});
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
      bgAudio.muted = false;
      bgAudio.volume = 0.35;
      bgAudio.play().catch(() => {});
      audioUnlocked = true;
      audioToggle.classList.add('is-playing');
      audioToggle.setAttribute('aria-pressed', 'true');
      audioToggle.setAttribute('aria-label', 'Silenciar audio');
      audioIcon.textContent = '🔊';
    } else if (bgAudio.paused) {
      bgAudio.play().catch(() => {});
      audioToggle.classList.add('is-playing');
      audioToggle.setAttribute('aria-label', 'Silenciar audio');
      audioIcon.textContent = '🔊';
    } else {
      bgAudio.pause();
      audioToggle.classList.remove('is-playing');
      audioToggle.setAttribute('aria-label', 'Reproducir audio');
      audioIcon.textContent = '🔇';
    }
  });
} else if (audioToggle) {
  // Sin audios cargados todavía: ocultar el botón
  audioToggle.style.display = 'none';
}
