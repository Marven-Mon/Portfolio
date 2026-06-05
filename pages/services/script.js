/* Liste des images de la galerie */
const galerieImages = [
  'images/pexels-enes-cihanger-610993519-19681533.jpg',
  'images/pexels-lulo-films-911293535-19960164.jpg',
  'images/pexels-maksim-kolykhanov-18139520-6679832.jpg',
  'images/pexels-muammar-jefri-2150424129-33640530.jpg',
  'images/pexels-newman-photographs-234743505-29891256.jpg',
  'images/pexels-san-wedding-1649543-6291011.jpg',
  'images/pexels-vinicius-quaresma-511530024-29734262.jpg',
  'images/pexels-vinicius-quaresma-511530024-29747720.jpg',
  'images/pexels-willians-huerta-2157111846-36430227.jpg',
  'images/pexels-wolworld-20034403.jpg'
];

/* Remplissage de la galerie au chargement */
const galerieGrid = document.getElementById('galerie-grid');
galerieImages.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Photo de mariage QuickPic';
  galerieGrid.appendChild(img);
});

/* Navigation entre les vues (affiche une seule vue à la fois) */
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-links a');

function navigate(viewId) {
  views.forEach(v => v.classList.toggle('active', v.id === viewId));

  // Met à jour le lien actif dans la barre de navigation
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === viewId && !a.classList.contains('btn-reserver')));

  // Ferme le menu mobile et remonte en haut de la page
  document.getElementById('nav-links').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tout élément possédant data-nav déclenche la navigation
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', () => navigate(el.dataset.nav));
});

/* Bouton «Choisir»: présélectionne le forfait puis ouvre la vue Contact */
document.querySelectorAll('[data-forfait]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('forfait').value = btn.dataset.forfait;
    navigate('contact');
  });
});

/* Menu mobile (ouverture / fermeture) */
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

/* Soumission du formulaire: remplit le résumé puis affiche la confirmation */
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const forfait = document.getElementById('forfait').value;
  const dateValeur = document.getElementById('date').value;
  const heure = document.getElementById('heure').value;

  // Date affichée en format long français 
  const dateLisible = new Date(dateValeur + 'T00:00:00').toLocaleDateString('fr-CA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  document.getElementById('r-forfait').textContent = forfait;
  document.getElementById('r-date').textContent = dateLisible;
  document.getElementById('r-heure').textContent = heure;

  form.reset();
  navigate('confirmation');
});

/* Visionneuse: agrandit une image de la galerie au clic */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

galerieGrid.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    lightboxImg.src = e.target.src;
    lightbox.classList.add('open');
  }
});

// Fermeture de la visionneuse clic sur le fond ou sur la croix
function fermerLightbox() { lightbox.classList.remove('open'); }
lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) fermerLightbox(); });
document.getElementById('lightbox-close').addEventListener('click', fermerLightbox);