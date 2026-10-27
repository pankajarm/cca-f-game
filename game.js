/* ============================================================
   ARCHITECT'S ASCENT — game engine
   CCA-F trainer · June 2026 edition
   ============================================================ */
'use strict';

/* ---------------- floor & boss roster ----------------
   each floor covers a group of exam-guide task statements and draws from their whole pool */
const FLOORS = [
  { id: 'floor-01', name: 'The Loop Chamber', domain: 'D1', dcolor: 'var(--d1)', ts: ['1.1'],
    boss: { name: 'Loop Terminator', face: '🌀',
      taunt: "You said 'task complete' three turns ago. I stopped listening. Forever.",
      hurt: 'Wait— wait, check my stop_reason—',
      death: 'end_turn… so this is what it feels like…' } },
  { id: 'floor-02', name: 'Coordination Hall', domain: 'D1', dcolor: 'var(--d1)', ts: ['1.2', '1.3', '1.6'],
    boss: { name: 'The Rogue Swarm', face: '🐝',
      taunt: 'My subagents share everything! …They share nothing. Nobody told them anything.',
      hurt: 'Who gave the coordinator actual context?!',
      death: 'Should have… packed the prompt…' } },
  { id: 'floor-03', name: 'The Hook Forge', domain: 'D1', dcolor: 'var(--d1)', ts: ['1.4', '1.5', '1.7'],
    boss: { name: 'Prompt Whisperer', face: '🗣️',
      taunt: 'Have you tried asking NICELY? In ALL CAPS? Twice?',
      hurt: 'A hook?! That is deterministic! That is CHEATING!',
      death: 'Exit code 2… blocked… forever…' } },
  { id: 'floor-04', name: 'The Tool Armory', domain: 'D2', dcolor: 'var(--d2)', ts: ['2.1', '2.2', '2.3', '2.4', '2.5'],
    boss: { name: 'The Tool Hoarder', face: '🧰',
      taunt: 'Behold, my agent wields all EIGHTEEN tools! It cannot pick one, but STILL!',
      hurt: 'Four to five tools per role?! Minimalist propaganda!',
      death: 'Fine… take my seventeen spare hammers…' } },
  { id: 'floor-05', name: 'The Config Maze', domain: 'D3', dcolor: 'var(--d3)', ts: ['3.1', '3.2', '3.3'],
    boss: { name: 'Config Phantom', face: '👻',
      taunt: 'Your team standards are safe with me… in MY home directory. Unversioned. Forever.',
      hurt: 'No! Not the project-level CLAUDE.md!',
      death: 'Committed… to the repo… how orderly…' } },
  { id: 'floor-06', name: 'The Pipeline Forge', domain: 'D3', dcolor: 'var(--d3)', ts: ['3.4', '3.5', '3.6'],
    boss: { name: 'CI Gremlin', face: '🧌',
      taunt: 'Your pipeline has been waiting on stdin since Tuesday. I brought snacks.',
      hurt: 'The -p flag! My one weakness! Who told you?!',
      death: 'Exiting… with code… zero…' } },
  { id: 'floor-07', name: 'Prompt Workshop', domain: 'D4', dcolor: 'var(--d4)', ts: ['4.1', '4.2', '4.3'],
    boss: { name: 'Vague Instructor', face: '🎭',
      taunt: 'Just… be careful. Be conservative. Be, you know… good?',
      hurt: 'Explicit criteria?! But ambiguity is my whole personality!',
      death: 'So specific… so… measurable…' } },
  { id: 'floor-08', name: 'Validation Gauntlet', domain: 'D4', dcolor: 'var(--d4)', ts: ['4.4', '4.5', '4.6'],
    boss: { name: 'Self-Review Shadow', face: '🪞',
      taunt: 'I reviewed my own code. Ten out of ten. No notes. Flawless.',
      hurt: 'An INDEPENDENT session?! But it does not trust me!',
      death: 'The second opinion… it saw… everything…' } },
  { id: 'floor-09', name: 'The Memory Halls', domain: 'D5', dcolor: 'var(--d5)', ts: ['5.1', '5.2', '5.3'],
    boss: { name: 'Context Glutton', face: '🐡',
      taunt: 'FEED ME ALL FORTY FIELDS. EVERY TURN. SUMMARIZE NOTHING.',
      hurt: 'A case-facts block?! My precious $147.23 — preserved?!',
      death: 'So… trim… very trim…' } },
  { id: 'floor-10', name: 'Synthesis Chamber', domain: 'D5', dcolor: 'var(--d5)', ts: ['5.4', '5.5', '5.6'],
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

/* each monster haunts the task statements where its anti-pattern shows up; hunt it there */
const MONSTERS = {
  'Loop Terminator':      { face: '🌀', ts: ['1.1'], cry: '“The reply says it is done — halt everything!”', weak: 'Check stop_reason, never parse prose.' },
  'Iteration Cap Golem':  { face: '🗿', ts: ['1.1', '1.6'], cry: '“max_iterations = 5. Problem solved.”', weak: 'Caps are safety nets, not loop control.' },
  'Prompt Whisperer':     { face: '🗣️', ts: ['1.4', '1.5'], cry: '“Just add it to the system prompt! In bold!”', weak: 'Critical rules belong in deterministic hooks.' },
  'The Tool Hoarder':     { face: '🧰', ts: ['2.1', '2.3', '2.5'], cry: '“Give every agent every tool, for convenience!”', weak: '4–5 scoped tools per agent role.' },
  'Sentiment Siren':      { face: '🧜', ts: ['5.2'], cry: '“They sound angry — escalate! ESCALATE!”', weak: 'Sentiment ≠ complexity. Use explicit triggers.' },
  'Confidence Phantom':   { face: '🔮', ts: ['4.4', '5.5'], cry: '“The model says it is 95% sure. Ship it.”', weak: 'Self-reported confidence is uncalibrated.' },
  'Context Glutton':      { face: '🐡', ts: ['5.1', '5.4'], cry: '“Dump everything into context. All of it.”', weak: 'Trim outputs, isolate verbosity in subagents.' },
  'Self-Review Shadow':   { face: '🪞', ts: ['4.6', '3.5'], cry: '“I checked my own work. Looks great to me!”', weak: 'Independent session without generation context.' },
  'Generic Error Ghost':  { face: '👤', ts: ['2.2', '5.3'], cry: '“Operation failed. That is all you get.”', weak: 'errorCategory, isRetryable, partial results.' },
  'The Accuracy Mirage':  { face: '🏜️', ts: ['5.5', '5.6'], cry: '“97% overall! What segment failures?”', weak: 'Validate per document type and field.' },
  'The Scope Creep':      { face: '🦑', ts: ['1.2', '1.3'], cry: '“I decomposed the task! …Into the wrong pieces.”', weak: 'Partition scope to match full coverage.' },
  'Schema Shapeshifter':  { face: '🦎', ts: ['4.3', '4.1'], cry: '“Just ask for JSON nicely. It will match the schema. Probably.”', weak: 'Enforce structure with tool use and a JSON schema.' },
};
/* prompt caching is out of scope for the exam, so its monster left the bestiary */
const RETIRED_MONSTERS = { 'Cache Vampire': 'Schema Shapeshifter' };

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
  { id: 'certified',     ic: '📜', nm: 'Certified',        ds: 'Score 720+ on a strict mock exam' },
  { id: 'beat-blogger',  ic: '✍️', nm: 'High Scorer',      ds: 'Score 900+ on a strict mock exam' },
  { id: 'lightning-15',  ic: '⚡', nm: 'Storm Caller',     ds: 'Score 15+ in one Recall Sprint' },
  { id: 'monster-hunter',ic: '🔦', nm: 'Monster Hunter',   ds: 'Capture all 12 monsters in the Hunt' },
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
const SCHEMA = 6;
const SAVE_HOLD_MS = 30;

/* v2 clinic cards were {src, idx}. The frozen ids were assigned from those v2 positions, so map by id,
   not by today's array (buckets have lost items since) */
const LEGACY_PREFIX = { 'exam-mix-1': 'mx1', 'exam-mix-2': 'mx2', hunt: 'hunt' };
function legacyId(c) {
  const p = LEGACY_PREFIX[c.src] || (/^floor-(\d\d)$/.test(c.src || '') ? 'f' + c.src.slice(6) : null);
  return p && Number.isInteger(c.idx) ? p + '-' + String(c.idx).padStart(2, '0') : null;
}

/* local calendar day, so the study streak follows the player's own midnight */
function localDay(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* a question's revision: the bank bumps it when the key or concept changed (absent = 0) */
function qRev(q) { return q && Number.isInteger(q.rev) && q.rev > 0 ? q.rev : 0; }

/* ---------------- merging saves across tabs ----------------
   merge(base, mine, theirs): base is what this tab last read or wrote, mine is this tab's state now,
   theirs is what storage holds now. Only the fields this tab changed since base are applied to theirs:
   counters as deltas (xp, totals, powerups), achievements and bestiary as unions, mockSeen per id max,
   qstats per id (the entry answered latest wins, but a first try once recorded is kept), the clinic deck
   by card id, floors per floor (cleared stays cleared, best is the max), new exam history appended,
   bests as max, anything else (settings) as this tab set it. A hard reset elsewhere (new epoch) wins */
const Sync = {
  clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); },
  same(a, b) { return JSON.stringify(a) === JSON.stringify(b); },
  num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; },

  merge(base, mine, theirs) {
    if (!base) return this.clone(mine);
    if ((base.epoch || '0') !== (theirs.epoch || '0')) return this.clone(theirs);
    const out = this.clone(theirs);
    new Set([...Object.keys(mine), ...Object.keys(theirs)]).forEach(k => {
      const b = base[k], m = mine[k], t = theirs[k];
      if (this.same(m, b)) return;  // this tab didn't touch it: storage's value stands
      switch (k) {
        case 'xp': out.xp = Math.max(0, this.num(t) + this.num(m) - this.num(b)); break;
        case 'totals': case 'powerups': out[k] = this.counters(b || {}, m || {}, t || {}); break;
        case 'achievements': case 'bestiary': out[k] = [...new Set([...(t || []), ...(m || [])])]; break;
        case 'mockSeen': {
          const o = Object.assign({}, t);
          Object.entries(m || {}).forEach(([id, n]) => { o[id] = Math.max(this.num(o[id]), this.num(n)); });
          out.mockSeen = o; break;
        }
        case 'qstats': out.qstats = this.stats(b || {}, m || {}, t || {}); break;
        case 'deck': out.deck = this.deck(b || [], m || [], t || []); break;
        case 'floors': {
          const o = this.clone(t || {});
          Object.entries(m || {}).forEach(([id, f]) => {
            if (this.same(f, (b || {})[id])) return;
            const x = o[id] || {};
            o[id] = Object.assign({}, x, f, { cleared: !!(x.cleared || f.cleared), best: Math.max(this.num(x.best), this.num(f.best)) });
          });
          out.floors = o; break;
        }
        case 'examHistory': {
          const seen = new Set((b || []).concat(t || []).map(h => JSON.stringify(h)));
          out.examHistory = (t || []).concat((m || []).filter(h => !seen.has(JSON.stringify(h)))).slice(-50);
          break;
        }
        case 'streak': {
          const ml = (m && m.last) || '', tl = (t && t.last) || '';
          out.streak = this.clone(ml > tl || (ml === tl && this.num(m && m.count) >= this.num(t && t.count)) ? m : t);
          break;
        }
        case 'examBest': case 'legacyExamBest': case 'lightningBest': case 'schemaVersion':
          out[k] = Math.max(this.num(t), this.num(m)); break;
        default: out[k] = this.clone(m);
      }
    });
    return out;
  },

  counters(b, m, t) {
    const o = Object.assign({}, t);
    new Set([...Object.keys(m), ...Object.keys(t)]).forEach(k => { o[k] = Math.max(0, this.num(t[k]) + this.num(m[k]) - this.num(b[k])); });
    return o;
  },

  /* per question: an entry only this tab changed is taken as is; if both changed it, the later answer
     (`at`) wins, but a first try already stored is never replaced (it was written first), and one
     recorded only here is kept. An entry this tab dropped (its question was revised) is dropped unless
     the other tab answered it since */
  stats(b, m, t) {
    const o = this.clone(t);
    new Set([...Object.keys(m), ...Object.keys(b)]).forEach(id => {
      const mb = b[id], mm = m[id], tt = t[id];
      if (this.same(mm, mb)) return;
      if (!mm) { if (this.same(tt, mb)) delete o[id]; return; }
      if (!tt || this.same(tt, mb)) { o[id] = this.clone(mm); return; }
      o[id] = this.clone(this.num(mm.at) >= this.num(tt.at) ? mm : tt);
      const first = tt.first != null ? tt.first : mm.first;
      if (first != null) o[id].first = first; else delete o[id].first;
    });
    return o;
  },

  /* clinic deck by card id: cards this tab added are added, cards it discharged are removed, a streak it
     changed is applied (a fresh miss re-admits a card the other tab discharged) */
  deck(b, m, t) {
    const byId = a => new Map(a.filter(c => c && c.id).map(c => [c.id, c]));
    const bm = byId(b), mm = byId(m), o = this.clone(t).filter(c => !(c && c.id && bm.has(c.id) && !mm.has(c.id)));
    const om = byId(o);
    m.forEach(c => {
      if (!c || !c.id) return;
      const was = bm.get(c.id), cur = om.get(c.id);
      if (was && was.streak === c.streak) return;
      if (cur) cur.streak = c.streak;
      else if (!was || c.streak === 0) o.push(this.clone(c));
    });
    return o;
  },
};

