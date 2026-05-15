/**
 * David Ugbor portfolio — behavior only.
 * Styling lives in css/style.css
 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* Hero carousel */
  const slides = $$('.hero-slide');
  const dots = $$('.hero-dots .dot');
  let current = 0;
  let timer;

  function goTo(i) {
    if (!slides.length) return;
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  function next() {
    goTo(current + 1);
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(next, 6000);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.i, 10) || 0);
      startTimer();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  if (slides.length) startTimer();

  /* Footer year */
  const yearEl = $('#yearVal');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Stat count-up */
  const stats = $$('.stat-num');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (target === 0) {
      el.textContent = '0';
      return;
    }
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = String(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            so.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach((s) => so.observe(s));
  } else {
    stats.forEach(animateCount);
  }

  /* Active nav from scroll */
  const sections = $$('section[id]');
  const navLinks = $$('.main-nav a');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* In-page anchors */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Scroll reveal — CSS: .js-reveal / .js-reveal.is-visible */
  const reveals = $$('.pillar, .cred, .vessel, .water-card, .stat-card');
  reveals.forEach((el) => el.classList.add('js-reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const parent = e.target.parentElement;
          const sibs = parent ? Array.from(parent.children).indexOf(e.target) : 0;
          setTimeout(() => {
            e.target.classList.add('is-visible');
          }, sibs * 90);
          revealObserver.unobserve(e.target);
        });
      },
      { threshold: 0.18 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Certificate lightbox */
  const lightbox = document.getElementById('certLightbox');
  const lbImg    = document.getElementById('certLbImg');
  const lbClose  = document.getElementById('certLbClose');
  const lbBack   = document.getElementById('certLbBackdrop');

  function openLightbox(src, label) {
    lbImg.src = src;
    lbImg.alt = label || 'Certificate';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  if (lightbox) {
    $$('.cred[data-cert]').forEach((card) => {
      card.addEventListener('click', () =>
        openLightbox(card.dataset.cert, card.querySelector('h3')?.textContent)
      );
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card.dataset.cert, card.querySelector('h3')?.textContent);
        }
      });
    });
    lbClose.addEventListener('click', closeLightbox);
    lbBack.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  console.log(
    '%c DAVID UGBOR %c FIRE WATCH OFFICER · #zeroharm ',
    'background:#d94a1a;color:#fff;font-weight:700;padding:6px 10px;font-family:monospace;',
    'background:#1a1a1a;color:#d94a1a;padding:6px 10px;border:1px solid #d94a1a;font-family:monospace;'
  );
})();
