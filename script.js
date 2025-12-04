// script.js - precise scroll, reveal, modal, lightbox, contact form, hero zoom, back-to-top, hero CTA
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.hero-header') || document.querySelector('header');
  const navLinks = document.querySelectorAll('.main-nav a, .hero-nav a');
  const sections = document.querySelectorAll('main section[id]');
  const reveals = document.querySelectorAll('.reveal');

  // Hero zoom
  const heroImage = document.getElementById('heroImage');
  if (heroImage) setTimeout(() => heroImage.classList.add('zoom-in'), 250);

  // compute header height for scroll offset
  function getHeaderHeight() { return header ? header.offsetHeight : 110; }

  // smooth scroll with accurate header offset
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
      }
    });
  });

  // Hero CTA -> planning
  const heroReserveBtn = document.getElementById('heroReserveBtn');
  if (heroReserveBtn) {
    heroReserveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#planning');
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

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
      modalContent.innerHTML = `<h3 id="modalTitle">Réserver un cours collectif</h3>
        <p>Pour réserver maintenant, contacte-nous au <strong>01 39 59 15 48</strong> ou passe à l'accueil. Réservation en ligne bientôt disponible.</p>
        <div style="text-align:right;margin-top:12px;"><button class="btn-main" id="closeModalBtn">Fermer</button></div>`;
    } else {
      modalContent.innerHTML = `<h3 id="modalTitle">Prendre un abonnement</h3>
        <p>Pour souscrire, viens en salle ou appelle-nous au <strong>01 39 59 15 48</strong>.</p>
        <div style="text-align:right;margin-top:12px;"><button class="btn-main" id="closeModalBtn">Fermer</button></div>`;
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

  // back-to-top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    if (window.pageYOffset > window.innerHeight / 2) backToTop.style.display = 'flex';
    else backToTop.style.display = 'none';
  });
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Update CSS var for header height for accurate anchors
  const updateHeaderHeight = () => {
    const h = getHeaderHeight();
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

  // close ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeLightbox(); }
  });
});
