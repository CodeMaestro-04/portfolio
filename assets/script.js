// ==========================================
// 1. MINIMAL 3D TECH & SKILLS BACKGROUND
// ==========================================
function initThreeJS() {
  const canvas = document.getElementById('canvas3d');
  if (!canvas || typeof THREE === 'undefined') return;
  canvas.style.display = 'block';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 42;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Helper: Create a crisp 3D glass tech pill texture for a skill/tech label
  function createSkillBadgeTexture(tag, sub, accentHex) {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 110;
    const ctx = c.getContext('2d');

    // Rounded glass card background
    const r = 20;
    ctx.beginPath();
    ctx.roundRect(6, 6, 308, 98, r);
    ctx.fillStyle = 'rgba(4, 24, 29, 0.72)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = accentHex;
    ctx.stroke();

    // Left status dot
    ctx.beginPath();
    ctx.arc(34, 44, 6, 0, Math.PI * 2);
    ctx.fillStyle = accentHex;
    ctx.fill();

    // Primary skill title
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f0fdfa';
    ctx.fillText(tag, 52, 52);

    // Sub-label
    ctx.font = '500 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#99f6e4';
    ctx.fillText(sub, 30, 82);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  // Minimal 3D floating skill cards placed around outer margins
  const skillSpecs = [
    { tag: 'Python', sub: 'Django · Scripts', color: '#34d399', x: -31, y: 17, z: -6, rx: 0.08, ry: 0.22 },
    { tag: 'RabbitMQ', sub: 'Async Queue', color: '#2dd4bf', x: 31, y: 16, z: -8, rx: 0.06, ry: -0.24 },
    { tag: 'Spring Boot', sub: 'Java 17 · AI', color: '#10b981', x: -33, y: -2, z: -10, rx: -0.05, ry: 0.25 },
    { tag: 'React', sub: 'Frontend UI', color: '#2dd4bf', x: 32, y: -3, z: -9, rx: -0.04, ry: -0.22 },
    { tag: 'PostgreSQL', sub: 'SQL · Data Logs', color: '#34d399', x: -29, y: -18, z: -7, rx: -0.08, ry: 0.2 },
    { tag: 'Telegram API', sub: 'Worker Monitor', color: '#fbbf24', x: 29, y: -18, z: -8, rx: -0.08, ry: -0.2 }
  ];

  const badgeMeshes = [];
  const planeGeo = new THREE.PlaneGeometry(9.2, 3.15);

  skillSpecs.forEach((s, idx) => {
    const tex = createSkillBadgeTexture(s.tag, s.sub, s.color);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(planeGeo, mat);
    mesh.position.set(s.x, s.y, s.z);
    mesh.rotation.set(s.rx, s.ry, 0);
    mesh.userData = { baseX: s.x, baseY: s.y, baseZ: s.z, baseRx: s.rx, baseRy: s.ry, phase: idx * 1.1 };
    scene.add(mesh);
    badgeMeshes.push(mesh);
  });

  // Minimal 3D Tech Wireframe Shapes:
  // 1) 3D Database Stack Ring (representing PostgreSQL / SQL) on bottom-left
  const dbGroup = new THREE.Group();
  const ringGeo = new THREE.CylinderGeometry(4.2, 4.2, 1.4, 24, 1, true);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.12 });
  for (let i = -1; i <= 1; i++) {
    const cyl = new THREE.Mesh(ringGeo, ringMat);
    cyl.position.y = i * 1.8;
    dbGroup.add(cyl);
  }
  dbGroup.position.set(-22, 9, -18);
  dbGroup.rotation.set(0.35, 0.4, 0.1);
  scene.add(dbGroup);

  // 2) 3D Orbital Gyro Rings (representing React / Async Architecture) on top-right
  const atomGroup = new THREE.Group();
  const torusGeo = new THREE.TorusGeometry(5.2, 0.08, 8, 48);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.18 });
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(torusGeo, torusMat);
    ring.rotation.x = (i * Math.PI) / 3;
    ring.rotation.y = (i * Math.PI) / 4;
    atomGroup.add(ring);
  }
  const coreGeo = new THREE.OctahedronGeometry(1.1, 0);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.28 });
  atomGroup.add(new THREE.Mesh(coreGeo, coreMat));
  atomGroup.position.set(23, 8, -16);
  scene.add(atomGroup);

  // 3) Subtle 3D Architecture Circuit Lines connecting left and right nodes
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.09 });
  const circuitPairs = [
    [0, 2], [2, 4], [1, 3], [3, 5]
  ];
  circuitPairs.forEach(([a, b]) => {
    const pts = [
      new THREE.Vector3(skillSpecs[a].x, skillSpecs[a].y, skillSpecs[a].z - 1),
      new THREE.Vector3(skillSpecs[b].x, skillSpecs[b].y, skillSpecs[b].z - 1)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    scene.add(new THREE.Line(lineGeo, lineMaterial));
  });

  // Gentle mouse parallax + ambient cursor glow
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smoothly float each 3D skill card
    badgeMeshes.forEach((m) => {
      const u = m.userData;
      m.position.y = u.baseY + Math.sin(t * 0.7 + u.phase) * 0.85;
      m.rotation.y = u.baseRy + Math.sin(t * 0.45 + u.phase) * 0.06 + mouseX * 0.05;
      m.rotation.x = u.baseRx + Math.cos(t * 0.4 + u.phase) * 0.04 - mouseY * 0.04;
    });

    // Gentle rotation on the 3D Database cylinder stack & 3D React/Async orbital rings
    dbGroup.rotation.y = t * 0.18;
    dbGroup.position.y = 9 + Math.sin(t * 0.6) * 0.6;

    atomGroup.rotation.y = t * 0.22;
    atomGroup.rotation.z = t * 0.12;
    atomGroup.position.y = 8 + Math.cos(t * 0.65) * 0.6;

    renderer.render(scene, camera);
  }

  animate();
}

