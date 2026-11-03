/* =====================================================================
   A BIRTHDAY TALE WRITTEN FOR LADY CHARITY — script.js
   Everything you might want to edit is gathered in the CONFIG block
   at the top. The rest of the file makes the realm come alive.
   ===================================================================== */
'use strict';

/* ─────────────────────────  CONFIG — EDIT FREELY  ───────────────────────── */

// CHANGE THE BIRTHDAY DATE (month is 1–12). The countdown, "today" and
// "after the day" messages all follow this. (The hero subtitle in
// index.html is plain text — edit it too if you change the date.)
const BIRTHDAY = { month: 11, day: 14 };

// CHANGE THE MUSIC: put the file in /music and update the path/title here.
const MUSIC = { src: 'music/Christina Perri A Thousand Years Epic Orchestra Cover.mp3', title: 'Birthday Song' };

// ADD / REMOVE PHOTOS: one line per photograph. Put the files in /images.
// `ratio` only shapes the placeholder tile until a real photo is added.
const GALLERY = [
  { src: 'images/charity-1.jpg', alt: 'Lady Charity, photograph one',   caption: 'Add a caption here', ratio: '4/5' },
  { src: 'images/charity-2.jpg', alt: 'Lady Charity, photograph two',   caption: 'Add a caption here', ratio: '1/1' },
  { src: 'images/charity-3.jpg', alt: 'Lady Charity, photograph three', caption: 'Add a caption here', ratio: '3/4' },
  { src: 'images/charity-4.jpg', alt: 'Lady Charity, photograph four',  caption: 'Add a caption here', ratio: '5/4' },
  { src: 'images/charity-5.jpg', alt: 'Lady Charity, photograph five',  caption: 'Add a caption here', ratio: '4/5' },
];

// ADD MORE COMPLIMENTS for the jar — one string per line.
const COMPLIMENTS = [
  'Thy kindness is one of thy loveliest qualities.',
  'Thou hast a rather wonderful way with words.',
  'Thy laughter deserves its own celebration.',
  'Thou art far more appreciated than thou mayest realise.',
  'Never underestimate the beauty of simply being thyself.',
  'Thy faith is a quiet light to all who stand near thee.',
  'Even the simplest conversation becomes a delight in thy company.',
  'Thou teachest not only with knowledge, but with heart.',
  'The way thou carest is a gift in itself.',
  'Thy curiosity makes the world seem a little more wonderful.',
  'Thou makest ordinary days feel rather special.',
  'Thy thoughtfulness is noticed, and it is treasured.',
  'Thou carriest grace as naturally as others carry a smile.',
  'The world is gentler for having thee in it.',
];

// MORE VERSES for "Unfold Another Verse". Each verse = list of stanzas,
// each stanza = list of lines.
const VERSES = [
  [
    ['Of all the tales that time may write,', 'Some souls make ordinary days bright.', 'With gentle words and a thoughtful heart,', 'Thou makest the simplest moments art.'],
    ['May every chapter bring thee grace,', 'And may joy forever find its place.', 'May faith light every path thou tread,', 'And blessings crown the days ahead.'],
  ],
  [
    ['A candle lit, a wish set free,', 'A year unfolds most graciously;', 'May every page that thou dost turn', 'Hold something sweet for thee to learn.'],
  ],
  [
    ['Let ink and joy together run', 'Across the days now just begun;', 'May laughter be thy constant guest,', 'And God Himself provide the rest.'],
  ],
  [
    ['Some stories glow without a sound,', 'Where kindness is the fertile ground;', 'So here’s to thee, this day and ever,', 'A gentle heart, a mind most clever.'],
  ],
  [
    ['When November’s fourteenth morning breaks,', 'The world a little brighter wakes;', 'May every season, soft and bright,', 'End in a warm and gentle light.'],
  ],
];

