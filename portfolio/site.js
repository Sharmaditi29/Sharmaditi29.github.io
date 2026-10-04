(() => {
  const choices = ['paper', 'sage', 'ink', 'night'];
  let selected = 'paper';
  try { const saved = localStorage.getItem('portfolio-theme'); if (saved === 'auto') selected = 'night'; else if (choices.includes(saved)) selected = saved; } catch {}
  function apply() {
    document.body.dataset.theme = selected;
    document.querySelectorAll('[name=appearance]').forEach(input => { input.checked = input.value === selected; });
  }
  document.querySelectorAll('[name=appearance]').forEach(input => input.addEventListener('change', () => {
    selected = input.value; apply(); try { localStorage.setItem('portfolio-theme', selected); } catch {}
  }));
  const panel = document.querySelector('.appearance');
  document.addEventListener('click', event => { if (!panel.contains(event.target)) panel.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.open) { panel.open = false; panel.querySelector('summary').focus(); } });
  apply();
})();

// Switch views inside the same page; native hashes preserve shareable links.
(() => {
  const links = [...document.querySelectorAll('.site-header nav a')];
  const views = [...document.querySelectorAll('#home, .single-section')];
  function show(focus = false) {
    const id = location.hash.slice(1);
    const current = views.find(view => view.id === id) || views[0];
    views.forEach(view => { view.hidden = view !== current; });
    links.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focus) {
      const heading = current.querySelector('h1, h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll:true});
    }
    window.scrollTo(0, 0);
  }
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    show(true);
  }));
  addEventListener('popstate', () => show());
  addEventListener('hashchange', () => show());
  show();
})();

// Project categories share the existing Projects view.
document.querySelectorAll('[data-project-category]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-project-category]').forEach(item => {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  });
});