const Game = {
  s: null,

  fresh() {
    return {
      xp: 0, soundOn: true, theme: 'light',
      streak: { count: 0, last: null },
      floors: {}, powerups: { compact: 1, think: 1, shield: 1 },
      bestiary: [], achievements: [],
      deck: [], clinicPeak: 0, examBest: 0, legacyExamBest: 0, examHistory: [], lightningBest: 0,
      totals: { answered: 0, correct: 0 },
      qstats: {}, mockSeen: {}, schemaVersion: SCHEMA,
      epoch: '0',  // changes on a hard reset, so another tab's pending changes aren't merged into the wiped save
    };
  },

  load() {
    let raw = null, saved = null;
    try {
      raw = localStorage.getItem(SAVE_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch (e) {
      saved = null;
      try { if (raw) localStorage.setItem(SAVE_KEY + '.corrupt', raw); } catch (_) {}
    }
    if (saved && (typeof saved !== 'object' || Array.isArray(saved))) saved = null;
    const ver = saved ? (Number(saved.schemaVersion) || 2) : SCHEMA;
    this.adopt(saved);
    /* what storage held when this tab read it: the base its later changes are measured against (see Sync).
       A save that needs a structural migration is written over whole the first time */
    this.base = ver >= 5 ? Sync.clone(this.s) : null;
    if (ver < 3) this.migrate(raw);
    if (ver < 4) this.migrate4(raw);
    if (ver < 5) this.migrate5(raw);
    if (ver < 6) this.migrate6(raw);
    this.cleanDeck();
    const reset = this.sweepRevs();
    if (reset && raw && ver >= SCHEMA) { try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {} }
    if (saved && (ver < SCHEMA || reset || raw !== JSON.stringify(this.s))) this.save();
  },

  /* take a parsed save (this tab's boot) and repair anything missing or mistyped */
  adopt(saved) {
    this.s = Object.assign(this.fresh(), saved || {});
    this.normalise();
  },

  /* a stored save string as a repaired state object, or null */
  parse(raw) {
    let o;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    return this.normalise(Object.assign(this.fresh(), o));
  },

  /* a null or wrongly typed field falls back to its default instead of breaking every screen */
  normalise(s = this.s) {
    const f = this.fresh();
    for (const k in f) {
      let v = s[k];
      const d = f[k];
      if (typeof d === 'number' && typeof v === 'string' && v.trim() && isFinite(v)) v = s[k] = Number(v);
      if (v == null || typeof v !== typeof d || Array.isArray(v) !== Array.isArray(d) || (typeof d === 'number' && !isFinite(v))) { s[k] = d; continue; }
      if (d && typeof d === 'object' && !Array.isArray(d) && k !== 'qstats' && k !== 'mockSeen' && k !== 'floors') {
        const m = Object.assign({}, d, v);
        for (const k2 in d) if (typeof d[k2] === 'number' && (typeof m[k2] !== 'number' || !isFinite(m[k2]))) m[k2] = d[k2];
        s[k] = m;
      }
    }
    ['qstats', 'mockSeen', 'floors'].forEach(k => Object.keys(s[k]).forEach(id => {
      const v = s[k][id];
      if (k === 'mockSeen' ? typeof v !== 'number' || !isFinite(v) : !v || typeof v !== 'object') delete s[k][id];
    }));
    Object.values(s.qstats).forEach(st => ['seen', 'right', 'last', 'at'].forEach(f2 => { if (typeof st[f2] !== 'number' || !isFinite(st[f2])) st[f2] = 0; }));
    s.deck = s.deck.filter(c => c && typeof c === 'object');
    s.examHistory = s.examHistory.filter(h => h && typeof h === 'object');
    s.bestiary = s.bestiary.filter(m => typeof m === 'string');
    s.achievements = s.achievements.filter(a => typeof a === 'string');
    s.clinicPeak = Math.max(s.clinicPeak, s.deck.length);
    return s;
  },

  /* v2 -> v3: clinic cards {src, idx} become {id}; Proctor scores move to legacyExamBest */
  migrate(raw) {
    try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {}
    this.s.deck = this.s.deck.map(c => c.id ? c : { id: legacyId(c), streak: c.streak || 0 });
    this.s.legacyExamBest = this.s.examBest || 0;
    this.s.examBest = 0;
    this.s.examHistory = this.s.examHistory.map(h => h.mode ? h : { ...h, mode: 'proctor' });
    this.s.schemaVersion = 3;
  },

  /* v3 -> v4: hunt and out-of-scope questions left the bank; first-try results for readiness */
  migrate4(raw) {
    try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {}
    Object.keys(this.s.qstats).forEach(id => {
      const st = this.s.qstats[id];
      if (!Bank.byId(id)) delete this.s.qstats[id];
      else if (st.first == null && st.seen === 1) st.first = st.last;  // older multi-try stats can't tell their first try
    });
    this.s.bestiary = [...new Set(this.s.bestiary.map(m => RETIRED_MONSTERS[m] || m))].filter(m => MONSTERS[m]);
    this.s.schemaVersion = 4;
  },

  /* v4 -> v5: questions carry a revision and qstats remember the one they were answered on (sweepRevs runs on every load) */
  migrate5(raw) {
    try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {}
    this.s.schemaVersion = 5;
  },

  /* v5 -> v6: saves are merged between tabs (an epoch marks hard resets); the mock record moves to v3
     (choose-two selections are arrays) and reads v2 records as they are */
  migrate6(raw) {
    try { localStorage.setItem(SAVE_KEY + '.bak', raw); } catch (e) {}
    if (typeof this.s.epoch !== 'string') this.s.epoch = '0';
    this.s.schemaVersion = 6;
  },

  /* every clinic card must name a question still in the bank; runs on every load, so saves migrated
     before this rule (cards left as {src, idx}) are cleaned too */
  cleanDeck() {
    const ids = new Set();
    this.s.deck = this.s.deck.filter(c => {
      if (typeof c.id !== 'string' || !Bank.byId(c.id) || ids.has(c.id)) return false;
      ids.add(c.id);
      if (typeof c.streak !== 'number' || !isFinite(c.streak)) c.streak = 0;
      return true;
    });
  },

  /* a question whose key or concept changed (its rev went up) starts over: its stats go, so readiness
     never counts a first try on the old version, and its clinic streak restarts. Returns how many */
  sweepRevs() {
    let n = 0;
    Object.keys(this.s.qstats).forEach(id => {
      const q = Bank.byId(id);
      if (!q || (Number(this.s.qstats[id].rev) || 0) >= qRev(q)) return;
      delete this.s.qstats[id];
      const c = this.s.deck.find(c => c.id === id);
      if (c) c.streak = 0;
      n++;
    });
    return n;
  },

  /* Two tabs can act at nearly the same moment, so a save never writes this tab's whole state over the
     stored one. It re-reads storage, applies this tab's delta since its last sync (this.s against
     this.base) and writes the result, inside navigator.locks 'aa-save' so no other tab writes in between
     (without Web Locks: the same re-read, apply, write, which narrows the race but can't close it).
     Calls in one task share one commit. The lock is held a moment after the write: browsers deliver a
     localStorage write to other tabs asynchronously, so the next tab must not re-read before it lands */
  save() {
    if (this._queued) return;
    this._queued = true;
    const run = () => { if (this._queued) this.commit(); };
    if (navigator.locks && navigator.locks.request) {
      navigator.locks.request('aa-save', () => { run(); return new Promise(r => setTimeout(r, SAVE_HOLD_MS)); }).catch(run);
    } else run();
  },

  commit() {
    this._queued = false;
    let raw = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch (e) {}
    const theirs = raw ? this.parse(raw) : null;
    const mine = JSON.stringify(this.s);
    const merged = theirs && this.base ? Sync.merge(this.base, this.s, theirs) : Sync.clone(this.s);
    this.replaceState(merged);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(merged)); } catch (e) {}
    this.base = Sync.clone(merged);
    /* another tab's progress came in with this write */
    if (JSON.stringify(merged) !== mine && typeof UI !== 'undefined') UI.refreshHud();
  },

  /* swap in new state while keeping the Game.s object itself */
  replaceState(o) {
    Object.keys(this.s).forEach(k => { delete this.s[k]; });
    Object.assign(this.s, o);
  },

  /* another tab wrote the save: refresh memory and screen only. Unsaved changes of this tab are carried
     over (merged onto what storage holds now); the storage event's own value may already be stale */
  syncFrom() {
    let raw = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch (e) {}
    const theirs = raw ? this.parse(raw) : null;
    if (!theirs) return;
    this.replaceState(this.base ? Sync.merge(this.base, this.s, theirs) : Sync.clone(theirs));
    this.base = Sync.clone(theirs);
    this.cleanDeck();
    if (this.sweepRevs() || this._queued) this.save();
    document.documentElement.dataset.theme = this.s.theme;
    UI.refreshHud();
    if (UI.current === 'home') UI.renderHome();
  },

  hardReset() {
    if (!confirm('Reset ALL progress — XP, floors, bestiary, exam history?')) return;
    this.replaceState(this.fresh());
    this.s.epoch = String(Date.now());
    this.base = null;  // a reset replaces the stored save instead of merging into it
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
    const today = localDay(new Date());
    const st = this.s.streak;
    if (st.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    st.count = (st.last === localDay(y)) ? st.count + 1 : 1;
    st.last = today;
    this.save();
    UI.refreshHud();
    if (st.count >= 7) this.unlock('streak-7');
    if (st.count >= 30) this.unlock('streak-30');
  },

  /* timed: a rushed answer (Lightning) counts as seen but never as the question's first try; the first
     try is the first UNTIMED answer (st.t counts the timed ones before it).
     late: answers scored after the fact (a mock that expired while away) don't touch today's streak */
  recordAnswer(ok, id, timed, late) {
    if (!late) this.touchStreak();
    this.s.totals.answered++;
    if (ok) this.s.totals.correct++;
    if (id) {
      const st = this.s.qstats[id] || (this.s.qstats[id] = { seen: 0, right: 0, last: 0, at: 0 });
      if (st.first == null && !timed && st.seen === (st.t || 0)) st.first = ok ? 1 : 0;
      if (timed) st.t = (st.t || 0) + 1;
      st.seen++; if (ok) st.right++;
      st.last = ok ? 1 : 0; st.at = Date.now();
      const rev = qRev(Bank.byId(id));
      if (rev) st.rev = rev; else delete st.rev;
    }
    if (this.s.totals.correct >= 100) this.unlock('scholar-100');
    const h = new Date().getHours();
    if (!late && h >= 0 && h < 5) this.unlock('night-shift');
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
    const keys = Object.keys(POWERUPS).filter(k => this.s.powerups[k] < 9);
    if (!keys.length) return null;
    const k = keys[Math.floor(Math.random() * keys.length)];
    this.s.powerups[k]++;
    this.save();
    return k;
  },

  /* mistake deck — stable question ids; correct twice in a row discharges, and a miss anywhere
     (another mode included) restarts the run */
  deckAdd(id) {
    if (!id) return;
    const c = this.s.deck.find(c => c.id === id);
    if (c) c.streak = 0;
    else this.s.deck.push({ id, streak: 0 });
    this.s.clinicPeak = Math.max(this.s.clinicPeak || 0, this.s.deck.length);
    this.save();
    UI.refreshHud();
  },
};

/* ---------------- question access ---------------- */
const Bank = {
  _byId: null,

  floor(id) { return (window.BANK && window.BANK[id]) || []; },

  byId(id) {
    if (!this._byId) {
      this._byId = {};
      Object.values(window.BANK || {}).forEach(qs => qs.forEach(q => { if (q.id) this._byId[q.id] = q; }));
    }
    return this._byId[id] || null;
  },

  /* domain comes from the exam-guide task statement */
  domainOf(q) { return q.ts ? 'D' + q.ts[0] : 'D1'; },

  /* every question, as refs { q, id, domain }; the bank keys are storage buckets only */
  everything() {
    if (!this._all) {
      this._all = [];
      Object.values(window.BANK || {}).forEach(qs => qs.forEach(q => this._all.push({ q, id: q.id, domain: this.domainOf(q) })));
    }
    return this._all;
  },

  /* every question is mapped to an exam-guide task statement and in scope (check_bank.py enforces it) */
  inScope() { return this.everything(); },
  forTs(list) { const set = new Set(list); return this.everything().filter(r => set.has(r.q.ts)); },

  /* unseen first, then last missed, then oldest; random among equals. With spread, take turns
     across task statements so a big pool doesn't crowd out a small one */
  pick(refs, n, spread) {
    const qs = Game.s.qstats;
    const rank = r => { const st = qs[r.id]; return !st ? 0 : st.last ? 2 : 1; };
    const sorted = shuffle(refs).sort((a, b) => rank(a) - rank(b) || ((qs[a.id] || {}).at || 0) - ((qs[b.id] || {}).at || 0));
    if (!spread) return sorted.slice(0, n);
    /* take turns within each rank tier, best tier first, so a lane of seen questions never
       displaces an unseen one */
    const out = [];
    for (const tier of [0, 1, 2]) {
      const lanes = {};
      sorted.filter(r => rank(r) === tier).forEach(r => (lanes[r.q.ts] = lanes[r.q.ts] || []).push(r));
      const order = shuffle(Object.keys(lanes));
      while (out.length < n && order.some(t => lanes[t].length)) order.forEach(t => { if (out.length < n && lanes[t].length) out.push(lanes[t].shift()); });
    }
    return shuffle(out);
  },

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

/* SCORE-BEGIN */
/* ---------------- scoring: the one place that reads an answer key ----------------
   A single-answer item ('mc', the default when type is absent) has 4 options and an integer key;
   a multiple-response item (type 'mr') has 5 options and a sorted array of key indices.
   `x` is a bank question or a deal (deal.correct is already remapped to displayed positions).
   `sel` is null | int (mc) | array of indices (mr). Scoring is all-or-nothing everywhere.
   scripts/check_correct_usage.sh fails if code outside these markers reads an answer key. */
const Score = {
  isMR(x) { return !!x && x.type === 'mr'; },
  /* the key as a sorted array of option indices */
  keys(x) {
    const c = x ? x.correct : null;
    return (Array.isArray(c) ? c.filter(Number.isInteger) : Number.isInteger(c) ? [c] : []).sort((a, b) => a - b);
  },
  /* how many options the player must choose */
  need(x) { return Math.max(1, this.keys(x).length); },
  /* a selection as a sorted array of unique indices */
  picks(sel) {
    if (sel == null) return [];
    return [...new Set((Array.isArray(sel) ? sel : [sel]).filter(Number.isInteger))].sort((a, b) => a - b);
  },
  isKey(x, i) { return this.keys(x).includes(i); },
  isCorrect(x, sel) {
    const k = this.keys(x), p = this.picks(sel);
    return k.length > 0 && p.length === k.length && p.every((v, i) => v === k[i]);
  },
  /* the player chose as many options as the item asks for (a choose-two item with one pick is incomplete) */
  isComplete(x, sel) { return this.picks(sel).length === this.need(x); },
  isPartial(x, sel) { const n = this.picks(sel).length; return n > 0 && n < this.need(x); },
  hits(x, sel) { return this.picks(sel).filter(i => this.isKey(x, i)).length; },
  /* per option: 'hit' key you picked · 'miss' key you missed · 'wrong' distractor you picked · '' */
  marks(x, sel) {
    const p = this.picks(sel);
    return x.options.map((_, i) => this.isKey(x, i) ? (p.includes(i) ? 'hit' : 'miss') : (p.includes(i) ? 'wrong' : ''));
  },
  distractors(x) { return x.options.map((_, i) => i).filter(i => !this.isKey(x, i)); },
  keyTexts(x) { return this.keys(x).map(i => x.options[i]); },
  /* the key of a question dealt in `order` (order[j] = bank index shown at position j) */
  dealKey(q, order) {
    const k = this.keys(q).map(i => order.indexOf(i)).sort((a, b) => a - b);
    return this.isMR(q) ? k : k[0];
  },
  /* the key as fingerprint text: sorted, so it is the same however the bank lists it */
  fpKey(q) { return this.keys(q).join(','); },
  /* a saved selection that still fits the item, else null (mc: one index; mr: up to `need` unique indices) */
  validSel(x, sel) {
    const n = x.options.length, ok = i => Number.isInteger(i) && i >= 0 && i < n;
    if (!this.isMR(x)) return ok(sel) ? sel : null;
    if (!Array.isArray(sel) || !sel.length || !sel.every(ok)) return null;
    const p = this.picks(sel);
    return p.length === sel.length && p.length <= this.need(x) ? p : null;
  },
};
/* SCORE-END */

const NUM_WORD = ['zero', 'one', 'two', 'three', 'four', 'five'];
function chooseText(x) { const n = Score.need(x); return 'Choose ' + (NUM_WORD[n] || n) + '.'; }

/* short hash of a question's options and SORTED key: a saved mock answer is replayed only onto the same
   content. For a single-answer item the hashed text is exactly what it was before choose-two items existed */
function qFingerprint(q) {
  if (!q || !Array.isArray(q.options)) return '';
  const s = q.options.join('␞') + '#' + Score.fpKey(q);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/* shuffle a question's options (or replay a saved order), remapping the key; 4 or 5 options */
function dealQuestion(q, order) {
  order = order || shuffle(q.options.map((_, i) => i));
  return {
    id: q.id, type: Score.isMR(q) ? 'mr' : 'mc', order, ts: q.ts, scenario: q.scenario,
    q: q.q,
    options: order.map(i => q.options[i]),
    correct: Score.dealKey(q, order),
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
  '(?:\\.{1,2}\\/|\\b)[A-Za-z0-9_\\-][A-Za-z0-9_\\-.]*\\.(?:md|json|tsx|ts|jsx|js|py|yaml|yml|mjs)\\b',
  '\\/(?:compact|memory|reload-skills|clear|resume|config|status|usage|plugin)\\b',
  '\\b(?:PreToolUse|PostToolUse|SessionStart|UserPromptSubmit|allowed-tools|argument-hint|cache_control|tool_choice|allowedTools|isRetryable|errorCategory|isError|custom_id|fork_session|max_iterations|max_tokens|stop_reason|end_turn|tool_use|tool_result|few_shot|Grep|Glob)\\b',
  '\\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\b',
  '"(?:auto|any|none)"',
].join('|'), 'g');

function fmt(text) {
  const esc = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /* `backticked` spans are code as written; elsewhere, spot identifiers */
  const code = m => '<code' + (m.length > 22 ? ' class="lc"' : '') + '>' + m + '</code>';
  return esc.split(/`([^`\n]+)`/).map((part, i) => i % 2 ? code(part) : part.replace(CODE_RX, code)).join('');
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
    this.closeModal();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    this.current = name;
    window.scrollTo({ top: 0, behavior: 'auto' });
    /* the control that was clicked is now hidden: start keyboard and screen-reader users at the new heading */
    if (el) setTimeout(() => this.focusScreen(el), 0);
    if (name === 'home') this.renderHome();
    if (name === 'tower') Tower.render();
    if (name === 'blueprint') Blueprint.render();
    if (name === 'examintro') this.renderExamIntro();
    if (name === 'bestiary') this.renderBestiary();
    if (name === 'trophies') this.renderTrophies();
    if (window.Learn && Learn.onGo) Learn.onGo(name);
    Sound.click();
  },

  /* focus the active screen's heading unless focus already sits on something visible in it */
  focusScreen(el) {
    const a = document.activeElement;
    if (document.getElementById('overlay').classList.contains('show')) return;
    if (a && a !== document.body && el.contains(a) && a.offsetParent) return;
    const h = el.querySelector('h1') || el.querySelector('.screen-head h2');
    if (!h) return;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  },

  reducedMotion() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); },

  /* polite screen-reader announcement */
  announce(msg) {
    const r = document.getElementById('sr-live');
    if (!r) return;
    r.textContent = '';
    setTimeout(() => { r.textContent = msg; }, 60);
  },

  refreshHud() {
    const s = Game.s;
    document.getElementById('hud-title').textContent = Game.title();
    const next = Game.nextTitle();
    document.getElementById('hud-xp').innerHTML = s.xp.toLocaleString() + ' XP<span class="xp-next">' + (next ? ' · next: ' + next.t + ' @ ' + next.xp.toLocaleString() : ' · MAX') + '</span>';
    const prev = [...TITLES].reverse().find(t => s.xp >= t.xp);
    const pct = next ? Math.min(100, ((s.xp - prev.xp) / (next.xp - prev.xp)) * 100) : 100;
    document.getElementById('hud-xpfill').style.width = pct + '%';
    document.getElementById('hud-xpbar').setAttribute('aria-valuenow', Math.round(pct));
    /* a streak is live only if the last study day is today or yesterday */
    const y = new Date(); y.setDate(y.getDate() - 1);
    const streak = (s.streak.last === localDay(new Date()) || s.streak.last === localDay(y)) ? s.streak.count : 0;
    document.getElementById('hud-streak').textContent = streak;
    document.getElementById('hud-streak-chip').setAttribute('aria-label', 'Daily streak: ' + streak + (streak === 1 ? ' day' : ' days'));
    const snd = document.getElementById('btn-sound');
    snd.innerHTML = '<span aria-hidden="true">' + (s.soundOn ? '🔊' : '🔇') + '</span>';
    snd.setAttribute('aria-pressed', String(!!s.soundOn));
    const th = document.getElementById('btn-theme'), toDark = s.theme !== 'dark';
    th.innerHTML = '<span aria-hidden="true">' + (toDark ? '🌙' : '☀️') + '</span>';
    th.title = toDark ? 'Switch to dark theme' : 'Switch to light theme';
    th.setAttribute('aria-label', th.title);
    const deckN = s.deck.length;
    const db = document.getElementById('deck-badge'); if (db) db.textContent = deckN + (deckN === 1 ? ' card' : ' cards');
  },

  renderHome() {
    const s = Game.s;
    const cleared = FLOORS.filter(f => (s.floors[f.id] || {}).cleared).length;
    const acc = s.totals.answered ? Math.round((s.totals.correct / s.totals.answered) * 100) : 0;
    const pool = Bank.inScope();
    document.getElementById('hub-stats').innerHTML = [
      ['Questions seen', pool.filter(r => (s.qstats[r.id] || {}).seen).length + '/' + pool.length],
      ['Best mock', s.examBest ? s.examBest + '/1000' : (s.legacyExamBest ? s.legacyExamBest + ' (old)' : '—')],
      ['Accuracy', s.totals.answered ? acc + '%' : '—'],
      ['Floors cleared', cleared + '/10'],
      ['Monsters', s.bestiary.length + '/12'],
    ].map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    Readiness.render();
    document.getElementById('tower-badge').textContent = cleared + '/10 floors';
    document.getElementById('beast-badge').textContent = s.bestiary.length + '/12';
    document.getElementById('hunt-badge').textContent = s.bestiary.length + '/12 captured';
    document.getElementById('trophy-badge').textContent = s.achievements.length + '/' + ACHIEVEMENTS.length;
    const live = Exam.saved();
    document.getElementById('exam-badge').textContent = live ? '⏳ in progress · ' + clock(Math.max(0, Math.ceil((live.deadline - Date.now()) / 1000))) + ' left'
      : s.examBest ? 'best est. ' + s.examBest : '60 Q · 120 min';
    const bpSt = Blueprint.stats(pool);
    document.getElementById('bp-badge').textContent = bpSt.seen + '/' + bpSt.total + ' seen';
    const learn = document.getElementById('card-learn');
    if (learn) {
      learn.style.display = window.Learn ? '' : 'none';
      const lp = window.Learn && Learn.progress ? Learn.progress() : null;
      if (lp) document.getElementById('learn-badge').textContent = lp.done + '/' + lp.total + ' lessons';
    }
    this.refreshHud();
  },

  renderExamIntro() {
    const live = Exam.saved();
    const box = document.getElementById('ei-resume');
    if (live) {
      const left = Math.max(0, Math.ceil((live.deadline - Date.now()) / 1000));
      const answered = live.items.filter(i => { const q = i && Bank.byId(i.id); return q && Score.isComplete(q, i.sel); }).length;
      box.innerHTML = `<p><strong>⏳ You have a mock exam in progress</strong>: ${answered}/${live.items.length} answered, ${clock(left)} left on the clock.</p>
        <button class="btn primary" onclick="Exam.resume()">▶ Resume mock exam</button>`;
      box.style.display = 'block';
    } else box.style.display = 'none';
    const hist = Game.s.examHistory.slice(-5).reverse();
    document.getElementById('ei-history').innerHTML = hist.length ? '<h2>Recent attempts</h2>' + hist.map(h =>
      `<div class="hist-row"><span>${h.date} · ${h.mode === 'practice' ? 'Practice' : h.mode === 'proctor' ? 'Proctor (old)' : 'Mock'}</span><span>${h.correct}/${h.total}${h.mode === 'proctor' ? '' : ' · est. ' + h.score}</span></div>`).join('') : '';
  },

  renderBestiary() {
    const grid = document.getElementById('beast-grid');
    grid.innerHTML = Object.entries(MONSTERS).map(([name, m]) => {
      const got = Game.s.bestiary.includes(name);
      return `<div class="beast-card${got ? '' : ' locked'}">
        <div class="face" aria-hidden="true">${m.face}</div>
        <h2>${got ? name : '<span aria-hidden="true">???</span><span class="sr-only">Unknown monster</span>'}</h2>
        <div class="cry">${got ? m.cry : 'Undiscovered. Hunt it down.'}</div>
        <div class="weak">${got ? '✦ Weakness: ' + m.weak : '🔒 capture to reveal weakness'}</div>
        <div class="haunts">Haunts ${m.ts.map(t => `<b>${t}</b>`).join(' · ')}</div>
        <button class="btn small ${got ? 'ghost' : 'primary'}" onclick="Hunt.start('${name}')"${got ? ` aria-label="Hunt ${name} again"` : ` aria-label="Hunt the monster that haunts ${m.ts.join(', ')}"`}><span aria-hidden="true">🔦</span> ${got ? 'Hunt again' : 'Hunt'}</button>
      </div>`;
    }).join('');
  },

  renderTrophies() {
    document.getElementById('t-sub').textContent = Game.s.achievements.length + '/' + ACHIEVEMENTS.length + ' unlocked · title: ' + Game.title();
    document.getElementById('trophy-grid').innerHTML = ACHIEVEMENTS.map(a => {
      const got = Game.s.achievements.includes(a.id);
      return `<div class="trophy${got ? '' : ' locked'}"><div class="ic" aria-hidden="true">${a.ic}</div><div><div class="nm">${a.nm}${got ? '' : '<span class="sr-only"> (locked)</span>'}</div><div class="ds">${a.ds}</div></div></div>`;
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
    if (this.reducedMotion()) return;
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

  /* a question stem; a multiple-response item gets its "Choose two." from the key's length */
  renderStem(elId, deal) {
    document.getElementById(elId).innerHTML = fmt(deal.q) + (Score.isMR(deal) ? ` <strong class="mr-choose">${chooseText(deal)}</strong>` : '');
  },

  /* shared answer renderer. Single-answer: a click (or key 1–4) answers at once, onAnswer(i).
     Multiple-response: each option is a checkbox; a live "N of 2 selected" counter; Submit stays
     disabled (and says why) until exactly 2 are chosen, then onAnswer([i, j]). A third pick is refused,
     never swapped in, and nothing auto-submits. opts.live (strict mock): no Submit, every change goes
     to opts.onChange(picks). opts.sel restores a selection. Returns the option buttons */
  renderAnswers(containerId, deal, onAnswer, opts = {}) {
    const box = document.getElementById(containerId);
    box.innerHTML = '';
    const mr = Score.isMR(deal);
    box.classList.toggle('mr', mr);
    box._mr = null;
    if (!mr) {
      box.removeAttribute('role'); box.removeAttribute('aria-label');
      return deal.options.map((opt, i) => {
        const b = document.createElement('button');
        b.className = 'answer';
        b.innerHTML = `<span class="key">${i + 1}</span><span class="opt">${fmt(opt)}</span>`;
        b.onclick = () => { if (!b.classList.contains('disabled')) onAnswer(i, b); };
        box.appendChild(b);
        return b;
      });
    }
    const need = Score.need(deal), uid = containerId + '-mr';
    let sel = Score.picks(opts.sel).slice(0, need);
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Options. ' + chooseText(deal));
    const btns = deal.options.map((opt, i) => {
      const b = document.createElement('button');
      b.className = 'answer';
      b.setAttribute('role', 'checkbox');
      b.innerHTML = `<span class="key">${i + 1}</span><span class="opt">${fmt(opt)}</span>`;
      b.onclick = () => { if (!b.classList.contains('disabled')) toggle(i); };
      box.appendChild(b);
      return b;
    });
    const bar = document.createElement('div');
    bar.className = 'mr-bar';
    bar.innerHTML = `<span class="mr-count" id="${uid}-count" aria-live="polite"></span>`
      + (opts.live ? '' : `<span class="mr-why" id="${uid}-why"></span><button class="btn small primary mr-submit" id="${uid}-submit" aria-describedby="${uid}-why">Submit answer</button>`);
    box.appendChild(bar);
    const count = bar.querySelector('.mr-count'), why = bar.querySelector('.mr-why'), submit = bar.querySelector('.mr-submit');
    const api = box._mr = { done: false, need, deal, sel: () => sel.slice(), submit: () => trySubmit() };
    const update = () => {
      btns.forEach((b, i) => { const on = sel.includes(i); b.setAttribute('aria-checked', String(on)); b.classList.toggle('picked', on); });
      count.textContent = sel.length + ' of ' + need + ' selected' + (opts.live && sel.length && sel.length < need ? ' · incomplete' : '');
      if (submit) {
        const ready = sel.length === need;
        submit.setAttribute('aria-disabled', String(!ready));
        submit.classList.toggle('is-disabled', !ready);
        why.textContent = ready ? 'Ready. Press Submit or Enter.' : 'Select ' + (need - sel.length) + ' more to submit.';
      }
    };
    const toggle = (i) => {
      if (api.done) return;
      const at = sel.indexOf(i);
      if (at >= 0) sel.splice(at, 1);
      else if (sel.length >= need) {
        UI.announce('You already chose ' + need + '. Clear one before choosing another.');
        bar.classList.remove('nudge'); void bar.offsetWidth; bar.classList.add('nudge');
        return;
      } else sel.push(i);
      sel.sort((a, b) => a - b);
      update();
      Sound.click();
      if (opts.onChange) opts.onChange(sel.slice());
    };
    const trySubmit = () => {
      if (api.done || opts.live) return;
      if (sel.length !== need) { UI.announce(why.textContent); bar.classList.remove('nudge'); void bar.offsetWidth; bar.classList.add('nudge'); return; }
      onAnswer(sel.slice());
    };
    if (submit) submit.onclick = () => trySubmit();
    update();
    return btns;
  },

  /* after an answer: single-answer shows the key and your wrong pick; multiple-response marks every
     option (key you picked, key you missed, distractor you picked) and says "1 of 2 correct" */
  markAnswers(btns, deal, sel) {
    const marks = Score.marks(deal, sel);
    btns.forEach((b, i) => {
      b.classList.add('disabled');
      if (marks[i] === 'hit' || marks[i] === 'miss') b.classList.add('correct');
      if (marks[i] === 'wrong') b.classList.add('wrong');
    });
    if (!Score.isMR(deal)) return;
    const label = { hit: '✓ Correct · you chose it', miss: '✓ Correct · you missed it', wrong: '✗ Not correct · you chose it', '': '' };
    btns.forEach((b, i) => {
      b.setAttribute('aria-disabled', 'true');
      b.setAttribute('aria-checked', String(marks[i] === 'hit' || marks[i] === 'wrong'));
      b.classList.toggle('missed', marks[i] === 'miss');
      b.classList.remove('picked');
      if (marks[i]) b.insertAdjacentHTML('beforeend', `<span class="mark">${label[marks[i]]}</span>`);
    });
    const box = btns[0] && btns[0].parentNode;
    if (!box) return;
    if (box._mr) box._mr.done = true;
    const bar = box.querySelector('.mr-bar');
    if (bar) bar.innerHTML = `<span class="mr-count">${this.hitsText(deal, sel)}</span>`;
  },

  /* the answer dialog for a dealt question */
  feedback(deal, sel, ok, onNext, opts = {}) {
    const note = Score.isMR(deal) ? (ok ? 'Both correct options chosen.' : 'You chose ' + this.hitsText(deal, sel) + '.') : '';
    this.modal(ok, Score.keyTexts(deal), deal.explanation, onNext, { ...opts, note });
  },

  hitsText(deal, sel) {
    const h = Score.hits(deal, sel), n = Score.need(deal);
    return h + ' of ' + n + ' correct' + (h === n ? '' : ' · scored as wrong (all or nothing)');
  },

  /* correct: the key's option text (string, or an array for a multiple-response item) */
  modal(verdictOk, correctText, explanation, onNext, opts = {}) {
    const o = document.getElementById('overlay');
    const v = document.getElementById('m-verdict');
    v.textContent = opts.title || (verdictOk ? pick(['Correct!', 'Direct hit!', 'Critical insight!', 'Root cause: fixed.', 'The tower approves.']) : pick(['Not quite.', 'The boss counters!', 'A trap — and it worked.', 'That patch hides the root cause.']));
    v.className = 'verdict ' + (verdictOk ? 'good' : 'bad');
    document.getElementById('m-right').innerHTML = (opts.note ? `<div class="m-note">${opts.note}</div>` : '')
      + [].concat(correctText).map(t => '<div>✅ ' + fmt(t) + '</div>').join('');
    document.getElementById('m-expl').innerHTML = fmt(explanation);
    const btn = document.getElementById('m-next');
    btn.textContent = opts.btn || 'Continue';
    const back = document.activeElement;
    btn.onclick = () => {
      this.closeModal();
      onNext && onNext();
      this.restoreFocus(back);
    };
    o.classList.add('show');
    document.getElementById('app').inert = true;
    o.querySelector('.modal').scrollTop = 0;
    btn.focus();
  },

  closeModal() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('app').inert = false;
  },

  /* after the dialog: back where focus was if it is still there, else the next question's first answer */
  restoreFocus(prev) {
    if (document.getElementById('overlay').classList.contains('show')) return;
    const scr = document.querySelector('.screen.active');
    if (!scr) return;
    if (prev && prev !== document.body && prev.isConnected && prev.offsetParent && scr.contains(prev) && !prev.classList.contains('disabled')) { prev.focus(); return; }
    const first = scr.querySelector('.answer:not(.disabled)');
    if (first) first.focus({ preventScroll: true });
    else this.focusScreen(scr);
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
      /* unlocked floors are buttons; a locked floor is plain text */
      const row = document.createElement(unlocked ? 'button' : 'div');
      row.className = 'floor-card' + (fs.cleared ? ' cleared' : '') + (next ? ' next-up' : '') + (!unlocked ? ' locked' : '');
      row.innerHTML = `
        <span class="floor-num" style="background:${f.dcolor}">F${i + 1}</span>
        <span class="floor-meta">
          <span class="name"><span aria-hidden="true">${FLOORS[i].boss.face} </span>${f.name}</span>
          <span class="dom">${f.domain} · task statements ${f.ts.join(', ')} · ${Bank.forTs(f.ts).length} questions · boss: ${f.boss.name}</span>
        </span>
        <span class="floor-right">
          ${fs.best ? `<span class="score">${fs.best}/10${fs.best === 10 ? ' <span class="stars" aria-label="perfect">★</span>' : ''}</span>` : ''}
          <span class="status">${!unlocked ? '<span aria-hidden="true">🔒</span> locked: clear the floor below' : fs.cleared ? 'cleared — fight again' : 'ENTER'}</span>
        </span>`;
      if (unlocked) row.onclick = () => Battle.start(i);
      rows.push(row);
      prevCleared = !!fs.cleared;
    });
    // final floor card (Proctor)
    const allClear = FLOORS.every(f => (Game.s.floors[f.id] || {}).cleared);
    const fin = document.createElement('button');
    fin.className = 'floor-card final';
    fin.innerHTML = `
      <span class="floor-num" style="background:var(--gold-ink)" aria-hidden="true">👁️</span>
      <span class="floor-meta">
        <span class="name"><span aria-hidden="true">📋 </span>THE PROCTOR · Mock exam</span>
        <span class="dom">All domains at exam weights · 60 questions · 120 minutes · pass 720/1000</span>
      </span>
      <span class="floor-right">
        ${Game.s.examBest ? `<span class="score">best est. ${Game.s.examBest}</span>` : ''}
        <span class="status">${allClear ? 'Tower cleared: take a mock to check your readiness' : 'open early, if you dare'}</span>
      </span>`;
    fin.onclick = () => UI.go('examintro');
    rows.push(fin);
    rows.forEach(r => list.appendChild(r));
    /* the list climbs upward, so the floor to play next can sit far below the fold on a phone */
    const nextUp = list.querySelector('.next-up');
    if (nextUp) requestAnimationFrame(() => {
      const r = nextUp.getBoundingClientRect();
      if (r.bottom > window.innerHeight) {
        nextUp.scrollIntoView({ block: 'center', behavior: 'auto' });
        /* the heading is now off screen, so start keyboard users on the floor they scrolled to */
        if (UI.current === 'tower' && !document.getElementById('overlay').classList.contains('show')) nextUp.focus({ preventScroll: true });
      }
    });
  },
};

/* ---------------- battle ---------------- */
const HEARTS = 4;
const Battle = {
  floorIdx: 0, queue: [], qi: 0, right: 0, wrong: 0, combo: 0, maxCombo: 0,
  shield: false, usedCompact: false, usedThink: false, qStart: 0, xpGained: 0,

  start(floorIdx) {
    const f = FLOORS[floorIdx];
    const refs = Bank.pick(Bank.forTs(f.ts), 10, true);
    if (refs.length < 5) { UI.toast('🚧', 'This floor is still being carved', 'Question bank missing.'); return; }
    this.floorIdx = floorIdx;
    this.queue = refs.map(r => ({ deal: dealQuestion(r.q) }));
    this.qi = 0; this.right = 0; this.wrong = 0; this.combo = 0; this.maxCombo = 0;
    this.shield = false; this.xpGained = 0;

    document.getElementById('b-boss-name').textContent = f.boss.name + ' — ' + f.name;
    document.getElementById('b-player-name').textContent = Game.title();
    const sprite = document.getElementById('b-sprite');
    sprite.textContent = f.boss.face;
    sprite.className = 'boss-sprite';
    document.getElementById('b-speech').textContent = '“' + f.boss.taunt + '”';
    document.getElementById('b-boss-hp').style.width = '100%';
    document.getElementById('b-boss-hpbar').setAttribute('aria-label', 'Boss health 100%');
    UI.go('battle');
    this.renderPowerups();
    this.show();
  },

  /* 4 hearts: the 4th miss is the one that makes a 7/10 clear impossible */
  hearts() { return Math.max(0, HEARTS - this.wrong); },

  renderHearts() {
    const el = document.getElementById('b-hearts'), n = this.hearts();
    el.innerHTML = '❤️'.repeat(n) + '<span class="h-lost"></span>'.repeat(HEARTS - n);
    el.setAttribute('aria-label', n + ' of ' + HEARTS + ' lives left');
  },

  show() {
    const item = this.queue[this.qi];
    const q = item.deal;
    this.usedCompact = false; this.usedThink = false; this.answered = false;
    this.qStart = Date.now();
    document.getElementById('b-progress').textContent = `Q ${this.qi + 1}/${this.queue.length}`;
    document.getElementById('b-combo').textContent = this.combo >= 2 ? `🔥 combo ×${this.combo}` : '';
    const boss = FLOORS[this.floorIdx].boss;
    document.getElementById('b-speech').textContent = '“' + (this.right * (100 / this.queue.length) >= 60 ? boss.hurt : boss.taunt) + '”';
    this.renderHearts();
    document.getElementById('b-hint').className = 'hint-strip';
    document.getElementById('b-shield').className = 'shield-note' + (this.shield ? ' show' : '');
    UI.renderStem('b-qtext', q);
    this.buttons = UI.renderAnswers('b-answers', q, (sel) => this.answer(sel));
    this.renderPowerups();
  },

  /* /compact can't halve a choose-two item (it would leave the key in plain sight), so it is
     unavailable there: shown disabled with the reason, and not spent */
  renderPowerups() {
    const bar = document.getElementById('b-powerups');
    bar.innerHTML = '';
    const cur = this.queue[this.qi], mr = !!cur && Score.isMR(cur.deal);
    Object.entries(POWERUPS).forEach(([k, p]) => {
      const n = Game.s.powerups[k];
      const b = document.createElement('button');
      const blocked = k === 'compact' && mr;
      b.className = 'powerup' + (blocked ? ' blocked' : '');
      b.disabled = n <= 0 || blocked || (k === 'compact' && this.usedCompact) || (k === 'think' && this.usedThink) || (k === 'shield' && this.shield);
      b.innerHTML = `<span aria-hidden="true">${p.ic}</span> ${p.nm} <span class="cnt"><span class="sr-only">(</span>${n}<span class="sr-only"> left)</span></span>`
        + (blocked ? '<span class="pu-why">not on choose-two items</span>' : '');
      b.title = blocked ? p.nm + ' is not available on choose-two items' : p.ds;
      b.onclick = () => this.usePowerup(k);
      bar.appendChild(b);
    });
  },

  usePowerup(k) {
    if (Game.s.powerups[k] <= 0 || UI.current !== 'battle') return;
    if (this.answered) return;  // already answered: nothing to spend it on
    const q = this.queue[this.qi].deal;
    if (k === 'compact') {
      if (this.usedCompact || Score.isMR(q)) return;
      this.usedCompact = true;
      const wrongs = shuffle(Score.distractors(q)).slice(0, 2);
      wrongs.forEach(i => { this.buttons[i].classList.add('dim', 'disabled'); this.buttons[i].setAttribute('aria-disabled', 'true'); });
      UI.announce('Two wrong options removed.');
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

  /* sel: an option index, or the chosen indices of a choose-two item (one item for combo and hearts) */
  answer(sel) {
    const item = this.queue[this.qi];
    const q = item.deal;
    if (this.answered) return;
    this.answered = true;
    const ok = Score.isCorrect(q, sel);
    const fast = (Date.now() - this.qStart) < 15000;
    UI.markAnswers(this.buttons, q, sel);
    this.renderPowerups();
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
        this.renderPowerups();
      }
      document.getElementById('b-combo').textContent = this.combo >= 2 ? `🔥 combo ×${this.combo}` : '';
      crit ? Sound.crit() : Sound.good();
      sprite.classList.remove('hit'); void sprite.offsetWidth; sprite.classList.add('hit');
      this.floatDamage(crit ? 'CRIT ' + (12 + this.combo) : '' + (10 + this.combo), crit);
      const hpLeft = Math.max(0, 100 - this.right * (100 / this.queue.length));
      document.getElementById('b-boss-hp').style.width = hpLeft + '%';
      document.getElementById('b-boss-hpbar').setAttribute('aria-label', 'Boss health ' + Math.round(hpLeft) + '%');
      if (hpLeft <= 40) speech.textContent = '“' + f.boss.hurt + '”';
    } else {
      if (this.shield) {
        this.shield = false;
        document.getElementById('b-shield').className = 'shield-note';
        UI.toast('🛡️', 'Checkpoint absorbed the hit', 'No heart lost — but study the explanation.');
      } else {
        this.wrong++;
      }
      this.combo = 0;
      document.getElementById('b-combo').textContent = '';
      Game.deckAdd(q.id);
      Sound.bad();
      speech.textContent = pick(['“Ha! A classic trap!”', '“Your prompt-based defenses amuse me.”', '“That one costs a heart.”', '“The distractor claims another victim!”']);
      this.renderHearts();
    }

    setTimeout(() => {
      if (UI.current !== 'battle' || this.queue[this.qi] !== item) return;  // the player left this battle
      UI.feedback(q, sel, ok, () => this.next());
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
    if (this.wrong >= HEARTS) return this.finish(false);
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

    const queue = this.queue;
    setTimeout(() => {
      if (UI.current !== 'battle' || this.queue !== queue) return;  // progress is saved; don't yank the player back
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
      again.className = 'btn ghost'; again.innerHTML = win ? '<span aria-hidden="true">↻</span> Fight again' : '<span aria-hidden="true">⚔️</span> Rematch';
      again.onclick = () => Battle.start(this.floorIdx);
      const tower = document.createElement('button');
      tower.className = 'btn primary';
      tower.innerHTML = '<span aria-hidden="true">🗼</span> ' + (win ? 'Climb on' : 'Back to tower');

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
/* share of each domain's mock quota drawn from choose-two items. The real exam's multiple-response share
   and format aren't published; this is a practice choice, said so on the intro screen */
const MR_SHARE = 0.12;
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

  /* blueprint quotas first. Within a domain: fewest earlier mocks, then never answered anywhere,
     then a drawn scenario, then least recently seen; no task statement takes more than its share */
  build(scenarios) {
    const qs = Game.s.qstats, ms = Game.s.mockSeen, drawn = new Set(scenarios), picked = [];
    const key = r => [ms[r.id] || 0, (qs[r.id] || {}).seen ? 1 : 0, drawn.has(r.q.scenario) ? 0 : 1, (qs[r.id] || {}).at || 0];
    Object.entries(DOMAINS).forEach(([d, meta]) => {
      const cand = shuffle(Bank.inScope().filter(r => r.domain === d)).sort((a, b) => {
        const x = key(a), y = key(b);
        for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
        return 0;
      });
      /* MR_SHARE of the quota are choose-two items when the bank has them (16→2, 11/12/12/9→1), the rest
         single-answer; both lists keep the same ranking and share the per-task-statement cap */
      const mr = cand.filter(r => Score.isMR(r.q)), mc = cand.filter(r => !Score.isMR(r.q));
      const wantMR = Math.min(mr.length, Math.round(meta.exam * MR_SHARE));
      const nTs = new Set(cand.map(r => r.q.ts)).size, cap = Math.ceil(meta.exam / nTs) + 1, per = {}, take = [];
      const fill = (list, upto, capped) => list.forEach(r => {
        if (take.length >= upto || take.includes(r) || (capped && (per[r.q.ts] || 0) >= cap)) return;
        per[r.q.ts] = (per[r.q.ts] || 0) + 1; take.push(r);
      });
      fill(mr, wantMR, true); fill(mr, wantMR, false);
      fill(mc, meta.exam, true); fill(mc, meta.exam, false);
      fill(mr, meta.exam, false);  // a bank short of single-answer items tops up with choose-two ones
      picked.push(...take);
    });
    const blocks = scenarios.map(sid => shuffle(picked.filter(r => r.q.scenario === sid)));
    blocks.push(shuffle(picked.filter(r => !drawn.has(r.q.scenario))));
    return blocks.flat().map(r => this.item(r.q, null, {
      scenario: drawn.has(r.q.scenario) ? r.q.scenario : 0,
      seenBefore: !!(qs[r.id] && qs[r.id].seen),
      mockBefore: !!ms[r.id],
    }));
  },

  item(q, order, extra) {
    return { id: q.id, domain: Bank.domainOf(q), deal: dealQuestion(q, order), sel: null, flag: false, scenario: 0,
      seenBefore: false, mockBefore: false, shown: false, ...extra };
  },

  /* every question displayed in a mock or practice exam counts once toward mockSeen, answered or not */
  noteExposure() {
    if (this.exposed) return;
    this.exposed = true;
    this.items.forEach(it => { if (it.shown) Game.s.mockSeen[it.id] = (Game.s.mockSeen[it.id] || 0) + 1; });
    Game.save();
  },

  /* the same, for a saved attempt that is discarded without being restored (abandoned or voided).
     Records from before `sh` existed count the answered items */
  creditExposure(rec) {
    (rec.items || []).forEach(s => {
      if (s && Bank.byId(s.id) && (s.sh == null ? s.sel != null : s.sh)) Game.s.mockSeen[s.id] = (Game.s.mockSeen[s.id] || 0) + 1;
    });
    Game.save();
  },

  /* ---- persistence (strict mock only) ----
     v2+ records carry a per-item fingerprint of the options and key, so an answer is only replayed onto
     the question the player actually saw. v1 records (no fingerprints) are voided on load.
     v3: an item's sel is null | int (single-answer) | array of displayed indices (choose-two, possibly
     incomplete). A v2 record is read as-is: its sel is an int and every item is single-answer */
  stored() {
    try { const r = JSON.parse(localStorage.getItem(EXAM_KEY)); return r && (r.v === 1 || r.v === 2 || r.v === 3) ? r : null; }
    catch (e) { return null; }
  },
  saved() { const r = this.stored(); return r && r.v >= 2 && r.status === 'live' && Array.isArray(r.items) ? r : null; },
  clearSaved() { try { localStorage.removeItem(EXAM_KEY); } catch (e) {} },
  /* a finished attempt leaves a marker so another tab can't write it back as live */
  endSaved(status, attemptId = this.attemptId) { try { localStorage.setItem(EXAM_KEY, JSON.stringify({ v: 3, status, attemptId })); } catch (e) {} },
  /* true when another tab submitted, reset or replaced this attempt */
  takenOver() { const r = this.stored(); return !!r && (r.attemptId !== this.attemptId || r.status !== 'live'); },
  /* fresh: a new attempt replaces whatever record or end marker is there */
  persist(fresh) {
    if (this.variant !== 'mock' || this.submitted) return;
    if (!fresh && this.takenOver()) return this.detach();
    const rec = {
      v: 3, status: 'live', attemptId: this.attemptId, bankHash: Bank.hash(),
      startedAt: this.startedAt, deadline: this.deadline, idx: this.idx, scenarios: this.scenarios,
      items: this.items.map(it => ({ id: it.id, o: it.deal.order, fp: qFingerprint(Bank.byId(it.id)), sel: it.sel, flag: it.flag, sc: it.scenario, seen: it.seenBefore, mb: it.mockBefore, sh: it.shown })),
    };
    try { localStorage.setItem(EXAM_KEY, JSON.stringify(rec)); } catch (e) {}
  },
  /* an attempt survives bank growth; it is void only if one of its own questions is gone. An item whose
     options or key changed since it was saved (fingerprint mismatch, or an order that isn't a permutation)
     loses its answer and is dealt again. Returns false (void) or the number of answers cleared */
  restore(rec) {
    const items = [];
    let cleared = 0, changed = 0;
    for (const s of rec.items) {
      const q = s && Bank.byId(s.id);
      if (!q) return false;
      const n = q.options.length, o = s.o;
      const perm = Array.isArray(o) && o.length === n && (n === 4 || n === 5) && o.every(i => Number.isInteger(i) && i >= 0 && i < n) && new Set(o).size === n;
      const same = perm && s.fp === qFingerprint(q);
      const it = this.item(q, same ? o : null, { flag: !!s.flag, scenario: s.sc || 0, seenBefore: !!s.seen, mockBefore: !!s.mb,
        shown: s.sh == null ? s.sel != null : !!s.sh });
      it.sel = same ? Score.validSel(it.deal, s.sel) : null;
      if (!same) { changed++; if (s.sel != null) cleared++; }
      items.push(it);
    }
    Object.assign(this, { variant: 'mock', items, idx: Math.max(0, Math.min(items.length - 1, rec.idx || 0)), startedAt: rec.startedAt, deadline: rec.deadline,
      attemptId: rec.attemptId, scenarios: rec.scenarios || [], submitted: false, warned: false, exposed: false });
    if (changed) {
      this.persist();  // store the new deal and fingerprints, so this happens once
      if (cleared) UI.toast('✏️', cleared + (cleared === 1 ? ' answer was' : ' answers were') + ' cleared',
        'Those questions were updated in the bank since you answered them. Answer them again.');
    }
    return cleared;
  },

  /* a v1 record has no fingerprints, so its answers can't be checked against today's bank: void it */
  voidLegacy() {
    const r = this.stored();
    if (!r || r.v >= 2 || r.status !== 'live') return false;
    this.creditExposure(r);
    this.endSaved('voided', r.attemptId);
    UI.toast('🗑️', 'Saved mock exam voided', 'The question bank was updated since you started it, and that attempt can\'t be checked against the new questions safely.');
    return true;
  },

  /* on boot: void a stale attempt, or finish one whose clock ran out while away */
  checkSaved() {
    if (this.voidLegacy()) return;
    const rec = this.saved();
    if (!rec) return;
    if (this.restore(rec) === false) {
      this.creditExposure(rec);
      this.endSaved('voided', rec.attemptId);
      UI.toast('🗑️', 'Saved mock exam voided', 'Some of its questions were removed from the bank.');
      return;
    }
    if (Date.now() >= this.deadline) {
      UI.toast('🛎️', 'Time ran out while you were away', 'Your mock exam was submitted with the answers you saved.');
      this.submit('expired');
    } else {
      this.armExpiry();
      /* a reload lands on the title screen: offer the way back in */
      const b = document.getElementById('title-resume');
      if (b) { b.hidden = false; b.querySelector('b').textContent = Math.max(1, Math.round((this.deadline - Date.now()) / 60000)) + ' min left'; }
    }
  },

  /* a suspended mock whose clock ran out while the user was elsewhere in the app: score it once */
  settleExpired() {
    const rec = this.saved();
    if (this.active || !rec || Date.now() < rec.deadline) return false;
    if (this.restore(rec) === false) { this.creditExposure(rec); this.endSaved('voided', rec.attemptId); return false; }
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
    const old = this.saved();
    if (old && !confirm('Abandon the mock exam you have in progress? It will not be scored.')) return;
    /* the abandoned attempt's displayed questions still count as exposure, and its end marker makes
       another tab on it detach (a new mock then replaces the marker) */
    if (old) { this.creditExposure(old); this.endSaved('abandoned', old.attemptId); }
    else this.clearSaved();
    const scenarios = this.drawScenarios();
    const items = this.build(scenarios);
    if (items.length < 60) { UI.toast('🚧', 'Bank too small for a full exam', items.length + ' eligible questions.'); return; }
    const now = Date.now();
    Object.assign(this, { variant, items, scenarios, idx: 0, startedAt: now, deadline: now + EXAM_SECS * 1000,
      attemptId: String(now), submitted: false, warned: false, exposed: false });
    this.persist(true);
    this.enter();
  },

  resume() {
    const rec = this.saved();
    if (!rec || this.restore(rec) === false) { if (rec) { this.creditExposure(rec); this.endSaved('voided', rec.attemptId); } UI.toast('🗑️', 'Nothing to resume', 'That attempt is gone or the bank changed.'); UI.go('examintro'); return; }
    if (Date.now() >= this.deadline) { this.submit('expired'); return; }
    this.enter();
  },

  enter() {
    this.active = true;
    UI.go('exam');
    document.getElementById('screen-exam').classList.toggle('practice', this.variant === 'practice');
    document.getElementById('e-mode').textContent = this.variant === 'mock' ? 'Mock exam · no feedback until you submit' : 'Practice exam · feedback after each question';
    this.shownIdx = -1;
    document.getElementById('e-grid').innerHTML = '';
    this.renderGrid(); this.show();
    clearInterval(this.timer); clearTimeout(this.away);
    this.timer = setInterval(() => this.tick(), 1000);
    this.tick();
  },

  /* leaving the screen: the mock clock keeps running (it lives in the saved deadline) */
  suspend() { this.active = false; clearInterval(this.timer); clearTimeout(this.away); },
  abort() { this.suspend(); this.noteExposure(); if (this.variant === 'mock') this.endSaved('abandoned'); },

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
      document.getElementById('e-timer-lbl').textContent = left <= 600 ? 'remaining · under 10 minutes' : 'remaining';
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

  /* answered = as many options chosen as the item asks for; a choose-two item with one pick is incomplete */
  done(it) { return Score.isComplete(it.deal, it.sel); },
  partial(it) { return Score.isPartial(it.deal, it.sel); },

  renderPace() {
    const answered = this.items.filter(i => this.done(i)).length;
    const diff = Math.round((answered * PACE_SECS - this.elapsed()) / 60);
    const pace = Math.abs(diff) < 2 ? 'on pace' : diff > 0 ? diff + ' min ahead' : -diff + ' min behind';
    const el = document.getElementById('e-pace');
    el.textContent = `${answered}/${this.items.length} answered · ${pace}`;
    el.className = 'pace' + (diff <= -5 ? ' behind' : '');
  },

  show() {
    const it = this.items[this.idx], practice = this.variant === 'practice';
    const prev = this.items[this.idx - 1];
    if (!it.shown) { it.shown = true; this.persist(); }
    document.getElementById('e-qn').textContent = 'Question ' + (this.idx + 1) + ' of ' + this.items.length;
    const dt = document.getElementById('e-domain');
    dt.textContent = it.domain + ' · ' + it.deal.ts;
    dt.style.background = DOMAINS[it.domain].color;
    /* the real exam doesn't label items by domain or task statement; the strict mock shows them only in the review */
    dt.style.display = practice ? '' : 'none';
    const sc = GUIDE.scenarios.find(x => x.id === it.scenario);
    document.getElementById('e-scen').textContent = sc ? 'Scenario: ' + sc.name : 'General';
    const box = document.getElementById('e-scenbox');
    const blockStart = !prev || prev.scenario !== it.scenario;
    box.innerHTML = blockStart ? (sc ? `<strong>${sc.name}.</strong> ${sc.blurb}` : '<strong>General questions.</strong> Items that don\'t belong to one of this exam\'s four scenarios.') : '';
    box.style.display = blockStart ? 'block' : 'none';
    const flag = document.getElementById('e-flag');
    flag.className = 'flag-btn' + (it.flag ? ' on' : '');
    flag.setAttribute('aria-pressed', String(!!it.flag));
    flag.lastChild.textContent = it.flag ? ' Flagged' : ' Flag';
    UI.renderStem('e-qtext', it.deal);
    const fb = document.getElementById('e-feedback');
    fb.innerHTML = '';
    document.getElementById('e-qclock').textContent = '';
    this.qStart = Date.now();

    const mr = Score.isMR(it.deal);
    /* strict mock, choose-two: no per-item Submit; the selection is saved as it is made */
    const btns = UI.renderAnswers('e-answers', it.deal, (sel) => {
      if (practice) { if (it.sel == null) this.practiceAnswer(sel); return; }
      it.sel = sel;
      btns.forEach((b, j) => { b.classList.toggle('picked', j === sel); b.setAttribute('aria-pressed', String(j === sel)); });
      this.renderGrid(); this.persist(); this.renderPace();
      Sound.click();
    }, practice || !mr ? { sel: practice ? it.sel : null } : {
      live: true, sel: it.sel,
      onChange: (sel) => { it.sel = sel.length ? sel : null; this.renderGrid(); this.persist(); this.renderPace(); },
    });
    if (practice && it.sel != null) this.markPractice(btns, it);
    else if (!practice && !mr) btns.forEach((b, j) => { b.classList.toggle('picked', j === it.sel); b.setAttribute('aria-pressed', String(j === it.sel)); });
    if (this.shownIdx !== this.idx) {
      this.shownIdx = this.idx;
      UI.announce('Question ' + (this.idx + 1) + ' of ' + this.items.length + (mr ? ', ' + chooseText(it.deal).toLowerCase().replace('.', '') : '')
        + (this.done(it) ? ', answered' : this.partial(it) ? ', incomplete' : '') + (it.flag ? ', flagged' : ''));
    }
    document.getElementById('e-prev').disabled = this.idx === 0;
    document.getElementById('e-next').disabled = this.idx === this.items.length - 1;
  },

  practiceAnswer(sel) {
    const it = this.items[this.idx];
    it.sel = sel;
    it.secs = Math.round((Date.now() - this.qStart) / 1000);
    const ok = Score.isCorrect(it.deal, sel);
    Game.recordAnswer(ok, it.id);
    if (!ok) Game.deckAdd(it.id);
    ok ? Sound.good() : Sound.bad();
    this.show(); this.renderGrid(); this.renderPace();
    /* the answers were redrawn: keep keyboard users on the feedback's Next button */
    /* keep the marked answers in view on phones: focus Next without jumping to it */
    const next = document.querySelector('#e-feedback button');
    if (next) next.focus({ preventScroll: true });
  },

  markPractice(btns, it) {
    const ok = Score.isCorrect(it.deal, it.sel), mr = Score.isMR(it.deal);
    UI.markAnswers(btns, it.deal, it.sel);
    const last = this.idx === this.items.length - 1;
    if (this.announced !== it) {
      this.announced = it;
      const keys = Score.keys(it.deal).map(k => (k + 1) + ': ' + it.deal.options[k]).join('; ');
      UI.announce((ok ? 'Correct. ' : 'Not quite. ' + (mr ? UI.hitsText(it.deal, it.sel) + '. The answers are ' : 'The answer is ') + keys));
    }
    document.getElementById('e-feedback').innerHTML = `
      <div class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Correct' : 'Not quite'}${mr ? ' · ' + UI.hitsText(it.deal, it.sel) : ''}${it.secs != null ? ` · ${clock(it.secs)}${it.secs > PACE_SECS ? ' (over 2:00)' : ''}` : ''}</div>
      <div class="expl">${fmt(it.deal.explanation)}</div>
      <div class="right"><button class="btn small primary" onclick="${last ? 'Exam.confirmSubmit()' : 'Exam.nav(1)'}">${last ? 'Finish' : 'Next →'}</button></div>`;
    document.getElementById('e-qclock').textContent = '';
  },

  nav(d) { this.idx = Math.max(0, Math.min(this.items.length - 1, this.idx + d)); this.show(); this.renderGrid(); this.persist(); this.keepFocus(); },
  /* a redraw removed the focused control (e.g. the feedback's Next): continue at the new question's answers */
  keepFocus() {
    const a = document.activeElement;
    if (a && a !== document.body && a.isConnected) return;
    const first = document.querySelector('#e-answers .answer:not(.disabled)') || document.getElementById('e-qn');
    if (first) first.focus({ preventScroll: true });
  },
  jump(i) { this.idx = i; this.show(); this.renderGrid(); this.persist(); },
  toggleFlag() { const it = this.items[this.idx]; it.flag = !it.flag; this.show(); this.renderGrid(); this.persist(); },

  /* cells are updated in place, so the one you just used keeps keyboard focus */
  renderGrid() {
    const g = document.getElementById('e-grid');
    if (g.children.length !== this.items.length) {
      g.innerHTML = '';
      this.items.forEach((it, i) => {
        const c = document.createElement('button');
        c.textContent = i + 1;
        c.onclick = () => this.jump(i);
        g.appendChild(c);
      });
    }
    const practice = this.variant === 'practice';
    this.items.forEach((it, i) => {
      const c = g.children[i];
      let cls = 'nav-cell', state = [];
      if (this.done(it)) {
        const right = Score.isCorrect(it.deal, it.sel);
        cls += practice ? (right ? ' answered' : ' missed') : ' answered';
        state.push(practice ? (right ? 'correct' : 'missed') : 'answered');
      } else if (this.partial(it)) {
        cls += ' incomplete';
        state.push('incomplete, ' + Score.picks(it.sel).length + ' of ' + Score.need(it.deal) + ' chosen');
      } else state.push('not answered');
      if (it.flag) { cls += ' flagged'; state.push('flagged'); }
      if (i === this.idx) { cls += ' current'; c.setAttribute('aria-current', 'step'); } else c.removeAttribute('aria-current');
      if (i > 0 && this.items[i - 1].scenario !== it.scenario) cls += ' block-start';
      c.className = cls;
      c.setAttribute('aria-label', 'Question ' + (i + 1) + ', ' + state.join(', '));
    });
  },

  /* phone: jump from the sticky clock bar to the navigator, landing on the current question */
  focusGrid() {
    const c = document.getElementById('e-grid').children[this.idx];
    if (!c) return;
    c.scrollIntoView({ block: 'center', behavior: UI.reducedMotion() ? 'auto' : 'smooth' });
    c.focus({ preventScroll: true });
  },

  confirmSubmit() {
    const un = this.items.filter(i => !this.done(i)).length;
    const inc = this.items.filter(i => this.partial(i)).length;
    const fl = this.items.filter(i => i.flag).length;
    const unTxt = un ? '⚠️ ' + un + ' unanswered (scored as wrong)' + (inc ? ', including ' + inc + ' incomplete choose-two ' + (inc === 1 ? 'item' : 'items') + ' with only one option chosen' : '') + '.' : 'All answered.';
    if (!confirm(`Submit exam?\n\n${unTxt}${fl ? '\n🚩 ' + fl + ' still flagged.' : ''}`)) return;
    this.submit('submitted');
  },

  /* idempotent: history, XP and clinic updates happen exactly once per attempt */
  submit(reason) {
    if (this.submitted) return;
    const mock = this.variant === 'mock';
    if (mock && this.takenOver()) return this.detach();
    this.submitted = true;
    this.suspend();
    this.noteExposure();
    if (mock) this.endSaved('submitted');

    let correct = 0;
    const perDomain = {}, perScen = {};
    Object.keys(DOMAINS).forEach(d => perDomain[d] = { right: 0, total: 0 });
    this.items.forEach(it => {
      const ok = Score.isCorrect(it.deal, it.sel);
      perDomain[it.domain].total++;
      const ps = perScen[it.scenario] || (perScen[it.scenario] = { right: 0, total: 0 });
      ps.total++;
      if (ok) { correct++; perDomain[it.domain].right++; ps.right++; }
      /* unanswered (and incomplete choose-two) items score as wrong but stay out of the clinic, totals and
         per-question stats; a mock scored after expiring while away doesn't count as studying today */
      if (mock && this.done(it)) { if (!ok) Game.deckAdd(it.id); Game.recordAnswer(ok, it.id, false, reason === 'expired'); }
    });
    const total = this.items.length, pct = correct / total;
    const score = scaledScore(pct);
    const se = Math.sqrt(Math.max(pct * (1 - pct), 0.01) / total);
    const band = pct >= 0.72 + se ? 'above' : pct >= 0.72 - se ? 'near' : 'below';
    const used = this.elapsed();
    const seenBefore = this.items.filter(i => i.seenBefore).length;
    const mockBefore = this.items.filter(i => i.mockBefore).length;

    if (mock) Game.s.examBest = Math.max(Game.s.examBest, score);
    Game.s.examHistory.push({ mode: this.variant, score, correct, total, pct: Math.round(pct * 100), reason,
      perDomain: Object.fromEntries(Object.entries(perDomain).map(([d, r]) => [d, [r.right, r.total]])),
      scenarios: this.scenarios, seenBefore, mockBefore, secs: used, date: localDay(new Date()) });
    Game.s.examHistory = Game.s.examHistory.slice(-50);
    Game.save();

    const xp = correct * 5 + (mock && score >= 720 ? 600 : 0) + (mock && score >= 900 ? 600 : 0);
    Game.addXP(xp);
    if (mock && score >= 720) Game.unlock('certified');
    if (mock && score >= 900) Game.unlock('beat-blogger');

    const mrItems = this.items.filter(i => Score.isMR(i.deal));
    const mr = { total: mrItems.length, right: mrItems.filter(i => Score.isCorrect(i.deal, i.sel)).length };
    this.renderResult({ correct, total, pct, score, band, used, seenBefore, mockBefore, perDomain, perScen, xp, mock, mr });
    if (band === 'above') { Sound.win(); UI.confetti(); } else Sound.lose();
    UI.go('examresult');
  },

  renderResult(r) {
    document.getElementById('er-kind').textContent = r.mock ? 'Mock exam result' : 'Practice exam result';
    /* one sitting is a noisy sample: show a band (about two standard errors), not a point */
    const se = Math.sqrt(Math.max(r.pct * (1 - r.pct), 0.01) / r.total);
    const r10 = x => Math.round(x / 10) * 10;
    const lo = Math.max(100, r10(scaledScore(Math.max(0, r.pct - 2 * se)))), hi = Math.min(1000, r10(scaledScore(Math.min(1, r.pct + 2 * se))));
    document.getElementById('er-score').textContent = '~' + lo + '–' + hi;
    document.getElementById('er-raw').textContent = r.correct + '/' + r.total + ' raw';
    const arc = document.getElementById('er-arc');
    arc.style.transition = 'none'; arc.style.strokeDashoffset = 540;
    arc.style.stroke = r.band === 'above' ? 'var(--good)' : r.band === 'near' ? 'var(--gold)' : 'var(--bad)';
    setTimeout(() => { arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)'; arc.style.strokeDashoffset = 540 - (540 * r.score / 1000); }, 60);
    const banner = document.getElementById('er-banner');
    banner.textContent = { above: '📜 Above the 720 line', near: '⚖️ Right on the line', below: '❌ Below the 720 line' }[r.band];
    banner.style.color = { above: 'var(--good)', near: 'var(--gold)', below: 'var(--bad)' }[r.band];
    document.getElementById('er-sub').textContent = `${r.correct}/${r.total} correct (${Math.round(r.pct * 100)}%) · ${Math.round(r.used / 60)}${r.mock ? ' of 120' : ''} minutes · ${Math.round(r.used / r.total)}s per question · +${r.xp} XP`;
    document.getElementById('er-note').innerHTML = `The scaled score is an <strong>estimate</strong>: a likely range of ${lo}–${hi}, centred on ${r.score} (72% raw maps to 720; the real scaling isn't published). One 60-question attempt is roughly ±100 points, so take two or three before trusting a trend.`
      + (r.mr.total ? ` ${r.mr.total} of ${r.total} items were choose-two (${r.mr.right} right, scored all or nothing); the real exam's multiple-response share isn't published, so that mix is our practice choice.`
        : ` This attempt had no choose-two items; the real exam includes multiple-response items.`)
      + ` <strong>${r.total - r.seenBefore} of ${r.total}</strong> questions were new to you`
      + (r.mockBefore ? ` and <strong>${r.mockBefore}</strong> had appeared in an earlier mock or practice exam` : '')
      + (r.seenBefore > r.total / 4 ? '. Questions you have answered before can inflate the score.' : '.');

    const bar = (label, right, total, color) => {
      const pct = total ? Math.round((right / total) * 100) : 0;
      return `<div class="dbar"><div class="row"><span>${label}</span><span>${right}/${total} · ${pct}%</span></div>
        <div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div></div>`;
    };
    document.getElementById('er-bars').innerHTML = '<h2>By domain</h2>' + Object.entries(r.perDomain).map(([d, x]) => bar(d + ' · ' + DOMAINS[d].label, x.right, x.total, DOMAINS[d].color)).join('')
      + '<h2>By scenario</h2>' + Object.entries(r.perScen).map(([sid, x]) => {
        const sc = GUIDE.scenarios.find(s => s.id === Number(sid));
        return bar(sc ? sc.name : 'General', x.right, x.total, 'var(--accent)');
      }).join('');

    const focus = Blueprint.focus(3);
    document.getElementById('er-focus').innerHTML = focus.length ? `<h2>Focus next <span class="muted">(from all your answers so far)</span></h2>` + focus.map(f =>
      `<div class="focus-row"><span><b>${f.t.id}</b> ${f.t.title}<br><span class="muted">${f.note}</span></span><button class="btn small ghost" onclick="Blueprint.drillTs('${f.t.id}')" aria-label="Drill ${f.t.id}">Drill</button></div>`).join('') : '';

    const acts = document.getElementById('er-actions');
    acts.innerHTML = '';
    [['all', '🔍', 'Review all'], ['wrong', '✘', 'Wrong only'], ['flagged', '🚩', 'Flagged']].filter(([k]) => k !== 'flagged' || this.variant !== 'practice').forEach(([k, ic, label]) => {
      const b = document.createElement('button');
      b.className = 'btn ghost small review-filter'; b.innerHTML = `<span aria-hidden="true">${ic}</span> ${label}`;
      b.setAttribute('aria-pressed', 'false'); b.dataset.filter = k;
      b.setAttribute('aria-controls', 'er-review');
      b.onclick = () => this.renderReview(k);
      acts.appendChild(b);
    });
    const bp = document.createElement('button');
    bp.className = 'btn ghost small'; bp.innerHTML = '<span aria-hidden="true">📘</span> Blueprint';
    bp.onclick = () => UI.go('blueprint');
    const home = document.createElement('button');
    home.className = 'btn primary small'; home.innerHTML = '<span aria-hidden="true">🏛️</span> Back to the hall';
    home.onclick = () => UI.go('home');
    acts.append(bp, home);
    document.getElementById('er-review').innerHTML = '';
  },

  renderReview(filter) {
    const list = this.items.map((it, n) => ({ it, n })).filter(({ it }) =>
      filter === 'wrong' ? !Score.isCorrect(it.deal, it.sel) : filter === 'flagged' ? it.flag : true);
    const MARK = { hit: ['ok', '✔ correct · you chose it'], miss: ['miss', '○ correct · you missed it'], wrong: ['no', '✘ not correct · you chose it'], '': ['plain', ''] };
    document.getElementById('er-review').innerHTML = list.length ? list.map(({ it, n }) => {
      const ok = Score.isCorrect(it.deal, it.sel);
      const ts = GUIDE.taskStatements.find(t => t.id === it.deal.ts);
      /* choose-two: every option with its mark, and how many of the two you got */
      const body = Score.isMR(it.deal)
        ? `<div class="row ${ok ? 'ok' : 'no'}">${ok ? '✔' : '✘'} ${Score.picks(it.sel).length ? UI.hitsText(it.deal, it.sel) : 'no answer'}${this.partial(it) ? ' · incomplete' : ''}</div>
           <ul class="rev-opts">${Score.marks(it.deal, it.sel).map((m, i) => `<li class="${MARK[m][0]}">${MARK[m][1] ? `<b>${MARK[m][1]}:</b> ` : ''}${fmt(it.deal.options[i])}</li>`).join('')}</ul>`
        : `<div class="row ${ok ? 'ok' : 'no'}">${ok ? '✔' : '✘'} you: ${it.sel != null ? fmt(it.deal.options[it.sel]) : '<em>no answer</em>'}</div>
           ${ok ? '' : `<div class="row ok">✔ correct: ${fmt(Score.keyTexts(it.deal)[0])}</div>`}`;
      return `<div class="rev-item">
        <div class="tsline">${it.domain} · ${ts ? ts.id + ' ' + ts.title : ''}${it.flag ? ' · 🚩' : ''}</div>
        <div class="q">${n + 1}. ${fmt(it.deal.q)}${Score.isMR(it.deal) ? ` <strong>${chooseText(it.deal)}</strong>` : ''}</div>
        ${body}
        <div class="ex">${fmt(it.deal.explanation)}</div>
      </div>`;
    }).join('') : '<p class="center muted">Nothing in this filter.</p>';
    document.querySelectorAll('#er-actions .review-filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    UI.announce(list.length + (list.length === 1 ? ' question' : ' questions') + ' in this review');
    const rv = document.getElementById('er-review');
    if (rv.getBoundingClientRect().top > window.innerHeight * 0.6) rv.scrollIntoView({ block: 'start', behavior: UI.reducedMotion() ? 'auto' : 'smooth' });
  },

};

/* ---------------- the blueprint (exam-guide study mode) ---------------- */
/* ---------------- readiness (home) ----------------
   Honest progress, not a predicted score: coverage and FIRST-try accuracy per domain from practice,
   and the estimate from your latest strict mock. Retries, Clinic repeats and Lightning don't inflate it. */
const READY_MIN_FIRST = 20, READY_TARGET = 0.72;

const Readiness = {
  domains() {
    const qs = Game.s.qstats;
    return Object.entries(DOMAINS).map(([d, meta]) => {
      const refs = Bank.inScope().filter(r => r.domain === d);
      let seen = 0, firstN = 0, firstRight = 0;
      refs.forEach(r => { const st = qs[r.id]; if (!st || !st.seen) return; seen++; if (st.first != null) { firstN++; firstRight += st.first; } });
      return { d, meta, total: refs.length, seen, firstN, firstRight, acc: firstN ? firstRight / firstN : null };
    });
  },

  /* first-try accuracy split by item format: blind guessing gets 25% on a single-answer item but only
     10% on a choose-two item (1 of the 10 possible pairs), so the two aren't pooled silently */
  formats() {
    const qs = Game.s.qstats, out = { mc: { n: 0, right: 0, total: 0 }, mr: { n: 0, right: 0, total: 0 } };
    Bank.inScope().forEach(r => {
      const f = out[Score.isMR(r.q) ? 'mr' : 'mc'], st = qs[r.id];
      f.total++;
      if (st && st.seen && st.first != null) { f.n++; f.right += st.first; }
    });
    return out;
  },

  formatLine() {
    const f = this.formats();
    const part = (x, name, chance) => `${name}: ${x.n ? Math.round(x.right / x.n * 100) + '% of ' + x.n + ' first ' + (x.n === 1 ? 'try' : 'tries') : x.total ? 'no first tries yet' : 'none in the bank yet'} <span class="muted">(chance ${chance})</span>`;
    return `<p class="ready-fmt small" id="ready-fmt"><b>By format.</b> ${part(f.mc, 'Single-answer', '25%')} · ${part(f.mr, 'Choose-two', '10%')}. The domain rows above pool both.</p>`;
  },

  lastMock() { return [...Game.s.examHistory].reverse().find(h => h.mode === 'mock') || null; },

  /* the single most useful thing to do next */
  next(rows) {
    const s = Game.s, days = h => (Date.now() - new Date(h.date + 'T00:00').getTime()) / 864e5;   // a local day
    if (!s.totals.answered) {
      if (window.Learn) return { ic: '🎓', label: 'Start with the learning path', sub: 'Short lessons for each domain, then drills.', run: () => UI.go('learn') };
      return { ic: '📘', label: 'Start with a D1 drill', sub: 'Domain 1 is 27% of the exam. Ten questions, explained one by one.', run: () => Blueprint.drillDomain('D1') };
    }
    if (s.deck.length >= 10) return { ic: '🩹', label: `Treat ${s.deck.length} mistakes in the Clinic`, sub: 'Your own misses are the highest-yield study there is.', run: () => Review.start() };
    const thin = rows.filter(r => r.firstN < READY_MIN_FIRST).sort((a, b) => a.firstN - b.firstN || b.meta.weight - a.meta.weight)[0];
    if (thin) return { ic: '🧭', label: `Cover ${thin.d}: ${thin.meta.label}`, sub: `${thin.firstN} of ${READY_MIN_FIRST} first tries so far. A drill serves questions you haven't seen.`, run: () => Blueprint.drillDomain(thin.d) };
    const weighted = rows.reduce((a, r) => a + r.acc * r.meta.weight, 0) / 100, last = this.lastMock();
    if (weighted >= READY_TARGET && (!last || days(last) >= 7)) return { ic: '📋', label: 'Take a full mock exam', sub: 'Your practice says you are close. Test it under real conditions: 60 questions, 120 minutes.', run: () => UI.go('examintro') };
    const f = Blueprint.focus(1)[0];
    if (!f) return { ic: '📋', label: 'Take a full mock exam', sub: '60 questions, 120 minutes.', run: () => UI.go('examintro') };
    const lesson = window.Learn && Learn.forTs ? Learn.forTs(f.t.id) : null;
    return { ic: '🎯', label: `Drill ${f.t.id}: ${f.t.title}`, sub: f.note + (lesson ? ' · a lesson is available in Learn' : ''), run: () => Blueprint.drillTs(f.t.id), lesson };
  },

  render() {
    const box = document.getElementById('ready-panel');
    if (!box) return;
    const rows = this.domains(), nx = this.next(rows), last = this.lastMock();
    this.go = nx.run;
    const ready = rows.every(r => r.firstN >= READY_MIN_FIRST);
    const weighted = ready ? Math.round(rows.reduce((a, r) => a + r.acc * r.meta.weight, 0)) : null;
    box.innerHTML = `
      <div class="ready-head">
        <div><h2>Exam readiness</h2>
          <div class="muted small">First-try accuracy on questions you've practised, by exam domain. A domain counts once you have ${READY_MIN_FIRST} first tries in it.</div></div>
        <div class="ready-sum">
          <div class="k">Practice, weighted</div><div class="v">${weighted != null ? weighted + '%' : '—'}</div>
          <div class="k">Last mock</div><div class="v">${last ? '~' + last.score + ' <span class="muted small">estimate · ' + last.date + '</span>' : '—'}</div>
        </div>
      </div>
      <div class="ready-rows">${rows.map(r => {
        const pct = r.acc != null ? Math.round(r.acc * 100) : 0, cov = Math.round(Math.min(1, r.firstN / READY_MIN_FIRST) * 100);
        const counted = r.firstN >= READY_MIN_FIRST;
        return `<button class="ready-row" onclick="Blueprint.drillDomain('${r.d}')" title="Drill ${r.d}">
          <span class="domain-tag" style="background:${r.meta.color}"><span class="sr-only">Drill </span>${r.d}</span>
          <span class="nm">${r.meta.label}<span class="muted small"> · ${r.meta.weight}% of the exam</span></span>
          <span class="track"><span class="cov" style="width:${cov}%"></span><span class="acc" style="width:${counted ? pct : 0}%;background:${r.meta.color}"></span><span class="target"></span></span>
          <span class="val">${counted ? pct + '%<span class="sr-only"> right on first tries</span>' : r.firstN + '/' + READY_MIN_FIRST + ' tries'}</span>
        </button>`;
      }).join('')}</div>
      ${this.formatLine()}
      <div class="next-step">
        <span class="ic" aria-hidden="true">${nx.ic}</span>
        <span class="txt" id="next-step-txt"><b>Next best step:</b> ${nx.label}<br><span class="muted small">${nx.sub}</span></span>
        ${nx.lesson ? `<button class="btn small ghost" onclick="Learn.open('${nx.lesson}')"><span aria-hidden="true">🎓</span> Lesson</button>` : ''}
        <button class="btn small primary" onclick="Readiness.go()" aria-describedby="next-step-txt">Go →</button>
      </div>
      <p class="muted small">The line on each bar marks ${Math.round(READY_TARGET * 100)}%, the raw score our mock maps to the 720 pass mark. Practice accuracy is not an exam score; a strict mock is the closest thing to one.</p>`;
  },
};

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

  pick(refs, n, spread) { return Bank.pick(refs, n, spread); },

  drillTs(id) {
    const t = GUIDE.taskStatements.find(x => x.id === id);
    Drill.start(this.pick(this.refsFor(q => q.ts === id), 10), `${id} · ${t.title}`);
  },
  drillDomain(d) { Drill.start(this.pick(this.refsFor(q => Bank.domainOf(q) === d), 10, true), `${d} · ${DOMAINS[d].label}`); },
  drillScenario(sid) {
    const sc = GUIDE.scenarios.find(x => x.id === sid);
    Drill.start(this.pick(this.refsFor(q => q.scenario === sid), 10, true), 'Scenario · ' + sc.name);
  },

  setTab(t) { this.tab = t; this.render(); },

  render() {
    const g = GUIDE.exam;
    document.getElementById('bp-version').textContent = GUIDE.version;
    document.getElementById('bp-facts').innerHTML = [
      `❓ <b>${g.items}</b> items`, `⏱️ <b>${g.minutes}</b> min`, `🎬 <b>${g.scenarios}</b> of ${g.scenarioBank} scenarios`, `🎯 pass <b>${g.pass}</b> scaled (${g.scaleMin}–${g.scaleMax})`,
    ].map(x => `<div class="fact-pill">${x}</div>`).join('');
    document.querySelectorAll('#bp-tabs button').forEach(b => { b.classList.toggle('on', b.dataset.tab === this.tab); b.setAttribute('aria-pressed', String(b.dataset.tab === this.tab)); });

    const focus = this.focus(3);
    document.getElementById('bp-focus').innerHTML = `<h2><span aria-hidden="true">🎯</span> Focus next</h2>` + focus.map(f =>
      `<div class="focus-row"><span><b>${f.t.id}</b> ${f.t.title}<br><span class="muted">${f.note}</span></span><button class="btn small primary" onclick="Blueprint.drillTs('${f.t.id}')" aria-label="Drill ${f.t.id}">Drill</button></div>`).join('');

    const body = document.getElementById('bp-body');
    body.innerHTML = this.tab === 'domains' ? this.renderDomains() : this.tab === 'scenarios' ? this.renderScenarios() : this.renderPrep();
    document.getElementById('bp-oos').innerHTML = GUIDE.outOfScope.map(x => `<li>${x}</li>`).join('');
  },

  bar(st, color) {
    const pct = st.total ? Math.round((st.right / st.total) * 100) : 0;
    const seen = st.total ? Math.round((st.seen / st.total) * 100) : 0;
    return `<div class="bp-bar" title="seen ${seen}% · right on last try ${pct}%" role="img" aria-label="seen ${seen}%, right on last try ${pct}%"><div class="seen" style="width:${seen}%"></div><div class="right" style="width:${pct}%;background:${color}"></div></div>`;
  },

  renderDomains() {
    return GUIDE.domains.map(d => {
      const dom = DOMAINS[d.id];
      const st = this.stats(this.refsFor(q => Bank.domainOf(q) === d.id));
      const tss = GUIDE.taskStatements.filter(t => t.id[0] === String(d.n));
      /* the drill button sits beside the summary, not inside it (no control nested in a control) */
      return `<div class="bp-dwrap"><details class="bp-domain" style="--dc:${dom.color}">
        <summary>
          <span class="bp-dnum">D${d.n}</span>
          <span class="bp-dmeta"><span class="nm">${d.label}</span><span class="muted">${d.weight}% · ${d.exam} of 60 items · ${this.statLine(st)}</span>${this.bar(st, dom.color)}</span>
        </summary>
        ${tss.map(t => this.renderTs(t, dom.color)).join('')}
      </details>
      <button class="btn small ghost bp-ddrill" onclick="Blueprint.drillDomain('${d.id}')" aria-label="Drill domain ${d.n}: ${d.label}">Drill domain</button></div>`;
    }).join('');
  },

  renderTs(t, color) {
    const st = this.stats(this.refsFor(q => q.ts === t.id));
    const docs = ((GUIDE.docs || {})[t.id] || []).map(x => `<a href="${x.url}" target="_blank" rel="noopener">${x.title}</a>`).join(' · ');
    const delta = (GUIDE.deltas || {})[t.id];
    const lesson = window.Learn && Learn.forTs ? Learn.forTs(t.id) : null;
    return `<div class="bp-ts">
      <div class="bp-tshead">
        <span class="bp-tsid">${t.id}</span>
        <span class="bp-tstitle">${t.title}<br><span class="muted">${this.statLine(st)}</span>${this.bar(st, color)}</span>
        ${lesson ? `<button class="btn small ghost" onclick="Learn.open('${lesson}')"><span aria-hidden="true">🎓</span> Lesson</button>` : ''}
        <button class="btn small primary" ${st.total ? '' : 'disabled'} onclick="Blueprint.drillTs('${t.id}')" aria-label="Drill ${Math.min(10, st.total)} questions on ${t.id}">Drill ${Math.min(10, st.total)}</button>
      </div>
      <div class="bp-ideas">
        <div><h3>Know</h3><ul>${t.know.map(x => `<li>${fmt(x)}</li>`).join('')}</ul></div>
        <div><h3>Be able to</h3><ul>${t.skills.map(x => `<li>${fmt(x)}</li>`).join('')}</ul></div>
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
        <button class="btn small primary" onclick="Blueprint.drillScenario(${sc.id})" aria-label="Drill scenario ${sc.id}: ${sc.name}">Drill scenario</button>
      </div>`;
    }).join('') + `</div><p class="muted small mt">On the real exam, 4 of these 6 scenarios are drawn at random. Each frames a set of questions.</p>`;
  },
};

