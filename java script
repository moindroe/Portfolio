// Afficher/cacher le formulaire de formation
function showForm() {
  var form = document.getElementById('formationForm');
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

// Empêche la soumission réelle et affiche un message
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('#formationForm form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Merci ! Vous recevrez bientôt les infos sur la formation.');
      form.reset();
      document.getElementById('formationForm').style.display = "none";
    });
  }
});
