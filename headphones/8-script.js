// 8-script.js
(function () {
  const btn = document.getElementById("hamburger-btn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  let lastFocused = null;
  const mq = window.matchMedia("(max-width: 480px)");

  function openMenu() {
    nav.classList.add("open");
    btn.classList.add("active");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    trapFocus();
  }

  function closeMenu() {
    nav.classList.remove("open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    releaseFocus();
  }

  function toggleMenu() {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  }

  // Focus management (accessibility)
  function trapFocus() {
    lastFocused = document.activeElement;
    const focusables = nav.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables);
    if (list.length) list[0].focus();

    function handleTab(e) {
      if (e.key !== "Tab") return;
      if (!list.length) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    nav._handleTab = handleTab;
    nav.addEventListener("keydown", handleTab);
  }

  function releaseFocus() {
    if (nav._handleTab) {
      nav.removeEventListener("keydown", nav._handleTab);
      nav._handleTab = null;
    }
    if (lastFocused) lastFocused.focus();
  }

  // Toggle on button click
  btn.addEventListener("click", toggleMenu);

  // Close on nav link click
  nav.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link")) closeMenu();
  });

  // Close with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
  });

  // Close when clicking outside the nav/hamburger
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    const clickedInside = nav.contains(e.target) || btn.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // If we resize above mobile breakpoint, ensure menu is closed/reset
  window.addEventListener("resize", () => {
    if (!mq.matches) closeMenu();
  });
})();
