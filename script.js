/* ========= Icon links object =========
   Stores web URLs to SVG icons. These are injected into <span data-icon="..."> placeholders.
*/
const iconLinks = {
  // Academics icons (Heroicons)
  book: 'https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/outline/book-open.svg',
  computer: 'https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/outline/computer-desktop.svg',
  science: 'https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/outline/beaker.svg',

  // Social icons (Simple Icons with brand color override set to Primary Blue)
  facebook: 'https://cdn.simpleicons.org/facebook/004a99',
  twitter: 'https://cdn.simpleicons.org/x/004a99',       // Twitter/X
  instagram: 'https://cdn.simpleicons.org/instagram/004a99'
};

/* ========= Inject icons on DOMContentLoaded =========
   Finds all elements with [data-icon] and injects an <img> with the corresponding src.
*/
function injectIcons() {
  const placeholders = document.querySelectorAll('[data-icon]');
  placeholders.forEach((el) => {
    const key = el.getAttribute('data-icon');
    const url = iconLinks[key];

    // Clear previous content (if any) and insert image
    el.innerHTML = '';
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `${key} icon`;
      img.className = 'dynamic-icon';
      img.loading = 'lazy';
      el.appendChild(img);
    } else {
      // Fallback: simple emoji if icon not found
      el.textContent = '🔗';
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ========= Mobile menu toggle =========
   Toggles "nav-active" on the nav when hamburger is clicked.
*/
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('primary-nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isActive = nav.classList.toggle('nav-active');
    // Update accessible state
    hamburger.setAttribute('aria-expanded', String(isActive));
  });
}

/* ========= Dynamic year in footer ========= */
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ========= Init ========= */
document.addEventListener('DOMContentLoaded', () => {
  injectIcons();
  setupMobileMenu();
  setCurrentYear();
});


