'use strict';

// ── Footer year ──────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Nav: scroll state ─────────────────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Nav: mobile toggle ────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll reveal ─────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.demo-card, .service-card, .about__content, .about__portrait, .writing__inner, .contact h2, .contact__intro, .contact .btn'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── Demo players (visual-only, no audio files yet) ────────────
const playBtns = document.querySelectorAll('.play-btn');
let activeCard = null;
let activeTimer = null;
let elapsed = 0;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getDuration(track) {
  const durations = { commercial: 30, elearning: 45, explainer: 40 };
  return durations[track] || 30;
}

function resetCard(btn) {
  const card   = btn.closest('.demo-card');
  const player = card.querySelector('.demo-card__player');
  const timeEl = card.querySelector('.player__time');
  const track  = btn.dataset.track;
  const dur    = getDuration(track);

  player.classList.remove('playing');
  btn.querySelector('.icon-play').classList.remove('hidden');
  btn.querySelector('.icon-pause').classList.add('hidden');
  timeEl.textContent = `0:00 / ${formatTime(dur)}`;
}

playBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const card   = btn.closest('.demo-card');
    const player = card.querySelector('.demo-card__player');
    const timeEl = card.querySelector('.player__time');
    const track  = btn.dataset.track;
    const dur    = getDuration(track);
    const isPlaying = player.classList.contains('playing');

    // Stop any currently playing card
    if (activeCard && activeCard !== card) {
      clearInterval(activeTimer);
      resetCard(activeCard.querySelector('.play-btn'));
      elapsed = 0;
    }

    if (isPlaying) {
      // Pause
      clearInterval(activeTimer);
      player.classList.remove('playing');
      btn.querySelector('.icon-play').classList.remove('hidden');
      btn.querySelector('.icon-pause').classList.add('hidden');
      activeCard  = null;
      activeTimer = null;
    } else {
      // Play (simulated)
      player.classList.add('playing');
      btn.querySelector('.icon-play').classList.add('hidden');
      btn.querySelector('.icon-pause').classList.remove('hidden');
      activeCard = card;

      if (!elapsed || activeCard !== card) elapsed = 0;

      activeTimer = setInterval(() => {
        elapsed++;
        timeEl.textContent = `${formatTime(elapsed)} / ${formatTime(dur)}`;

        if (elapsed >= dur) {
          clearInterval(activeTimer);
          resetCard(btn);
          elapsed     = 0;
          activeCard  = null;
          activeTimer = null;
        }
      }, 1000);
    }
  });
});