// ==========================================
// 2. TYPING EFFECT IN HERO
// ==========================================
const typeWords = [
  "Python & Django REST APIs",
  "RabbitMQ & Telegram Bot Systems",
  "Java & Spring Boot Backend",
  "PostgreSQL, SQL & Hibernate JPA",
  "React & Modern Web Interfaces"
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingDelay = 75;
const erasingDelay = 40;
const newWordDelay = 1800;

function typeWriter() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  const currentWord = typeWords[wordIdx];

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? erasingDelay : typingDelay;

  if (!isDeleting && charIdx === currentWord.length) {
    speed = newWordDelay;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % typeWords.length;
    speed = 400;
  }

  setTimeout(typeWriter, speed);
}

// ==========================================
// 3. TOAST NOTIFICATION & COPY UTILITY
// ==========================================
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function copyToClipboard(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`✓ Copied ${label}: ${text}`);
    }).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`✓ Copied ${label}: ${text}`);
  } catch (e) {
    showToast(`Copied: ${text}`);
  }
  ta.remove();
}

// ==========================================
// 4. SCROLL PROGRESS BAR
// ==========================================
function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const progress = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
    progressBar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

// ==========================================
// 5. INTERACTIVE ARCHITECTURE PIPELINE (Telegram Bot, RabbitMQ & PostgreSQL Task System)
// ==========================================
function setupInteractivePipeline() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const archSvg = document.getElementById('archSvg');
  const dotsGroup = document.getElementById('archDots');
  const captionEl = document.getElementById('archCaption');

  if (!archSvg || !dotsGroup || !captionEl) return;

  const CAPTIONS = {
    telegram: 'Telegram Bot Interface: Built with Python & Telegram Bot API, integrated with company APIs to trigger and manage task-related operations.',
    api: 'Company APIs: Dispatches task operations into RabbitMQ queues for asynchronous background processing.',
    heartbeat: 'Worker Status & Failure Monitor: Tracks RabbitMQ worker execution status, detects failures, and logs every state transition in PostgreSQL.'
  };
  const DEFAULT_CAPTION = captionEl.textContent;

  function createFlowDot(pathId, cls, beginSec, durSec) {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '4.5');
    circle.setAttribute('class', cls);

    const anim = document.createElementNS(svgNS, 'animateMotion');
    anim.setAttribute('dur', durSec + 's');
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('begin', beginSec + 's');

    const mpath = document.createElementNS(svgNS, 'mpath');
    mpath.setAttribute('href', '#' + pathId);

    anim.appendChild(mpath);
    circle.appendChild(anim);
    dotsGroup.appendChild(circle);
  }

  // Add animated data packets flowing along paths
  ['aw0', 'aw1', 'aw2'].forEach((id, idx) => {
    createFlowDot(id, 'dot-pulse-a', -idx * 0.45, 1.8);
  });
  createFlowDot('awm', 'dot-pulse-b', 0, 1.0);
  createFlowDot('awm', 'dot-pulse-b', -0.5, 1.0);
  ['ad0', 'ad1', 'ad2'].forEach((id, idx) => {
    createFlowDot(id, 'dot-pulse-b', -idx * 0.45, 1.6);
  });

  // Interactive source click handler
  const sources = Array.from(archSvg.querySelectorAll('.src-group'));
  const wires = Array.from(archSvg.querySelectorAll('.src-wire'));

  function selectSource(key) {
    const isSame = archSvg.dataset.selected === key;
    archSvg.dataset.selected = isSame ? '' : key;
    archSvg.classList.toggle('filtered', !isSame);

    sources.forEach((g) => {
      g.classList.toggle('active', !isSame && g.dataset.k === key);
    });
    wires.forEach((w) => {
      w.classList.toggle('on', !isSame && w.dataset.k === key);
    });
    captionEl.textContent = isSame ? DEFAULT_CAPTION : (CAPTIONS[key] || DEFAULT_CAPTION);
  }

  sources.forEach((g) => {
    g.addEventListener('click', () => selectSource(g.dataset.k));
  });
}

