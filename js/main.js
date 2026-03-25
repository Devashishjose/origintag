// INTRO
const intro = document.getElementById('intro');
const nav   = document.getElementById('nav');
const hero  = document.getElementById('hero');

setTimeout(() => intro.classList.add('show'), 500);
setTimeout(() => {
  intro.classList.add('out');
  nav.classList.add('show');
  hero.classList.add('open');
}, 3500);
setTimeout(() => intro.remove(), 4500);

// SCROLL REVEAL
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.r').forEach(el => ro.observe(el));

// PARALLAX
const pEls = document.querySelectorAll('[data-parallax]');
function doParallax() {
  pEls.forEach(el => {
    const f    = parseFloat(el.dataset.parallax);
    const rect = el.parentElement.getBoundingClientRect();
    const off  = (window.innerHeight / 2 - rect.top - rect.height / 2) * f;
    el.style.transform = `translateY(${off}px)`;
  });
}
window.addEventListener('scroll', doParallax, { passive: true });
doParallax();

// NAV SCROLL
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });