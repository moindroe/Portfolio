// script.js - hero video fallback + precise scroll + reveal + modal + lightbox + contact form
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.hero-header') || document.querySelector('header');
  const navLinks = document.querySelectorAll('.main-nav a, .hero-nav a');
  const sections = document.querySelectorAll('main section[id]');
  const reveals = document.querySelectorAll('.reveal');

  // HERO: video vs fallback logic
  const heroVideo = document.getElementById('heroVideo');
  const heroFallback = document.getElementById('heroFallback');

  function supportsAutoplay() {
    // simple heuristic: skip autoplay on small screens to save mobile bandwidth
    return window.innerWidth > 560;
  }

  if (heroVideo) {
    if (!supportsAutoplay()) {
      heroVideo.style.display = 'none';
      if (heroFallback) heroFallback.style.display = 'block';
    } else {
      // hide fallback initially (if exists)
      if (heroFallback) heroFallback.style.display = 'none';
      // if video errors, show fallback
      heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'block';
      });
      // try to play - some browsers block autoplay if not muted, but it's muted here
      heroVideo.play().catch(() => {
        heroVideo.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'block';
      });
    }
  } else {
    if (heroFallback) heroFallback.style.display = 'block';
  }

  // compute header height for scroll offset
  function getHeaderHeight() {
    return header ? header.offsetHeight : 110;
  }

  // smooth scroll with header offset
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // IntersectionObserver for active nav
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const activeLink = document.querySelector(`.main-nav a[href="#${id}"], .hero-nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        document.querySelectorAll('.main-nav a, .hero-nav a').forEach(a => a.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { root: null, threshold: 0.18 });

  sections.forEach(s => sectionObserver.observe(s));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObserver.observe(r));

  // Modal handling (reservation / abonnement)
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.querySelector('.modal-close');

  function openModal(type) {
    if (!modalOverlay || !modalContent) return;
    modalContent.innerHTML = '';
    if (type === 'reservation') {
      modalContent.innerHTML = `
        <h3>Réserver un cours collectif</h3>
        <p>Pour réserver maintenant, contacte-nous au <strong>01 39 59 15 48</strong> ou passe à l'accueil. Réservation en ligne bientôt disponible.</p>
        <div style="text-align:right;margin-top:12px;"><button class="btn-main" id="closeModalBtn">Fermer</button></div>
      `;
    } else {
      modalContent.innerHTML = `
        <h3>Prendre un abonnement</h3>
        <p>Pour souscrire, viens en salle ou appelle-nous au <strong>01 39 59 15 48</strong>. Souscription en ligne à venir.</p>
        <div style="text-align:right;margin-top:12px;"><button class="btn-main" id="closeModalBtn">Fermer</button></div>
      `;
    }
    modalOverlay.classList.add('active');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  }
  function closeModal() {
    modalOverlay.classList.remove('active');
    modalContent.innerHTML = '';
  }
  document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-type')));
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const msg = contactForm.querySelector('[name="message"]').value.trim();
      if (name && email && msg) {
        contactForm.innerHTML = `<div class="form-confirm"><strong>Merci ${name} !</strong><p>Votre message a bien été envoyé. Nous vous répondrons rapidement.</p></div>`;
      } else {
        alert('Merci de remplir tous les champs.');
      }
    });
  }

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    if (lightboxImg) lightboxImg.src = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Update CSS var for header height for accurate anchors
  const updateHeaderHeight = () => {
    const h = getHeaderHeight();
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

  // close ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(); closeLightbox();
    }
  });
});
