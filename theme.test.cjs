const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const source = readFileSync(`${__dirname}/theme.js`, 'utf8');

function page({ saved = null, dark = false, blocked = false } = {}) {
  const root = { dataset: {} };
  const button = { hidden: true, setAttribute(k, v) { this[k] = v; }, addEventListener(_, f) { this.click = f; } };
  const system = { matches: dark, addEventListener(_, f) { this.change = f; } };
  let ready;
  runInNewContext(source, {
    document: { documentElement: root, querySelector: () => button, addEventListener: (_, f) => { ready = f; } },
    matchMedia: () => system,
    localStorage: {
      getItem() { if (blocked) throw Error('blocked'); return saved; },
      setItem(_, value) { if (blocked) throw Error('blocked'); saved = value; },
    },
  });
  const beforePaint = root.dataset.theme;
  ready();
  return { root, button, system, beforePaint, saved: () => saved };
}
const automatic = page({ dark: true });
assert.equal(automatic.root.dataset.theme, undefined);
assert.equal(automatic.button.textContent, 'Light mode');
automatic.system.matches = false;
automatic.system.change();
assert.equal(automatic.button.textContent, 'Dark mode');
automatic.button.click();
assert.equal(automatic.root.dataset.theme, 'dark');
assert.equal(automatic.saved(), 'dark');
assert.equal(automatic.button['aria-label'], 'Switch to light mode');
assert.equal(automatic.button.hidden, false);
automatic.system.change();
assert.equal(automatic.button.textContent, 'Light mode');
const revisited = page({ saved: automatic.saved() });
assert.equal(revisited.beforePaint, 'dark');
revisited.button.click();
assert.equal(revisited.saved(), 'light');
assert.equal(page({ saved: 'light', dark: true }).beforePaint, 'light');
assert.equal(page({ saved: 'invalid', dark: true }).beforePaint, undefined);
const restricted = page({ blocked: true, dark: true });
restricted.button.click();
assert.equal(restricted.root.dataset.theme, 'light');
assert.equal(restricted.button.textContent, 'Dark mode');
console.log('PASS: system default, switching, persistence, pre-paint restore, invalid/blocked storage, accessible labels');
