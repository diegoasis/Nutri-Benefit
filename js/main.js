/* ============================================================
   NUTRI-BENEFIT — main.js
   Navbar · Hamburger · FAQ Accordion · Scroll animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (navbar.hasAttribute('data-fixed')) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── Hamburger menu ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── FAQ Accordion ──────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }

      if (typeof window.trackEvent === 'function') {
        window.trackEvent('faq_open', { question: btn.textContent.trim() });
      }
    });
  });

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll animations (IntersectionObserver) ───────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Scroll tracking for analytics ──────────────────────── */
  const trackSections = {
    servicios: false,
    contacto: false,
  };

  window.addEventListener('scroll', () => {
    ['servicios', 'contacto'].forEach(id => {
      if (trackSections[id]) return;
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        trackSections[id] = true;
        if (typeof window.trackEvent === 'function') {
          window.trackEvent(`scroll_${id}`);
        }
      }
    });
  }, { passive: true });

  /* ── Service CTA → pre-populate plan select ─────────────── */
  const planSelect = document.getElementById('plan');

  document.querySelectorAll('.service-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      if (planSelect && plan) {
        planSelect.value = plan;
        planSelect.classList.add('highlighted');
        setTimeout(() => planSelect.classList.remove('highlighted'), 1200);
      }
    });
  });

  /* ── Cookie banner ──────────────────────────────────────── */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');

  function hideBanner() {
    cookieBanner.classList.remove('visible');
    cookieBanner.addEventListener('transitionend', () => {
      cookieBanner.style.display = 'none';
    }, { once: true });
  }

  if (cookieBanner && !localStorage.getItem('nb_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 800);

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('nb_cookie_consent', 'all');
      hideBanner();
    });

    cookieReject.addEventListener('click', () => {
      localStorage.setItem('nb_cookie_consent', 'essential');
      hideBanner();
    });
  } else if (cookieBanner) {
    cookieBanner.style.display = 'none';
  }

  /* ── CTA click tracking ──────────────────────────────────── */
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('cta_hero_click');
      }
    });
  }

  document.querySelectorAll('.whatsapp-fab, .btn-whatsapp').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('whatsapp_click');
      }
    });
  });

});
