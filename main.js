/* ══════════════════════════════════════════════════
   HARSHA // PORTFOLIO — main.js
   ASCII Rain • Typewriter • Reveal • Nav • Form
   ══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   ASCII RAIN
   ───────────────────────────────────────── */
(function initAsciiRain() {
  const canvas = document.getElementById('ascii-rain');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ASCII character palette — keeps it strictly printable ASCII, no katakana
  const CHARS = '01234567890abcdefghijklmnopqrstuvwxyz/\\|_-+*#.:;,!?<>{}[]()=~@$%&^';

  const FONT_SIZE  = 13;
  const SPEED      = 0.45;  // columns per tick (lower = slower rain)
  const OPACITY_BG = 0.055; // trail fade (lower = longer tails)
  const CHAR_ALPHA = 0.038; // character brightness (very subtle)

  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -(canvas.height / FONT_SIZE));
  }

  function tick() {
    // Semi-transparent black fade → creates trail effect
    ctx.fillStyle = `rgba(0, 0, 0, ${OPACITY_BG})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(255, 255, 255, ${CHAR_ALPHA})`;
    ctx.font = `${FONT_SIZE}px "IBM Plex Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(ch, i * FONT_SIZE, drops[i] * FONT_SIZE);

      // Reset column when it reaches the bottom (with randomness)
      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.978) {
        drops[i] = 0;
      }
      drops[i] += SPEED;
    }
  }

  resize();
  setInterval(tick, 55);
  window.addEventListener('resize', resize);
})();


/* ─────────────────────────────────────────
   TYPEWRITER EFFECT
   ───────────────────────────────────────── */
function typeWriter(el, text, speed, onDone) {
  let i = 0;
  el.textContent = '';

  function step() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(step, speed + Math.random() * 20); // slight jitter feels human
    } else if (typeof onDone === 'function') {
      onDone();
    }
  }
  step();
}


/* ─────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
   ───────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );

  document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────
   MOBILE NAV TOGGLE
   ───────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const panel  = document.getElementById('mobilePanel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.textContent = isOpen ? '[×]' : '[≡]';
    toggle.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      panel.classList.remove('open');
      toggle.textContent = '[≡]';
    });
  });
})();


/* ─────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
   ───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = '';
          });
          const active = document.querySelector(`.nav-desktop a[href="#${entry.target.id}"]`);
          if (active) active.style.color = 'var(--accent)';
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* ─────────────────────────────────────────
   HIRE FORM (Formspree / async)
   ───────────────────────────────────────── */
(function initHireForm() {
  const form   = document.getElementById('hireForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '[ SENDING... ]';

    const endpoint = form.getAttribute('action');

    // Guard: if the user hasn't replaced the placeholder, bail gracefully
    if (endpoint.includes('YOUR_FORMSPREE_ID')) {
      status.textContent = '[ ! REPLACE YOUR_FORMSPREE_ID IN index.html OR REMOVE THIS GUARD ]';
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        status.textContent = "[ ✓ MESSAGE SENT — I'LL REACH OUT ]";
        form.reset();
      } else {
        status.textContent = '[ ! FAILED — EMAIL: harshavguntreddi@gmail.com ]';
      }
    } catch (_) {
      status.textContent = '[ ! NETWORK ERROR — EMAIL: harshavguntreddi@gmail.com ]';
    }
  });
})();


/* ─────────────────────────────────────────
   HERO TYPEWRITER — fires on load
   ───────────────────────────────────────── */
window.addEventListener('load', () => {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  // Small delay so the page settles first
  setTimeout(() => {
    typeWriter(el, 'I build systems that survive reality.', 38);
  }, 700);
});


/* ─────────────────────────────────────────
   TERMINAL SEQUENCE ANIMATION (hero lines)
   Each command/output line fades in sequentially.
   ───────────────────────────────────────── */
(function initTerminalLines() {
  const lines = document.querySelectorAll('.terminal-body .t-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      line.style.opacity = '1';
    }, 200 + i * 120);
  });
})();


/* ─────────────────────────────────────────
   SMOOTH SCROLL OFFSET (fixed header)
   ───────────────────────────────────────── */
(function initSmoothScroll() {
  const HEADER_H = 54;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
