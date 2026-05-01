(function () {
  const data = window.glomerularMapData;
  const svg = document.getElementById("glomerulusMap");
  const staticLayer = document.getElementById("staticLayer");
  const stressLayer = document.getElementById("stressLayer");
  const signalLayer = document.getElementById("signalLayer");
  const cellLayer = document.getElementById("cellLayer");
  const labelLayer = document.getElementById("labelLayer");
  const tooltip = document.getElementById("tooltip");
  const stageTabs = document.getElementById("stageTabs");
  const layerToggles = document.getElementById("layerToggles");
  const stageTitle = document.getElementById("stageTitle");
  const readingTitle = document.getElementById("readingTitle");
  const readingText = document.getElementById("readingText");
  const compositionBars = document.getElementById("compositionBars");
  const signalList = document.getElementById("signalList");
  const meterFill = document.getElementById("meterFill");

  const ns = "http://www.w3.org/2000/svg";
  const center = { x: 470, y: 365 };
  const layers = {
    cells: true,
    signals: true,
    stress: true,
    labels: true
  };
  let activeStageId = data.stages[0].id;

  const layerLabels = [
    { id: "cells", label: "Cell populations" },
    { id: "signals", label: "Pathway arrows" },
    { id: "stress", label: "Stress field" },
    { id: "labels", label: "Anatomy labels" }
  ];

  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  function seededPoint(seed, zone) {
    const a = Math.sin(seed * 12.9898) * 43758.5453;
    const b = Math.sin((seed + 8.17) * 78.233) * 9876.5432;
    const u = a - Math.floor(a);
    const v = b - Math.floor(b);
    const angle = u * Math.PI * 2;

    const zones = {
      tuft: { rx: 230, ry: 158, min: 0.1, spread: 0.78 },
      rim: { rx: 316, ry: 214, min: 0.78, spread: 0.18 },
      capsule: { rx: 345, ry: 242, min: 0.86, spread: 0.14 },
      outer: { rx: 390, ry: 285, min: 0.9, spread: 0.18 }
    };
    const z = zones[zone];
    const radius = z.min + Math.sqrt(v) * z.spread;
    const jitter = Math.sin(seed * 4.7) * 12;

    return {
      x: center.x + Math.cos(angle) * z.rx * radius + jitter,
      y: center.y + Math.sin(angle) * z.ry * radius + jitter * 0.55
    };
  }

  function drawStaticMap() {
    staticLayer.replaceChildren();

    const capsule = createSvgElement("ellipse", {
      class: "capsule",
      cx: center.x,
      cy: center.y,
      rx: 392,
      ry: 286
    });
    const bowmanSpace = createSvgElement("ellipse", {
      class: "bowman-space",
      cx: center.x,
      cy: center.y,
      rx: 337,
      ry: 235
    });
    const glomerulus = createSvgElement("ellipse", {
      class: "glomerulus-body",
      cx: center.x,
      cy: center.y,
      rx: 292,
      ry: 194
    });

    staticLayer.append(capsule, bowmanSpace, glomerulus);

    const loops = [
      "M260,352 C320,206 462,224 512,328 S690,456 555,515 S318,523 260,352",
      "M330,254 C396,310 372,404 450,430 S604,376 628,274",
      "M275,430 C380,360 452,556 612,458",
      "M402,214 C424,302 552,272 590,368 S506,518 420,482",
      "M238,344 C320,424 352,245 470,286 S646,348 704,302"
    ];
    loops.forEach((path) => {
      staticLayer.appendChild(createSvgElement("path", { class: "capillary-loop", d: path }));
    });
  }

  function drawStress(stage) {
    stressLayer.replaceChildren();
    const stress = createSvgElement("ellipse", {
      class: "stress-field",
      cx: center.x + 48,
      cy: center.y - 6,
      rx: 292,
      ry: 204,
      style: `opacity: ${layers.stress ? stage.stress : 0};`
    });
    stressLayer.appendChild(stress);
  }

  function pathForSignal(id) {
    const paths = {
      pdgf: "M590,575 C638,505 672,440 620,358 C578,296 506,284 452,320",
      tgfb: "M725,428 C642,496 610,560 488,548 C404,540 362,502 337,454",
      ifn: "M190,270 C262,190 390,162 504,198 C640,240 730,310 776,410"
    };
    return paths[id];
  }

  function drawSignals(stage) {
    signalLayer.replaceChildren();
    ["pdgf", "tgfb", "ifn"].forEach((id) => {
      const isActive = stage.signals.includes(id) && layers.signals;
      const marker = id === "pdgf" ? "arrowPd" : id === "tgfb" ? "arrowTgf" : "arrowIfn";
      const path = createSvgElement("path", {
        class: "signal-path",
        d: pathForSignal(id),
        stroke: data.signals[id].color,
        "marker-end": `url(#${marker})`,
        style: `opacity: ${isActive ? 0.82 : 0};`
      });
      const labels = {
        pdgf: { x: 606, y: 520 },
        tgfb: { x: 626, y: 505 },
        ifn: { x: 612, y: 238 }
      };
      const label = createSvgElement("text", {
        class: "signal-label",
        x: labels[id].x,
        y: labels[id].y,
        style: `opacity: ${isActive && layers.labels ? 1 : 0};`
      });
      label.textContent = data.signals[id].label;
      signalLayer.append(path, label);
    });
  }

  function makeCells(stage) {
    const cells = [];
    let seed = 4;
    Object.entries(stage.composition).forEach(([type, value]) => {
      const meta = data.cellTypes[type];
      const count = Math.max(1, Math.round(value * 1.15));
      for (let i = 0; i < count; i += 1) {
        const p = seededPoint(seed + i * 2.7 + value, meta.zone);
        cells.push({ type, value, ...p });
      }
      seed += 101;
    });
    return cells;
  }

  function drawCells(stage) {
    cellLayer.replaceChildren();
    const cells = makeCells(stage);
    cells.forEach((cell, index) => {
      const meta = data.cellTypes[cell.type];
      const circle = createSvgElement("circle", {
        class: "cell",
        cx: cell.x.toFixed(1),
        cy: cell.y.toFixed(1),
        r: meta.radius,
        fill: meta.color,
        tabindex: "0",
        role: "img",
        "aria-label": `${meta.label}: ${meta.description}`,
        style: `opacity: ${layers.cells ? 0.88 : 0}; transform-origin: ${cell.x}px ${cell.y}px; transition-delay: ${(index % 12) * 8}ms;`
      });
      circle.addEventListener("mouseenter", (event) => showTooltip(event, meta, stage));
      circle.addEventListener("mousemove", moveTooltip);
      circle.addEventListener("mouseleave", hideTooltip);
      circle.addEventListener("focus", (event) => showTooltip(event, meta, stage));
      circle.addEventListener("blur", hideTooltip);
      cellLayer.appendChild(circle);
    });
  }

  function drawLabels() {
    labelLayer.replaceChildren();
    const labels = [
      { text: "Bowman's capsule", x: 114, y: 188 },
      { text: "Capillary tuft", x: 388, y: 172 },
      { text: "Crescent zone", x: 650, y: 594 },
      { text: "Periglomerular immune rim", x: 108, y: 556 }
    ];
    labels.forEach((item) => {
      const label = createSvgElement("text", {
        class: "map-label",
        x: item.x,
        y: item.y,
        style: `opacity: ${layers.labels ? 1 : 0};`
      });
      label.textContent = item.text;
      labelLayer.appendChild(label);
    });
  }

  function showTooltip(event, meta, stage) {
    tooltip.innerHTML = `<strong>${meta.label}</strong>${meta.description}<br><span>${stage.name} index: ${stage.composition[findCellKey(meta.label)] ?? "n/a"}</span>`;
    moveTooltip(event);
    tooltip.classList.add("is-visible");
  }

  function findCellKey(label) {
    return Object.entries(data.cellTypes).find(([, meta]) => meta.label === label)?.[0];
  }

  function moveTooltip(event) {
    const source = event.touches ? event.touches[0] : event;
    tooltip.style.left = `${source.clientX + 14}px`;
    tooltip.style.top = `${source.clientY + 14}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove("is-visible");
  }

  function renderComposition(stage) {
    compositionBars.replaceChildren();
    const max = Math.max(...Object.values(stage.composition));
    Object.entries(stage.composition).forEach(([type, value]) => {
      const meta = data.cellTypes[type];
      const item = document.createElement("div");
      item.className = "bar-item";
      item.innerHTML = `
        <div class="bar-meta">
          <span>${meta.label}</span>
          <span>${value}</span>
        </div>
        <div class="bar-track">
          <span style="width: ${(value / max) * 100}%; background: ${meta.color};"></span>
        </div>
      `;
      compositionBars.appendChild(item);
    });
  }

  function renderSignals(stage) {
    signalList.replaceChildren();
    stage.signals.forEach((id) => {
      const signal = data.signals[id];
      const item = document.createElement("div");
      item.className = "signal-pill";
      item.style.setProperty("--signal-color", signal.color);
      item.innerHTML = `<span><strong>${signal.label}</strong>${signal.text}</span>`;
      signalList.appendChild(item);
    });
  }

  function renderTabs() {
    stageTabs.replaceChildren();
    data.stages.forEach((stage) => {
      const tab = document.createElement("button");
      tab.className = "stage-tab";
      tab.type = "button";
      tab.id = `stage-${stage.id}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(stage.id === activeStageId));
      tab.innerHTML = `<strong>${stage.name}</strong><span>${stage.short}</span>`;
      tab.addEventListener("click", () => {
        activeStageId = stage.id;
        render();
      });
      stageTabs.appendChild(tab);
    });
  }

  function renderToggles() {
    layerToggles.replaceChildren();
    layerLabels.forEach((layer) => {
      const btn = document.createElement("button");
      btn.className = `toggle-btn ${layers[layer.id] ? "is-on" : ""}`;
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(layers[layer.id]));
      btn.innerHTML = `<span>${layer.label}</span>`;
      btn.addEventListener("click", () => {
        layers[layer.id] = !layers[layer.id];
        render();
      });
      layerToggles.appendChild(btn);
    });
  }

  function currentStage() {
    return data.stages.find((stage) => stage.id === activeStageId) || data.stages[0];
  }

  function render() {
    const stage = currentStage();
    stageTitle.textContent = stage.title;
    readingTitle.textContent = stage.readingTitle;
    readingText.textContent = stage.reading;
    meterFill.style.width = `${stage.progression * 100}%`;

    renderTabs();
    renderToggles();
    drawStaticMap();
    drawStress(stage);
    drawSignals(stage);
    drawCells(stage);
    drawLabels();
    renderComposition(stage);
    renderSignals(stage);
  }

  render();
})();
