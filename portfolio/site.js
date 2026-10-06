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

// A lightweight, perspective-projected helix. Render only while settling or resizing.
(() => {
  const canvas = document.querySelector('.molecular-depth');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const background = canvas.parentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(pointer: fine)');
  let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0;
  let width = 0, height = 0;
  function homeVisible() { return !document.getElementById('home').hidden && !document.hidden; }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const dark = document.body.dataset.theme === 'night';
    const ink = dark ? '151,196,183' : '61,111,112';
    const scale = Math.min(width * .14, height * .22);
    const originX = width * .78, originY = height * .48;
    const nodes = [];
    for (let i = 0; i < 24; i++) {
      for (let strand = 0; strand < 2; strand++) {
        const angle = i * .39 + strand * Math.PI + x * .35;
        const px = Math.cos(angle) * .42;
        const py = (i / 23 - .5) * 3;
        const pz = Math.sin(angle) * .42;
        const depth = pz + y * py * .08;
        const perspective = 4 / (4 - depth);
        nodes.push({x:originX + (px + py * .18 + x * .09) * scale * perspective,
          y:originY + (py + y * .08) * scale * perspective, z:depth, i, strand});
      }
    }
    function bond(a,b,alpha) {
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
      ctx.strokeStyle = 'rgba(' + ink + ',' + alpha + ')'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    nodes.forEach((node,index) => {
      if (index + 2 < nodes.length) bond(node,nodes[index + 2],.35);
      if (node.strand === 0) bond(node,nodes[index + 1],.2);
    });
    [...nodes].sort((a,b)=>a.z-b.z).forEach(node => {
      const radius = 2.6 + (node.z + .6) * 2.2;
      const shade = ctx.createRadialGradient(node.x-radius*.3,node.y-radius*.3,.2,node.x,node.y,radius);
      shade.addColorStop(0, dark ? 'rgba(224,236,218,.95)' : 'rgba(202,219,204,.95)');
      shade.addColorStop(1,'rgba(' + ink + ',.7)');
      ctx.fillStyle=shade; ctx.beginPath(); ctx.arc(node.x,node.y,radius,0,Math.PI*2); ctx.fill();
    });
  }
  function animate() {
    frame=0;
    if (!homeVisible()) return;
    x += (targetX-x)*.09; y += (targetY-y)*.09;
    background.style.setProperty('--depth-rx',(-y*1.4)+'deg');
    background.style.setProperty('--depth-ry',(x*1.8)+'deg');
    draw();
    if (Math.abs(targetX-x)+Math.abs(targetY-y)>.002) frame=requestAnimationFrame(animate);
  }
  function schedule() { if (!frame && homeVisible()) frame=requestAnimationFrame(animate); }
  function resize() {
    width=innerWidth; height=innerHeight;
    const ratio=Math.min(devicePixelRatio || 1,2);
    canvas.width=width*ratio; canvas.height=height*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0); draw();
  }
  addEventListener('pointermove',event=>{
    if(reduced.matches || !pointer.matches || !homeVisible()) return;
    targetX=event.clientX/width*2-1; targetY=event.clientY/height*2-1; schedule();
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{targetX=targetY=0;schedule();});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;x=y=targetX=targetY=0;background.style.setProperty('--depth-rx','0deg');background.style.setProperty('--depth-ry','0deg');draw();});
  new MutationObserver(()=>{draw();schedule();}).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  new MutationObserver(()=>{if(!homeVisible()){cancelAnimationFrame(frame);frame=0;}else schedule();}).observe(document.getElementById('home'),{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});
  addEventListener('resize',resize); resize();
})();
