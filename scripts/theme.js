(function () {
  const STORAGE_KEY = "wjcing-theme";
  const root = document.documentElement;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.dataset.theme = "light";
  } else {
    root.dataset.theme = "dark";
  }

  function applyToggleState() {
    const isLight = root.dataset.theme === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(isLight));
      btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      btn.title = isLight ? "Switch to dark mode" : "Switch to light mode";
    });
  }

  function bind() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        root.dataset.theme = next;
        localStorage.setItem(STORAGE_KEY, next);
        applyToggleState();
      });
    });
    applyToggleState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
