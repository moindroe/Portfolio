// Smooth scroll using header height dynamically, highlight active nav, reveal animations, gallery lightbox, modal handling

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('main section[id]');
  const reveals = document.querySelectorAll('.reveal');

  function getHeaderHeight() {
    return header ? header.offsetHeight : 110;
  }

  // Smooth scroll on nav click using computed header height
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
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

  // IntersectionObserver to highlight active nav link and reveal sections
  const obsOptions = { root: null, rootMargin: `-${Math.round(getHeaderHeight()/2)}px 0px -40% 0px`, threshold: 0.15 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(n => n.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }, obsOptions);

  sections.forEach(s => sectionObserver.observe(s));

  // Reveal animations when entering viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => revealObserver.observe(r));

  // Modal (reservation / abonnement)
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.querySelector('.modal-close');

  function openModal(type) {
    if (!modalOverlay || !modalContent) return;
    modalContent.innerHTML = '';
    if (type === 'reservation') {
      modalContent.innerHTML = `
        <h3>Réserver un cours collectif</h3>
        <p>Pour réserver maintenant, contacte-nous au <strong>01 39 59 15 48</strong> ou passe en accueil. Réservation en ligne bientôt disponible.</p>
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

  // Contact form behaviour
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

  // Update scroll-margin-top CSS variable for accurate anchor placement
  const updateHeaderHeightVar = () => {
    const h = getHeaderHeight();
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  };
  updateHeaderHeightVar();
  window.addEventListener('resize', () => {
    updateHeaderHeightVar();
  });

  // Keyboard escape closes modals/lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(); closeLightbox();
    }
  });
});