/* ---------------- drill (Blueprint practice with instant feedback) ---------------- */
/* one engine for every untimed practice run: Blueprint drills and the Anti-Pattern Hunt (opts.onDone) */
const Drill = {
  queue: [], qi: 0, right: 0, label: '', buttons: [], xp: 0, opts: {},

  start(refs, label, opts = {}) {
    if (!refs.length) { UI.toast('🚧', 'No questions here yet', 'This part of the guide has no questions in the bank.'); return; }
    this.queue = refs.map(r => dealQuestion(r.q));
    this.qi = 0; this.right = 0; this.xp = 0; this.label = label; this.opts = opts;
    /* a drill started from the hall (next best step, readiness rows) goes back there, so the next step updates */
    const from = UI.current === 'drill' || UI.current === 'result' ? (this.from || 'blueprint') : UI.current;
    this.from = from === 'home' ? 'home' : 'blueprint';
    UI.go('drill');
    document.getElementById('d-title').textContent = label;
    const back = document.getElementById('d-back');
    const dflt = this.from === 'home' ? ['home', '← Hall'] : ['blueprint', '← Blueprint'];
    back.textContent = opts.back ? opts.back[1] : dflt[1];
    back.onclick = () => UI.go(opts.back ? opts.back[0] : dflt[0]);
    this.show();
  },

  show() {
    const q = this.queue[this.qi];
    const t = GUIDE.taskStatements.find(x => x.id === q.ts);
    document.getElementById('d-progress').textContent = `Q ${this.qi + 1}/${this.queue.length} · ${this.right} right`;
    document.getElementById('d-ts').textContent = t ? `${t.id} · ${t.title}` : '';
    UI.renderStem('d-qtext', q);
    this.answered = false;
    this.buttons = UI.renderAnswers('d-answers', q, (sel) => this.answer(sel));
  },

  answer(sel) {
    const q = this.queue[this.qi];
    if (this.answered) return;
    this.answered = true;
    const ok = Score.isCorrect(q, sel);
    Game.recordAnswer(ok, q.id);
    UI.markAnswers(this.buttons, q, sel);
    if (ok) { this.right++; this.xp += 15; Game.addXP(15); Sound.good(); }
    else { Game.deckAdd(q.id); Sound.bad(); }
    setTimeout(() => {
      if (UI.current !== 'drill' || this.queue[this.qi] !== q) return;
      UI.feedback(q, sel, ok, () => this.next(),
        { btn: this.qi + 1 >= this.queue.length ? (this.opts.finish || 'Finish drill') : 'Next question' });
    }, 700);
  },

  next() {
    this.qi++;
    if (this.qi < this.queue.length) return this.show();
    if (this.opts.onDone) return this.opts.onDone(this.right, this.queue.length, this.xp);
    const n = this.queue.length, good = this.right / n >= 0.75;
    document.getElementById('r-emoji').textContent = good ? '📘' : '📖';
    const t = document.getElementById('r-title');
    t.textContent = good ? 'DRILL DONE' : 'KEEP STUDYING'; t.className = good ? 'win' : 'lose';
    document.getElementById('r-sub').textContent = this.label;
    document.getElementById('r-stats').innerHTML = [['Score', this.right + '/' + n], ['XP earned', '+' + this.xp]]
      .map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    const acts = document.getElementById('r-actions');
    acts.innerHTML = '';
    const home = document.createElement('button');
    home.className = this.from === 'home' ? 'btn primary' : 'btn ghost';
    home.innerHTML = '<span aria-hidden="true">🏛️</span> Hall · next step';
    home.onclick = () => UI.go('home');
    const bp = document.createElement('button');
    bp.className = this.from === 'home' ? 'btn ghost' : 'btn primary';
    bp.innerHTML = '<span aria-hidden="true">📘</span> Back to the Blueprint';
    bp.onclick = () => UI.go('blueprint');
    acts.append(home, bp);
    good ? Sound.win() : Sound.lose();
    UI.go('result');
  },
};

