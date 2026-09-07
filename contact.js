(() => {
  const dialog = document.querySelector('#contact-dialog');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  const success = document.querySelector('#contact-success');
  const submit = form.querySelector('[type="submit"]');
  const title = document.querySelector('#contact-title');
  const description = document.querySelector('#contact-description');
  let source = '';
  let pending = false;
  let completed = false;
  let lastPayload = '';
  let requestId = '';
  let opener;

  document.querySelectorAll('[data-contact]').forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      if (completed) {
        form.reset();
        completed = false;
        lastPayload = '';
        requestId = '';
      }
      source = button.textContent.replace('↗', '').trim();
      title.textContent = source === 'Contact support' ? 'How can we help?' : 'Get your crew connected.';
      description.hidden = false;
      form.hidden = false;
      success.hidden = true;
      status.hidden = true;
      dialog.showModal();
      document.body.classList.add('contact-open');
    });
  });

  function close() {
    if (!pending) dialog.close();
  }
  dialog.querySelector('.dialog-close').addEventListener('click', close);
  dialog.querySelector('[data-contact-done]').addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    if (pending) event.preventDefault();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('contact-open');
    opener?.focus();
  });
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(payload)) payload[key] = payload[key].trim();
    if (!payload.name || !payload.message) {
      status.hidden = false;
      status.textContent = 'Please include your name and a message.';
      status.focus();
      return;
    }
    payload.source = source;
    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayload) {
      requestId = crypto.randomUUID();
      lastPayload = serialized;
    }
    payload.requestId = requestId;
    pending = true;
    form.setAttribute('aria-busy', 'true');
    const controls = [...form.querySelectorAll('input, textarea, button'), dialog.querySelector('.dialog-close')];
    controls.forEach((control) => { control.disabled = true; });
    submit.textContent = 'Sending…';
    status.hidden = false;
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('https://us-central1-fiber-color-code-app.cloudfunctions.net/submitWebsiteContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || 'We couldn’t send your message. Please try again.');
      }
      completed = true;
      form.hidden = true;
      description.hidden = true;
      success.hidden = false;
      title.textContent = 'Message sent.';
      dialog.querySelector('[data-contact-done]').focus();
    } catch (error) {
      status.textContent = error instanceof TypeError || error.name === 'AbortError'
        ? 'We couldn’t confirm your message was sent. Your details are still here; please check your connection and try again.'
        : error.message;
      status.focus();
    } finally {
      clearTimeout(timer);
      pending = false;
      form.removeAttribute('aria-busy');
      controls.forEach((control) => { control.disabled = false; });
      submit.textContent = 'Send message ↗';
    }
  });
})();