// ROYAL DICTIONARY — phrase on the left, modern English on the right.
const DICTIONARY = [
  { old: 'Thou art most gracious.',                  modern: 'You are so kind and gracious.' },
  { old: 'My lady, thou art a delight.',             modern: 'You are an absolute joy to know.' },
  { old: 'Pray, accept these humble birthday wishes.', modern: 'Please accept these heartfelt birthday wishes.' },
  { old: 'Thy knight remains at thy service.',       modern: 'I’m always here for you, whenever you need me.' },
  { old: 'Prithee, have a splendid day.',            modern: 'Please, have a wonderful day!' },
];

/* ───────────────────────────  HELPERS  ─────────────────────────── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = window.matchMedia('(max-width: 700px)').matches;
const PALETTE = ['#F4B6C2', '#D6B477', '#FFF5F0', '#C98599', '#641B35', '#ffe08a'];

/* ───────────────────────  MISSING-IMAGE PLACEHOLDER  ─────────────────────── */
function placeholder(path, label) {
  const d = document.createElement('div');
  d.className = 'photo-missing';
  d.innerHTML = '<b aria-hidden="true">C</b><span></span>';
  $('span', d).textContent = label || ('Add photo: ' + path);
  return d;
}
function guardImage(img, onBroken) {
  const fail = () => {
    const ph = placeholder(img.getAttribute('src'));
    img.replaceWith(ph);
    if (onBroken) onBroken(ph);
  };
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
  else img.addEventListener('error', fail, { once: true });
}

/* ───────────────────────  STARFIELD CANVAS  ─────────────────────── */
function starfield(canvas, count) {
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], raf = 0, running = false;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: rand(.4, 1.9),
      p: Math.random() * 6.28, s: rand(.6, 2.2), gold: Math.random() < .55,
    }));
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const a = .35 + .65 * Math.abs(Math.sin(t / 1000 * s.s + s.p));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.gold ? '#D6B477' : '#FFF5F0';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1.5) { // little cross sparkle on the bigger stars
        ctx.globalAlpha = a * .5; ctx.fillRect(s.x - s.r * 3, s.y - .4, s.r * 6, .8); ctx.fillRect(s.x - .4, s.y - s.r * 3, .8, s.r * 6);
      }
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(frame);
  }
  const api = {
    start() { if (running) return; running = true; raf = requestAnimationFrame(frame); },
    stop()  { running = false; cancelAnimationFrame(raf); },
  };
  size();
  window.addEventListener('resize', size);
  if (reduced) { frame(0); running = false; return api; }
  // only animate while on screen (saves battery on phones)
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? api.start() : api.stop())).observe(canvas);
  return api;
}

/* ───────────────────────────  PETALS  ─────────────────────────── */
function petals(container, n) {
  if (reduced || !container) return;
  const count = isSmall ? Math.ceil(n * .55) : n;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    const s = rand(9, 20);
    p.style.cssText = `left:${rand(0, 100)}%;width:${s}px;height:${s * 1.25}px;animation-duration:${rand(10, 20)}s;animation-delay:${-rand(0, 20)}s;opacity:${rand(.4, .85)}`;
    container.appendChild(p);
  }
}