/* ---------------- lightning round ---------------- */
const Lightning = {
  running: false, score: 0, combo: 0, secs: 90, timer: null, pool: [], buttons: [],

  /* a recall sprint: questions you've already studied, so speed trains recall instead of skimming new stems.
     Single-answer only: a choose-two item doesn't fit a one-tap sprint */
  sprintPool() {
    const all = Bank.inScope().filter(r => !Score.isMR(r.q));
    const seen = all.filter(r => (Game.s.qstats[r.id] || {}).seen);
    return seen.length >= 20 ? seen : all;
  },

  start() {
    const pool = this.sprintPool();
    if (pool.length < 10) { UI.toast('🚧', 'Not enough questions here yet', 'The question bank did not load. Try reloading the page.'); return; }
    this.pool = shuffle(pool);
    this.score = 0; this.combo = 0; this.secs = 90;
    document.getElementById('l-time').style.width = '100%';
    document.getElementById('l-secs').textContent = '90s';
    document.getElementById('l-timebar').setAttribute('aria-label', '90 seconds left');
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
    document.getElementById('l-secs').textContent = this.secs + 's';
    if (this.secs % 15 === 0 || this.secs === 10) document.getElementById('l-timebar').setAttribute('aria-label', this.secs + ' seconds left');
    if (this.secs <= 10 && this.secs > 0) Sound.tick();
    if (this.secs <= 0) this.finish();
  },

  show() {
    if (!this.pool.length) this.pool = shuffle(this.sprintPool());
    const ref = this.pool.pop();
    this.cur = { deal: dealQuestion(ref.q) };
    document.getElementById('l-score').textContent = this.score;
    document.getElementById('l-combo').textContent = this.combo >= 2 ? `🔥 ×${this.combo} combo — +${1 + Math.floor(this.combo / 3)} per hit` : '';
    UI.renderStem('l-qtext', this.cur.deal);
    this.buttons = UI.renderAnswers('l-answers', this.cur.deal, (i) => this.answer(i));
  },

  answer(i) {
    if (!this.running) return;
    const q = this.cur.deal;
    const ok = Score.isCorrect(q, i);
    Game.recordAnswer(ok, q.id, true);
    UI.markAnswers(this.buttons, q, i);
    if (ok) {
      this.combo++;
      this.score += 1 + Math.floor(this.combo / 3);
      this.combo >= 3 ? Sound.crit() : Sound.good();
    } else {
      this.combo = 0;
      Game.deckAdd(q.id);
      Sound.bad();
    }
    UI.announce((ok ? 'Correct. ' : 'Wrong. ') + 'Score ' + this.score + '.');
    const cur = this.cur;
    setTimeout(() => this.running && this.cur === cur && this.show(), ok ? 350 : 900);
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
    again.className = 'btn ghost'; again.innerHTML = '<span aria-hidden="true">⚡</span> Again';
    again.onclick = () => Lightning.start();
    const home = document.createElement('button');
    home.className = 'btn primary'; home.innerHTML = '<span aria-hidden="true">🏛️</span> Hall';
    home.onclick = () => UI.go('home');
    acts.append(again, home);
    Sound.win();
    UI.go('result');
  },
};

