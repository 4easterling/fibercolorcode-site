(() => {
  const viewer = document.querySelector('#image-viewer');
  const image = viewer.querySelector('img');
  const closeButton = viewer.querySelector('button');
  let opener;

  document.querySelectorAll('.app-screen, .screenshot-detail').forEach((link) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', (event) => {
      // Preserve the browser's open-in-new-tab shortcuts and no-JS image links.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.getAttribute('href');
      image.alt = link.querySelector('img').alt;
      viewer.showModal();
      document.documentElement.classList.add('image-viewer-open');
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => viewer.close());
  viewer.querySelector('.image-viewer-stage').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) viewer.close();
  });
  // Native dialogs handle Escape and trap keyboard focus inside the viewer.
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('image-viewer-open');
    opener?.focus({ preventScroll: true });
  });
})();
