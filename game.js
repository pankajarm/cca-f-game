/* ============================================================
   ARCHITECT'S ASCENT — game engine
   CCA-F trainer · June 2026 edition
   ============================================================ */
'use strict';

/* ---------------- floor & boss roster ---------------- */
const FLOORS = [
  { id: 'floor-01', name: 'The Loop Chamber', domain: 'D1', dcolor: 'var(--d1)',
    boss: { name: 'Loop Terminator', face: '🌀',
      taunt: "You said 'task complete' three turns ago. I stopped listening. Forever.",
      hurt: 'Wait— wait, check my stop_reason—',
      death: 'end_turn… so this is what it feels like…' } },
  { id: 'floor-02', name: 'Coordination Hall', domain: 'D1', dcolor: 'var(--d1)',
    boss: { name: 'The Rogue Swarm', face: '🐝',
      taunt: 'My subagents share everything! …They share nothing. Nobody told them anything.',
      hurt: 'Who gave the coordinator actual context?!',
      death: 'Should have… packed the prompt…' } },
  { id: 'floor-03', name: 'The Hook Forge', domain: 'D1', dcolor: 'var(--d1)',
    boss: { name: 'Prompt Whisperer', face: '🗣️',
      taunt: 'Have you tried asking NICELY? In ALL CAPS? Twice?',
      hurt: 'A hook?! That is deterministic! That is CHEATING!',
      death: 'Exit code 2… blocked… forever…' } },
  { id: 'floor-04', name: 'The Tool Armory', domain: 'D2', dcolor: 'var(--d2)',
    boss: { name: 'The Tool Hoarder', face: '🧰',
      taunt: 'Behold, my agent wields all EIGHTEEN tools! It cannot pick one, but STILL!',
      hurt: 'Four to five tools per role?! Minimalist propaganda!',
      death: 'Fine… take my seventeen spare hammers…' } },
  { id: 'floor-05', name: 'The Config Maze', domain: 'D3', dcolor: 'var(--d3)',
    boss: { name: 'Config Phantom', face: '👻',
      taunt: 'Your team standards are safe with me… in MY home directory. Unversioned. Forever.',
      hurt: 'No! Not the project-level CLAUDE.md!',
      death: 'Committed… to the repo… how orderly…' } },
  { id: 'floor-06', name: 'The Pipeline Forge', domain: 'D3', dcolor: 'var(--d3)',
    boss: { name: 'CI Gremlin', face: '🧌',
      taunt: 'Your pipeline has been waiting on stdin since Tuesday. I brought snacks.',
      hurt: 'The -p flag! My one weakness! Who told you?!',
      death: 'Exiting… with code… zero…' } },
  { id: 'floor-07', name: 'Prompt Workshop', domain: 'D4', dcolor: 'var(--d4)',
    boss: { name: 'Vague Instructor', face: '🎭',
      taunt: 'Just… be careful. Be conservative. Be, you know… good?',
      hurt: 'Explicit criteria?! But ambiguity is my whole personality!',
      death: 'So specific… so… measurable…' } },
  { id: 'floor-08', name: 'Validation Gauntlet', domain: 'D4', dcolor: 'var(--d4)',
    boss: { name: 'Self-Review Shadow', face: '🪞',
      taunt: 'I reviewed my own code. Ten out of ten. No notes. Flawless.',
      hurt: 'An INDEPENDENT session?! But it does not trust me!',
      death: 'The second opinion… it saw… everything…' } },
  { id: 'floor-09', name: 'The Memory Halls', domain: 'D5', dcolor: 'var(--d5)',
    boss: { name: 'Context Glutton', face: '🐡',
      taunt: 'FEED ME ALL FORTY FIELDS. EVERY TURN. SUMMARIZE NOTHING.',
      hurt: 'A case-facts block?! My precious $147.23 — preserved?!',
      death: 'So… trim… very trim…' } },
  { id: 'floor-10', name: 'Synthesis Chamber', domain: 'D5', dcolor: 'var(--d5)',
    boss: { name: 'The Accuracy Mirage', face: '🏜️',
      taunt: 'Ninety-seven percent accurate! Do NOT ask about the handwritten receipts.',
      hurt: 'Stratified sampling?! Stop segmenting my beautiful average!',
      death: 'Per-type… validation… the mirage… fades…' } },
];

const DOMAINS = {
  D1: { label: 'Agentic Architecture & Orchestration', weight: 27, color: 'var(--d1)', exam: 16 },
  D2: { label: 'Tool Design & MCP Integration',        weight: 18, color: 'var(--d2)', exam: 11 },
  D3: { label: 'Claude Code Configuration & Workflows', weight: 20, color: 'var(--d3)', exam: 12 },
  D4: { label: 'Prompt Engineering & Structured Output', weight: 20, color: 'var(--d4)', exam: 12 },
  D5: { label: 'Context Management & Reliability',     weight: 15, color: 'var(--d5)', exam: 9 },
};

const MONSTERS = {
  'Loop Terminator':      { face: '🌀', cry: '“The reply says it is done — halt everything!”', weak: 'Check stop_reason, never parse prose.' },
  'Iteration Cap Golem':  { face: '🗿', cry: '“max_iterations = 5. Problem solved.”', weak: 'Caps are safety nets, not loop control.' },
  'Prompt Whisperer':     { face: '🗣️', cry: '“Just add it to the system prompt! In bold!”', weak: 'Critical rules belong in deterministic hooks.' },
  'The Tool Hoarder':     { face: '🧰', cry: '“Give every agent every tool, for convenience!”', weak: '4–5 scoped tools per agent role.' },
  'Sentiment Siren':      { face: '🧜', cry: '“They sound angry — escalate! ESCALATE!”', weak: 'Sentiment ≠ complexity. Use explicit triggers.' },
  'Confidence Phantom':   { face: '🔮', cry: '“The model says it is 95% sure. Ship it.”', weak: 'Self-reported confidence is uncalibrated.' },
  'Context Glutton':      { face: '🐡', cry: '“Dump everything into context. All of it.”', weak: 'Trim outputs, isolate verbosity in subagents.' },
  'Self-Review Shadow':   { face: '🪞', cry: '“I checked my own work. Looks great to me!”', weak: 'Independent session without generation context.' },
  'Generic Error Ghost':  { face: '👤', cry: '“Operation failed. That is all you get.”', weak: 'errorCategory, isRetryable, partial results.' },
  'The Accuracy Mirage':  { face: '🏜️', cry: '“97% overall! What segment failures?”', weak: 'Validate per document type and field.' },
  'The Scope Creep':      { face: '🦑', cry: '“I decomposed the task! …Into the wrong pieces.”', weak: 'Partition scope to match full coverage.' },
  'Cache Vampire':        { face: '🦇', cry: '“Put the timestamp first in the prompt!”', weak: 'Stable prefix first — protect the cache.' },
};

