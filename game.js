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
const SCHEMA = 3;

const Game = {
  s: null,

  fresh() {
    return {
      xp: 0, soundOn: true, theme: 'light',
      streak: { count: 0, last: null },
      floors: {}, powerups: { compact: 1, think: 1, shield: 1 },
      bestiary: [], achievements: [],
      deck: [], examBest: 0, legacyExamBest: 0, examHistory: [], lightningBest: 0,
      totals: { answered: 0, correct: 0 },
      qstats: {}, schemaVersion: SCHEMA,
    };
  },

  load() {
    let raw = null, saved = null;
    try {
      raw = localStorage.getItem(SAVE_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch (e) { saved = null; }
    this.s = Object.assign(this.fresh(), saved || {});
    if (saved && (saved.schemaVersion || 2) < SCHEMA) this.migrate(raw);
  },

  /* v2 -> v3: clinic cards {src, idx} become {id}; Proctor scores move to legacyExamBest */
  migrate(raw) {
    try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {}
    this.s.deck = this.s.deck.map(c => {
      if (c.id) return c;
      const q = Bank.byRef(c.src, c.idx);
      return q && q.id ? { id: q.id, streak: c.streak || 0 } : c;
    });
    this.s.legacyExamBest = this.s.examBest || 0;
    this.s.examBest = 0;
    this.s.examHistory = this.s.examHistory.map(h => h.mode ? h : { ...h, mode: 'proctor' });
    this.s.schemaVersion = SCHEMA;
    this.save();
  },

  save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); } catch (e) {} },

  hardReset() {
    if (!confirm('Reset ALL progress — XP, floors, bestiary, exam history?')) return;
    this.s = this.fresh();
    this.save();
    const live = Exam.saved();
    Exam.suspend(); if (live) Exam.endSaved('reset', live.attemptId);
    Exam.items = []; Exam.submitted = false;
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

  recordAnswer(ok, id) {
    this.touchStreak();
    this.s.totals.answered++;
    if (ok) this.s.totals.correct++;
    if (id) {
      const st = this.s.qstats[id] || (this.s.qstats[id] = { seen: 0, right: 0, last: 0, at: 0 });
      st.seen++; if (ok) st.right++;
      st.last = ok ? 1 : 0; st.at = Date.now();
    }
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

  /* mistake deck — stable question ids; correct twice in a row discharges */
  deckAdd(id) {
    if (id && !this.s.deck.some(c => c.id === id)) {
      this.s.deck.push({ id, streak: 0 });
      this.save();
      UI.refreshHud();
    }
  },
};

/* ---------------- question access ---------------- */
const Bank = {
  _byId: null,

  floor(id) { return (window.BANK && window.BANK[id]) || []; },
  hunt() { return this.floor('hunt'); },

  /* legacy position lookup, used only by the v2 save migration */
  byRef(src, idx) { return this.floor(src)[idx] || null; },

  byId(id) {
    if (!this._byId) {
      this._byId = {};
      Object.values(window.BANK || {}).forEach(qs => qs.forEach(q => { if (q.id) this._byId[q.id] = q; }));
    }
    return this._byId[id] || null;
  },

  /* domain comes from the exam-guide task statement */
  domainOf(q) { return q.ts ? 'D' + q.ts[0] : 'D1'; },

  /* every non-hunt question, as refs { q, id, domain } */
  everything() {
    const all = [];
    Object.entries(window.BANK || {}).forEach(([key, qs]) => {
      if (key === 'hunt') return;
      qs.forEach(q => all.push({ q, id: q.id, domain: this.domainOf(q) }));
    });
    return all;
  },

  /* what the exam guide says is testable: no hunt, no out-of-scope items */
  inScope() { return this.everything().filter(r => !r.q.oos); },

  /* fingerprint of the in-scope pool, so a saved exam can tell the bank changed */
  hash() {
    const ids = this.inScope().map(r => r.id).join(',');
    let h = 0;
    for (let i = 0; i < ids.length; i++) h = (h * 31 + ids.charCodeAt(i)) | 0;
    return String(h);
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

/* shuffle a question's options (or replay a saved order), remapping the correct index */
function dealQuestion(q, order) {
  order = order || shuffle([0, 1, 2, 3]);
  return {
    id: q.id, order, ts: q.ts, scenario: q.scenario,
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
      if (Exam.variant === 'practice') {
        if (!confirm('Leave the practice exam? It will not be scored.')) return;
        Exam.abort();
      } else {
        Exam.suspend(); Exam.armExpiry();
        UI.toast('⏳', 'Mock exam still running', 'The clock keeps going, like the real exam. Resume from the Proctor card.');
      }
    }
    if (EXAM_SETTLE_ON.has(name) && Exam.settleExpired()) return;
    if (name !== 'lightning') Lightning.stop();
    document.getElementById('overlay').classList.remove('show');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    this.current = name;
    window.scrollTo({ top: 0 });
    if (name === 'home') this.renderHome();
    if (name === 'tower') Tower.render();
    if (name === 'blueprint') Blueprint.render();
    if (name === 'examintro') this.renderExamIntro();
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
      ['Best mock', s.examBest ? s.examBest + '/1000' : (s.legacyExamBest ? s.legacyExamBest + ' (old)' : '—')],
      ['Accuracy', s.totals.answered ? acc + '%' : '—'],
      ['Lightning best', s.lightningBest || '—'],
      ['Monsters', s.bestiary.length + '/12'],
    ].map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    document.getElementById('tower-badge').textContent = cleared + '/10 floors';
    document.getElementById('beast-badge').textContent = s.bestiary.length + '/12';
    document.getElementById('trophy-badge').textContent = s.achievements.length;
    const live = Exam.saved();
    document.getElementById('exam-badge').textContent = live ? '⏳ in progress · ' + clock(Math.max(0, Math.ceil((live.deadline - Date.now()) / 1000))) + ' left'
      : s.examBest >= 720 ? 'best ' + s.examBest : (cleared >= 10 ? 'ready' : 'always open');
    const bpSt = Blueprint.stats(Bank.inScope());
    document.getElementById('bp-badge').textContent = bpSt.seen + '/' + bpSt.total + ' seen';
    this.refreshHud();
  },

  renderExamIntro() {
    const live = Exam.saved();
    const box = document.getElementById('ei-resume');
    if (live) {
      const left = Math.max(0, Math.ceil((live.deadline - Date.now()) / 1000));
      const answered = live.items.filter(i => i.sel != null).length;
      box.innerHTML = `<p><strong>⏳ You have a mock exam in progress</strong>: ${answered}/${live.items.length} answered, ${clock(left)} left on the clock.</p>
        <button class="btn primary" onclick="Exam.resume()">▶ Resume mock exam</button>`;
      box.style.display = 'block';
    } else box.style.display = 'none';
    const hist = Game.s.examHistory.slice(-5).reverse();
    document.getElementById('ei-history').innerHTML = hist.length ? '<h4>Recent attempts</h4>' + hist.map(h =>
      `<div class="hist-row"><span>${h.date} · ${h.mode === 'practice' ? 'Practice' : h.mode === 'proctor' ? 'Proctor (old)' : 'Mock'}</span><span>${h.correct}/${h.total}${h.mode === 'proctor' ? '' : ' · est. ' + h.score}</span></div>`).join('') : '';
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
      b.onclick = () => { if (!b.classList.contains('disabled')) onPick(i, b); };
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
    this.queue = shuffle(bank.map(q => ({ deal: dealQuestion(q) }))).slice(0, 10);
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
    Game.recordAnswer(ok, q.id);

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
      Game.deckAdd(q.id);
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

/* ---------------- exam (The Proctor: mock + practice) ---------------- */
const EXAM_KEY = 'aa-exam-attempt';
const EXAM_SECS = 7200, PACE_SECS = 120;
/* screens where a mock that ran out of time while away can be scored without interrupting anything */
const EXAM_SETTLE_ON = new Set(['home', 'examintro', 'blueprint', 'tower', 'trophies', 'bestiary']);

/* estimated scaled score — real equating is unpublished, so anchor 72% raw at the 720 cut */
function scaledScore(pct) {
  return Math.round(pct <= 0.72 ? 100 + 620 * pct / 0.72 : 720 + 280 * (pct - 0.72) / 0.28);
}

function clock(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return m + ':' + String(s).padStart(2, '0');
}

const Exam = {
  active: false, variant: 'mock', items: [], idx: 0, timer: null,
  startedAt: 0, deadline: 0, attemptId: '', scenarios: [], submitted: false, warned: false, qStart: 0, away: null,

  /* 4 of 6 scenarios, rejecting draws that leave a domain with no primary scenario */
  drawScenarios() {
    for (let t = 0; t < 50; t++) {
      const four = shuffle(GUIDE.scenarios).slice(0, 4);
      const doms = new Set(four.flatMap(sc => sc.domains));
      if (Object.keys(DOMAINS).every(d => doms.has(d))) return four.map(sc => sc.id);
    }
    return [1, 3, 5, 6];
  },

  /* blueprint quotas first; within a domain prefer drawn scenarios, then least recently seen */
  build(scenarios) {
    const qs = Game.s.qstats, drawn = new Set(scenarios), picked = [];
    const pool = Bank.inScope();
    Object.entries(DOMAINS).forEach(([d, meta]) => {
      const cand = shuffle(pool.filter(r => r.domain === d));
      cand.sort((a, b) => (drawn.has(a.q.scenario) ? 0 : 1) - (drawn.has(b.q.scenario) ? 0 : 1)
        || ((qs[a.id] || {}).at || 0) - ((qs[b.id] || {}).at || 0));
      picked.push(...cand.slice(0, meta.exam));
    });
    const blocks = scenarios.map(sid => shuffle(picked.filter(r => r.q.scenario === sid)));
    blocks.push(shuffle(picked.filter(r => !drawn.has(r.q.scenario))));
    return blocks.flat().map(r => this.item(r.q, null, {
      scenario: drawn.has(r.q.scenario) ? r.q.scenario : 0,
      seenBefore: !!(qs[r.id] && qs[r.id].seen),
    }));
  },

  item(q, order, extra) {
    return { id: q.id, domain: Bank.domainOf(q), deal: dealQuestion(q, order), sel: null, flag: false, scenario: 0, seenBefore: false, ...extra };
  },

  /* ---- persistence (strict mock only) ---- */
  stored() {
    try { const r = JSON.parse(localStorage.getItem(EXAM_KEY)); return r && r.v === 1 ? r : null; }
    catch (e) { return null; }
  },
  saved() { const r = this.stored(); return r && r.status === 'live' ? r : null; },
  clearSaved() { try { localStorage.removeItem(EXAM_KEY); } catch (e) {} },
  /* a finished attempt leaves a marker so another tab can't write it back as live */
  endSaved(status, attemptId = this.attemptId) { try { localStorage.setItem(EXAM_KEY, JSON.stringify({ v: 1, status, attemptId })); } catch (e) {} },
  /* true when another tab submitted, reset or replaced this attempt */
  takenOver() { const r = this.stored(); return !!r && (r.attemptId !== this.attemptId || r.status !== 'live'); },
  persist() {
    if (this.variant !== 'mock' || this.submitted) return;
    if (this.takenOver()) return this.detach();
    const rec = {
      v: 1, status: 'live', attemptId: this.attemptId, bankHash: Bank.hash(),
      startedAt: this.startedAt, deadline: this.deadline, idx: this.idx, scenarios: this.scenarios,
      items: this.items.map(it => ({ id: it.id, o: it.deal.order, sel: it.sel, flag: it.flag, sc: it.scenario, seen: it.seenBefore })),
    };
    try { localStorage.setItem(EXAM_KEY, JSON.stringify(rec)); } catch (e) {}
  },
  restore(rec) {
    if (rec.bankHash !== Bank.hash()) return false;
    const items = [];
    for (const s of rec.items) {
      const q = Bank.byId(s.id);
      if (!q) return false;
      items.push(this.item(q, s.o, { sel: s.sel, flag: !!s.flag, scenario: s.sc, seenBefore: !!s.seen }));
    }
    Object.assign(this, { variant: 'mock', items, idx: rec.idx || 0, startedAt: rec.startedAt, deadline: rec.deadline,
      attemptId: rec.attemptId, scenarios: rec.scenarios, submitted: false, warned: false });
    return true;
  },

  /* on boot: void a stale attempt, or finish one whose clock ran out while away */
  checkSaved() {
    const rec = this.saved();
    if (!rec) return;
    if (!this.restore(rec)) {
      this.clearSaved();
      UI.toast('🗑️', 'Saved mock exam voided', 'The question bank changed since it started.');
      return;
    }
    if (Date.now() >= this.deadline) {
      UI.toast('🛎️', 'Time ran out while you were away', 'Your mock exam was submitted with the answers you saved.');
      this.submit('expired');
    } else this.armExpiry();
  },

  /* a suspended mock whose clock ran out while the user was elsewhere in the app: score it once */
  settleExpired() {
    const rec = this.saved();
    if (this.active || !rec || Date.now() < rec.deadline) return false;
    if (!this.restore(rec)) { this.clearSaved(); return false; }
    UI.toast('🛎️', 'Your mock exam ran out of time', 'It was submitted with the answers you saved.');
    this.submit('expired');
    return true;
  },

  /* while suspended, score the mock at its deadline (or at the next calm screen) */
  armExpiry() {
    clearTimeout(this.away);
    const rec = this.saved();
    if (!rec) return;
    this.away = setTimeout(() => {
      const cur = this.saved();
      if (!cur) return;
      if (Date.now() < cur.deadline) return this.armExpiry();
      if (document.visibilityState !== 'visible') return; // scored when this tab is next shown or navigated
      if (EXAM_SETTLE_ON.has(UI.current)) this.settleExpired();
      else UI.toast('🛎️', 'Mock exam time is up', 'Your result opens when you leave this screen.');
    }, Math.max(0, rec.deadline - Date.now()) + 250);
  },

  /* another tab ended or replaced this attempt: stop here without scoring it twice */
  detach() {
    this.submitted = true; this.suspend();
    UI.toast('⚠️', 'This mock exam ended in another tab', 'It was submitted or replaced there, so this tab stopped.');
    UI.go('examintro');
  },

  /* ---- lifecycle ---- */
  start(variant) {
    if (this.settleExpired()) return;
    if (this.saved() && !confirm('Abandon the mock exam you have in progress? It will not be scored.')) return;
    this.clearSaved();
    const scenarios = this.drawScenarios();
    const items = this.build(scenarios);
    if (items.length < 60) { UI.toast('🚧', 'Bank too small for a full exam', items.length + ' eligible questions.'); return; }
    const now = Date.now();
    Object.assign(this, { variant, items, scenarios, idx: 0, startedAt: now, deadline: now + EXAM_SECS * 1000,
      attemptId: String(now), submitted: false, warned: false });
    this.persist();
    this.enter();
  },

  resume() {
    const rec = this.saved();
    if (!rec || !this.restore(rec)) { this.clearSaved(); UI.toast('🗑️', 'Nothing to resume', 'That attempt is gone or the bank changed.'); UI.go('examintro'); return; }
    if (Date.now() >= this.deadline) { this.submit('expired'); return; }
    this.enter();
  },

  enter() {
    this.active = true;
    UI.go('exam');
    document.getElementById('screen-exam').classList.toggle('practice', this.variant === 'practice');
    document.getElementById('e-mode').textContent = this.variant === 'mock' ? 'Mock exam · no feedback until you submit' : 'Practice exam · feedback after each question';
    this.renderGrid(); this.show();
    clearInterval(this.timer); clearTimeout(this.away);
    this.timer = setInterval(() => this.tick(), 1000);
    this.tick();
  },

  /* leaving the screen: the mock clock keeps running (it lives in the saved deadline) */
  suspend() { this.active = false; clearInterval(this.timer); clearTimeout(this.away); },
  abort() { this.suspend(); if (this.variant === 'mock') this.endSaved('abandoned'); },

  remaining() { return Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000)); },
  elapsed() {
    if (this.variant !== 'mock') return Math.max(0, Math.round((Date.now() - this.startedAt) / 1000));
    return Math.max(0, Math.min(EXAM_SECS, Math.round((Math.min(Date.now(), this.deadline) - this.startedAt) / 1000)));
  },

  tick() {
    if (!this.active) return;
    const t = document.getElementById('e-timer');
    if (this.variant === 'mock') {
      const left = this.remaining();
      t.textContent = clock(left);
      t.className = 't' + (left <= 600 ? ' low' : '');
      document.getElementById('e-timer-lbl').textContent = 'remaining';
      if (!this.warned && left <= 600 && left > 0) { this.warned = true; UI.toast('⏳', '10 minutes remain', 'The Proctor taps the desk.'); }
      if (left <= 0) { UI.toast('🛎️', 'Time!', 'Pencils down. Auto-submitting.'); this.submit('timeout'); return; }
    } else {
      t.textContent = clock(this.elapsed()); t.className = 't';
      document.getElementById('e-timer-lbl').textContent = 'elapsed';
      const it = this.items[this.idx], q = document.getElementById('e-qclock');
      if (it.sel == null) {
        const spent = Math.round((Date.now() - this.qStart) / 1000);
        q.textContent = '⏱ ' + clock(Math.abs(PACE_SECS - spent)) + (spent > PACE_SECS ? ' over' : ' left');
        q.className = 'qclock' + (spent > PACE_SECS ? ' over' : '');
      }
    }
    this.renderPace();
  },

  renderPace() {
    const answered = this.items.filter(i => i.sel != null).length;
    const diff = Math.round((answered * PACE_SECS - this.elapsed()) / 60);
    const pace = Math.abs(diff) < 2 ? 'on pace' : diff > 0 ? diff + ' min ahead' : -diff + ' min behind';
    const el = document.getElementById('e-pace');
    el.textContent = `${answered}/${this.items.length} answered · ${pace}`;
    el.className = 'pace' + (diff <= -5 ? ' behind' : '');
  },

  show() {
    const it = this.items[this.idx], practice = this.variant === 'practice';
    const prev = this.items[this.idx - 1];
    document.getElementById('e-qn').textContent = 'Question ' + (this.idx + 1) + ' of ' + this.items.length;
    const dt = document.getElementById('e-domain');
    dt.textContent = it.domain + ' · ' + it.deal.ts;
    dt.style.background = DOMAINS[it.domain].color;
    const sc = GUIDE.scenarios.find(x => x.id === it.scenario);
    document.getElementById('e-scen').textContent = sc ? 'Scenario: ' + sc.name : 'General';
    const box = document.getElementById('e-scenbox');
    const blockStart = !prev || prev.scenario !== it.scenario;
    box.innerHTML = blockStart ? (sc ? `<strong>${sc.name}.</strong> ${sc.blurb}` : '<strong>General questions.</strong> Items that don\'t belong to one of this exam\'s four scenarios.') : '';
    box.style.display = blockStart ? 'block' : 'none';
    document.getElementById('e-flag').className = 'flag-btn' + (it.flag ? ' on' : '');
    document.getElementById('e-qtext').innerHTML = fmt(it.deal.q);
    const fb = document.getElementById('e-feedback');
    fb.innerHTML = '';
    document.getElementById('e-qclock').textContent = '';
    this.qStart = Date.now();

    const btns = UI.renderAnswers('e-answers', it.deal.options, (i) => {
      if (practice) { if (it.sel == null) this.practiceAnswer(i); return; }
      it.sel = i;
      btns.forEach((b, j) => b.classList.toggle('picked', j === i));
      this.renderGrid(); this.persist(); this.renderPace();
      Sound.click();
    });
    if (practice && it.sel != null) this.markPractice(btns, it);
    else if (it.sel != null) btns[it.sel].classList.add('picked');
    document.getElementById('e-prev').disabled = this.idx === 0;
    document.getElementById('e-next').disabled = this.idx === this.items.length - 1;
  },

  practiceAnswer(i) {
    const it = this.items[this.idx];
    it.sel = i;
    it.secs = Math.round((Date.now() - this.qStart) / 1000);
    const ok = i === it.deal.correct;
    Game.recordAnswer(ok, it.id);
    if (!ok) Game.deckAdd(it.id);
    ok ? Sound.good() : Sound.bad();
    this.show(); this.renderGrid(); this.renderPace();
  },

  markPractice(btns, it) {
    const ok = it.sel === it.deal.correct;
    btns.forEach(b => b.classList.add('disabled'));
    btns[it.deal.correct].classList.add('correct');
    if (!ok) btns[it.sel].classList.add('wrong');
    const last = this.idx === this.items.length - 1;
    document.getElementById('e-feedback').innerHTML = `
      <div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Correct' : 'Not quite'}${it.secs != null ? ` · ${clock(it.secs)}${it.secs > PACE_SECS ? ' (over 2:00)' : ''}` : ''}</div>
      <div class="expl">${fmt(it.deal.explanation)}</div>
      <div class="right"><button class="btn small primary" onclick="${last ? 'Exam.confirmSubmit()' : 'Exam.nav(1)'}">${last ? 'Finish' : 'Next →'}</button></div>`;
    document.getElementById('e-qclock').textContent = '';
  },

  nav(d) { this.idx = Math.max(0, Math.min(this.items.length - 1, this.idx + d)); this.show(); this.renderGrid(); this.persist(); },
  jump(i) { this.idx = i; this.show(); this.renderGrid(); this.persist(); },
  toggleFlag() { const it = this.items[this.idx]; it.flag = !it.flag; this.show(); this.renderGrid(); this.persist(); },

  renderGrid() {
    const g = document.getElementById('e-grid');
    g.innerHTML = '';
    const practice = this.variant === 'practice';
    this.items.forEach((it, i) => {
      const c = document.createElement('button');
      let cls = 'nav-cell';
      if (it.sel != null) cls += practice ? (it.sel === it.deal.correct ? ' answered' : ' missed') : ' answered';
      if (it.flag) cls += ' flagged';
      if (i === this.idx) cls += ' current';
      if (i > 0 && this.items[i - 1].scenario !== it.scenario) cls += ' block-start';
      c.className = cls;
      c.textContent = i + 1;
      c.onclick = () => this.jump(i);
      g.appendChild(c);
    });
  },

  confirmSubmit() {
    const un = this.items.filter(i => i.sel == null).length;
    const fl = this.items.filter(i => i.flag).length;
    if (!confirm(`Submit exam?\n\n${un ? '⚠️ ' + un + ' unanswered (scored as wrong).' : 'All answered.'}${fl ? '\n🚩 ' + fl + ' still flagged.' : ''}`)) return;
    this.submit('submitted');
  },

  /* idempotent: history, XP and clinic updates happen exactly once per attempt */
  submit(reason) {
    if (this.submitted) return;
    const mock = this.variant === 'mock';
    if (mock && this.takenOver()) return this.detach();
    this.submitted = true;
    this.suspend();
    if (mock) this.endSaved('submitted');

    let correct = 0;
    const perDomain = {}, perScen = {};
    Object.keys(DOMAINS).forEach(d => perDomain[d] = { right: 0, total: 0 });
    this.items.forEach(it => {
      const ok = it.sel === it.deal.correct;
      perDomain[it.domain].total++;
      const ps = perScen[it.scenario] || (perScen[it.scenario] = { right: 0, total: 0 });
      ps.total++;
      if (ok) { correct++; perDomain[it.domain].right++; ps.right++; }
      /* unanswered items score as wrong but don't count as seen in the per-question stats */
      if (mock) { if (!ok) Game.deckAdd(it.id); Game.recordAnswer(ok, it.sel != null ? it.id : null); }
    });
    const total = this.items.length, pct = correct / total;
    const score = scaledScore(pct);
    const se = Math.sqrt(Math.max(pct * (1 - pct), 0.01) / total);
    const band = pct >= 0.72 + se ? 'above' : pct >= 0.72 - se ? 'near' : 'below';
    const used = this.elapsed();
    const seenBefore = this.items.filter(i => i.seenBefore).length;

    if (mock) Game.s.examBest = Math.max(Game.s.examBest, score);
    Game.s.examHistory.push({ mode: this.variant, score, correct, total, pct: Math.round(pct * 100), reason,
      perDomain: Object.fromEntries(Object.entries(perDomain).map(([d, r]) => [d, [r.right, r.total]])),
      scenarios: this.scenarios, seenBefore, secs: used, date: new Date().toISOString().slice(0, 10) });
    Game.s.examHistory = Game.s.examHistory.slice(-50);
    Game.save();

    const xp = correct * 5 + (mock && score >= 720 ? 600 : 0) + (mock && score >= 900 ? 600 : 0);
    Game.addXP(xp);
    if (mock && score >= 720) Game.unlock('certified');
    if (mock && score >= 900) Game.unlock('beat-blogger');

    this.renderResult({ correct, total, pct, score, band, used, seenBefore, perDomain, perScen, xp, mock });
    if (band === 'above') { Sound.win(); UI.confetti(); } else Sound.lose();
    UI.go('examresult');
  },

  renderResult(r) {
    document.getElementById('er-kind').textContent = r.mock ? '📋 Mock exam result' : '📝 Practice exam result';
    document.getElementById('er-score').textContent = r.score;
    const arc = document.getElementById('er-arc');
    arc.style.transition = 'none'; arc.style.strokeDashoffset = 540;
    arc.style.stroke = r.band === 'above' ? 'var(--good)' : r.band === 'near' ? 'var(--gold)' : 'var(--bad)';
    setTimeout(() => { arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)'; arc.style.strokeDashoffset = 540 - (540 * r.score / 1000); }, 60);
    const banner = document.getElementById('er-banner');
    banner.textContent = { above: '📜 Above the 720 line', near: '⚖️ Right on the line', below: '❌ Below the 720 line' }[r.band];
    banner.style.color = { above: 'var(--good)', near: 'var(--gold)', below: 'var(--bad)' }[r.band];
    document.getElementById('er-sub').textContent = `${r.correct}/${r.total} correct (${Math.round(r.pct * 100)}%) · ${Math.round(r.used / 60)}${r.mock ? ' of 120' : ''} minutes · ${Math.round(r.used / r.total)}s per question · +${r.xp} XP`;
    document.getElementById('er-note').innerHTML = `Scaled score is an <strong>estimate</strong> (72% raw maps to 720; the real scaling isn't published). One 60-question attempt is roughly ±100 points, so take two or three before trusting a trend.`
      + (r.seenBefore ? ` <strong>${r.seenBefore} of ${r.total}</strong> questions were ones you'd seen before, which can inflate the score.` : '');

    const bar = (label, right, total, color) => {
      const pct = total ? Math.round((right / total) * 100) : 0;
      return `<div class="dbar"><div class="row"><span>${label}</span><span>${right}/${total} · ${pct}%</span></div>
        <div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div></div>`;
    };
    document.getElementById('er-bars').innerHTML = '<h4>By domain</h4>' + Object.entries(r.perDomain).map(([d, x]) => bar(d + ' · ' + DOMAINS[d].label, x.right, x.total, DOMAINS[d].color)).join('')
      + '<h4>By scenario</h4>' + Object.entries(r.perScen).map(([sid, x]) => {
        const sc = GUIDE.scenarios.find(s => s.id === Number(sid));
        return bar(sc ? sc.name : 'General', x.right, x.total, 'var(--accent)');
      }).join('');

    const focus = Blueprint.focus(3);
    document.getElementById('er-focus').innerHTML = focus.length ? `<h4>Focus next <span class="muted">(from all your answers so far)</span></h4>` + focus.map(f =>
      `<div class="focus-row"><span><b>${f.t.id}</b> ${f.t.title}<br><span class="muted">${f.note}</span></span><button class="btn small ghost" onclick="Blueprint.drillTs('${f.t.id}')">Drill</button></div>`).join('') : '';

    const acts = document.getElementById('er-actions');
    acts.innerHTML = '';
    [['all', '🔍 Review all'], ['wrong', '✘ Wrong only'], ['flagged', '🚩 Flagged']].forEach(([k, label]) => {
      const b = document.createElement('button');
      b.className = 'btn ghost small'; b.textContent = label;
      b.onclick = () => this.renderReview(k);
      acts.appendChild(b);
    });
    const bp = document.createElement('button');
    bp.className = 'btn ghost small'; bp.textContent = '📘 Blueprint';
    bp.onclick = () => UI.go('blueprint');
    const home = document.createElement('button');
    home.className = 'btn primary small'; home.textContent = '🏛️ Back to the hall';
    home.onclick = () => UI.go('home');
    acts.append(bp, home);
    document.getElementById('er-review').innerHTML = '';
  },

  renderReview(filter) {
    const list = this.items.map((it, n) => ({ it, n })).filter(({ it }) =>
      filter === 'wrong' ? it.sel !== it.deal.correct : filter === 'flagged' ? it.flag : true);
    document.getElementById('er-review').innerHTML = list.length ? list.map(({ it, n }) => {
      const ok = it.sel === it.deal.correct;
      const ts = GUIDE.taskStatements.find(t => t.id === it.deal.ts);
      return `<div class="rev-item">
        <div class="tsline">${it.domain} · ${ts ? ts.id + ' ' + ts.title : ''}${it.flag ? ' · 🚩' : ''}</div>
        <div class="q">${n + 1}. ${fmt(it.deal.q)}</div>
        <div class="row ${ok ? 'ok' : 'no'}">${ok ? '✔' : '✘'} you: ${it.sel != null ? fmt(it.deal.options[it.sel]) : '<em>no answer</em>'}</div>
        ${ok ? '' : `<div class="row ok">✔ correct: ${fmt(it.deal.options[it.deal.correct])}</div>`}
        <div class="ex">${fmt(it.deal.explanation)}</div>
      </div>`;
    }).join('') : '<p class="center muted">Nothing in this filter.</p>';
  },
};

/* ---------------- the blueprint (exam-guide study mode) ---------------- */
const Blueprint = {
  tab: 'domains',

  refsFor(pred) { return Bank.inScope().filter(r => pred(r.q)); },

  stats(refs) {
    const qs = Game.s.qstats;
    let seen = 0, right = 0;
    refs.forEach(r => { const st = qs[r.id]; if (st && st.seen) { seen++; right += st.last; } });
    return { total: refs.length, seen, right };
  },

  statLine(st) {
    return `${st.total} questions · seen ${st.seen}/${st.total} · right on last try ${st.right}`;
  },

  /* weakest task statements with enough data, else the least covered */
  focus(n) {
    const rows = GUIDE.taskStatements.map(t => ({ t, st: this.stats(this.refsFor(q => q.ts === t.id)) }));
    const weak = rows.filter(r => r.st.seen >= 2).sort((a, b) => a.st.right / a.st.seen - b.st.right / b.st.seen)
      .filter(r => r.st.right / r.st.seen < 0.75);
    const pickRows = weak.length ? weak : shuffle(rows).sort((a, b) => a.st.seen / a.st.total - b.st.seen / b.st.total);
    return pickRows.slice(0, n).map(r => ({ t: r.t,
      note: weak.length ? `right on last try ${r.st.right} of ${r.st.seen} seen` : `seen ${r.st.seen} of ${r.st.total}` }));
  },

  /* unseen first, then last missed, then oldest; random among equals */
  pick(refs, n) {
    const qs = Game.s.qstats;
    const rank = r => { const st = qs[r.id]; return !st ? 0 : st.last ? 2 : 1; };
    return shuffle(refs).sort((a, b) => rank(a) - rank(b) || ((qs[a.id] || {}).at || 0) - ((qs[b.id] || {}).at || 0)).slice(0, n);
  },

  drillTs(id) {
    const t = GUIDE.taskStatements.find(x => x.id === id);
    Drill.start(this.pick(this.refsFor(q => q.ts === id), 10), `${id} · ${t.title}`);
  },
  drillDomain(d) { Drill.start(this.pick(this.refsFor(q => Bank.domainOf(q) === d), 10), `${d} · ${DOMAINS[d].label}`); },
  drillScenario(sid) {
    const sc = GUIDE.scenarios.find(x => x.id === sid);
    Drill.start(this.pick(this.refsFor(q => q.scenario === sid), 10), 'Scenario · ' + sc.name);
  },

  setTab(t) { this.tab = t; this.render(); },

  render() {
    const g = GUIDE.exam;
    document.getElementById('bp-version').textContent = GUIDE.version;
    document.getElementById('bp-facts').innerHTML = [
      `❓ <b>${g.items}</b> items`, `⏱️ <b>${g.minutes}</b> min`, `🎬 <b>${g.scenarios}</b> of ${g.scenarioBank} scenarios`, `🎯 pass <b>${g.pass}</b> scaled (${g.scaleMin}–${g.scaleMax})`,
    ].map(x => `<div class="fact-pill">${x}</div>`).join('');
    document.querySelectorAll('#bp-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === this.tab));

    const focus = this.focus(3);
    document.getElementById('bp-focus').innerHTML = `<h4>🎯 Focus next</h4>` + focus.map(f =>
      `<div class="focus-row"><span><b>${f.t.id}</b> ${f.t.title}<br><span class="muted">${f.note}</span></span><button class="btn small primary" onclick="Blueprint.drillTs('${f.t.id}')">Drill</button></div>`).join('');

    const body = document.getElementById('bp-body');
    body.innerHTML = this.tab === 'domains' ? this.renderDomains() : this.tab === 'scenarios' ? this.renderScenarios() : this.renderPrep();
    document.getElementById('bp-oos').innerHTML = GUIDE.outOfScope.map(x => `<li>${x}</li>`).join('');
  },

  bar(st, color) {
    const pct = st.total ? Math.round((st.right / st.total) * 100) : 0;
    const seen = st.total ? Math.round((st.seen / st.total) * 100) : 0;
    return `<div class="bp-bar" title="seen ${seen}% · right on last try ${pct}%"><div class="seen" style="width:${seen}%"></div><div class="right" style="width:${pct}%;background:${color}"></div></div>`;
  },

  renderDomains() {
    return GUIDE.domains.map(d => {
      const dom = DOMAINS[d.id];
      const st = this.stats(this.refsFor(q => Bank.domainOf(q) === d.id));
      const tss = GUIDE.taskStatements.filter(t => t.id[0] === String(d.n));
      return `<details class="bp-domain" style="--dc:${dom.color}">
        <summary>
          <span class="bp-dnum">D${d.n}</span>
          <span class="bp-dmeta"><span class="nm">${d.label}</span><span class="muted">${d.weight}% · ${d.exam} of 60 items · ${this.statLine(st)}</span>${this.bar(st, dom.color)}</span>
          <button class="btn small ghost" onclick="event.preventDefault();Blueprint.drillDomain('${d.id}')">Drill domain</button>
        </summary>
        ${tss.map(t => this.renderTs(t, dom.color)).join('')}
      </details>`;
    }).join('');
  },

  renderTs(t, color) {
    const st = this.stats(this.refsFor(q => q.ts === t.id));
    const docs = ((GUIDE.docs || {})[t.id] || []).map(x => `<a href="${x.url}" target="_blank" rel="noopener">${x.title}</a>`).join(' · ');
    const delta = (GUIDE.deltas || {})[t.id];
    return `<div class="bp-ts">
      <div class="bp-tshead">
        <span class="bp-tsid">${t.id}</span>
        <span class="bp-tstitle">${t.title}<br><span class="muted">${this.statLine(st)}</span>${this.bar(st, color)}</span>
        <button class="btn small primary" ${st.total ? '' : 'disabled'} onclick="Blueprint.drillTs('${t.id}')">Drill ${Math.min(10, st.total)}</button>
      </div>
      <div class="bp-ideas">
        <div><h5>Know</h5><ul>${t.know.map(x => `<li>${fmt(x)}</li>`).join('')}</ul></div>
        <div><h5>Be able to</h5><ul>${t.skills.map(x => `<li>${fmt(x)}</li>`).join('')}</ul></div>
      </div>
      ${docs ? `<div class="bp-docs">📚 Official docs: ${docs}</div>` : ''}
      ${delta ? `<div class="bp-delta">🔄 <strong>Docs have moved on since the guide:</strong> ${fmt(delta)}</div>` : ''}
    </div>`;
  },

  renderPrep() {
    const p = GUIDE.prep, link = x => `<li><a href="${x.url}" target="_blank" rel="noopener">${x.title}</a></li>`;
    return `<div class="bp-prep">
      <div class="bp-scen"><div class="nm">📅 Exam day</div><ul>${p.facts.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div class="bp-scen"><div class="nm">⏱️ Tips from people who sat it</div><ul>${p.tips.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div class="bp-scen"><div class="nm">🎓 Free official courses</div><ul>${p.courses.map(link).join('')}</ul></div>
      <div class="bp-scen"><div class="nm">🔗 Official pages</div><ul>${p.official.map(link).join('')}</ul></div>
    </div><p class="muted small mt">Facts from Anthropic's Partner Academy and Pearson VUE pages, checked ${GUIDE.docsCheckedOn}. Tips are common themes from public candidate write-ups, which don't disclose exam content.</p>`;
  },

  renderScenarios() {
    return `<div class="bp-scen-grid">` + GUIDE.scenarios.map(sc => {
      const st = this.stats(this.refsFor(q => q.scenario === sc.id));
      return `<div class="bp-scen">
        <div class="nm">${sc.id}. ${sc.name}</div>
        <div class="chips">${sc.domains.map(d => `<span class="domain-tag" style="background:${DOMAINS[d].color}">${d}</span>`).join(' ')}</div>
        <p>${sc.blurb}</p>
        <div class="muted small">${this.statLine(st)}</div>${this.bar(st, 'var(--accent)')}
        <button class="btn small primary" onclick="Blueprint.drillScenario(${sc.id})">Drill scenario</button>
      </div>`;
    }).join('') + `</div><p class="muted small mt">On the real exam, 4 of these 6 scenarios are drawn at random. Each frames a set of questions.</p>`;
  },
};

/* ---------------- drill (Blueprint practice with instant feedback) ---------------- */
const Drill = {
  queue: [], qi: 0, right: 0, label: '', buttons: [], xp: 0,

  start(refs, label) {
    if (!refs.length) { UI.toast('🚧', 'No questions here yet', 'This part of the guide has no questions in the bank.'); return; }
    this.queue = refs.map(r => dealQuestion(r.q));
    this.qi = 0; this.right = 0; this.xp = 0; this.label = label;
    UI.go('drill');
    document.getElementById('d-title').textContent = label;
    this.show();
  },

  show() {
    const q = this.queue[this.qi];
    const t = GUIDE.taskStatements.find(x => x.id === q.ts);
    document.getElementById('d-progress').textContent = `Q ${this.qi + 1}/${this.queue.length} · ${this.right} right`;
    document.getElementById('d-ts').textContent = t ? `${t.id} · ${t.title}` : '';
    document.getElementById('d-qtext').innerHTML = fmt(q.q);
    this.buttons = UI.renderAnswers('d-answers', q.options, (i) => this.answer(i));
  },

  answer(i) {
    const q = this.queue[this.qi];
    const ok = i === q.correct;
    Game.recordAnswer(ok, q.id);
    this.buttons.forEach(b => b.classList.add('disabled'));
    this.buttons[q.correct].classList.add('correct');
    if (ok) { this.right++; this.xp += 15; Game.addXP(15); Sound.good(); }
    else { this.buttons[i].classList.add('wrong'); Game.deckAdd(q.id); Sound.bad(); }
    setTimeout(() => {
      if (UI.current !== 'drill' || this.queue[this.qi] !== q) return;
      UI.modal(ok, q.options[q.correct], q.explanation, () => this.next(),
        { btn: this.qi + 1 >= this.queue.length ? 'Finish drill' : 'Next question' });
    }, 700);
  },

  next() {
    this.qi++;
    if (this.qi < this.queue.length) return this.show();
    const n = this.queue.length, good = this.right / n >= 0.75;
    document.getElementById('r-emoji').textContent = good ? '📘' : '📖';
    const t = document.getElementById('r-title');
    t.textContent = good ? 'DRILL DONE' : 'KEEP STUDYING'; t.className = good ? 'win' : 'lose';
    document.getElementById('r-sub').textContent = this.label;
    document.getElementById('r-stats').innerHTML = [['Score', this.right + '/' + n], ['XP earned', '+' + this.xp]]
      .map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    const acts = document.getElementById('r-actions');
    acts.innerHTML = '';
    const bp = document.createElement('button');
    bp.className = 'btn primary'; bp.textContent = '📘 Back to the Blueprint';
    bp.onclick = () => UI.go('blueprint');
    acts.appendChild(bp);
    good ? Sound.win() : Sound.lose();
    UI.go('result');
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
    this.cur = { deal: dealQuestion(ref.q) };
    document.getElementById('l-score').textContent = this.score;
    document.getElementById('l-combo').textContent = this.combo >= 2 ? `🔥 ×${this.combo} combo — +${1 + Math.floor(this.combo / 3)} per hit` : '';
    document.getElementById('l-qtext').innerHTML = fmt(this.cur.deal.q);
    this.buttons = UI.renderAnswers('l-answers', this.cur.deal.options, (i) => this.answer(i));
  },

  answer(i) {
    if (!this.running) return;
    const q = this.cur.deal;
    const ok = i === q.correct;
    Game.recordAnswer(ok, q.id);
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
      Game.deckAdd(q.id);
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
    this.queue = shuffle(bank.map(q => ({ deal: dealQuestion(q) })));
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
    Game.recordAnswer(ok, q.id);
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
      Game.deckAdd(q.id);
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
    const q = Bank.byId(card.id);
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
    Game.recordAnswer(ok, card.id);
    this.buttons.forEach(b => b.classList.add('disabled'));
    this.buttons[this.cur.correct].classList.add('correct');
    if (!ok) this.buttons[i].classList.add('wrong');

    const real = Game.s.deck.find(c => c.id === card.id);
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
  if (e.key === 'Enter' && UI.current === 'exam' && Exam.variant === 'practice') {
    const f = document.activeElement, next = document.querySelector('#e-feedback button');
    if (f && f !== document.body && !f.closest('#e-answers, #e-feedback')) return;
    if (next) { e.preventDefault(); next.click(); }
    return;
  }
  if (e.key >= '1' && e.key <= '4') {
    const map = { battle: 'b-answers', lightning: 'l-answers', hunt: 'h-answers', exam: 'e-answers', review: 'rv-answers', drill: 'd-answers' };
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
Exam.checkSaved();
window.addEventListener('storage', (e) => {
  if (e.key !== EXAM_KEY || !Exam.active || Exam.variant !== 'mock') return;
  if (Exam.takenOver()) Exam.detach();
  else if (Exam.stored()) UI.toast('⚠️', 'Exam open in another tab', 'Answers from two tabs will overwrite each other. Use one.');
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && EXAM_SETTLE_ON.has(UI.current)) Exam.settleExpired();
});
