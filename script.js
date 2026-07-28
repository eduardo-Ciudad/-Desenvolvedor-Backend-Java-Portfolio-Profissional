/* ============================================================
   CUSTOM CURSOR
============================================================ */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function followCursor() {
  fx += (mouseX - fx) * 0.12;
  fy += (mouseY - fy) * 0.12;
  cursorFollower.style.left = fx + 'px';
  cursorFollower.style.top  = fy + 'px';
  requestAnimationFrame(followCursor);
})();

document.querySelectorAll('a, button, [data-tilt], .badge-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    cursorFollower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    cursorFollower.classList.remove('hovered');
  });
});

/* ============================================================
   PARTICLES
============================================================ */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }

  reset(randomY = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = randomY ? Math.random() * canvas.height : canvas.height + 5;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.28;
    this.vy = (Math.random() - 0.5) * 0.28;
    this.a  = Math.random() * 0.35 + 0.08;
    this.c  = Math.random() > 0.55 ? '124,58,237' : '139,92,246';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -5 || this.x > canvas.width + 5 || this.y < -5 || this.y > canvas.height + 5) {
      this.reset();
    }
  }

  draw() {
    ctx.globalAlpha = this.a;
    ctx.fillStyle   = `rgb(${this.c})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 95) {
        ctx.globalAlpha = (1 - d / 95) * 0.09;
        ctx.strokeStyle = 'rgba(124,58,237,1)';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   NAVBAR
============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const ids      = ['home', 'about', 'projects', 'skills', 'contact'];
  const scrollY  = window.scrollY + 180;
  ids.forEach(id => {
    const section = document.getElementById(id);
    const link    = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!section || !link) return;
    const inView  = section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY;
    link.classList.toggle('active', inView);
  });
}

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   TYPING EFFECT
============================================================ */
const typedEl  = document.getElementById('typedText');
const phrases  = [
  'Desenvolvedor Backend Java',
  'Spring Boot & PostgreSQL',
  'Construindo APIs Escaláveis',
  'Deploy em VPS própria',
  'Disponível para Freelance',
  'Primeiro freelance entregue ✓',
];

let pIdx   = 0;
let cIdx   = 0;
let del    = false;
let speed  = 80;

function type() {
  const phrase = phrases[pIdx];
  if (del) {
    typedEl.textContent = phrase.slice(0, cIdx - 1);
    cIdx--;
  } else {
    typedEl.textContent = phrase.slice(0, cIdx + 1);
    cIdx++;
  }

  if (!del && cIdx === phrase.length) {
    del = true; speed = 2200;          // pause at end
  } else if (del && cIdx === 0) {
    del  = false;
    pIdx = (pIdx + 1) % phrases.length;
    speed = 120;
  } else {
    speed = del ? 38 : 75;
  }

  setTimeout(type, speed);
}
type();

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.revealDelay || 0);
    setTimeout(() => entry.target.classList.add('revealed'), delay);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger siblings within the same parent
  const siblings = [...el.parentElement.querySelectorAll('.reveal')];
  el.dataset.revealDelay = siblings.indexOf(el) * 90;
  revealObserver.observe(el);
});

/* ============================================================
   SKILL BAR ANIMATION
============================================================ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 200 + i * 120);
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll('.skill-category').forEach(c => skillObserver.observe(c));

/* ============================================================
   CARD TILT EFFECT
============================================================ */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (card.classList.contains('expanded')) return;
    const rect = card.getBoundingClientRect();
    const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
    const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) *  8;
    card.style.transition = 'transform .1s ease';
    card.style.transform  = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('expanded')) return;
    card.style.transition = 'transform .55s ease';
    card.style.transform  = 'translateY(0) perspective(900px) rotateX(0) rotateY(0)';
  });
});

/* ============================================================
   COUNTER ANIMATION (hero stats)
============================================================ */
function animateCount(el, to, suffix, duration = 1400) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(p * to) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl = entry.target.querySelector('.stat-number[data-count]');
    if (numEl) animateCount(numEl, parseInt(numEl.dataset.count), '+');
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat').forEach(s => statsObserver.observe(s));

/* ============================================================
   PROJECT ZOOM OVERLAY
============================================================ */
(function() {
  const backdrop = document.createElement('div');
  backdrop.className = 'card-backdrop';
  document.body.appendChild(backdrop);

  let activeCard = null;
  let savedScroll = 0;

  function openCard(card) {
    if (activeCard) closeCard(activeCard, true);

    savedScroll = window.scrollY;

    /* FLIP step 1: record natural viewport position */
    const rect = card.getBoundingClientRect();

    /* FLIP step 2: pin card to that same spot in fixed coords, no transition */
    card.style.cssText =
      'position:fixed!important;' +
      'top:' + rect.top + 'px!important;' +
      'left:' + rect.left + 'px!important;' +
      'width:' + rect.width + 'px!important;' +
      'transform:none!important;' +
      'transition:none!important;' +
      'z-index:1000;margin:0;';

    /* Force paint so browser commits the starting frame */
    card.getBoundingClientRect();

    /* FLIP step 3: clear inline overrides → class rules drive animation to center */
    requestAnimationFrame(function() {
      card.style.cssText = '';
      card.classList.add('expanded');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      activeCard = card;
    });
  }

  function closeCard(card, instant) {
    card.classList.remove('expanded');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    activeCard = null;
  }



  /* Add close button to every card */
  document.querySelectorAll('.project-card').forEach(function(card) {
    const btn = document.createElement('button');
    btn.className = 'card-exp-close';
    btn.setAttribute('aria-label', 'Fechar');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    card.appendChild(btn);

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeCard(card);
    });

    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      if (e.target.closest('.card-exp-close')) return;
      if (card.classList.contains('expanded')) return;
      openCard(card);
    });
  });

  /* Close on backdrop click */
  backdrop.addEventListener('click', function() {
    if (activeCard) closeCard(activeCard);
  });

  /* Close on ESC */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeCard) closeCard(activeCard);
  });
})();

/* ============================================================
   CODE CARD — line-by-line reveal
============================================================ */
(function revealCodeLines() {
  const codeEl = document.querySelector('.code-body code');
  if (!codeEl) return;

  const original = codeEl.innerHTML;
  codeEl.style.opacity = '0';

  const heroSection = document.querySelector('.hero');
  const codeObs     = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    codeEl.style.opacity    = '1';
    codeEl.style.transition = 'opacity .4s ease';
    codeObs.disconnect();
  }, { threshold: 0.5 });
  codeObs.observe(heroSection);
})();
