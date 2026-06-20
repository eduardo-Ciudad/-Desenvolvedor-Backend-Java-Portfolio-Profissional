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
  'Spring Boot Enthusiast',
  'Construindo APIs Escaláveis',
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
    const rect = card.getBoundingClientRect();
    const rx   = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
    const ry   = ((e.clientX - rect.left) / rect.width  - 0.5) *  8;
    card.style.transition = 'transform .1s ease';
    card.style.transform  = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
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
   PROJECT MODAL
============================================================ */
const projectData = {
  'Controle Financeiro': {
    badge: 'Freelance',
    badgeClass: 'freelance',
    image: 'img/Captura de tela 2026-06-20 200942.png',
    about: 'Sistema de gestão financeira desenvolvido sob demanda para uma fornecedora de tecidos real. O cliente precisava controlar contas a receber e a pagar de clientes e fornecedores, gerenciar estoque de produtos, e ter uma visão clara do financeiro do negócio no dia a dia.',
    how: 'O sistema funciona com um modelo de conta-corrente — cada venda ou pagamento gera um lançamento. O saldo nunca é armazenado diretamente: ele é calculado em tempo real via SUM sobre todos os lançamentos, eliminando qualquer possibilidade de inconsistência. O dashboard mostra resumo diário e mensal, gráfico de vendas por mês e listagem de clientes devedores. O catálogo de produtos calcula automaticamente o preço de venda baseado na margem de lucro configurada.',
    tech: 'Arquitetura append-only — lançamentos nunca são editados ou deletados, apenas estornados (novo lançamento inverso). Isso garante rastreabilidade completa. Organização package-by-feature com cada domínio isolado. Autenticação JWT, rate limiting com Bucket4j, migrations versionadas com Flyway, e Docker multi-stage build para deploy.',
    experience: 'Foi meu primeiro projeto freelance — do levantamento de requisitos com o cliente até a apresentação final e deploy em produção. Aprendi muito sobre traduzir necessidades reais do negócio em decisões técnicas, e sobre a responsabilidade de manter um sistema que alguém depende no dia a dia.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'JWT', 'PostgreSQL', 'Flyway', 'Bucket4j', 'Docker', 'Swagger', 'HTML/CSS/JS'],
    links: [
      { label: 'Ver Projeto', url: 'https://cadin-financeiro.vercel.app', primary: true },
      { label: 'GitHub', url: 'https://github.com/eduardo-Ciudad/cadin-finaceiro-', primary: false }
    ]
  },
  'StudyMind': {
    badge: 'Fullstack',
    badgeClass: 'in-dev',
    image: 'img/studymind.png',
    about: 'Plataforma de estudos inteligente que usa IA para gerar planos de estudo personalizados. O sistema conduz um onboarding conversacional com o aluno, entende suas matérias e objetivos, e gera automaticamente um cronograma com tópicos e tarefas.',
    how: 'O usuário faz um onboarding por chat onde a IA faz perguntas sobre o que precisa estudar. Com base nas respostas, o sistema gera um plano de estudo completo em JSON, que é parseado automaticamente em matérias, tópicos e tarefas no banco. O aluno registra sessões de estudo, e o sistema analisa desempenho e gera recomendações adaptativas.',
    tech: 'Integração com Claude Haiku da Anthropic via API. Onboarding conversacional com histórico persistido. PlanoEstudoParser que converte JSON da IA em entidades do banco. Refresh token JWT com validade de 7 dias. Email assíncrono via @Async + Gmail SMTP. Rate limiting diferenciado: 10 req/min para endpoints auth, 5 req/min para endpoints de IA. 58 testes automatizados com JUnit 5, Mockito e MockMvc.',
    experience: 'Meu projeto mais complexo tecnicamente. Foi onde aprendi a integrar APIs externas, lidar com parsing de respostas de IA, e construir um fluxo de onboarding completo. O desafio principal foi transformar texto livre da IA em dados estruturados no banco de forma confiável.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'JWT', 'PostgreSQL', 'Flyway', 'Anthropic API', 'Docker', 'JUnit 5', 'Mockito', 'HTML/CSS/JS'],
    links: [
      { label: 'Ver Frontend', url: 'https://studymind-mu.vercel.app/', primary: true },
      { label: 'GitHub', url: 'https://github.com/eduardo-Ciudad/StudyMind', primary: false }
    ]
  },
  'MiniModa — E-commerce Backend': {
    badge: 'Backend',
    badgeClass: '',
    image: 'img/ecommerce.png',
    about: 'Backend completo para um e-commerce de roupas infantis. O sistema cobre todo o fluxo de compra: catálogo de produtos, carrinho persistente, autenticação com dois níveis de acesso (ADMIN e CLIENT), e fluxo de pedidos com controle de estados.',
    how: 'O cliente navega pelo catálogo, adiciona produtos ao carrinho (que persiste entre sessões), e faz o checkout que gera um pedido. O pedido segue uma máquina de estados (PENDING → CONFIRMED → SHIPPED → DELIVERED) implementada via enum com transições permitidas embutidas. O admin gerencia produtos, categorias e visualiza todos os pedidos.',
    tech: 'Auditoria de segurança completa: correção de IDOR no CartService com validação de ownership (findByIdAndCartUserId, padrão 404-over-403), JWT refresh token com claim de tipo para impedir uso de refresh como access. Rate limiting com cache Caffeine. GlobalExceptionHandler tratando DataIntegrityViolation e HttpMessageNotReadable. Integração de pagamento desenhada com Ports & Adapters (PaymentGateway interface + MockPaymentGateway).',
    experience: 'Foi o projeto onde mais aprendi sobre segurança. Fazer a auditoria de IDOR, entender por que retornar 404 em vez de 403, implementar refresh token corretamente — tudo isso mudou minha forma de pensar sobre autenticação e autorização.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'JWT', 'PostgreSQL', 'Flyway', 'Swagger', 'Docker Compose'],
    links: [
      { label: 'GitHub', url: 'https://github.com/eduardo-Ciudad/MiniModa', primary: true }
    ]
  },
  'Sistema de Biblioteca': {
    badge: 'Fullstack',
    badgeClass: 'in-dev',
    image: 'img/1776379087557.jpg',
    about: 'API REST completa para gerenciamento de biblioteca — foi meu primeiro projeto fullstack com deploy real. O sistema gerencia livros, usuários e empréstimos com controle de acesso por role (ADMIN e USER).',
    how: 'O administrador cadastra livros e gerencia usuários. Usuários podem consultar o catálogo e solicitar empréstimos. O sistema controla devoluções e mantém histórico. Frontend com estética de biblioteca escura, totalmente responsivo, com UI adaptada por role do usuário logado.',
    tech: 'Começou com JDBC manual e DAO pattern, depois migrei para Spring Data JPA. Autenticação JWT com Spring Security, role-based access control, Bean Validation, Swagger/OpenAPI. Migração de MySQL para PostgreSQL. Deploy no Render com frontend no GitHub Pages.',
    experience: 'O projeto que me ensinou os fundamentos. Foi onde entendi na prática a diferença entre JDBC manual e JPA, por que usar DTOs, como funciona o ciclo de vida de uma requisição no Spring. Cada erro que eu resolvia aqui me preparou para os projetos seguintes.',
    tags: ['Java 17', 'Spring Boot 3', 'Spring Security', 'JWT', 'PostgreSQL', 'Flyway', 'Swagger', 'Docker', 'HTML/CSS/JS'],
    links: [
      { label: 'Ver Projeto', url: 'https://eduardo-ciudad.github.io/frontend-biblioteca-api/login.html', primary: true },
      { label: 'GitHub', url: 'https://github.com/eduardo-Ciudad/biblioteca-api', primary: false }
    ]
  }
};