const TITLES = [
  { xp: 0,     t: 'Apprentice' },
  { xp: 1500,  t: 'Loop Warden' },
  { xp: 4000,  t: 'Hook Smith' },
  { xp: 8000,  t: 'Config Architect' },
  { xp: 13000, t: 'Schema Sage' },
  { xp: 19000, t: 'Context Keeper' },
  { xp: 26000, t: 'Certified Architect' },
];

const ACHIEVEMENTS = [
  { id: 'first-blood',   ic: '🗡️', nm: 'First Blood',      ds: 'Clear your first floor' },
  { id: 'perfectionist', ic: '💎', nm: 'Perfectionist',    ds: 'Score 10/10 on any floor' },
  { id: 'combo-7',       ic: '🔥', nm: 'Heating Up',       ds: 'Reach a 7-answer combo' },
  { id: 'tower-master',  ic: '🗼', nm: 'Tower Master',     ds: 'Clear all 10 floors' },
  { id: 'flawless',      ic: '👑', nm: 'Flawless Ascent',  ds: 'Earn ★ on every floor' },
  { id: 'certified',     ic: '📜', nm: 'Certified',        ds: 'Pass The Proctor (720+)' },
  { id: 'beat-blogger',  ic: '✍️', nm: 'Beat the Blogger', ds: 'Score 900+ — the famous pass post was 893' },
  { id: 'lightning-15',  ic: '⚡', nm: 'Storm Caller',     ds: 'Score 15+ in one Lightning Round' },
  { id: 'monster-hunter',ic: '🔦', nm: 'Monster Hunter',   ds: 'Capture all 12 bestiary monsters' },
  { id: 'clinic-clear',  ic: '🩹', nm: 'Clean Bill',       ds: 'Empty a Mistake Clinic of 10+ cards' },
  { id: 'streak-7',      ic: '📅', nm: 'Habit Forming',    ds: '7-day study streak' },
  { id: 'streak-30',     ic: '🏔️', nm: 'Iron Will',        ds: '30-day study streak' },
  { id: 'scholar-100',   ic: '🎓', nm: 'Scholar',          ds: '100 correct answers, lifetime' },
  { id: 'night-shift',   ic: '🌙', nm: 'Night Shift',      ds: 'Study between midnight and 5am' },
];

const POWERUPS = {
  compact: { ic: '🗜️', nm: '/compact',          ds: 'Trim away two wrong options' },
  think:   { ic: '💭', nm: 'Extended Thinking', ds: 'Reveal a hint' },
  shield:  { ic: '🛡️', nm: 'Checkpoint',        ds: 'Your next miss is forgiven' },
};

/* ---------------- save state ---------------- */
const SAVE_KEY = 'architects-ascent-v2';

const Game = {
  s: null,

  fresh() {
    return {
      xp: 0, soundOn: true, theme: 'light',
      streak: { count: 0, last: null },
      floors: {}, powerups: { compact: 1, think: 1, shield: 1 },
      bestiary: [], achievements: [],
      deck: [], examBest: 0, examHistory: [], lightningBest: 0,
      totals: { answered: 0, correct: 0 },
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      this.s = raw ? Object.assign(this.fresh(), JSON.parse(raw)) : this.fresh();
    } catch (e) { this.s = this.fresh(); }
  },

  save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); } catch (e) {} },

  hardReset() {
    if (!confirm('Reset ALL progress — XP, floors, bestiary, exam history?')) return;
    this.s = this.fresh();
    this.save();
    UI.refreshHud(); UI.go('home');
    UI.toast('🗑️', 'Progress reset', 'The tower forgets you. For now.');
  },

  title() {
    let t = TITLES[0].t;
    for (const lv of TITLES) if (this.s.xp >= lv.xp) t = lv.t;
    return t;
  },

  nextTitle() {
    for (const lv of TITLES) if (this.s.xp < lv.xp) return lv;
    return null;
  },

  addXP(n) {
    const before = this.title();
    this.s.xp += n;
    const after = this.title();
    this.save();
    UI.refreshHud();
    if (after !== before) {
      UI.toast('🎖️', 'Title unlocked: ' + after, 'The tower acknowledges you.');
      Sound.win();
    }
  },

  touchStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const st = this.s.streak;
    if (st.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    st.count = (st.last === y.toISOString().slice(0, 10)) ? st.count + 1 : 1;
    st.last = today;
    this.save();
    UI.refreshHud();
    if (st.count >= 30) this.unlock('streak-30');
    else if (st.count >= 7) this.unlock('streak-7');
  },

  recordAnswer(ok) {
    this.touchStreak();
    this.s.totals.answered++;
    if (ok) this.s.totals.correct++;
    if (this.s.totals.correct >= 100) this.unlock('scholar-100');
    const h = new Date().getHours();
    if (h >= 0 && h < 5) this.unlock('night-shift');
    this.save();
  },

  unlock(id) {
    if (this.s.achievements.includes(id)) return;
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    this.s.achievements.push(id);
    this.save();
    UI.toast(a.ic, 'Achievement: ' + a.nm, a.ds);
    Sound.win();
  },

  grantPowerup() {
    const keys = Object.keys(POWERUPS);
    const k = keys[Math.floor(Math.random() * keys.length)];
    if (this.s.powerups[k] >= 9) return null;
    this.s.powerups[k]++;
    this.save();
    return k;
  },

  /* mistake deck — src bank + index; correct twice in a row discharges */
  deckAdd(src, idx) {
    if (!this.s.deck.some(c => c.src === src && c.idx === idx)) {
      this.s.deck.push({ src, idx, streak: 0 });
      this.save();
      UI.refreshHud();
    }
  },
};