/* ---------------- anti-pattern hunt (a themed drill over a monster's task statements) ---------------- */
const HUNT_N = 8, HUNT_CAPTURE = 6;

const Hunt = {
  /* no name: the next monster you haven't captured, else any */
  start(name) {
    if (!name) {
      const open = Object.keys(MONSTERS).filter(m => !Game.s.bestiary.includes(m));
      name = pick(open.length ? open : Object.keys(MONSTERS));
    }
    const m = MONSTERS[name];
    if (UI.current !== 'result' && UI.current !== 'drill') this.from = UI.current === 'bestiary' ? 'bestiary' : 'home';
    const back = this.from === 'bestiary' ? ['bestiary', '← Bestiary'] : ['home', '← Hall'];
    Drill.start(Bank.pick(Bank.forTs(m.ts), HUNT_N, true), `🔦 Hunting ${m.face} ${name} · ${m.ts.join(' · ')}`,
      { back, finish: 'Finish the hunt', onDone: (right, n) => this.finish(name, right, n) });
  },

  finish(name, right, n) {
    const m = MONSTERS[name], win = right >= Math.min(HUNT_CAPTURE, n - 2), fresh = win && !Game.s.bestiary.includes(name);
    if (win) Game.addXP(100);
    if (fresh) {
      Game.s.bestiary.push(name);
      Game.save();
      UI.toast(m.face, name + ' captured!', 'Added to the bestiary.');
      if (Game.s.bestiary.length >= 12) Game.unlock('monster-hunter');
    }
    document.getElementById('r-emoji').textContent = win ? m.face : '🔦';
    const t = document.getElementById('r-title');
    t.textContent = win ? (fresh ? 'CAPTURED' : 'HUNTED DOWN') : 'IT ESCAPED'; t.className = win ? 'win' : 'lose';
    document.getElementById('r-sub').textContent = win ? `${name}: ${m.weak}` : `${right}/${n}: you need ${HUNT_CAPTURE} of ${HUNT_N} to capture ${name}. Its weakness hides in the explanations.`;
    document.getElementById('r-stats').innerHTML = [['Score', right + '/' + n], ['XP earned', '+' + (Drill.xp + (win ? 100 : 0))], ['Bestiary', Game.s.bestiary.length + '/12']]
      .map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    const acts = document.getElementById('r-actions');
    acts.innerHTML = '';
    const again = document.createElement('button');
    again.className = 'btn ghost'; again.innerHTML = '<span aria-hidden="true">🔦</span> ' + (win ? 'Next monster' : 'Try again');
    again.onclick = () => win ? Hunt.start() : Hunt.start(name);
    const beast = document.createElement('button');
    beast.className = 'btn primary'; beast.innerHTML = '<span aria-hidden="true">📖</span> Bestiary';
    beast.onclick = () => UI.go('bestiary');
    if (this.from === 'home') {
      const home = document.createElement('button');
      home.className = 'btn ghost'; home.innerHTML = '<span aria-hidden="true">🏛️</span> Hall';
      home.onclick = () => UI.go('home');
      acts.append(again, beast, home);
    } else acts.append(again, beast);
    win ? Sound.win() : Sound.lose();
    UI.go('result');
  },
};

