window.glomerularMapData = {
  source: {
    repository: "https://github.com/imsb-uke/xenium-cgn",
    spatialGeo: "GSE294965",
    snrnaGeo: "GSE303481",
    note:
      "Display values are curated relative indices derived from the published xenium-cgn disease trajectory and are meant for a lightweight web prototype."
  },
  stages: [
    {
      id: "control",
      name: "Control",
      short: "Reference tissue",
      title: "Control glomerulus",
      readingTitle: "Spatial baseline",
      reading:
        "Podocytes and mesangial structure dominate the central tuft. PECs remain a quiet rim population and immune cells stay sparse around the capsule.",
      progression: 0,
      stress: 0.05,
      composition: {
        podocyte: 32,
        pec: 6,
        mesangial: 22,
        fibroblast: 2,
        macrophage: 1,
        tcell: 1
      },
      signals: ["homeostasis"]
    },
    {
      id: "sle",
      name: "SLE",
      short: "Immune pressure",
      title: "Immune-active glomerulus",
      readingTitle: "Inflammation enters the niche",
      reading:
        "Inflammatory cells rise around the glomerulus while the tuft still keeps much of its shape. The map treats this as a pressure state before crescent formation dominates.",
      progression: 0.34,
      stress: 0.28,
      composition: {
        podocyte: 28,
        pec: 9,
        mesangial: 15,
        fibroblast: 3,
        macrophage: 5,
        tcell: 3
      },
      signals: ["ifn"]
    },
    {
      id: "anca",
      name: "ANCA-GN",
      short: "Early crescent",
      title: "PEC activation and early crescent",
      readingTitle: "PDGF-linked expansion",
      reading:
        "PEC abundance increases and local inflammatory contact becomes more organized. The early trajectory emphasizes PDGF-linked epithelial expansion in the crescent region.",
      progression: 0.68,
      stress: 0.58,
      composition: {
        podocyte: 24,
        pec: 16,
        mesangial: 10,
        fibroblast: 7,
        macrophage: 8,
        tcell: 5
      },
      signals: ["pdgf", "ifn"]
    },
    {
      id: "anti-gbm",
      name: "Anti-GBM",
      short: "Crescent rich",
      title: "Crescent-rich injury state",
      readingTitle: "Fibrotic signalling takes over",
      reading:
        "The crescent compartment expands, stromal signal rises, and immune cells accumulate near the capsule. The later trajectory highlights TGF-beta-linked remodelling.",
      progression: 1,
      stress: 0.84,
      composition: {
        podocyte: 21,
        pec: 18,
        mesangial: 8,
        fibroblast: 12,
        macrophage: 10,
        tcell: 8
      },
      signals: ["pdgf", "tgfb", "ifn"]
    }
  ],
  cellTypes: {
    podocyte: {
      label: "Podocyte",
      color: "oklch(0.58 0.13 250)",
      zone: "tuft",
      radius: 7,
      description: "Filtration barrier epithelial cells along capillary loops."
    },
    pec: {
      label: "PEC",
      color: "oklch(0.59 0.15 38)",
      zone: "rim",
      radius: 7,
      description: "Parietal epithelial cells, central to crescent expansion."
    },
    mesangial: {
      label: "Mesangial",
      color: "oklch(0.55 0.1 150)",
      zone: "tuft",
      radius: 6,
      description: "Structural and signalling cells within the glomerular tuft."
    },
    fibroblast: {
      label: "Fibrotic",
      color: "oklch(0.48 0.105 188)",
      zone: "capsule",
      radius: 6,
      description: "Stromal remodelling signal around injured glomeruli."
    },
    macrophage: {
      label: "Macrophage",
      color: "oklch(0.52 0.13 305)",
      zone: "outer",
      radius: 6,
      description: "Innate immune cells enriched near active injury."
    },
    tcell: {
      label: "T cell",
      color: "oklch(0.57 0.15 18)",
      zone: "outer",
      radius: 5,
      description: "Adaptive immune cells accumulating in active disease."
    }
  },
  signals: {
    homeostasis: {
      label: "Homeostasis",
      color: "oklch(0.5 0.09 150)",
      text: "Low inflammatory contact, stable filtration architecture."
    },
    pdgf: {
      label: "PDGF",
      color: "oklch(0.6 0.16 42)",
      text: "Early signal linked to epithelial expansion and crescent initiation."
    },
    tgfb: {
      label: "TGF-beta",
      color: "oklch(0.5 0.14 178)",
      text: "Later remodelling signal associated with fibrotic transition."
    },
    ifn: {
      label: "IFN / immune contact",
      color: "oklch(0.52 0.13 262)",
      text: "Inflammatory activity surrounding the glomerular niche."
    }
  }
};