/* ---------------- question access ---------------- */
const Bank = {
  floor(id) { return (window.BANK && window.BANK[id]) || []; },
  mixed() { return this.floor('exam-mix-1').concat(this.floor('exam-mix-2')); },
  hunt() { return this.floor('hunt'); },

  byRef(src, idx) {
    const b = this.floor(src);
    return b[idx] || null;
  },

  /* all floor questions of a domain, as refs */
  domainPool(d) {
    const pool = [];
    FLOORS.forEach(f => {
      if (f.domain === d) this.floor(f.id).forEach((q, i) => pool.push({ q, src: f.id, idx: i, domain: d }));
    });
    const dTag = d.toLowerCase();
    ['exam-mix-1', 'exam-mix-2'].forEach(src => {
      this.floor(src).forEach((q, i) => {
        if ((q.tags && q.tags[0] || '').toLowerCase() === dTag) pool.push({ q, src, idx: i, domain: d });
      });
    });
    return pool;
  },

  everything() {
    const all = [];
    FLOORS.forEach(f => this.floor(f.id).forEach((q, i) => all.push({ q, src: f.id, idx: i, domain: f.domain })));
    ['exam-mix-1', 'exam-mix-2'].forEach(src => this.floor(src).forEach((q, i) => {
      const d = ((q.tags && q.tags[0]) || 'd1').toUpperCase();
      all.push({ q, src, idx: i, domain: DOMAINS[d] ? d : 'D1' });
    }));
    return all;
  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* shuffle a question's options, remapping the correct index */
function dealQuestion(q) {
  const order = shuffle([0, 1, 2, 3]);
  return {
    q: q.q,
    options: order.map(i => q.options[i]),
    correct: order.indexOf(q.correct),
    explanation: q.explanation, hint: q.hint || '',
    difficulty: q.difficulty, tags: q.tags || [],
  };
}

/* ---------------- sound (WebAudio, gentle) ---------------- */
const Sound = {
  ctx: null,
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(freq, dur, delay = 0, type = 'triangle', vol = 0.06) {
    if (!Game.s.soundOn) return;
    this.ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + dur);
  },
  click() { this.tone(620, .06, 0, 'sine', .04); },
  good() { this.tone(523, .12); this.tone(784, .18, .09); },
  crit() { this.tone(523, .1); this.tone(659, .1, .07); this.tone(784, .1, .14); this.tone(1047, .22, .21); },
  bad() { this.tone(196, .25, 0, 'sawtooth', .045); this.tone(147, .3, .12, 'sawtooth', .04); },
  win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .22, i * .11)); },
  lose() { [392, 311, 233].forEach((f, i) => this.tone(f, .3, i * .18, 'sawtooth', .045)); },
  tick() { this.tone(880, .04, 0, 'sine', .03); },
};

/* ---------------- code-token renderer ---------------- */
const CODE_RX = new RegExp([
  '(?:~\\/)?\\.claude\\/[A-Za-z0-9_\\-.\\/*]+',
  '~\\/\\.claude\\.json', '\\.mcp\\.json',
  'claude -p\\b', 'claude-code-action',
  '\\$\\{[A-Z_][A-Z0-9_]*\\}',
  '--[a-z][a-z-]+\\b',
  '\\b[A-Za-z0-9_\\-]+\\.(?:md|json|tsx|ts|jsx|js|py|yaml|yml|mjs)\\b',
  '\\/(?:compact|memory|reload-skills|clear|resume|config|status|usage|plugin)\\b',
  '\\b(?:PreToolUse|PostToolUse|SessionStart|UserPromptSubmit|allowed-tools|argument-hint|cache_control|tool_choice|allowedTools|isRetryable|errorCategory|isError|custom_id|fork_session|max_iterations|max_tokens|stop_reason|end_turn|tool_use|tool_result|few_shot|Grep|Glob)\\b',
  '\\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\b',
  '"(?:auto|any|none)"',
].join('|'), 'g');

function fmt(text) {
  const esc = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(CODE_RX, m => '<code>' + m + '</code>');
}

