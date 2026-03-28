/* ─────────────────────────────────────────────────────────────
   OriginTag V3 — main.js
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

/* ─── ESCALATION ─────────────────────────────────────────────
   Five lines revealed via setTimeout chain adding .visible.
   Fires once when escalation section enters view.
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

/* ─── CAROUSEL DOTS + CAPTION REVEAL ────────────────────────
   Detail + tools carousels: captions fade in 300ms after slide enters.
   On leaving, caption resets so it can re-reveal on swipe back.
   Making carousel: no captions.
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
initCarouselDots('tools-carousel',  'tools-dots',  true);   /* captions ON  */

/* ─── PIECE ID CARD — typewriter + verified pulse ───────────
   Replays every time the card enters the viewport.
   2.5s cooldown prevents glitching on quick scroll up/down.
   ─────────────────────────────────────────────────────────── */
const pieceIdCard   = document.querySelector('.piece-id-card');
const pieceIdNumber = document.querySelector('.piece-id-number');
const pieceIdBadge  = document.querySelector('.piece-id-badge');
const pieceIdNote   = document.querySelector('.piece-id-note');

if (pieceIdCard && pieceIdNumber) {
  const fullText     = 'PAC — 2024 — 007';
  let cardLastRun    = 0;
  const cardCooldown = 2500;

  /* hide until typewriter fires */
  pieceIdNumber.textContent = '';
  if (pieceIdBadge) pieceIdBadge.style.opacity = '0';
  if (pieceIdNote)  pieceIdNote.style.opacity  = '0';

  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const now = Date.now();
      if (e.isIntersecting && now - cardLastRun > cardCooldown) {
        cardLastRun = now;

        /* reset before each run */
        pieceIdNumber.textContent = '';
        if (pieceIdBadge) {
          pieceIdBadge.style.transition = 'none';
          pieceIdBadge.style.opacity    = '0';
          pieceIdBadge.classList.remove('pulse');
        }
        if (pieceIdNote) {
          pieceIdNote.style.transition = 'none';
          pieceIdNote.style.opacity    = '0';
        }

        /* wait for card fade-in, then type */
        setTimeout(() => {
          let i = 0;
          const type = setInterval(() => {
            pieceIdNumber.textContent = fullText.slice(0, i + 1);
            i++;
            if (i >= fullText.length) {
              clearInterval(type);
              setTimeout(() => {
                if (pieceIdBadge) {
                  pieceIdBadge.style.transition = 'opacity 0.4s ease';
                  pieceIdBadge.style.opacity    = '1';
                  setTimeout(() => pieceIdBadge.classList.add('pulse'), 80);
                }
                setTimeout(() => {
                  if (pieceIdNote) {
                    pieceIdNote.style.transition = 'opacity 0.6s ease';
                    pieceIdNote.style.opacity    = '1';
                  }
                }, 400);
              }, 150);
            }
          }, 65);
        }, 400);
      }
    });
  }, { threshold: 0.6 });

  cardObserver.observe(pieceIdCard);
}

/* ─── PRICE — day-by-day build ──────────────────────────────
   Day 1 (₹850) → Day 28 (₹23,800) at 60ms per day (~1.68s).
   Replays every time the price enters the viewport.
   2.5s cooldown prevents glitching on quick scroll up/down.
   ─────────────────────────────────────────────────────────── */
const closePriceEl  = document.querySelector('.close-price');
const closeCalcEl   = document.querySelector('.close-calc');
let   priceLastRun  = 0;
const priceCooldown = 5000;

if (closePriceEl) {
  const priceObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const now = Date.now();
      if (e.isIntersecting && now - priceLastRun > priceCooldown) {
        priceLastRun = now;

        const dayRate   = 850;
        const totalDays = 28;
        const msPerDay  = 60;

        /* reset before each run */
        closePriceEl.textContent   = '';
        closePriceEl.style.opacity = '1';
        if (closeCalcEl) closeCalcEl.style.opacity = '0';

        /* count up day by day */
        for (let day = 1; day <= totalDays; day++) {
          ((d) => {
            setTimeout(() => {
              closePriceEl.textContent = '₹' + (d * dayRate).toLocaleString('en-IN');
            }, d * msPerDay);
          })(day);
        }

        /* after last day, fade in the calc line */
        setTimeout(() => {
          if (closeCalcEl) closeCalcEl.style.opacity = '1';
        }, totalDays * msPerDay + 400);
      }
    });
  }, { threshold: 0.5 });

  priceObserver.observe(closePriceEl);
}

/* ─── LINEAGE CHAIN — staggered reveal ──────────────────────
   I → II → III → IV → V, 300ms apart via setTimeout chain.
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
