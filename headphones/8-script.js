// 8-scripts.js
(() => {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  const isMobile = () => window.matchMedia('(max-width: 480px)').matches;

  function setOpen(open) {
    // ARIA + visual state
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    // Class hook (if your CSS uses .nav.open { display:flex })
    nav.classList.toggle('open', open);

    // Accessibility + FOUC prevention
    nav.hidden = !open;

    // Fallback to ensure visibility even if CSS class isn't present
    if (isMobile()) {
      nav.style.display = open ? 'flex' : '';
      document.body.classList.toggle('no-scroll', open);
    } else {
      // On desktop, let CSS control layout
      nav.style.display = '';
      document.body.classList.remove('no-scroll');
    }
  }

  function isOpen() {
    return btn.getAttribute('aria-expanded') === 'true';
  }

  // Toggle on click
  btn.addEventListener('click', () => setOpen(!isOpen()));

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      btn.focus();
    }
  });

  // Close when clicking a link inside the nav
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Click outside to close (only when open)
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  // Reset when crossing breakpoint
  const mq = window.matchMedia('(min-width: 481px)');
  mq.addEventListener('change', () => setOpen(false));

  // Ensure closed on load (and nav hidden on mobile)
  setOpen(false);

  // Tiny “am I loaded?” sanity ping (uncomment to debug)
  // console.log('[hamburger] script loaded, btn/nav found:', !!btn, !!nav);
})();