/* ---------------- mistake clinic ---------------- */
const Review = {
  session: [], qi: 0, buttons: [],

  start() {
    UI.go('review');
    this.render();
  },

  render() {
    const body = document.getElementById('rv-body');
    const deck = Game.s.deck;
    document.getElementById('rv-progress').textContent = deck.length + ' in the ward';
    if (!deck.length) {
      body.innerHTML = `<div class="deck-empty"><div class="big" aria-hidden="true">🌿</div><p><strong>The clinic is empty.</strong></p><p>No outstanding mistakes. Go make some interesting new ones.</p></div>`;
      return;
    }
    body.innerHTML = `
      <div class="exam-rules">
        <p><strong>${deck.length}</strong> missed question${deck.length === 1 ? '' : 's'} awaiting treatment. Answer one correctly <strong>twice in a row</strong> and it is discharged for good.</p>
        <div class="center mt"><button class="btn primary" id="rv-start"><span aria-hidden="true">🩹</span> Treat ${Math.min(10, deck.length)} cards</button></div>
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
    /* the round has begun: the intro and its start button would only restart it */
    document.querySelector('#rv-body .exam-rules').style.display = 'none';
    document.getElementById('rv-stage').style.display = 'block';
    this.show();
  },

  show() {
    const card = this.session[this.qi];
    const q = Bank.byId(card.id);
    if (!q) { this.next(); return; }
    this.cur = dealQuestion(q);
    document.getElementById('rv-count').textContent = `card ${this.qi + 1}/${this.session.length} · streak ${card.streak}/2`;
    UI.renderStem('rv-qtext', this.cur);
    this.answered = false;
    this.buttons = UI.renderAnswers('rv-answers', this.cur, (sel) => this.answer(sel));
    document.getElementById('rv-stage').scrollIntoView({ behavior: UI.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  },

  answer(sel) {
    const card = this.session[this.qi];
    if (this.answered) return;
    this.answered = true;
    const ok = Score.isCorrect(this.cur, sel);
    Game.recordAnswer(ok, card.id);
    UI.markAnswers(this.buttons, this.cur, sel);

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
    document.getElementById('rv-progress').textContent = Game.s.deck.length + ' in the ward';
    if (!Game.s.deck.length) {
      if (Game.s.clinicPeak >= 10) Game.unlock('clinic-clear');
      Game.s.clinicPeak = 0; Game.save();
    }

    const cur = this.cur;
    setTimeout(() => {
      if (UI.current !== 'review' || this.cur !== cur) return;  // the player left the clinic
      UI.feedback(this.cur, sel, ok, () => this.next(), { btn: this.qi + 1 >= this.session.length ? 'Finish round' : 'Next card' });
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
    /* the dialog: Enter or Escape continues, Tab stays inside */
    if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); document.getElementById('m-next').click(); }
    else if (e.key === 'Tab') {
      const f = [...overlay.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(x => !x.disabled);
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
    return;
  }
  if (e.key === 'Escape' && UI.current === 'lightning') { e.preventDefault(); UI.go('home'); return; }
  const map = { battle: 'b-answers', lightning: 'l-answers', exam: 'e-answers', review: 'rv-answers', drill: 'd-answers' };
  const id = map[UI.current];
  const box = id && document.getElementById(id);
  /* choose-two: Enter submits (or says why it can't yet), unless focus is on another control, which keeps
     its own Enter */
  if (e.key === 'Enter' && box && box._mr && !box._mr.done && !(UI.current === 'exam' && Exam.variant === 'mock')) {
    const f = document.activeElement;
    const other = f && f !== document.body && !box.contains(f) && f.matches('button, a[href], input, select, textarea, summary, [role="button"]');
    if (!other) { e.preventDefault(); box._mr.submit(); return; }
  }
  if (e.key === 'Enter' && UI.current === 'exam' && Exam.variant === 'practice') {
    const f = document.activeElement, next = document.querySelector('#e-feedback button');
    if (f && f.matches('button, a[href], input, select, textarea') && !f.closest('#e-answers, #e-feedback')) return;
    if (next) { e.preventDefault(); next.click(); }
    return;
  }
  /* 1–5: answer (single-answer) or toggle an option (choose-two) */
  if (e.key >= '1' && e.key <= '5' && !e.altKey && !e.ctrlKey && !e.metaKey) {
    if (!id) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const btns = document.querySelectorAll('#' + id + ' .answer:not(.disabled)');
    const all = document.querySelectorAll('#' + id + ' .answer');
    const target = all[Number(e.key) - 1];
    if (target && !target.classList.contains('disabled') && btns.length) target.click();
  }
});

/* ---------------- boot ---------------- */
Game.load();
/* theme: the player's explicit pick, else follow the system setting (and keep following it) */
const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
const applyTheme = () => {
  if (!Game.s.themeSet) Game.s.theme = darkMQ && darkMQ.matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = Game.s.theme;
};
if (Game.s.themeSet === undefined) Game.s.themeSet = Game.s.theme === 'dark';  // an older save that picked dark keeps it
applyTheme();
if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener('change', () => { if (!Game.s.themeSet) { applyTheme(); UI.refreshHud(); } });
document.getElementById('btn-theme').onclick = () => {
  Game.s.theme = Game.s.theme === 'light' ? 'dark' : 'light';
  Game.s.themeSet = true;
  document.documentElement.dataset.theme = Game.s.theme;
  Game.save(); UI.refreshHud(); Sound.click();
};
/* the sticky exam clock sits under the top bar, whose height changes as it wraps */
const topbarEl = document.getElementById('topbar');
const syncTopbar = () => document.documentElement.style.setProperty('--topbar-h', topbarEl.offsetHeight + 'px');
syncTopbar();
if (window.ResizeObserver) new ResizeObserver(syncTopbar).observe(topbarEl);

document.getElementById('btn-sound').onclick = () => {
  Game.s.soundOn = !Game.s.soundOn;
  Game.save(); UI.refreshHud();
  if (Game.s.soundOn) Sound.good();
};
UI.refreshHud();
Exam.checkSaved();
window.addEventListener('storage', (e) => {
  if (e.key === SAVE_KEY) { if (e.newValue) Game.syncFrom(); return; }
  if (e.key !== EXAM_KEY || !Exam.active || Exam.variant !== 'mock') return;
  if (Exam.takenOver()) Exam.detach();
  else if (Exam.stored()) UI.toast('⚠️', 'Exam open in another tab', 'Answers from two tabs will overwrite each other. Use one.');
});
/* practice exams aren't persisted: count what was displayed if the tab closes mid-exam */
window.addEventListener('pagehide', () => {
  if (Exam.active && Exam.variant === 'practice') Exam.noteExposure();
  if (Game._queued) Game.commit();  // a save still waiting for the lock: write it before the tab goes
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && EXAM_SETTLE_ON.has(UI.current)) Exam.settleExpired();
});