/* ---------------- UI core ---------------- */
const UI = {
  current: 'title',

  go(name) {
    if (Exam.active && name !== 'exam' && name !== 'examresult') {
      if (!confirm('Abandon the exam in progress?')) return;
      Exam.abort();
    }
    if (name !== 'lightning') Lightning.stop();
    document.getElementById('overlay').classList.remove('show');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    this.current = name;
    window.scrollTo({ top: 0 });
    if (name === 'home') this.renderHome();
    if (name === 'tower') Tower.render();
    if (name === 'bestiary') this.renderBestiary();
    if (name === 'trophies') this.renderTrophies();
    Sound.click();
  },

  refreshHud() {
    const s = Game.s;
    document.getElementById('hud-title').textContent = Game.title();
    const next = Game.nextTitle();
    document.getElementById('hud-xp').textContent = s.xp.toLocaleString() + ' XP' + (next ? ' · next: ' + next.t + ' @ ' + next.xp.toLocaleString() : ' · MAX');
    const prev = [...TITLES].reverse().find(t => s.xp >= t.xp);
    const pct = next ? Math.min(100, ((s.xp - prev.xp) / (next.xp - prev.xp)) * 100) : 100;
    document.getElementById('hud-xpfill').style.width = pct + '%';
    document.getElementById('hud-streak').textContent = s.streak.count;
    document.getElementById('btn-sound').textContent = s.soundOn ? '🔊' : '🔇';
    document.getElementById('btn-theme').textContent = s.theme === 'light' ? '🌙' : '☀️';
    const deckN = s.deck.length;
    const db = document.getElementById('deck-badge'); if (db) db.textContent = deckN + (deckN === 1 ? ' card' : ' cards');
  },

  renderHome() {
    const s = Game.s;
    const cleared = FLOORS.filter(f => (s.floors[f.id] || {}).cleared).length;
    const acc = s.totals.answered ? Math.round((s.totals.correct / s.totals.answered) * 100) : 0;
    document.getElementById('hub-stats').innerHTML = [
      ['Floors cleared', cleared + '/10'],
      ['Best exam', s.examBest ? s.examBest + '/1000' : '—'],
      ['Accuracy', s.totals.answered ? acc + '%' : '—'],
      ['Lightning best', s.lightningBest || '—'],
      ['Monsters', s.bestiary.length + '/12'],
    ].map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    document.getElementById('tower-badge').textContent = cleared + '/10 floors';
    document.getElementById('beast-badge').textContent = s.bestiary.length + '/12';
    document.getElementById('trophy-badge').textContent = s.achievements.length;
    document.getElementById('exam-badge').textContent = s.examBest >= 720 ? 'PASSED ' + s.examBest : (cleared >= 10 ? 'ready' : 'always open');
    this.refreshHud();
  },

  renderBestiary() {
    const grid = document.getElementById('beast-grid');
    grid.innerHTML = Object.entries(MONSTERS).map(([name, m]) => {
      const got = Game.s.bestiary.includes(name);
      return `<div class="beast-card${got ? '' : ' locked'}">
        <div class="face">${m.face}</div>
        <h4>${got ? name : '???'}</h4>
        <div class="cry">${got ? m.cry : 'Undiscovered. Hunt it down.'}</div>
        <div class="weak">${got ? '✦ Weakness: ' + m.weak : '🔒 capture to reveal weakness'}</div>
      </div>`;
    }).join('');
  },

  renderTrophies() {
    document.getElementById('t-sub').textContent = Game.s.achievements.length + '/' + ACHIEVEMENTS.length + ' unlocked · title: ' + Game.title();
    document.getElementById('trophy-grid').innerHTML = ACHIEVEMENTS.map(a => {
      const got = Game.s.achievements.includes(a.id);
      return `<div class="trophy${got ? '' : ' locked'}"><div class="ic">${a.ic}</div><div><div class="nm">${a.nm}</div><div class="ds">${a.ds}</div></div></div>`;
    }).join('');
  },

  toast(ic, nm, sub) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="ic">${ic}</div><div><div>${nm}</div><div class="sub">${sub || ''}</div></div>`;
    document.getElementById('toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, 3600);
  },

  confetti() {
    const colors = ['#D97757', '#C2912E', '#4E8F83', '#5B7FA6', '#B0628F', '#4E8F5B'];
    for (let i = 0; i < 90; i++) {
      const b = document.createElement('div');
      b.className = 'confetti-bit';
      const sz = 6 + Math.random() * 8;
      b.style.cssText = `left:${Math.random() * 100}vw;width:${sz}px;height:${sz * (Math.random() > .5 ? 1 : 2.2)}px;background:${colors[i % colors.length]};border-radius:${Math.random() > .5 ? '50%' : '2px'};animation-duration:${2.2 + Math.random() * 2.5}s;animation-delay:${Math.random() * .6}s;`;
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 6000);
    }
  },

  /* shared answer renderer: returns array of button elements */
  renderAnswers(containerId, options, onPick) {
    const box = document.getElementById(containerId);
    box.innerHTML = '';
    return options.map((opt, i) => {
      const b = document.createElement('button');
      b.className = 'answer';
      b.innerHTML = `<span class="key">${i + 1}</span><span>${fmt(opt)}</span>`;
      b.onclick = () => onPick(i, b);
      box.appendChild(b);
      return b;
    });
  },

  modal(verdictOk, correctText, explanation, onNext, opts = {}) {
    const o = document.getElementById('overlay');
    const v = document.getElementById('m-verdict');
    v.textContent = opts.title || (verdictOk ? pick(['Correct!', 'Direct hit!', 'Critical insight!', 'Root cause: fixed.', 'The tower approves.']) : pick(['Not quite.', 'The boss counters!', 'A trap — and it worked.', 'That patch hides the root cause.']));
    v.className = 'verdict ' + (verdictOk ? 'good' : 'bad');
    document.getElementById('m-right').innerHTML = '✅ ' + fmt(correctText);
    document.getElementById('m-expl').innerHTML = fmt(explanation);
    const btn = document.getElementById('m-next');
    btn.textContent = opts.btn || 'Continue';
    btn.onclick = () => { o.classList.remove('show'); onNext && onNext(); };
    o.classList.add('show');
  },
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ---------------- tower ---------------- */
const Tower = {
  render() {
    const list = document.getElementById('floor-list');
    list.innerHTML = '';
    let prevCleared = true;
    const rows = [];
    FLOORS.forEach((f, i) => {
      const fs = Game.s.floors[f.id] || {};
      const unlocked = prevCleared;
      const next = unlocked && !fs.cleared;
      const row = document.createElement('div');
      row.className = 'floor-card' + (fs.cleared ? ' cleared' : '') + (next ? ' next-up' : '') + (!unlocked ? ' locked' : '');
      row.innerHTML = `
        <div class="floor-num" style="background:${f.dcolor}">F${i + 1}</div>
        <div class="floor-meta">
          <div class="name">${FLOORS[i].boss.face} ${f.name}</div>
          <div class="dom">${f.domain} · ${DOMAINS[f.domain].label} · boss: ${f.boss.name}</div>
        </div>
        <div class="floor-right">
          ${fs.best ? `<div class="score">${fs.best}/10${fs.best === 10 ? ' <span class="stars">★</span>' : ''}</div>` : ''}
          <div class="status">${!unlocked ? '🔒 clear the floor below' : fs.cleared ? 'cleared — fight again' : 'ENTER'}</div>
        </div>`;
      if (unlocked) row.onclick = () => Battle.start(i);
      rows.push(row);
      prevCleared = !!fs.cleared;
    });
    // final floor card (Proctor)
    const allClear = FLOORS.every(f => (Game.s.floors[f.id] || {}).cleared);
    const fin = document.createElement('div');
    fin.className = 'floor-card final';
    fin.innerHTML = `
      <div class="floor-num" style="background:var(--gold)">👁️</div>
      <div class="floor-meta">
        <div class="name">📋 THE PROCTOR</div>
        <div class="dom">ALL DOMAINS · 60 questions · 120 minutes · pass 720/1000</div>
      </div>
      <div class="floor-right">
        ${Game.s.examBest ? `<div class="score">${Game.s.examBest}/1000</div>` : ''}
        <div class="status">${allClear ? 'You are ready.' : 'open early, if you dare'}</div>
      </div>`;
    fin.onclick = () => UI.go('examintro');
    rows.push(fin);
    rows.forEach(r => list.appendChild(r));
  },
};

/* ---------------- battle ---------------- */
const Battle = {
  floorIdx: 0, queue: [], qi: 0, right: 0, wrong: 0, combo: 0, maxCombo: 0,
  shield: false, usedCompact: false, usedThink: false, qStart: 0, xpGained: 0,

  start(floorIdx) {
    const f = FLOORS[floorIdx];
    const bank = Bank.floor(f.id);
    if (bank.length < 5) { UI.toast('🚧', 'This floor is still being carved', 'Question bank missing.'); return; }
    this.floorIdx = floorIdx;
    this.queue = shuffle(bank.map((q, i) => ({ deal: dealQuestion(q), src: f.id, idx: i }))).slice(0, 10);
    this.qi = 0; this.right = 0; this.wrong = 0; this.combo = 0; this.maxCombo = 0;
    this.shield = false; this.xpGained = 0;

    document.getElementById('b-boss-name').textContent = f.boss.name + ' — ' + f.name;
    document.getElementById('b-player-name').textContent = Game.title();
    const sprite = document.getElementById('b-sprite');
    sprite.textContent = f.boss.face;
    sprite.className = 'boss-sprite';
    document.getElementById('b-speech').textContent = '“' + f.boss.taunt + '”';
    document.getElementById('b-boss-hp').style.width = '100%';
    UI.go('battle');
    this.renderPowerups();
    this.show();
  },

  hearts() { return Math.max(0, 3 - this.wrong); },

  show() {
    const item = this.queue[this.qi];
    const q = item.deal;
    this.usedCompact = false; this.usedThink = false;
    this.qStart = Date.now();
    document.getElementById('b-progress').textContent = `Q ${this.qi + 1}/${this.queue.length}`;
    document.getElementById('b-combo').textContent = this.combo >= 2 ? `🔥 combo ×${this.combo}` : '';
    document.getElementById('b-hearts').textContent = '❤️'.repeat(this.hearts()) + '🖤'.repeat(3 - this.hearts());
    document.getElementById('b-hint').className = 'hint-strip';
    document.getElementById('b-shield').className = 'shield-note' + (this.shield ? ' show' : '');
    document.getElementById('b-qtext').innerHTML = fmt(q.q);
    this.buttons = UI.renderAnswers('b-answers', q.options, (i) => this.answer(i));
    this.renderPowerups();
  },

  renderPowerups() {
    const bar = document.getElementById('b-powerups');
    bar.innerHTML = '';
    Object.entries(POWERUPS).forEach(([k, p]) => {
      const n = Game.s.powerups[k];
      const b = document.createElement('button');
      b.className = 'powerup';
      b.disabled = n <= 0 || (k === 'compact' && this.usedCompact) || (k === 'think' && this.usedThink) || (k === 'shield' && this.shield);
      b.innerHTML = `${p.ic} ${p.nm} <span class="cnt">${n}</span>`;
      b.title = p.ds;
      b.onclick = () => this.usePowerup(k);
      bar.appendChild(b);
    });
  },

  usePowerup(k) {
    if (Game.s.powerups[k] <= 0) return;
    const q = this.queue[this.qi].deal;
    if (k === 'compact') {
      if (this.usedCompact) return;
      this.usedCompact = true;
      const wrongs = shuffle([0, 1, 2, 3].filter(i => i !== q.correct)).slice(0, 2);
      wrongs.forEach(i => { this.buttons[i].classList.add('dim', 'disabled'); });
    }
    if (k === 'think') {
      if (this.usedThink) return;
      this.usedThink = true;
      const h = document.getElementById('b-hint');
      h.innerHTML = '💭 ' + fmt(q.hint || 'Trust the root cause, not the patch.');
      h.className = 'hint-strip show';
    }
    if (k === 'shield') {
      if (this.shield) return;
      this.shield = true;
      document.getElementById('b-shield').className = 'shield-note show';
    }
    Game.s.powerups[k]--;
    Game.save();
    Sound.click();
    this.renderPowerups();
  },

  answer(i) {
    const item = this.queue[this.qi];
    const q = item.deal;
    const ok = i === q.correct;
    const fast = (Date.now() - this.qStart) < 15000;
    this.buttons.forEach(b => b.classList.add('disabled'));
    this.buttons[q.correct].classList.add('correct');
    Game.recordAnswer(ok);

    const f = FLOORS[this.floorIdx];
    const sprite = document.getElementById('b-sprite');
    const speech = document.getElementById('b-speech');

    if (ok) {
      this.right++; this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      if (this.combo >= 7) Game.unlock('combo-7');
      const crit = this.combo >= 3;
      let xp = 15 + (crit ? 8 : 0) + (fast ? 5 : 0);
      this.xpGained += xp;
      Game.addXP(xp);
      if (this.combo > 0 && this.combo % 3 === 0) {
        const k = Game.grantPowerup();
        if (k) UI.toast(POWERUPS[k].ic, 'Power-up: ' + POWERUPS[k].nm, 'Earned with a ×' + this.combo + ' combo');
      }
      crit ? Sound.crit() : Sound.good();
      sprite.classList.remove('hit'); void sprite.offsetWidth; sprite.classList.add('hit');
      this.floatDamage(crit ? 'CRIT ' + (12 + this.combo) : '' + (10 + this.combo), crit);
      const hpLeft = Math.max(0, 100 - this.right * (100 / this.queue.length));
      document.getElementById('b-boss-hp').style.width = hpLeft + '%';
      if (hpLeft <= 40) speech.textContent = '“' + f.boss.hurt + '”';
    } else {
      this.buttons[i].classList.add('wrong');
      if (this.shield) {
        this.shield = false;
        document.getElementById('b-shield').className = 'shield-note';
        UI.toast('🛡️', 'Checkpoint absorbed the hit', 'No heart lost — but study the explanation.');
      } else {
        this.wrong++;
      }
      this.combo = 0;
      Game.deckAdd(item.src, item.idx);
      Sound.bad();
      speech.textContent = pick(['“Ha! A classic trap!”', '“Your prompt-based defenses amuse me.”', '“That one costs a heart.”', '“The distractor claims another victim!”']);
      document.getElementById('b-hearts').textContent = '❤️'.repeat(this.hearts()) + '🖤'.repeat(3 - this.hearts());
    }

    setTimeout(() => {
      UI.modal(ok, q.options[q.correct], q.explanation, () => this.next());
    }, ok ? 700 : 900);
  },

  floatDamage(text, crit) {
    const zone = document.querySelector('.boss-zone');
    const d = document.createElement('div');
    d.className = 'dmg-float' + (crit ? ' crit' : '');
    d.textContent = text;
    d.style.left = (38 + Math.random() * 24) + '%';
    d.style.top = '20px';
    zone.appendChild(d);
    setTimeout(() => d.remove(), 1000);
  },

  next() {
    if (this.wrong >= 4) return this.finish(false);
    this.qi++;
    if (this.qi >= this.queue.length) return this.finish(this.right >= 7);
    this.show();
  },

  finish(win) {
    const f = FLOORS[this.floorIdx];
    const fs = Game.s.floors[f.id] || { cleared: false, best: 0 };
    fs.best = Math.max(fs.best || 0, this.right);
    if (win) {
      fs.cleared = true;
      const sprite = document.getElementById('b-sprite');
      sprite.classList.add('dead');
      document.getElementById('b-speech').textContent = '“' + f.boss.death + '”';
    }
    Game.s.floors[f.id] = fs;
    Game.save();

    let bonus = 0;
    if (win) {
      bonus = 150;
      if (this.right === 10) { bonus += 400; Game.unlock('perfectionist'); }
      Game.unlock('first-blood');
      if (FLOORS.every(x => (Game.s.floors[x.id] || {}).cleared)) Game.unlock('tower-master');
      if (FLOORS.every(x => (Game.s.floors[x.id] || {}).best === 10)) Game.unlock('flawless');
      Game.addXP(bonus);
      this.xpGained += bonus;
    }

    setTimeout(() => {
      document.getElementById('r-emoji').textContent = win ? (this.right === 10 ? '👑' : '🏆') : '💀';
      const t = document.getElementById('r-title');
      t.textContent = win ? (this.right === 10 ? 'FLAWLESS!' : 'FLOOR CLEARED') : 'DEFEATED';
      t.className = win ? 'win' : 'lose';
      document.getElementById('r-sub').textContent = win
        ? `${f.boss.name} crumbles. ${this.floorIdx < 9 ? 'Floor ' + (this.floorIdx + 2) + ' unlocks above you.' : 'The Proctor awaits at the summit.'}`
        : `${f.boss.name} still holds ${f.name}. Read the explanations and strike again.`;
      document.getElementById('r-stats').innerHTML = [
        ['Score', this.right + '/' + this.queue.length],
        ['Best combo', '×' + this.maxCombo],
        ['XP earned', '+' + this.xpGained],
      ].map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
      document.getElementById('r-actions').innerHTML = '';
      const acts = document.getElementById('r-actions');
      const again = document.createElement('button');
      again.className = 'btn ghost'; again.textContent = win ? '↻ Fight again' : '⚔️ Rematch';
      again.onclick = () => Battle.start(this.floorIdx);
      const tower = document.createElement('button');
      tower.className = 'btn primary'; tower.style.marginLeft = '10px';
      tower.textContent = win ? '🗼 Climb on' : '🗼 Back to tower';
      tower.onclick = () => UI.go('tower');
      acts.append(again, tower);
      if (win) { Sound.win(); UI.confetti(); } else Sound.lose();
      UI.go('result');
    }, win ? 1100 : 400);
  },
};

/* ---------------- exam (The Proctor) ---------------- */
const Exam = {
  active: false, items: [], idx: 0, secs: 7200, timer: null,

  build() {
    const items = [];
    Object.keys(DOMAINS).forEach(d => {
      const pool = shuffle(Bank.domainPool(d));
      pool.slice(0, DOMAINS[d].exam).forEach(ref => {
        items.push({ ...ref, deal: dealQuestion(ref.q), sel: null, flag: false });
      });
    });
    return shuffle(items);
  },

  start() {
    this.items = this.build();
    if (this.items.length < 30) { UI.toast('🚧', 'Bank too small for a full exam', 'Generate questions first.'); return; }
    this.idx = 0; this.secs = 7200; this.active = true;
    UI.go('exam');
    this.renderGrid(); this.show();
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 1000);
  },

  abort() { this.active = false; clearInterval(this.timer); },

  tick() {
    this.secs--;
    const m = Math.floor(this.secs / 60), s = this.secs % 60;
    const t = document.getElementById('e-timer');
    t.textContent = m + ':' + String(s).padStart(2, '0');
    t.className = 't' + (this.secs <= 600 ? ' low' : '');
    if (this.secs === 600) UI.toast('⏳', '10 minutes remain', 'The Proctor taps the desk.');
    if (this.secs <= 0) { UI.toast('🛎️', 'Time!', 'Pencils down. Auto-submitting.'); this.submit(); }
  },

  show() {
    const it = this.items[this.idx];
    document.getElementById('e-qn').textContent = 'Question ' + (this.idx + 1) + ' of ' + this.items.length;
    const dt = document.getElementById('e-domain');
    dt.textContent = it.domain;
    dt.style.background = DOMAINS[it.domain].color;
    document.getElementById('e-flag').className = 'flag-btn' + (it.flag ? ' on' : '');
    document.getElementById('e-qtext').innerHTML = fmt(it.deal.q);
    const btns = UI.renderAnswers('e-answers', it.deal.options, (i) => {
      it.sel = i;
      btns.forEach((b, j) => { b.style.borderColor = j === i ? 'var(--accent)' : ''; b.style.background = j === i ? 'var(--accent-soft)' : ''; });
      this.renderGrid();
      Sound.click();
    });
    if (it.sel != null) { btns[it.sel].style.borderColor = 'var(--accent)'; btns[it.sel].style.background = 'var(--accent-soft)'; }
    document.getElementById('e-prev').disabled = this.idx === 0;
    document.getElementById('e-next').disabled = this.idx === this.items.length - 1;
  },

  nav(d) { this.idx = Math.max(0, Math.min(this.items.length - 1, this.idx + d)); this.show(); this.renderGrid(); },
  jump(i) { this.idx = i; this.show(); this.renderGrid(); },
  toggleFlag() { const it = this.items[this.idx]; it.flag = !it.flag; this.show(); this.renderGrid(); },

  renderGrid() {
    const g = document.getElementById('e-grid');
    g.innerHTML = '';
    this.items.forEach((it, i) => {
      const c = document.createElement('button');
      c.className = 'nav-cell' + (it.sel != null ? ' answered' : '') + (it.flag ? ' flagged' : '') + (i === this.idx ? ' current' : '');
      c.textContent = i + 1;
      c.onclick = () => this.jump(i);
      g.appendChild(c);
    });
  },

  confirmSubmit() {
    const un = this.items.filter(i => i.sel == null).length;
    const fl = this.items.filter(i => i.flag).length;
    if (!confirm(`Submit exam?\n\n${un ? '⚠️ ' + un + ' unanswered.' : 'All answered.'}${fl ? '\n🚩 ' + fl + ' still flagged.' : ''}`)) return;
    this.submit();
  },

  submit() {
    this.abort();
    let correct = 0;
    const perDomain = {};
    Object.keys(DOMAINS).forEach(d => perDomain[d] = { right: 0, total: 0 });
    this.items.forEach(it => {
      const ok = it.sel === it.deal.correct;
      perDomain[it.domain].total++;
      if (ok) { correct++; perDomain[it.domain].right++; }
      else Game.deckAdd(it.src, it.idx);
      Game.recordAnswer(ok);
    });
    const score = Math.round((correct / this.items.length) * 1000);
    const passed = score >= 720;
    Game.s.examBest = Math.max(Game.s.examBest, score);
    Game.s.examHistory.push({ score, correct, total: this.items.length, date: new Date().toISOString().slice(0, 10) });
    Game.save();

    let xp = correct * 5 + (passed ? 600 : 0) + (score >= 900 ? 600 : 0);
    Game.addXP(xp);
    if (passed) Game.unlock('certified');
    if (score >= 900) Game.unlock('beat-blogger');

    // render result
    document.getElementById('er-score').textContent = score;
    const arc = document.getElementById('er-arc');
    arc.style.stroke = passed ? 'var(--good)' : 'var(--bad)';
    setTimeout(() => { arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)'; arc.style.strokeDashoffset = 540 - (540 * score / 1000); }, 60);
    const banner = document.getElementById('er-banner');
    banner.textContent = passed ? (score >= 900 ? '🏅 CERTIFIED — with style (the famous blog post only hit 893)' : '📜 PASS — Claude Certified Architect material') : '❌ Below the 720 bar — the tower remembers, and so should you';
    banner.style.color = passed ? 'var(--good)' : 'var(--bad)';
    document.getElementById('er-sub').textContent = `${correct}/${this.items.length} correct · used ${Math.floor((7200 - this.secs) / 60)} of 120 minutes · +${xp} XP`;
    document.getElementById('er-bars').innerHTML = Object.entries(perDomain).map(([d, r]) => {
      const pct = r.total ? Math.round((r.right / r.total) * 100) : 0;
      return `<div class="dbar"><div class="row"><span>${d} · ${DOMAINS[d].label}</span><span>${r.right}/${r.total}</span></div>
        <div class="track"><div class="fill" style="width:${pct}%;background:${DOMAINS[d].color}"></div></div></div>`;
    }).join('');
    const acts = document.getElementById('er-actions');
    acts.innerHTML = '';
    const rev = document.createElement('button');
    rev.className = 'btn ghost'; rev.textContent = '🔍 Review all 60';
    rev.onclick = () => this.renderReview();
    const home = document.createElement('button');
    home.className = 'btn primary'; home.style.marginLeft = '10px'; home.textContent = '🏛️ Back to the hall';
    home.onclick = () => UI.go('home');
    acts.append(rev, home);
    document.getElementById('er-review').innerHTML = '';
    if (passed) { Sound.win(); UI.confetti(); } else Sound.lose();
    UI.go('examresult');
  },

  renderReview() {
    document.getElementById('er-review').innerHTML = this.items.map((it, n) => {
      const ok = it.sel === it.deal.correct;
      return `<div class="rev-item">
        <div class="q">${n + 1}. ${fmt(it.deal.q)}</div>
        <div class="row ${ok ? 'ok' : 'no'}">${ok ? '✔' : '✘'} you: ${it.sel != null ? fmt(it.deal.options[it.sel]) : '<em>no answer</em>'}</div>
        ${ok ? '' : `<div class="row ok">✔ correct: ${fmt(it.deal.options[it.deal.correct])}</div>`}
        <div class="ex">${fmt(it.deal.explanation)}</div>
      </div>`;
    }).join('');
  },
};

/* ---------------- lightning round ---------------- */
const Lightning = {
  running: false, score: 0, combo: 0, secs: 90, timer: null, pool: [], buttons: [],

  start() {
    const pool = Bank.everything();
    if (pool.length < 10) { UI.toast('🚧', 'Bank not loaded', 'Generate questions first.'); return; }
    this.pool = shuffle(pool);
    this.score = 0; this.combo = 0; this.secs = 90;
    UI.go('lightning');
    this.running = true;
    document.getElementById('l-best').textContent = Game.s.lightningBest ? 'best: ' + Game.s.lightningBest : 'first run — set the bar';
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 1000);
    this.show();
  },

  stop() { this.running = false; clearInterval(this.timer); },

  tick() {
    if (!this.running) return;
    this.secs--;
    document.getElementById('l-time').style.width = (this.secs / 90 * 100) + '%';
    if (this.secs <= 10 && this.secs > 0) Sound.tick();
    if (this.secs <= 0) this.finish();
  },

  show() {
    if (!this.pool.length) this.pool = shuffle(Bank.everything());
    const ref = this.pool.pop();
    this.cur = { deal: dealQuestion(ref.q), src: ref.src, idx: ref.idx };
    document.getElementById('l-score').textContent = this.score;
    document.getElementById('l-combo').textContent = this.combo >= 2 ? `🔥 ×${this.combo} combo — +${1 + Math.floor(this.combo / 3)} per hit` : '';
    document.getElementById('l-qtext').innerHTML = fmt(this.cur.deal.q);
    this.buttons = UI.renderAnswers('l-answers', this.cur.deal.options, (i) => this.answer(i));
  },

  answer(i) {
    if (!this.running) return;
    const q = this.cur.deal;
    const ok = i === q.correct;
    Game.recordAnswer(ok);
    this.buttons.forEach(b => b.classList.add('disabled'));
    if (ok) {
      this.combo++;
      this.score += 1 + Math.floor(this.combo / 3);
      this.buttons[i].classList.add('correct');
      this.combo >= 3 ? Sound.crit() : Sound.good();
    } else {
      this.combo = 0;
      this.buttons[i].classList.add('wrong');
      this.buttons[q.correct].classList.add('correct');
      Game.deckAdd(this.cur.src, this.cur.idx);
      Sound.bad();
    }
    setTimeout(() => this.running && this.show(), ok ? 350 : 900);
  },

  finish() {
    this.stop();
    const s = this.score;
    Game.s.lightningBest = Math.max(Game.s.lightningBest, s);
    Game.save();
    if (s >= 15) Game.unlock('lightning-15');
    const xp = s * 8;
    Game.addXP(xp);
    document.getElementById('r-emoji').textContent = s >= 15 ? '🌩️' : '⚡';
    const t = document.getElementById('r-title');
    t.textContent = 'TIME!'; t.className = s >= Game.s.lightningBest ? 'win' : 'win';
    document.getElementById('r-sub').textContent = s >= 15 ? 'The storm answers to you.' : 'Faster reading, faster ruling. Run it back.';
    document.getElementById('r-stats').innerHTML = [
      ['Score', s], ['Best', Game.s.lightningBest], ['XP earned', '+' + xp],
    ].map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    const acts = document.getElementById('r-actions');
    acts.innerHTML = '';
    const again = document.createElement('button');
    again.className = 'btn ghost'; again.textContent = '⚡ Again';
    again.onclick = () => Lightning.start();
    const home = document.createElement('button');
    home.className = 'btn primary'; home.style.marginLeft = '10px'; home.textContent = '🏛️ Hall';
    home.onclick = () => UI.go('home');
    acts.append(again, home);
    Sound.win();
    UI.go('result');
  },
};

/* ---------------- anti-pattern hunt ---------------- */
const Hunt = {
  queue: [], qi: 0, captured: 0,

  start() {
    const bank = Bank.hunt();
    if (!bank.length) { UI.toast('🚧', 'The hunting grounds are empty', 'Generate questions first.'); return; }
    this.queue = shuffle(bank.map((q, i) => ({ deal: dealQuestion(q), src: 'hunt', idx: i })));
    this.qi = 0; this.captured = 0;
    UI.go('hunt');
    this.show();
  },

  show() {
    const it = this.queue[this.qi];
    document.getElementById('h-progress').textContent = `vignette ${this.qi + 1}/${this.queue.length} · ${Game.s.bestiary.length}/12 captured all-time`;
    document.getElementById('h-qtext').innerHTML = '🔦 ' + fmt(it.deal.q) + '<br><br><strong>Which monster is lurking?</strong>';
    this.buttons = UI.renderAnswers('h-answers', it.deal.options, (i) => this.answer(i));
  },

  answer(i) {
    const it = this.queue[this.qi];
    const q = it.deal;
    const ok = i === q.correct;
    Game.recordAnswer(ok);
    this.buttons.forEach(b => b.classList.add('disabled'));
    this.buttons[q.correct].classList.add('correct');
    if (!ok) this.buttons[i].classList.add('wrong');

    const monster = q.options[q.correct];
    if (ok) {
      this.captured++;
      Game.addXP(25);
      if (!Game.s.bestiary.includes(monster) && MONSTERS[monster]) {
        Game.s.bestiary.push(monster);
        Game.save();
        UI.toast(MONSTERS[monster].face, monster + ' captured!', 'Added to the bestiary.');
        if (Game.s.bestiary.length >= 12) Game.unlock('monster-hunter');
      }
      Sound.good();
    } else {
      Game.deckAdd(it.src, it.idx);
      Sound.bad();
    }

    setTimeout(() => {
      UI.modal(ok, monster + (MONSTERS[monster] ? ' ' + MONSTERS[monster].face : ''), q.explanation, () => this.next(), { btn: this.qi + 1 >= this.queue.length ? 'Finish hunt' : 'Next vignette' });
    }, 800);
  },

  next() {
    this.qi++;
    if (this.qi >= this.queue.length) {
      UI.toast('🔦', 'Hunt complete', this.captured + '/' + this.queue.length + ' identified');
      UI.go('bestiary');
      return;
    }
    this.show();
  },
};

/* ---------------- mistake clinic ---------------- */
const Review = {
  session: [], qi: 0, buttons: [], hadTen: false,

  start() {
    UI.go('review');
    this.render();
  },

  render() {
    const body = document.getElementById('rv-body');
    const deck = Game.s.deck;
    document.getElementById('rv-progress').textContent = deck.length + ' in the ward';
    if (!deck.length) {
      body.innerHTML = `<div class="deck-empty"><div class="big">🌿</div><p><strong>The clinic is empty.</strong></p><p>No outstanding mistakes. Go make some interesting new ones.</p></div>`;
      return;
    }
    this.hadTen = this.hadTen || deck.length >= 10;
    body.innerHTML = `
      <div class="exam-rules">
        <p><strong>${deck.length}</strong> missed question${deck.length === 1 ? '' : 's'} awaiting treatment. Answer one correctly <strong>twice in a row</strong> and it is discharged for good.</p>
        <div class="center mt"><button class="btn primary" id="rv-start">🩹 Treat ${Math.min(10, deck.length)} cards</button></div>
      </div>
      <div class="battle-stage mt" id="rv-stage" style="display:none">
        <div class="q-zone">
          <div class="q-progress" id="rv-count" style="text-align:left;margin-bottom:8px"></div>
          <div class="q-text" id="rv-qtext"></div>
          <div class="answers" id="rv-answers"></div>
        </div>
      </div>`;
    document.getElementById('rv-start').onclick = () => this.begin();
  },

  begin() {
    this.session = shuffle([...Game.s.deck]).slice(0, 10);
    this.qi = 0;
    document.getElementById('rv-stage').style.display = 'block';
    this.show();
  },

  show() {
    const card = this.session[this.qi];
    const q = Bank.byRef(card.src, card.idx);
    if (!q) { this.next(); return; }
    this.cur = dealQuestion(q);
    document.getElementById('rv-count').textContent = `card ${this.qi + 1}/${this.session.length} · streak ${card.streak}/2`;
    document.getElementById('rv-qtext').innerHTML = fmt(this.cur.q);
    this.buttons = UI.renderAnswers('rv-answers', this.cur.options, (i) => this.answer(i));
    document.getElementById('rv-stage').scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  answer(i) {
    const card = this.session[this.qi];
    const ok = i === this.cur.correct;
    Game.recordAnswer(ok);
    this.buttons.forEach(b => b.classList.add('disabled'));
    this.buttons[this.cur.correct].classList.add('correct');
    if (!ok) this.buttons[i].classList.add('wrong');

    const real = Game.s.deck.find(c => c.src === card.src && c.idx === card.idx);
    let discharged = false;
    if (real) {
      if (ok) {
        real.streak = (real.streak || 0) + 1;
        if (real.streak >= 2) {
          Game.s.deck = Game.s.deck.filter(c => c !== real);
          discharged = true;
        }
      } else real.streak = 0;
      Game.save();
    }
    if (ok) { Game.addXP(10); Sound.good(); } else Sound.bad();
    if (discharged) UI.toast('🌿', 'Discharged!', 'That mistake will not haunt the exam.');
    if (!Game.s.deck.length && this.hadTen) Game.unlock('clinic-clear');

    setTimeout(() => {
      UI.modal(ok, this.cur.options[this.cur.correct], this.cur.explanation, () => this.next(), { btn: this.qi + 1 >= this.session.length ? 'Finish round' : 'Next card' });
    }, 800);
  },

  next() {
    this.qi++;
    if (this.qi >= this.session.length) { this.render(); return; }
    this.show();
  },
};

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('overlay');
  if (overlay.classList.contains('show')) {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('m-next').click(); }
    return;
  }
  if (e.key >= '1' && e.key <= '4') {
    const map = { battle: 'b-answers', lightning: 'l-answers', hunt: 'h-answers', exam: 'e-answers', review: 'rv-answers' };
    const id = map[UI.current];
    if (!id) return;
    const btns = document.querySelectorAll('#' + id + ' .answer:not(.disabled)');
    const all = document.querySelectorAll('#' + id + ' .answer');
    const target = all[Number(e.key) - 1];
    if (target && !target.classList.contains('disabled') && btns.length) target.click();
  }
});

/* ---------------- boot ---------------- */
Game.load();
document.documentElement.dataset.theme = Game.s.theme;
document.getElementById('btn-theme').onclick = () => {
  Game.s.theme = Game.s.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = Game.s.theme;
  Game.save(); UI.refreshHud(); Sound.click();
};
document.getElementById('btn-sound').onclick = () => {
  Game.s.soundOn = !Game.s.soundOn;
  Game.save(); UI.refreshHud();
  if (Game.s.soundOn) Sound.good();
};
UI.refreshHud();
