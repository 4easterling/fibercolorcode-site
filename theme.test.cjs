const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const source = readFileSync(`${__dirname}/theme.js`, 'utf8');

function page({ saved = null, dark = false, blocked = false, screenshots = true } = {}) {
  const root = { dataset: {} };
  const label = { hidden: true };
  const toggle = { checked: false, closest: () => label, addEventListener(_, f) { this.change = f; } };
  const image = {};
  const link = { dataset: { lightImage: 'light.png', darkImage: 'dark.png' }, querySelector: () => image };
  const system = { matches: dark, addEventListener(_, f) { this.change = f; } };
  let ready;
  runInNewContext(source, {
    document: { documentElement: root, querySelector: () => toggle, querySelectorAll: () => screenshots ? [link] : [], addEventListener: (_, f) => { ready = f; } },
    matchMedia: () => system,
    localStorage: {
      getItem() { if (blocked) throw Error('blocked'); return saved; },
      setItem(_, value) { if (blocked) throw Error('blocked'); saved = value; },
    },
  });
  const beforePaint = root.dataset.theme;
  ready();
  return { root, toggle, label, system, image, link, beforePaint, saved: () => saved };
}
const automatic = page({ dark: true });
assert.equal(automatic.root.dataset.theme, undefined);
assert.equal(automatic.toggle.checked, true);
assert.equal(automatic.image.src, 'light.png');
automatic.system.matches = false;
automatic.system.change();
assert.equal(automatic.toggle.checked, false);
assert.equal(automatic.image.src, 'dark.png');
assert.equal(automatic.link.href, automatic.image.src);
automatic.toggle.checked = true;
automatic.toggle.change();
assert.equal(automatic.saved(), 'dark');
assert.equal(automatic.image.src, 'light.png');
assert.equal(automatic.link.href, automatic.image.src);
assert.equal(automatic.toggle.title, 'Switch to light mode');
assert.equal(automatic.label.hidden, false);
automatic.system.change();
assert.equal(automatic.toggle.checked, true);
const revisited = page({ saved: automatic.saved() });
assert.equal(revisited.beforePaint, 'dark');
revisited.toggle.checked = false;
revisited.toggle.change();
assert.equal(revisited.saved(), 'light');
assert.equal(revisited.image.src, 'dark.png');
assert.equal(page({ saved: 'light', dark: true }).beforePaint, 'light');
assert.equal(page({ saved: 'invalid', dark: true }).beforePaint, undefined);
const restricted = page({ blocked: true, dark: true });
restricted.toggle.checked = false;
restricted.toggle.change();
assert.equal(restricted.root.dataset.theme, 'light');
assert.equal(restricted.image.src, 'dark.png');
assert.equal(page({ screenshots: false }).label.hidden, false);
console.log('PASS: system/manual themes, persistence, blocked storage, switch state, opposite-theme images and viewer links, legal pages');
