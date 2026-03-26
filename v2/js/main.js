/* ─────────────────────────────────────────────────────────────
   OriginTag V2 — main.js
   ───────────────────────────────────────────────────────────── */

const intro       = document.getElementById('intro');
const nav         = document.getElementById('nav');
const hero        = document.getElementById('hero');
const heroContent = document.getElementById('hero-content');
const lines       = document.querySelectorAll('.intro-line');

/* ─── INTRO — no skip, plays in full every time ──────────────
   Line 1: 0.6s → 2.4s
   Line 2: 3.0s → 4.8s
   Line 3: 5.4s → 7.2s
   Hero reveal: 7.8s   |   Intro removed: 9.0s
   Hero content: 9.6s
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

/* ─── ESCALATION — five lines, staggered 0.4s apart ─────────
   Line 3 ("It will outlast all of them.") arrives with a
   slightly longer pause (900ms) for weight.
   ─────────────────────────────────────────────────────────── */
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
  }, { threshold: 0.15 });
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

/* ─── PRICE COUNT-UP ────────────────────────────────────────
   Fires once when ₹17,850 scrolls into view.
   Counts from 0 over 1.5s with an ease-out curve —
   deliberate and slow, not gimmicky.
   ─────────────────────────────────────────────────────────── */
const closePriceEl = document.querySelector('.close-price');
let priceAnimated  = false;

if (closePriceEl) {
  const priceObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !priceAnimated) {
        priceAnimated = true;
        priceObserver.unobserve(e.target);

        const target   = 17850;
        const duration = 1500;
        const start    = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          /* ease-out quad — quick start, slows as it lands */
          const eased    = 1 - Math.pow(1 - progress, 2);
          const current  = Math.round(eased * target);

          /* Indian number formatting: ₹17,850 */
          closePriceEl.textContent = '₹' + current.toLocaleString('en-IN');

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            closePriceEl.textContent = '₹17,850';
          }
        }

        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.5 });

  priceObserver.observe(closePriceEl);
}