/* ─────────────────────  FX ENGINE: confetti, hearts, fireworks  ───────────────────── */
const fx = (() => {
  const canvas = $('#fx'), ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, parts = [], raf = 0;
  function size() {
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener('resize', size);

  function heart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * .35);
    ctx.bezierCurveTo(x, y - s * .1, x - s * .75, y - s * .1, x - s * .75, y + s * .3);
    ctx.bezierCurveTo(x - s * .75, y + s * .7, x, y + s * .95, x, y + s * 1.2);
    ctx.bezierCurveTo(x, y + s * .95, x + s * .75, y + s * .7, x + s * .75, y + s * .3);
    ctx.bezierCurveTo(x + s * .75, y - s * .1, x, y - s * .1, x, y + s * .35);
    ctx.fill();
  }
  function step() {
    ctx.clearRect(0, 0, w, h);
    const next = [];
    for (const p of parts) {
      p.life--;
      if (p.life <= 0 || p.y > h + 60 || p.y < -120) { if (p.type === 'rocket' && p.life <= 0) explode(p.x, p.y); continue; }
      p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; p.vx *= p.fr || 1; if (p.fr) p.vy *= p.fr;
      p.rot += p.vr || 0;
      const fade = Math.min(1, p.life / (p.fade || 30));
      ctx.globalAlpha = Math.max(0, fade);
      ctx.fillStyle = p.color; ctx.strokeStyle = p.color;
      if (p.type === 'confetti') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.rot * 1.7));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
      } else if (p.type === 'heart') {
        p.x += Math.sin(p.life / 12 + p.ph) * .6;
        heart(p.x, p.y, p.size);
      } else if (p.type === 'spark') {
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke();
      } else if (p.type === 'rocket') {
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, 6.28); ctx.fill();
        if (p.vy > -1.6) p.life = 0;
      }
      next.push(p);
    }
    ctx.globalAlpha = 1;
    parts = next;
    if (parts.length) raf = requestAnimationFrame(step); else { raf = 0; ctx.clearRect(0, 0, w, h); }
  }
  const add = p => { parts.push(p); if (!raf) raf = requestAnimationFrame(step); };

  function confetti(x, y, n = 70, spread = 1) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = rand(0, 6.283), v = rand(3, 10) * spread;
      add({ type: 'confetti', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, g: .22, fr: .985,
        rot: rand(0, 6), vr: rand(-.3, .3), size: rand(7, 13), color: pick(PALETTE), life: rand(80, 150), fade: 40 });
    }
  }
  function hearts(x, y, n = 14, spread = 60) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      add({ type: 'heart', x: x + rand(-spread, spread), y: y + rand(-10, 20), vx: rand(-.4, .4), vy: rand(-2.6, -1.2), g: -.004,
        size: rand(8, 20), color: pick(['#F4B6C2', '#C98599', '#ff6f91', '#D6B477']), life: rand(110, 190), fade: 50, ph: rand(0, 6), rot: 0 });
    }
  }
  function explode(x, y) {
    const col = pick(PALETTE.filter(c => c !== '#641B35'));
    const n = isSmall ? 34 : 54;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + rand(-.05, .05), v = rand(2, 6.2);
      add({ type: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .045, fr: .965, color: col, life: rand(45, 80), fade: 35, rot: 0 });
    }
  }
  function firework() {
    if (reduced) return;
    const x = rand(w * .12, w * .88), target = rand(h * .15, h * .5);
    add({ type: 'rocket', x, y: h + 10, vx: rand(-.6, .6), vy: -rand(9, 12), g: .12, color: '#FFF5F0', life: 200, rot: 0 });
    void target;
  }
  function risingHearts(n = 24) {
    if (reduced) return;
    for (let i = 0; i < n; i++) setTimeout(() => hearts(rand(0, w), h + 10, 1, 0), i * 90);
  }
  return { confetti, hearts, firework, risingHearts };
})();

/* ───────────────────────────  LOADER  ─────────────────────────── */
(function loader() {
  const el = $('#loader'), t0 = performance.now();
  let gone = false;
  const hide = () => {
    if (gone) return; gone = true;
    el.classList.add('done');
    setTimeout(() => { el.remove(); const b = $('#openLetter'); if (b) b.focus({ preventScroll: true }); }, 900);
  };
  const ready = () => setTimeout(hide, Math.max(0, 1500 - (performance.now() - t0)));
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
  setTimeout(hide, 5000); // safety net if a font or image stalls
})();

/* ─────────────────────  INTRO: ENVELOPE & INVITATION  ───────────────────── */
(function intro() {
  const introEl = $('#intro'), site = $('#site');
  site.classList.remove('is-hidden');
  starfield($('#introSky'), isSmall ? 70 : 130);
  petals($('#introPetals'), 14);

  const env = $('#envelope'), openBtn = $('#openLetter'), enterBtn = $('#enterRealm');
  openBtn.addEventListener('click', () => {
    env.classList.add('open');
    $('.intro-inner', introEl).classList.add('opened');
    $('#introHeading').classList.add('fade');
    openBtn.classList.add('is-hidden');
    enterBtn.classList.remove('is-hidden');
    const r = env.getBoundingClientRect();
    setTimeout(() => fx.hearts(r.left + r.width / 2, r.top + r.height / 2, 16, 90), 900);
    setTimeout(() => enterBtn.focus({ preventScroll: true }), 1400);
  });

  enterBtn.addEventListener('click', () => {
    introEl.classList.add('leaving');
    site.classList.add('show');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    setTimeout(() => { fx.risingHearts(22); fx.confetti(innerWidth / 2, innerHeight * .35, 60); }, 500);
    setTimeout(() => introEl.remove(), 1400);
    $('#top').focus?.();
  });
})();

