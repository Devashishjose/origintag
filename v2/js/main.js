/* ─────────────────────────────────────────────────────────────
   OriginTag V2 — main.js
   ───────────────────────────────────────────────────────────── */

const intro   = document.getElementById('intro');
const nav     = document.getElementById('nav');
const hero    = document.getElementById('hero');
const heroContent = document.getElementById('hero-content');
const lines   = document.querySelectorAll('.intro-line');

/* ─── INTRO ANIMATION ────────────────────────────────────────
   Each line fades in, holds, fades out before the next.
   Line 1: 0.6s – 2.4s
   Line 2: 3.0s – 4.8s
   Line 3: 5.4s – 7.2s
   Hero reveal: 7.8s
   Hero content: 9.6s
   Intro removed: 9.0s
   ─────────────────────────────────────────────────────────── */
function showLine(index, showAt, hideAt) {
  setTimeout(() => lines[index].classList.add('visible'),    showAt);
  setTimeout(() => lines[index].classList.remove('visible'), hideAt);
}

showLine(0,  600,  2400);
showLine(1, 3000,  4800);
showLine(2, 5400,  7200);

setTimeout(() => {
  hero.classList.add('open');
  nav.classList.add('show');
}, 7800);

setTimeout(() => {
  if (intro && intro.parentNode) intro.remove();
}, 9000);

setTimeout(() => {
  if (heroContent) heroContent.classList.add('show');
}, 9600);

/* ─── SKIP INTRO ────────────────────────────────────────────── */
let introDone = false;

function skipIntro() {
  if (introDone) return;
  introDone = true;
  lines.forEach(l => { l.style.transition = 'none'; l.style.opacity = '0'; });
  setTimeout(() => {
    hero.classList.add('open');
    nav.classList.add('show');
  }, 200);
  setTimeout(() => {
    if (intro && intro.parentNode) intro.remove();
    if (heroContent) heroContent.classList.add('show');
  }, 1000);
}

if (intro) {
  intro.addEventListener('click', skipIntro);
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') && intro.parentNode) skipIntro();
  }, { once: true });
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      scrollObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.r').forEach(el => scrollObserver.observe(el));

/* ─── ESCALATION — staggered line reveal ────────────────────── */
const escSection = document.getElementById('escalation');
const escLines   = document.querySelectorAll('.esc-line');

if (escSection) {
  const escObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        escLines.forEach(line => {
          const delay = parseInt(line.dataset.delay || 0);
          setTimeout(() => line.classList.add('on'), delay);
        });
        escObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  escObserver.observe(escSection);
}

/* ─── NAV SCROLL STATE ──────────────────────────────────────── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 56);
}, { passive: true });

/* ─── CAROUSEL DOTS ─────────────────────────────────────────── */
function initCarouselDots(carouselId, dotsId) {
  const carousel = document.getElementById(carouselId);
  const dotsEl   = document.getElementById(dotsId);
  if (!carousel || !dotsEl) return;

  const dots   = Array.from(dotsEl.querySelectorAll('.dot'));
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  if (!dots.length || !slides.length) return;

  const slideObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        const idx = slides.indexOf(e.target);
        if (idx === -1) return;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, { root: carousel, threshold: 0.5 });

  slides.forEach(s => slideObserver.observe(s));
}

initCarouselDots('detail-carousel', 'detail-dots');
initCarouselDots('making-carousel', 'making-dots');
