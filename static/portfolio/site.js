(() => {
  const choices = ['auto', 'paper', 'sage', 'ink', 'night'];
  const media = matchMedia('(prefers-color-scheme: dark)');
  let selected = 'paper';
  try { const saved = localStorage.getItem('portfolio-theme'); if (choices.includes(saved)) selected = saved; } catch {}
  function apply() {
    document.body.dataset.theme = selected === 'auto' ? (media.matches ? 'night' : 'paper') : selected;
    document.querySelectorAll('[name=appearance]').forEach(input => { input.checked = input.value === selected; });
  }
  document.querySelectorAll('[name=appearance]').forEach(input => input.addEventListener('change', () => {
    selected = input.value; apply(); try { localStorage.setItem('portfolio-theme', selected); } catch {}
  }));
  const panel = document.querySelector('.appearance');
  document.addEventListener('click', event => { if (!panel.contains(event.target)) panel.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.open) { panel.open = false; panel.querySelector('summary').focus(); } });
  media.addEventListener('change', apply);
  apply();
})();

// Keep navigation in sync with the section being read, without rewriting history.
(() => {
  const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let queued = false;
  function update() {
    queued = false;
    const threshold = document.querySelector('.site-header').getBoundingClientRect().bottom + 100;
    let active = -1;
    sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= threshold) active = index; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = sections.length - 1;
    links.forEach((link, index) => { if (index === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive:true });
  addEventListener('resize', update);
  update();
})();