/* ───────────────────────  NAV, SCROLL, BACK-TO-TOP  ─────────────────────── */
(function nav() {
  const navEl = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks'), top = $('#toTop');
  const onScroll = () => {
    navEl.classList.toggle('scrolled', scrollY > 40);
    top.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  // highlight current section
  const map = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { map.forEach(a => a.classList.remove('active')); map.get(e.target.id)?.classList.add('active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ─────────────────────  SCROLL-TRIGGERED REVEALS  ───────────────────── */
(function reveals() {
  $$('.memory-grid,.quality-grid,.gift-grid').forEach(g =>
    $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', (i * .1) + 's')));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
})();

/* ───────────────────────────  HERO  ─────────────────────────── */
(function hero() {
  petals($('#heroPetals'), 12);
  $$('img[data-fallback]').forEach(img => guardImage(img));

  // Live countdown. Before the day → counts down; on the day → celebrates;
  // afterwards → a gentle message instead of a negative number.
  const box = $('#countdown'), msg = $('#cdMessage');
  const set = (id, v) => { $(id).textContent = String(v).padStart(2, '0'); };
  let celebratedToday = false;
  function tick() {
    const now = new Date(), y = now.getFullYear();
    const start = new Date(y, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0);
    const end   = new Date(y, BIRTHDAY.month - 1, BIRTHDAY.day + 1, 0, 0, 0);
    box.classList.remove('is-today', 'is-past');
    if (now < start) {
      let s = Math.floor((start - now) / 1000);
      set('#cdDays', Math.floor(s / 86400)); s %= 86400;
      set('#cdHours', Math.floor(s / 3600)); s %= 3600;
      set('#cdMins', Math.floor(s / 60)); set('#cdSecs', s % 60);
      msg.textContent = 'until the day we celebrate thee';
    } else if (now < end) {
      box.classList.add('is-today');
      msg.textContent = 'Today is the day — Happy Birthday, Lady Charity!';
      if (!celebratedToday && !$('#intro')) { celebratedToday = true; fx.confetti(innerWidth / 2, innerHeight / 3, 90); }
    } else {
      box.classList.add('is-past');
      msg.textContent = 'The day has come and gone, yet the celebration lives on in this little realm.';
    }
  }
  tick(); setInterval(tick, 1000);
})();

/* ───────────────────────  THE LETTER  ─────────────────────── */
(function letter() {
  const words = [];
  $$('[data-letter]').forEach(p => {
    [...p.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') { n.classList.add('w'); words.push(n); }
    });
  });

  const btn = $('#revealLetter'), card = $('#letter-card');
  let i = 0, timer = 0, started = false;
  const finish = () => { clearTimeout(timer); words.forEach(w => w.classList.add('on')); i = words.length; started = true; btn.textContent = 'Write it again'; btn.dataset.state = 'done'; };
  function run() {
    if (i >= words.length) { btn.textContent = 'Write it again'; btn.dataset.state = 'done'; return; }
    words[i].classList.add('on');
    const t = words[i].textContent; i++;
    timer = setTimeout(run, /[.,;:!?—]$/.test(t) ? 330 : 85);
  }
  function start() { started = true; btn.textContent = 'Reveal the whole letter'; btn.dataset.state = 'writing'; run(); }
  btn.addEventListener('click', () => {
    if (btn.dataset.state === 'done') { // replay
      clearTimeout(timer); words.forEach(w => w.classList.remove('on')); i = 0; start();
      card.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    } else finish();
  });
  if (reduced) { finish(); return; }
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting && !started) { o.disconnect(); setTimeout(start, 700); }
  }), { threshold: .3 }).observe(card);
})();

/* ───────────────────────  MEMORY CARDS  ─────────────────────── */
(function memories() {
  // night sky stars
  const sky = $('.stars-visual');
  for (let n = 0; n < 46; n++) {
    const s = document.createElement('i'), z = rand(1, 3);
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${z}px;height:${z}px;animation-delay:${-rand(0, 3)}s;animation-duration:${rand(2, 4.5)}s`;
    sky.appendChild(s);
  }
  $$('.memory').forEach(card => {
    card.addEventListener('click', () => {
      const open = card.getAttribute('aria-expanded') !== 'true';
      card.setAttribute('aria-expanded', open);
      $('.memory-hint', card).textContent = 'Tap to open';
      if (open && card.dataset.kind === 'stars' && !reduced) {
        const sh = document.createElement('i');
        sh.className = 'shooter'; sh.style.cssText = `left:${rand(0, 30)}%;top:${rand(4, 30)}%`;
        sky.appendChild(sh); setTimeout(() => sh.remove(), 1200);
      }
      if (open && card.dataset.kind === 'heart') {
        const r = card.getBoundingClientRect(); fx.hearts(r.left + r.width / 2, r.top + r.height * .6, 10, 50);
      }
      if (open && card.dataset.kind === 'kesha') {
        const r = card.getBoundingClientRect(); fx.confetti(r.left + r.width / 2, r.top + r.height / 2, 30, .7);
      }
    });
  });
})();

/* ───────────────────────  QUALITIES  ─────────────────────── */
(function qualities() {
  $$('.quality').forEach(card => {
    card.addEventListener('click', e => {
      card.classList.toggle('lit');
      if (reduced) return;
      const r = card.getBoundingClientRect();
      const cx = e.clientX ? e.clientX - r.left : r.width / 2, cy = e.clientY ? e.clientY - r.top : r.height / 2;
      for (let i = 0; i < 9; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle'; s.textContent = pick(['✦', '✧', '❖']);
        s.style.cssText = `left:${cx}px;top:${cy}px;--x:${rand(-80, 80)}px;--y:${rand(-70, 70)}px`;
        card.appendChild(s); setTimeout(() => s.remove(), 950);
      }
    });
  });
})();

/* ───────────────────────  LITERARY CORNER  ─────────────────────── */
(function literary() {
  // drifting ink motes
  if (!reduced) {
    const field = $('#inkField');
    for (let i = 0; i < (isSmall ? 10 : 20); i++) {
      const s = document.createElement('i'), z = rand(6, 20);
      s.className = 'ink';
      s.style.cssText = `left:${rand(0, 100)}%;width:${z}px;height:${z}px;animation-duration:${rand(14, 30)}s;animation-delay:${-rand(0, 30)}s`;
      field.appendChild(s);
    }
  }
  // verses
  const poem = $('#poem'); let vi = 0;
  function render(index) {
    poem.innerHTML = ''; let delay = 0;
    VERSES[index].forEach(stanza => {
      const d = document.createElement('div'); d.className = 'stanza';
      stanza.forEach(line => {
        const l = document.createElement('span'); l.className = 'ln'; l.textContent = line;
        l.style.animationDelay = (delay += reduced ? 0 : .45) + 's'; d.appendChild(l);
      });
      poem.appendChild(d);
    });
  }
  render(0);
  $('#nextVerse').addEventListener('click', () => { vi = (vi + 1) % VERSES.length; render(vi); });

  // royal dictionary
  const list = $('#dictList'), pop = $('#dictPop');
  DICTIONARY.forEach((d, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.textContent = '“' + d.old + '”'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      $$('button', list).forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      pop.hidden = false; pop.style.animation = 'none'; void pop.offsetWidth; pop.style.animation = '';
      pop.innerHTML = '<small>In modern tongue</small><span></span>';
      $('span', pop).textContent = d.modern;
    });
    li.appendChild(b); list.appendChild(li);
  });
})();

/* ───────────────────────  GIFTS  ─────────────────────── */
(function gifts() {
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  // One — the sealed wish
  const env = $('#wishEnv'), hint = $('#wishHint');
  env.addEventListener('click', () => {
    const open = env.classList.toggle('open');
    env.setAttribute('aria-expanded', open);
    hint.textContent = open ? 'Touch again to fold it away' : 'Break the seal';
    if (open) setTimeout(() => fx.hearts(...center(env), 12, 70), 500);
  });

  // Two — the cake
  const candles = $('#candles'), wish = $('#wishText'), relight = $('#relight'), cakeHint = $('#cakeHint');
  const total = 5; let out = 0;
  for (let i = 0; i < total; i++) {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'candle'; c.setAttribute('aria-label', `Blow out candle ${i + 1} of ${total}`);
    c.innerHTML = '<span class="flame"></span><span class="smoke"></span>';
    c.addEventListener('click', () => {
      if (c.classList.contains('out')) return;
      c.classList.add('out'); out++;
      if (out === total) {
        wish.hidden = false; cakeHint.classList.add('is-hidden'); relight.classList.remove('is-hidden');
        const [x, y] = center($('#cake')); fx.confetti(x, y - 40, 110, 1.15); fx.hearts(x, y, 10, 60);
      }
    });
    candles.appendChild(c);
  }
  relight.addEventListener('click', () => {
    $$('.candle', candles).forEach(c => c.classList.remove('out')); out = 0;
    wish.hidden = true; cakeHint.classList.remove('is-hidden'); relight.classList.add('is-hidden');
  });

  // Three — the jar of compliments
  const jar = $('#jar'), notePop = $('#notePop'), noteText = $('#noteText'), count = $('#noteCount');
  let deck = [], last = '', drawn = 0, hideT = 0;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  jar.addEventListener('click', () => {
    if (!deck.length) { deck = shuffle([...COMPLIMENTS]); if (deck[deck.length - 1] === last && deck.length > 1) deck.unshift(deck.pop()); }
    last = deck.pop(); drawn++;
    noteText.textContent = last;
    count.textContent = drawn === 1 ? '· 1 note drawn' : `· ${drawn} notes drawn`;
    notePop.classList.remove('show'); void notePop.offsetWidth; notePop.classList.add('show');
    jar.classList.remove('shake'); void jar.offsetWidth; jar.classList.add('shake');
    clearTimeout(hideT); hideT = setTimeout(() => notePop.classList.remove('show'), 4200);
    const [x, y] = center(jar); fx.hearts(x, y - 40, 4, 30);
  });
})();

/* ───────────────────────  GALLERY + LIGHTBOX  ─────────────────────── */
(function gallery() {
  const grid = $('#galleryGrid'), broken = new Set();
  if (!GALLERY.length) { grid.innerHTML = '<p class="lede">Photographs will appear here.</p>'; return; }

  GALLERY.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'g-item reveal'; b.style.setProperty('--ar', g.ratio || '4/5');
    b.setAttribute('aria-label', 'Open photograph: ' + (g.caption || g.alt));
    const img = document.createElement('img');
    img.src = g.src; img.alt = g.alt || ''; img.loading = 'lazy'; img.decoding = 'async';
    const cap = document.createElement('span'); cap.className = 'cap'; cap.textContent = g.caption || '';
    b.append(img, cap);
    guardImage(img, () => { broken.add(i); b.classList.add('broken'); b.setAttribute('aria-label', 'Photograph placeholder: add ' + g.src); });
    b.addEventListener('click', () => { if (!broken.has(i)) open(i); });
    grid.appendChild(b);
  });
  // reveal observer for freshly-created tiles
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('.g-item', grid).forEach((el, i) => { el.style.setProperty('--d', (i % 3) * .1 + 's'); io.observe(el); });

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCaption');
  let cur = 0, lastFocus = null;
  const valid = () => GALLERY.map((_, i) => i).filter(i => !broken.has(i));
  function show(i) {
    cur = i; const g = GALLERY[i];
    lbImg.src = g.src; lbImg.alt = g.alt || ''; lbCap.textContent = g.caption || '';
    const multi = valid().length > 1;
    $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
  }
  function open(i) {
    lastFocus = document.activeElement; show(i);
    lb.hidden = false; document.body.classList.add('modal-open'); $('#lbClose').focus();
  }
  function close() { lb.hidden = true; document.body.classList.remove('modal-open'); lastFocus?.focus(); }
  function move(d) { const v = valid(); show(v[(v.indexOf(cur) + d + v.length) % v.length]); }
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => move(-1));
  $('#lbNext').addEventListener('click', () => move(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('button:not([hidden])', lb), a = document.activeElement;
      if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // swipe on phones
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); });
})();

/* ───────────────────────  MUSIC PLAYER  ─────────────────────── */
(function player() {
  const root = $('#player'), audio = $('#audio'), fab = $('#playerFab'), panel = $('#playerPanel');
  const play = $('#pPlay'), seek = $('#pSeek'), vol = $('#pVol'), cur = $('#tCur'), dur = $('#tDur'), missing = $('#songMissing');
  audio.src = MUSIC.src; $('#songTitle').textContent = MUSIC.title;
  audio.volume = +vol.value;
  const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
  const fill = el => el.style.setProperty('--fill', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  fill(seek); fill(vol);

  fab.addEventListener('click', () => {
    const open = panel.hidden; panel.hidden = !open;
    fab.setAttribute('aria-expanded', open);
    if (open) play.focus({ preventScroll: true });
  });
  const setPlaying = on => { root.classList.toggle('playing', on); play.setAttribute('aria-label', on ? 'Pause' : 'Play'); };
  play.addEventListener('click', () => {
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => { missing.hidden = false; setPlaying(false); });
    } else audio.pause();
  });
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => { setPlaying(false); audio.currentTime = 0; });
  audio.addEventListener('error', () => { missing.hidden = false; setPlaying(false); });
  audio.addEventListener('loadedmetadata', () => { dur.textContent = fmt(audio.duration); missing.hidden = true; });
  audio.addEventListener('timeupdate', () => {
    cur.textContent = fmt(audio.currentTime);
    if (audio.duration) { seek.value = audio.currentTime / audio.duration * 100; fill(seek); }
  });
  seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = seek.value / 100 * audio.duration; fill(seek); });
  vol.addEventListener('input', () => { audio.volume = +vol.value; fill(vol); });
})();

/* ───────────────────────  FINAL CELEBRATION  ─────────────────────── */
(function finale() {
  starfield($('#finalSky'), isSmall ? 90 : 170);
  petals($('#finalPetals'), 16);
  const btn = $('#sparkle'), overlay = $('#celebrate'), close = $('#celebrateClose');
  let timers = [];
  function stop() {
    timers.forEach(clearInterval); timers = [];
    overlay.hidden = true; document.body.classList.remove('modal-open'); btn.focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => {
    overlay.hidden = false; document.body.classList.add('modal-open'); close.focus({ preventScroll: true });
    const burst = () => { fx.firework(); if (Math.random() < .5) setTimeout(fx.firework, 250); };
    burst();
    fx.confetti(innerWidth / 2, innerHeight * .4, 140, 1.4);
    timers.push(setInterval(burst, 750));
    timers.push(setInterval(() => fx.hearts(rand(0, innerWidth), innerHeight + 10, 3, 0), 420));
    timers.push(setInterval(() => fx.confetti(rand(0, innerWidth), -10, 30, .5), 2200));
  });
  close.addEventListener('click', stop);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) stop(); });
})();

/* ───────────────────────  CUSTOM CURSOR (desktop only)  ─────────────────────── */
(function cursor() {
  if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.documentElement.classList.add('has-cursor');
  const wrap = $('#cursor'), dot = $('.c-dot', wrap), ring = $('.c-ring', wrap);
  let x = -100, y = -100, rx = -100, ry = -100, lx = 0, ly = 0;
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    wrap.classList.toggle('hover', !!e.target.closest('a,button,input,[role=button]'));
    if (Math.hypot(x - lx, y - ly) > 70) { // a faint trail of gold sparkles
      lx = x; ly = y;
      const t = document.createElement('span'); t.className = 'trail'; t.textContent = '✦';
      t.style.left = x + 'px'; t.style.top = y + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 900);
    }
  }, { passive: true });
  (function loop() {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    requestAnimationFrame(loop);
  })();
})();
