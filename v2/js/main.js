/* ─────────────────────────────────────────────────────────────
   OriginTag V2 — main.js
   ───────────────────────────────────────────────────────────── */

const intro       = document.getElementById('intro');
const nav         = document.getElementById('nav');
const hero        = document.getElementById('hero');
const heroContent = document.getElementById('hero-content');
const lines       = document.querySelectorAll('.intro-line');

/* ─── INTRO ──────────────────────────────────────────────────
   Line 1: 0.6s → 2.4s
   Line 2: 3.0s → 4.8s
   Line 3: 5.4s → 7.2s
   Hero reveal: 7.8s  |  Intro removed: 9.0s
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

/* ─── ESCALATION — Change 3 fix ─────────────────────────────
   Five lines revealed via setTimeout chain adding .visible.
   Delays: 0, 700, 1600, 2800, 3500ms.
   Line 3 ("It will outlast all of them.") lands at 1600ms —
   the longest gap, for weight.
   ─────────────────────────────────────────────────────────── */
const escSection = document.getElementById('escalation');
const escLines   = document.querySelectorAll('.esc-line');

if (escSection) {
  let escFired = false;
  const escObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !escFired) {
        escFired = true;
        escLines.forEach(line => {
          const delay = parseInt(line.dataset.delay || 0);
          setTimeout(() => line.classList.add('visible'), delay);
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

/* ─── CAROUSEL DOTS + CAPTION REVEAL (Change 9) ─────────────
   Detail carousel: captions fade in 300ms after slide enters.
   On leaving, caption resets so it can re-reveal on swipe back.
   ─────────────────────────────────────────────────────────── */
function initCarouselDots(carouselId, dotsId, revealCaptions) {
  const carousel = document.getElementById(carouselId);
  const dotsEl   = document.getElementById(dotsId);
  if (!carousel || !dotsEl) return;

  const dots   = Array.from(dotsEl.querySelectorAll('.dot'));
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  if (!dots.length || !slides.length) return;

  const slideObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const idx = slides.indexOf(e.target);
      if (idx === -1) return;

      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');

        if (revealCaptions) {
          const caption = e.target.querySelector('.slide-caption');
          if (caption) {
            setTimeout(() => caption.classList.add('visible'), 300);
          }
        }
      } else {
        if (revealCaptions) {
          const caption = e.target.querySelector('.slide-caption');
          if (caption) caption.classList.remove('visible');
        }
      }
    });
  }, { root: carousel, threshold: 0.5 });

  slides.forEach(s => slideObserver.observe(s));
}

initCarouselDots('detail-carousel', 'detail-dots', true);   /* captions ON */
initCarouselDots('making-carousel', 'making-dots', false);  /* captions OFF */

/* ─── PRICE — day-by-day build (Change 7) ───────────────────
   Day 1 (₹850) → Day 21 (₹17,850) at 80ms per day.
   After final day, calc line ("21 days × ₹850") fades in.
   ─────────────────────────────────────────────────────────── */
const closePriceEl = document.querySelector('.close-price');
const closeCalcEl  = document.querySelector('.close-calc');
let priceAnimated  = false;

if (closePriceEl) {
  const priceObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !priceAnimated) {
        priceAnimated = true;
        priceObserver.unobserve(e.target);

        const dayRate   = 850;
        const totalDays = 21;
        const msPerDay  = 80;

        /* make the price element visible immediately */
        closePriceEl.style.opacity = '1';
        closePriceEl.textContent   = '₹850';

        /* fire each day */
        for (let day = 1; day <= totalDays; day++) {
          ((d) => {
            setTimeout(() => {
              closePriceEl.textContent = '₹' + (d * dayRate).toLocaleString('en-IN');
            }, d * msPerDay);
          })(day);
        }

        /* after last day, fade in the calc line */
        const doneAt = totalDays * msPerDay + 400;
        setTimeout(() => {
          if (closeCalcEl) closeCalcEl.style.opacity = '1';
        }, doneAt);
      }
    });
  }, { threshold: 0.5 });

  priceObserver.observe(closePriceEl);
}

/* ─── LINEAGE CHAIN — staggered reveal (Change 8) ───────────
   I → II → III → IV, 300ms apart via setTimeout chain.
   Fires once when the lineage section enters view.
   ─────────────────────────────────────────────────────────── */
const lineageSection = document.getElementById('lineage');
const chainItems     = document.querySelectorAll('.chain-item');

if (lineageSection && chainItems.length) {
  let lineageFired = false;
  const lineageObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !lineageFired) {
        lineageFired = true;
        chainItems.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 300);
        });
        lineageObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  lineageObserver.observe(lineageSection);
}
