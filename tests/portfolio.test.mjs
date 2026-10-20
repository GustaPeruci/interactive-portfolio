import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function element(dataset = {}) {
  const events = new Map();
  const attrs = {};
  const classes = new Set();
  return {
    dataset, events, attrs, textContent: '', hidden: false,
    classList: {
      add: name => classes.add(name),
      remove: name => classes.delete(name),
      contains: name => classes.has(name),
      toggle(name, force) {
        const enabled = force ?? !classes.has(name);
        if (enabled) classes.add(name); else classes.delete(name);
        return enabled;
      },
    },
    setAttribute: (name, value) => { attrs[name] = value; },
    addEventListener: (name, callback) => events.set(name, callback),
    click() { events.get('click')?.(); },
  };
}

function setup() {
  const lang = element(), theme = element(), year = element();
  const root = { lang: 'pt-BR', dataset: {} };
  const body = element();
  const translation = element({ pt: 'Projetos', en: 'Projects' });
  const filters = ['all', 'design', 'tools', 'data'].map(filter => element({ filter }));
  const projects = ['design', 'tools', 'data'].map(category => element({ category }));
  const store = new Map();
  const document = {
    documentElement: root, body, title: '',
    getElementById: id => ({ lang, theme, year })[id],
    querySelectorAll: selector => ({
      '[data-pt][data-en]': [translation],
      '[data-filter]': filters,
      '.project[data-category]': projects,
    })[selector] || [],
  };
  const context = {
    document,
    localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    navigator: { language: 'pt-BR' },
    window: { matchMedia: () => ({ matches: false }) },
    Date,
  };
  vm.runInNewContext(script, context, { filename: 'script.js' });
  return { lang, theme, year, root, body, translation, filters, projects, store };
}

test('HTML exposes working controls and main landmark', () => {
  assert.match(html, /id="lang"/);
  assert.match(html, /id="theme"/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /assets\/forge\.css/);
});

test('translation toggles PT/EN and persists preference', () => {
  const ui = setup();
  assert.equal(ui.translation.textContent, 'Projetos');
  ui.lang.click();
  assert.equal(ui.translation.textContent, 'Projects');
  assert.equal(ui.root.lang, 'en');
  assert.equal(ui.store.get('portfolio-language'), 'en');
  ui.lang.click();
  assert.equal(ui.translation.textContent, 'Projetos');
});

test('theme toggles semantic Forge theme and persists preference', () => {
  const ui = setup();
  assert.equal(ui.root.dataset.theme, 'dark');
  ui.theme.click();
  assert.equal(ui.root.dataset.theme, 'light');
  assert.equal(ui.body.classList.contains('light'), true);
  assert.equal(ui.store.get('portfolio-theme'), 'light');
  ui.theme.click();
  assert.equal(ui.root.dataset.theme, 'dark');
});

test('project filters toggle visibility and aria state', () => {
  const ui = setup();
  ui.filters[1].click();
  assert.deepEqual(ui.projects.map(p => p.hidden), [false, true, true]);
  assert.equal(ui.filters[1].attrs['aria-pressed'], 'true');
  ui.filters[0].click();
  assert.deepEqual(ui.projects.map(p => p.hidden), [false, false, false]);
});