const modal        = document.getElementById('projectModal');
const modalClose   = document.getElementById('modalClose');

function openModal(projectName) {
  const data = projectData[projectName];
  if (!data) return;

  const badgeEl = document.getElementById('modalBadge');
  badgeEl.textContent = data.badge;
  badgeEl.className   = 'modal-badge project-badge ' + (data.badgeClass || '');

  document.getElementById('modalTitle').textContent      = projectName;
  document.getElementById('modalImage').src              = data.image;
  document.getElementById('modalImage').alt              = 'Preview ' + projectName;
  document.getElementById('modalAbout').textContent      = data.about;
  document.getElementById('modalHow').textContent        = data.how;
  document.getElementById('modalTech').textContent       = data.tech;
  document.getElementById('modalExperience').textContent = data.experience;

  document.getElementById('modalTags').innerHTML = data.tags
    .map(function(tag) { return '<span class="tech-tag">' + tag + '</span>'; })
    .join('');

  document.getElementById('modalActions').innerHTML = data.links
    .map(function(link) {
      var cls = link.primary ? 'btn btn-primary' : 'btn btn-outline';
      return '<a href="' + link.url + '" target="_blank" rel="noopener" class="' + cls + '">' + link.label + '</a>';
    })
    .join('');

  // Register cursor hover on dynamically created action buttons
  document.getElementById('modalActions').querySelectorAll('a').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.classList.add('hovered');
      cursorFollower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', function() {
      cursor.classList.remove('hovered');
      cursorFollower.classList.remove('hovered');
    });
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', function(e) {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

document.querySelectorAll('.project-card').forEach(function(card) {
  card.addEventListener('click', function(e) {
    if (e.target.closest('a')) return;
    var titleEl = card.querySelector('.project-title');
    if (titleEl) openModal(titleEl.textContent.trim());
  });
});

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
