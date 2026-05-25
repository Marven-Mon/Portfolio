/* Carrousel d'arrière-plan pour la section Hero avec un mélange aléatoire des 10 wallpapers ultra-larges */
const wallpapers = [
  'assets/images/Ultrawide Wallpaper 1.jpg',
  'assets/images/Ultrawide Wallpaper 2.jpg',
  'assets/images/Ultrawide Wallpaper 3.jpg',
  'assets/images/Ultrawide Wallpaper 4.jpg',
  'assets/images/Ultrawide Wallpaper 5.jpg',
  'assets/images/Ultrawide Wallpaper 6.jpg',
  'assets/images/Ultrawide Wallpaper 7.jpg',
  'assets/images/Ultrawide Wallpaper 8.jpg',
  'assets/images/Ultrawide Wallpaper 9.jpg',
  'assets/images/Ultrawide Wallpaper 10.jpg'
];

// Mélange aléatoire (algorithme Fisher-Yates simplifié)
const shuffled = [...wallpapers].sort(() => Math.random() - 0.5);

const heroBg = document.getElementById('hero-bg');
shuffled.forEach((src, i) => {
  const slide = document.createElement('div');
  slide.className = 'slide' + (i === 0 ? ' active' : '');
  slide.style.backgroundImage = `url("${src}")`;
  heroBg.appendChild(slide);
});

// Changement d'image toutes les 7 secondes avec fondu enchaîné
let currentSlide = 0;
const slides = heroBg.querySelectorAll('.slide');
if (slides.length > 1) {
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 7000);
}

/* Horloge en direct */
function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('live-time').textContent = `${h}:${m}:${s}`;
}
updateTime();
setInterval(updateTime, 1000);

/* Bascule thème clair/sombre La préférence est sauvegardée dans localStorage */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const root = document.documentElement;

// Récupère le thème sauvegardé ou utilise «dark» par défaut
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

// L'icône affichée représente l'action à venir
function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
}