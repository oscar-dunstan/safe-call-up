/* ─────────────────────────────────────────────────────────────────────────────
   Safe Call Up — GSAP Animation Layer
   Motion aesthetic: deliberate, editorial, physics-aware
   Premium easing (expo.out / power3.out), staggered reveals, parallax depth

   Requires (loaded before this file):
     gsap.min.js  +  ScrollTrigger.min.js
   ───────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

// ── helpers ───────────────────────────────────────────────────────────────────
const q  = sel => document.querySelector(sel);
const qa = sel => gsap.utils.toArray(sel);

// ── entry point ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initReducedMotion();
  } else {
    init();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// REDUCED MOTION — opacity-only fades, no transforms
// ─────────────────────────────────────────────────────────────────────────────
function initReducedMotion() {
  // Reveal above-fold elements immediately
  gsap.from(['.nav', '.quick-exit', '.eyebrow', '.hero h1', '.hero .standfirst',
             '.hero-actions', '.hero-figure'].filter(q), {
    opacity: 0, duration: 0.4, stagger: 0.06,
  });

  // Fade everything else in as it enters the viewport
  qa('.section-tag, .section-lead, .col-meta, .lede, .atlas, .pull-quote, ' +
     '.practice-scroller, .featured-post, .entry, .faq-cat, ' +
     '.ribbon, .crisis, .foot-cols, .foot-bottom, .section-foot').forEach(el => {
    gsap.from(el, {
      opacity: 0, duration: 0.5,
      scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
function init() {
  // Order matters: DOM prep → initial states → animations
  prepHeroH1();
  setInitialStates();

  animateChrome();      // nav pill + quick exit
  animateHero();        // hero entrance timeline + parallax
  animateRibbon();      // audience ribbon
  animateSections();    // all section-tags, section-leads, intros
  animateAtlas();       // pattern atlas index + detail
  animatePullQuotes();  // pull quotes + rule line draw
  animateSectionFeet(); // "Continue →" links
  animateScroller();    // practice card scroller section
  animateEntries();     // numbered entry rows (evidence page — legacy)
  animateEvidencePage(); // new evidence page layout components
  animateFaqCats();     // faq category blocks
  animateFeaturedPost();
  animateFooter();
  animateNavOnScroll(); // nav backdrop deepens as user scrolls
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM PREP: split hero h1 into per-line clip containers for slide-up reveal
// ─────────────────────────────────────────────────────────────────────────────
function prepHeroH1() {
  const h1 = q('.hero h1');
  if (!h1) return;

  // Collect child nodes, split on <br> elements
  const lines = [];
  let current = [];
  Array.from(h1.childNodes).forEach(node => {
    if (node.nodeName === 'BR') {
      lines.push(current);
      current = [];
    } else {
      // Drop pure-whitespace text nodes that are just indentation
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      current.push(node.cloneNode(true));
    }
  });
  if (current.length) lines.push(current);

  // Rebuild h1: each line wrapped in overflow:hidden so the y-transform clips
  h1.innerHTML = '';
  lines.forEach(nodes => {
    const clip = document.createElement('span');
    // Small padding-bottom / negative margin-bottom so descenders aren't clipped
    clip.style.cssText = 'display:block;overflow:hidden;padding-bottom:0.06em;margin-bottom:-0.06em;';

    const mover = document.createElement('span');
    mover.className = 'h1-line';
    mover.style.cssText = 'display:block;';
    nodes.forEach(n => mover.appendChild(n));

    clip.appendChild(mover);
    h1.appendChild(clip);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATES — set everything to hidden before any animation runs
// Prevents flash of unstyled/positioned content
// ─────────────────────────────────────────────────────────────────────────────
function setInitialStates() {
  // Chrome (fixed elements)
  gsap.set('.nav',         { y: -56, opacity: 0 });
  gsap.set('.quick-exit',  { y: 24,  opacity: 0 });

  // Hero
  gsap.set('.eyebrow',              { y: 18,    opacity: 0 });
  gsap.set('.h1-line',              { y: '108%'             }); // clipped inside overflow:hidden
  gsap.set('.hero .standfirst',     { y: 28,    opacity: 0 });
  gsap.set('.hero-actions > *',     { y: 18,    opacity: 0 });
  gsap.set('.hero-figure',          { y: 48,    opacity: 0, scale: 0.95 });
  gsap.set('.hero-figure__caption', { y: 14,    opacity: 0 });

  // Ribbon
  gsap.set('.ribbon',    { y: 20, opacity: 0 });
  gsap.set('.ribbon li', { y: 10, opacity: 0 });

  // Section scaffolding (applies to all pages)
  gsap.set('.section-tag',  { x: -18, opacity: 0 });
  gsap.set('.section-lead', { y: 30,  opacity: 0 });
  gsap.set('.col-meta',     {         opacity: 0 });
  gsap.set('.lede',         { y: 22,  opacity: 0 });

  // Pattern atlas
  gsap.set('.atlas',             { y: 24, opacity: 0 });
  gsap.set('.atlas-index .item', { x: -14, opacity: 0 });
  gsap.set('.atlas-detail',      { x: 14,  opacity: 0 });

  // Pull quotes + rule line
  gsap.set('.pull-quote', { y: 24, opacity: 0 });
  qa('.pull-quote .attrib .rule').forEach(rule =>
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
  );

  // Section feet
  gsap.set('.section-foot .ghost',     { opacity: 0 });
  gsap.set('.section-foot .next-link', { x: -14, opacity: 0 });

  // Practice scroller section + its controls
  gsap.set('.practice-scroller',       { y: 32, opacity: 0 });
  gsap.set('.section-head__controls',  { opacity: 0 });

  // Featured post
  gsap.set('.featured-post', { y: 24, opacity: 0 });

  // Footer
  gsap.set('.crisis .label',   { x: -12, opacity: 0 });
  gsap.set('.crisis-body h3',  { y: 20,  opacity: 0 });
  gsap.set('.crisis-num',      { y: 16,  opacity: 0 });
  gsap.set('.foot-cols > div', { y: 20,  opacity: 0 });
  gsap.set('.foot-bottom',     {         opacity: 0 });

  // Evidence page: numbered entry rows
  gsap.set('.entry', { y: 20, opacity: 0 });

  // Evidence page: new layout components
  gsap.set('.guide-index', { y: 14, opacity: 0 });
  gsap.set('.ev-lede',     { y: 20, opacity: 0 });
  gsap.set('.pgrid-card',  { y: 28, opacity: 0 });
  gsap.set('.evrow',       { y: 24, opacity: 0 });
  gsap.set('.trust-item',  { y: 20, opacity: 0 });
  gsap.set('.state-pill',  { y: 12, opacity: 0 });
  gsap.set('.ev-legal-body p', { y: 16, opacity: 0 });

  // FAQ page: category blocks
  gsap.set('.faq-cat', { y: 20, opacity: 0 });
}

// ─────────────────────────────────────────────────────────────────────────────
// CHROME — nav pill slides in from above, quick exit rises from below
// ─────────────────────────────────────────────────────────────────────────────
function animateChrome() {
  // Nav — first thing the user sees
  gsap.to('.nav', {
    y: 0, opacity: 1,
    duration: 1.1, ease: 'expo.out', delay: 0.08,
  });

  // Quick Exit — arrives after hero settles, so it doesn't compete
  gsap.to('.quick-exit', {
    y: 0, opacity: 1,
    duration: 1, ease: 'expo.out', delay: 1.5,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — sequenced entrance timeline with parallax depth
// ─────────────────────────────────────────────────────────────────────────────
function animateHero() {
  if (!q('.hero')) return;

  // Main entrance sequence
  const tl = gsap.timeline({ delay: 0.22 });

  tl
    // 1. Eyebrow label fades up
    .to('.eyebrow', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })

    // 2. H1 lines rise up from behind their overflow-hidden clip, staggered
    .to('.h1-line', {
      y: '0%',
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.11,
    }, '-=0.5')

    // 3. Standfirst paragraph
    .to('.hero .standfirst', {
      y: 0, opacity: 1,
      duration: 0.9, ease: 'power3.out',
    }, '-=0.55')

    // 3b. Guide index (evidence page only — no-op on other pages)
    .to('.guide-index', {
      y: 0, opacity: 1,
      duration: 0.75, ease: 'power3.out',
    }, '-=0.6')

    // 4. CTA buttons stagger
    .to('.hero-actions > *', {
      y: 0, opacity: 1,
      duration: 0.75, ease: 'power3.out',
      stagger: 0.1,
    }, '-=0.5')

    // 5. Hero figure — starts at same time as h1, arrives with its own timing
    .to('.hero-figure', {
      y: 0, opacity: 1, scale: 1,
      duration: 1.3, ease: 'expo.out',
    }, 0.18)

    // 6. Caption card rises from bottom of figure
    .to('.hero-figure__caption', {
      y: 0, opacity: 1,
      duration: 0.85, ease: 'power3.out',
    }, '-=0.6');

  // Hero figure parallax — drifts upward as user scrolls past the hero
  gsap.to('.hero-figure', {
    y: -80, ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Hero copy — more subtle parallax (less movement than figure, creates depth)
  gsap.to('.hero-copy', {
    y: -36, ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.5,
    },
  });

  // Eyebrow dot — continuous gentle pulse (breathing quality)
  gsap.to('.eyebrow .dot', {
    scale: 1.55, duration: 1.5, ease: 'sine.inOut',
    yoyo: true, repeat: -1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RIBBON — audience strip fades in with staggered list items
// ─────────────────────────────────────────────────────────────────────────────
function animateRibbon() {
  if (!q('.ribbon')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.ribbon',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });

  tl.to('.ribbon',    { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' })
    .to('.ribbon li', { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }, '-=0.55');
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS — section-tags, section-leads, and intro blocks across all pages
// ─────────────────────────────────────────────────────────────────────────────
function animateSections() {
  // Section number tags slide in from the left
  qa('.section-tag').forEach(tag => {
    gsap.to(tag, {
      x: 0, opacity: 1,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: tag, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });

  // Section lead headings rise up
  qa('.section-lead').forEach(lead => {
    gsap.to(lead, {
      y: 0, opacity: 1,
      duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: lead, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  // Section intro blocks: col-meta fades, then lede paragraph rises
  qa('.section-intro').forEach(intro => {
    const meta  = intro.querySelector('.col-meta');
    const ledes = intro.querySelectorAll('.lede');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: intro, start: 'top 85%', toggleActions: 'play none none none' },
    });

    if (meta)        tl.to(meta,             { opacity: 1, duration: 0.7, ease: 'power2.out' });
    if (ledes.length) tl.to(ledes,           { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.15 }, '-=0.4');

    // Also reveal any scroller controls inside section-heads
    const controls = intro.closest('.wrap')?.querySelector('.section-head__controls');
    if (controls) {
      tl.to(controls, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5');
    }
  });

  // Scroller controls for sections that use section-head--with-controls
  qa('.section-head--with-controls').forEach(head => {
    const controls = head.querySelector('.section-head__controls');
    if (!controls) return;
    gsap.to(controls, {
      opacity: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: controls, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN ATLAS — index items stagger from left, detail panel from right
// ─────────────────────────────────────────────────────────────────────────────
function animateAtlas() {
  if (!q('.atlas')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.atlas',
      start: 'top 84%',
      toggleActions: 'play none none none',
    },
  });

  tl
    // Container rises into view
    .to('.atlas', {
      y: 0, opacity: 1,
      duration: 0.8, ease: 'power3.out',
    })
    // Index buttons cascade in from the left
    .to('.atlas-index .item', {
      x: 0, opacity: 1,
      duration: 0.65, ease: 'power3.out',
      stagger: 0.07,
    }, '-=0.45')
    // Detail panel slides in from the right
    .to('.atlas-detail', {
      x: 0, opacity: 1,
      duration: 0.9, ease: 'expo.out',
    }, '-=0.6');
}

// ─────────────────────────────────────────────────────────────────────────────
// PULL QUOTES — rise in, then the attribution rule draws from left to right
// ─────────────────────────────────────────────────────────────────────────────
function animatePullQuotes() {
  qa('.pull-quote').forEach(pq => {
    const rule = pq.querySelector('.attrib .rule');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pq,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(pq, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' });

    // Rule line draws in like a reveal
    if (rule) {
      tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, '-=0.55');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION FEET — ghost label fades, then the link slides in from left
// ─────────────────────────────────────────────────────────────────────────────
function animateSectionFeet() {
  qa('.section-foot').forEach(foot => {
    const ghost = foot.querySelector('.ghost');
    const link  = foot.querySelector('.next-link');
    if (!ghost && !link) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: foot, start: 'top 92%', toggleActions: 'play none none none' },
    });

    if (ghost) tl.to(ghost, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    if (link)  tl.to(link,  { x: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, '-=0.3');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRACTICE SCROLLER — the horizontal card section rises into view
// ─────────────────────────────────────────────────────────────────────────────
function animateScroller() {
  if (!q('.practice-scroller')) return;

  gsap.to('.practice-scroller', {
    y: 0, opacity: 1,
    duration: 1.1, ease: 'expo.out',
    scrollTrigger: {
      trigger: '.practice-scroller',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTRIES — numbered editorial rows (evidence.html), stagger as they scroll in
// ─────────────────────────────────────────────────────────────────────────────
function animateEntries() {
  qa('.entry').forEach(entry => {
    gsap.to(entry, {
      y: 0, opacity: 1,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: entry, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ CATEGORIES — each category block rises as it enters (faq.html)
// ─────────────────────────────────────────────────────────────────────────────
function animateFaqCats() {
  qa('.faq-cat').forEach(cat => {
    gsap.to(cat, {
      y: 0, opacity: 1,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: cat, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED POST — editorial article card
// ─────────────────────────────────────────────────────────────────────────────
function animateFeaturedPost() {
  if (!q('.featured-post')) return;

  gsap.to('.featured-post', {
    y: 0, opacity: 1,
    duration: 1.1, ease: 'expo.out',
    scrollTrigger: {
      trigger: '.featured-post',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — cascading reveal: crisis zone → columns → bottom bar
// ─────────────────────────────────────────────────────────────────────────────
function animateFooter() {
  if (!q('footer')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });

  const crisisLabel = q('.crisis .label');
  const crisisH3    = q('.crisis-body h3');
  const crisisNums  = qa('.crisis-num');
  const footCols    = qa('.foot-cols > div');
  const footBottom  = q('.foot-bottom');

  if (crisisLabel) tl.to(crisisLabel, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
  if (crisisH3)    tl.to(crisisH3,   { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },           '-=0.35');
  if (crisisNums.length) tl.to(crisisNums, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.4');
  if (footCols.length)   tl.to(footCols,   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08 }, '-=0.3');
  if (footBottom)        tl.to(footBottom,  { opacity: 1, duration: 0.6, ease: 'power2.out' },        '-=0.2');
}

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE PAGE — new layout components (pgrid, evrows, trust strip, state pills)
// ─────────────────────────────────────────────────────────────────────────────
function animateEvidencePage() {
  // ev-lede paragraphs in section heads
  qa('.ev-lede').forEach(el => {
    gsap.to(el, {
      y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });

  // Practice grid: cards stagger from the pgrid container
  const pgrid = q('.pgrid');
  if (pgrid) {
    gsap.to('.pgrid-card', {
      y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: pgrid, start: 'top 84%', toggleActions: 'play none none none' },
    });
  }

  // Evidence rows: each rises individually as it enters
  qa('.evrow').forEach(row => {
    gsap.to(row, {
      y: 0, opacity: 1, duration: 0.95, ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 86%', toggleActions: 'play none none none' },
    });
  });

  // Trust strip items: stagger from the container trigger
  const trustStrip = q('.trust-strip');
  if (trustStrip) {
    gsap.to('.trust-item', {
      y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: trustStrip, start: 'top 84%', toggleActions: 'play none none none' },
    });
  }

  // State pills: fast cascade
  const pillsContainer = q('.state-pills');
  if (pillsContainer) {
    gsap.to('.state-pill', {
      y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
      stagger: 0.05,
      scrollTrigger: { trigger: pillsContainer, start: 'top 90%', toggleActions: 'play none none none' },
    });
  }

  // Legal body paragraphs
  const legalBody = q('.ev-legal-body');
  if (legalBody) {
    gsap.to('.ev-legal-body p', {
      y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: legalBody, start: 'top 86%', toggleActions: 'play none none none' },
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV ON SCROLL — deepen the nav's glass effect as the user scrolls
// ─────────────────────────────────────────────────────────────────────────────
function animateNavOnScroll() {
  const nav = q('.nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onUpdate: self => {
      const past = self.scroll() > 60;
      // Stronger blur + shadow once user is past the hero
      nav.style.backdropFilter        = past ? 'blur(20px) saturate(1.15)' : '';
      nav.style.webkitBackdropFilter  = past ? 'blur(20px) saturate(1.15)' : '';
      nav.style.boxShadow             = past
        ? '0 1px 0 rgba(255,255,255,.65) inset, 0 18px 48px -12px rgba(31,26,20,.28), 0 2px 8px -2px rgba(31,26,20,.12)'
        : '';
    },
  });
}