// ==========================================
// 6. PROJECT CATEGORY FILTERS
// ==========================================
function setupProjectFilters() {
  const buttons = document.querySelectorAll(".project-filter-btn");
  const cards = document.querySelectorAll(".project-case-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      buttons.forEach((b) => {
        b.classList.remove("bg-emerald-500", "text-slate-950", "border-emerald-400", "shadow-lg", "shadow-emerald-500/20");
        b.classList.add("bg-slate-900/80", "text-slate-300", "border-slate-700");
      });

      btn.classList.add("bg-emerald-500", "text-slate-950", "border-emerald-400", "shadow-lg", "shadow-emerald-500/20");
      btn.classList.remove("bg-slate-900/80", "text-slate-300", "border-slate-700");

      cards.forEach((card) => {
        const tags = card.getAttribute("data-tags") || "";
        if (filter === "all" || tags.includes(filter)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ==========================================
// 7. SKILL FILTERING
// ==========================================
function setupSkillFilters() {
  const buttons = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".skill-item");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("bg-emerald-600", "text-slate-950", "shadow-lg", "shadow-emerald-500/25");
        b.classList.add("bg-slate-800/80", "text-slate-300");
      });

      btn.classList.add("bg-emerald-600", "text-slate-950", "shadow-lg", "shadow-emerald-500/25");
      btn.classList.remove("bg-slate-800/80", "text-slate-300");

      const category = btn.getAttribute("data-category");

      skillCards.forEach((card) => {
        if (category === "all" || card.getAttribute("data-category").includes(category)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ==========================================
// 8. MODALS MANAGEMENT
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto";
  }
}

// ==========================================
// 9. INITIALIZE ALL ON DOM CONTENT LOADED
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  typeWriter();
  setupScrollProgress();
  setupInteractivePipeline();
  setupProjectFilters();
  setupSkillFilters();

  // Mobile Menu Toggle
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Active Navbar Link Highlighting on Scroll
  const navLinks = document.querySelectorAll('.site-nav-link');
  const sectionIds = ['tldr', 'about', 'experience', 'projects', 'skills', 'education', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((sec) => navObserver.observe(sec));
  }

  // Initialize VanillaTilt if loaded
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      perspective: 1000
    });
  }
});
