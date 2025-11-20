// Scroll fluide navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetID = this.getAttribute('href');
    if (targetID.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(targetID);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 30,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Confirmation et reset formulaire contact
const contactForm = document.querySelector('section#contact form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = contactForm.querySelector('[name="email"]').value;
    const msg = contactForm.querySelector('[name="message"]').value;
    if (email && msg) {
      contactForm.innerHTML =
        `<div class="form-confirm"><strong>Merci&nbsp;!</strong> Votre message a bien été envoyé.<br>Nous vous répondrons rapidement.</div>`;
    }
  });
}
