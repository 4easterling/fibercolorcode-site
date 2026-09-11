(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const key = 'fiber-color-code-theme';
  // Apply the saved choice before the page paints. Storage may be unavailable.
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {}

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    function updateTheme() {
      const dark = root.dataset.theme === 'dark' ||
        (!root.dataset.theme && system.matches);
      toggle.checked = dark;
      toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
      // Contrast the real app captures against the site's selected theme.
      document.querySelectorAll('[data-dark-image]').forEach(link => {
        const src = dark ? link.dataset.lightImage : link.dataset.darkImage;
        link.href = src;
        link.querySelector('img').src = src;
      });
    }
    toggle.addEventListener('change', () => {
      root.dataset.theme = toggle.checked ? 'dark' : 'light';
      try { localStorage.setItem(key, root.dataset.theme); } catch {}
      updateTheme();
    });
    system.addEventListener('change', updateTheme);
    updateTheme();
    toggle.closest('label').hidden = false;
  });
})();
