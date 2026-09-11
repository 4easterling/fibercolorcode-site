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
    const button = document.querySelector('[data-theme-toggle]');
    const isDark = () => root.dataset.theme === 'dark' ||
      (!root.dataset.theme && system.matches);
    function updateButton() {
      const next = isDark() ? 'light' : 'dark';
      button.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', `Switch to ${next} mode`);
    }
    button.addEventListener('click', () => {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem(key, root.dataset.theme); } catch {}
      updateButton();
    });
    system.addEventListener('change', updateButton);
    updateButton();
    button.hidden = false;
  });
})();
