(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById('lang');
  const themeButton = document.getElementById('theme');
  const year = document.getElementById('year');
  const safeGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  function setLanguage(lang) {
    const selected = lang === 'en' ? 'en' : 'pt';
    root.lang = selected === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-pt][data-en]').forEach(element => {
      element.textContent = element.dataset[selected];
    });
    languageButton.textContent = selected === 'pt' ? 'EN' : 'PT';
    languageButton.setAttribute('aria-label', selected === 'pt' ? 'Switch to English' : 'Mudar para português');
    document.title = selected === 'pt' ? 'Gustavo Assis — Desenvolvedor de Software' : 'Gustavo Assis — Software Engineer';
    safeSet('portfolio-language', selected);
  }
  function setTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('light', light);
    root.dataset.theme = light ? 'light' : 'dark';
    themeButton.textContent = light ? '☾' : '☀';
    themeButton.setAttribute('aria-label', light ? 'Activate dark theme' : 'Activate light theme');
    safeSet('portfolio-theme', light ? 'light' : 'dark');
  }
  languageButton.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'pt' : 'en'));
  themeButton.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
  setLanguage(safeGet('portfolio-language') || (navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'));
  setTheme(safeGet('portfolio-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('.project[data-category]').forEach(project => {
        project.hidden = filter !== 'all' && project.dataset.category !== filter;
      });
    });
  });
  year.textContent = String(new Date().getFullYear());
})();
