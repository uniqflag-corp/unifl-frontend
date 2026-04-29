/* ============================================
   UNIFL — Main JavaScript
   Navigation, Dark Mode, Scroll Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeader();
  initMobileNav();
  initFloatingCTA();
  initAccordion();
  initScrollReveal();
  initCountUp();
});

/* ── Theme Toggle ── */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const toggleMobile = document.getElementById('themeToggleMobile');
  
  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('unifl-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
  
  [toggle, toggleMobile].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('unifl-theme', next);
      updateThemeIcon(next);
    });
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

/* ── Header Scroll Effect ── */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Navigation ── */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const nav = document.getElementById('mobileNav');
  
  if (!toggleBtn || !nav) return;
  
  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleBtn.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });
}

/* ── Floating CTA ── */
function initFloatingCTA() {
  const cta = document.querySelector('.floating-cta');
  if (!cta) return;
  
  const onScroll = () => {
    if (window.scrollY > 500) {
      cta.classList.add('is-visible');
    } else {
      cta.classList.remove('is-visible');
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Scroll to top button
  const topBtn = document.getElementById('scrollToTop');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ── FAQ Accordion ── */
function initAccordion() {
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion__item');
      const wasActive = item.classList.contains('is-active');
      
      // Close all items in the same accordion
      item.closest('.accordion').querySelectorAll('.accordion__item').forEach(i => {
        i.classList.remove('is-active');
      });
      
      // Toggle clicked item
      if (!wasActive) {
        item.classList.add('is-active');
      }
    });
  });
}

/* ── Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

/* ── Count Up Animation ── */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();
  
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);
    
    el.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }
  
  requestAnimationFrame(update);
}
