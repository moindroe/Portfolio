// script.js - anchor precision, reveal, modal, lightbox, hero zoom, back-to-top
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.hero-header') || document.querySelector('header');
  const navLinks = document.querySelectorAll('.main-nav a, .hero-nav a');
  const sections = document.querySelectorAll('main section[id], main section');
  const reveals = document.querySelectorAll('.reveal');

  // Hero zoom (Ken Burns)
  const heroImage = document.getElementById('heroImage');
  if (heroImage) setTimeout(() => heroImage.classList.add('zoom-in'), 250);

  // compute header height
  function getHeaderHeight() { return header ? header.offsetHeight : 110; }

  // Set CSS var and section scroll-margin-top (so native anchor jumps land correctly)
  function updateHeaderVarAndMargin() {
    const h = getHeaderHeight();
    document.documentElement.style.setProperty('--header-height', `${h}px`);
    // also set scrollMarginTop for every section for browsers that use it
    document.querySelectorAll('.section').forEach(sec => {
      sec.style.scrollMarginTop = `${h + 16}px`;
    });
  }
  updateHeaderVarAndMargin();
  window.addEventListener('resize', updateHeaderVarAndMargin);

  // Smooth scroll for nav links (pages link to separate pages - handle same-page anchor or fallback)
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      // If link is same-page anchor (starts with '#') -> smooth scroll with offset
      if (href && href.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
      // If link points to a page with hash (e.g. planning.html#...), default navigation will happen.
      // For links to the same page name (planning.html when already on planning.html), allow reload anchor processing.
    });
  });

  // If URL has a hash on load (e.g. page.html#section), scroll with header offset
  if (window.location.hash) {
    const id = window.location.hash;
    setTimeout(() => {
      const target = document.querySelector(id);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 60); // small delay to allow layout
  }

  // IntersectionObserver for active nav (highlights link on view)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.target.id) return;
      const id = entry.target.id;
      const activeLink = document.querySelector(`.main-nav a[href$="${id}"], .hero-nav a[href$="${id}"]`);
      if (entry.isIntersecting) {
        document.querySelectorAll('.main-nav a, .hero-nav a').forEach(a => a.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { root: null, threshold: 0.25 });

  sections.forEach(s => sectionObserver.observe(s));

  // Reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObserver.observe(r));

  // Modal handling
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.querySelector('.modal-close');

  function openModal(type) {
    if (!modalOverlay || !modalContent) return;
    modalContent.innerHTML = '';
    if (type === 'reservation') {
      modalContent.innerHTML = `<h3 id="modalTitle">Réserver un cours collectif</h3>
        <p>Pour réserver maintenant, contacte-nous au <strong>01 39 59 15 48</strong> ou passe à l'accueil.</p>
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
    if (modalContent) modalContent.innerHTML = '';
  }
  document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-type')));
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  // Contact form behaviour (simple)
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

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    if (window.pageYOffset > window.innerHeight / 2) backToTop.style.display = 'flex';
    else backToTop.style.display = 'none';
  });
  if (backToTop) backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // close ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeLightbox(); }
  });
});
