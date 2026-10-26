/* ARCHITECT'S ASCENT — Learn track
 * A staged path through the exam guide: beginner primers, one lesson per task statement,
 * then scenario walkthroughs and exam day. Each lesson is a slide deck (rendered here and
 * by learn/deck.html), an AI-narrated video of the same slides, a quick check, official
 * sources and curated official videos. Lesson data lives in learn/lessons.js (window.LESSONS,
 * window.LEARN_RES). Progress has its own key so the game save schema is untouched. */

const LEARN_KEY = 'aa-learn-v1';

const STAGES = [
  { id: 'beginner', n: 1, label: 'Foundations', blurb: 'Start here if the words agent loop, MCP, CLAUDE.md or tool_use are new. One primer per domain gives you the vocabulary and the mental model the task-statement lessons build on.' },
  { id: 'intermediate', n: 2, label: 'Task statements', blurb: 'One lesson for each of the 30 task statements in the exam guide: the idea, how it works, how it shows up in a scenario, the exam traps, then a drill on that task statement.' },
  { id: 'advanced', n: 3, label: 'Exam-ready', blurb: 'Think like the exam: walk through each of the 6 scenarios, see which task statements it pulls in and where the plausible wrong answers hide, then plan exam day and sit the mock.' },
];

const Learn = {
  cur: null,      // lesson being viewed
  slide: 0,
  tab: 'slides',

  /* ---------- data ---------- */
  all() { return window.LESSONS || []; },
  byId(id) { return this.all().find(l => l.id === id); },
  forTs(ts) { const l = this.all().find(l => l.kind === 'ts' && l.ts.includes(ts)); return l ? l.id : null; },

  state() {
    if (!this._s) {
      try { this._s = JSON.parse(localStorage.getItem(LEARN_KEY)) || {}; } catch (e) { this._s = {}; }
      this._s.done = this._s.done || {};
      this._s.slide = this._s.slide || {};
    }
    return this._s;
  },
  save() { try { localStorage.setItem(LEARN_KEY, JSON.stringify(this.state())); } catch (e) { /* private mode */ } },
  isDone(id) { return !!this.state().done[id]; },
  progress() {
    const all = this.all();
    return { done: all.filter(l => this.isDone(l.id)).length, total: all.length };
  },
  next() { return this.all().find(l => !this.isDone(l.id)) || null; },

  markDone(id) {
    if (this.isDone(id)) return;
    this.state().done[id] = Date.now(); this.save();
    if (typeof Game !== 'undefined' && Game.addXP) { Game.addXP(15); Game.touchStreak && Game.touchStreak(); }
    if (typeof UI !== 'undefined') UI.toast('🎓', 'Lesson complete', `+15 XP · ${this.progress().done}/${this.all().length} lessons`);
  },

  domainColor(d) { return d ? `var(--d${d[1]})` : 'var(--accent)'; },

  /* ---------- slides (shared with learn/deck.html and the video renderer) ---------- */
  esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); },
  rich(s) {
    if (typeof fmt === 'function') return fmt(s);
    return this.esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  },

  kicker(l) {
    if (l.kind === 'ts') return `Task statement ${l.ts[0]} · Domain ${l.domain[1]}`;
    if (l.kind === 'primer') return `Domain ${l.domain[1]} primer · Beginner`;
    if (l.kind === 'scenario') return `Scenario walkthrough · Advanced`;
    return 'Architect\'s Ascent · Learn';
  },

  /* the deck = a generated title slide, the authored slides, and a glossary slide for primers */
  deck(l) {
    const out = [{ kind: 'title', title: l.title, hook: l.hook,
      note: l.titleNote || `${l.kind === 'ts' ? `Task statement ${l.ts[0]}. ` : ''}${l.title}. ${l.hook}` }];
    (l.slides || []).forEach(s => out.push(s));
    if (l.glossary && l.glossary.length) out.splice(out.length - 1, 0, { kind: 'glossary', title: 'Words to know', note: 'Here are the words this domain uses most. Pause the video and read through them, then keep going.' });
    return out;
  },

  slideHTML(l, i) {
    const d = this.deck(l), s = d[i], n = d.length;
    const cls = ['lslide', 'k-' + s.kind];
    const traps = s.pairs || [];
    let inner;
    if (s.kind === 'title') {
      const badge = l.kind === 'ts' ? l.ts[0] : l.kind === 'primer' ? l.domain : l.kind === 'scenario' ? 'Scenario ' + l.scenarios[0] : 'Start';
      inner = `<span class="badge">${this.esc(badge)}</span><div class="kick">${this.esc(this.kicker(l))}</div><h2>${this.rich(s.title)}</h2><div class="hook">${this.rich(s.hook || '')}</div>`;
    } else if (s.kind === 'traps') {
      inner = `<div class="kick">Exam traps</div><h2>${this.rich(s.title || 'Exam traps')}</h2><div class="traps">${traps.map(p =>
        `<div class="trap"><div class="w"><b>Tempting</b>${this.rich(p.wrong)}</div><div class="r"><b>Exam wants</b>${this.rich(p.right)}<span class="why">${this.rich(p.why || '')}</span></div></div>`).join('')}</div>`;
    } else if (s.kind === 'glossary') {
      inner = `<div class="kick">Vocabulary</div><h2>${this.rich(s.title)}</h2><div class="gl">${l.glossary.slice(0, 10).map(g => `<div><b>${this.rich(g.term)}</b> ${this.rich(g.def)}</div>`).join('')}</div>`;
    } else {
      const label = { idea: 'The idea', how: 'How it works', practice: 'In a scenario', recap: 'Remember' }[s.kind] || '';
      const list = (s.bullets || []).length ? `<ul>${s.bullets.map(b => `<li>${this.rich(b)}</li>`).join('')}</ul>` : '';
      let code = '';
      if (s.code) {
        // start the code at a size that fits its half of the slide; fit() shrinks the whole slide if needed
        const lines = s.code.text.split('\n'), wide = Math.min(64, Math.max(...lines.map(x => x.length)));
        const fs = Math.max(0.46, Math.min(0.72, 20.5 / (wide * 0.62), 16.7 / (lines.length * 1.5 + 2)));
        code = `<pre style="font-size:${fs.toFixed(3)}em"><span class="lang">${this.esc(s.code.lang || '')}</span>${this.esc(s.code.text)}</pre>`;
      }
      inner = `<div class="kick">${label}</div><h2>${this.rich(s.title)}</h2><div class="body">${code ? `<div>${list}</div>${code}` : list}</div>` +
        (s.delta ? `<div class="delta">🔄 Docs today: ${this.rich(s.delta)}</div>` : '');
    }
    const foot = `<div class="foot"><span>Architect's Ascent · CCA-F Learn</span><span>${i + 1} / ${n}</span></div>`;
    return `<div class="${cls.join(' ')}" style="--dc:${this.domainColor(l.domain)}">${inner}${foot}</div>`;
  },

  /* shrink a rendered slide's type until its content clears the footer */
  fit(slide) {
    if (!slide) return;
    const kids = [...slide.querySelectorAll('h2, ul, pre, .traps, .gl, .hook, .delta')];
    for (let k = 1; k >= 0.62; k -= 0.04) {
      slide.style.fontSize = (2.15 * k).toFixed(3) + 'cqw';
      const limit = slide.getBoundingClientRect().bottom - slide.clientWidth * 0.035;
      const pre = slide.querySelector('pre');
      if (Math.max(...kids.map(x => x.getBoundingClientRect().bottom)) <= limit && (!pre || pre.scrollHeight <= pre.clientHeight + 1)) return;
    }
  },

  /* ---------- screens ---------- */
  onGo(name) {
    if (name === 'learn') this.renderPath();
    if (name !== 'lesson') this.stopMedia();
  },

  card(l, nextId) {
    const done = this.isDone(l.id);
    const id = l.kind === 'ts' ? l.ts[0] : l.kind === 'primer' ? l.domain + ' primer' : l.kind === 'scenario' ? 'Scenario ' + l.scenarios[0] : '★';
    const vid = l.video ? ' · 🎬 video' : '';
    return `<button class="ln-card${done ? ' is-done' : ''}${l.id === nextId ? ' is-next' : ''}" style="--dc:${this.domainColor(l.domain)}" onclick="Learn.open('${l.id}')">
      ${done ? '<span class="done" title="Done">✅</span>' : ''}<span class="id">${this.esc(id)}</span>
      <span class="nm">${this.esc(l.short || l.title)}</span><span class="meta">${l.minutes} min · ${this.deck(l).length} slides${vid}</span></button>`;
  },

  renderPath() {
    const root = document.getElementById('ln-body');
    if (!root) return;
    this.cur = null;
    const p = this.progress(), nx = this.next();
    document.getElementById('ln-summary').innerHTML = `
      <div class="ln-prog"><b>${p.done} of ${p.total}</b> lessons done<div class="ln-bar"><div style="width:${p.total ? Math.round(100 * p.done / p.total) : 0}%"></div></div></div>
      ${nx ? `<button class="btn primary small" onclick="Learn.open('${nx.id}')">${p.done ? 'Continue' : 'Start'}: ${this.esc(nx.short || nx.title)}</button>` : `<button class="btn primary small" onclick="UI.go('examintro')">All done. Sit the mock exam</button>`}`;
    const nextId = nx && nx.id;
    document.getElementById('ln-focus').innerHTML = this.renderFocus();
    root.innerHTML = STAGES.map(st => {
      const ls = this.all().filter(l => l.stage === st.id);
      let grid;
      if (st.id === 'intermediate') {
        grid = GUIDE.domains.map(d => {
          const dl = ls.filter(l => l.domain === d.id);
          if (!dl.length) return '';
          const dn = dl.filter(l => this.isDone(l.id)).length;
          return `<div class="ln-domain" style="--dc:${this.domainColor(d.id)}"><span class="dot"></span>D${d.n} · ${d.label} <span class="muted">· ${d.exam} of 60 exam items · ${dn}/${dl.length} done</span>
            <button class="btn small ghost" style="margin-left:auto;padding:5px 12px" onclick="Learn.drill('domain','${d.id}')">Drill D${d.n}</button></div>
            <div class="ln-grid">${dl.map(l => this.card(l, nextId)).join('')}</div>`;
        }).join('');
      } else grid = `<div class="ln-grid">${ls.map(l => this.card(l, nextId)).join('')}</div>`;
      const dn = ls.filter(l => this.isDone(l.id)).length;
      return `<section class="ln-stage"><h3><span class="lvl l${st.n}">Stage ${st.n} · ${st.id}</span>${st.label} <span class="muted small">${dn}/${ls.length} done</span></h3><p>${st.blurb}</p>${grid}</section>`;
    }).join('') + this.renderResources();
  },

  /* task statements you are weakest on (from every mode's answers), mapped to their lessons */
  weakTs() {
    const qs = Game.s.qstats, by = {};
    Bank.inScope().forEach(r => {
      const st = qs[r.id]; if (!st || !st.seen || !r.q.ts) return;
      const t = by[r.q.ts] = by[r.q.ts] || { seen: 0, right: 0 };
      t.seen++; t.right += st.last ? 1 : 0;
    });
    return Object.entries(by).filter(([, t]) => t.seen >= 2 && t.right / t.seen < 0.75)
      .sort((a, b) => a[1].right / a[1].seen - b[1].right / b[1].seen).map(([ts, t]) => ({ ts, ...t }));
  },

  renderFocus() {
    const weak = this.weakTs().slice(0, 4);
    if (!weak.length) {
      const seen = Object.keys(Game.s.qstats || {}).length;
      return `<div class="bp-focus"><h3>🧭 Not sure where to start?</h3><div class="focus-row"><span>Take a 15-question placement check across all five domains, weighted like the exam. Afterwards this panel lists the lessons for the task statements you missed.${seen ? '' : ' Or start at Stage 1 below.'}</span>
        <button class="btn small primary" onclick="Learn.placement()">Placement check</button></div></div>`;
    }
    return `<div class="bp-focus"><h3>🎯 Lessons for your weak spots</h3>` + weak.map(w => {
      const id = this.forTs(w.ts), l = id && this.byId(id), t = GUIDE.taskStatements.find(x => x.id === w.ts);
      return `<div class="focus-row"><span><b>${w.ts}</b> ${this.esc(t ? t.title : '')}<br><span class="muted">right on last try ${w.right} of ${w.seen} seen${l && this.isDone(id) ? ' · lesson done, worth a re-watch' : ''}</span></span>
        ${l ? `<button class="btn small primary" onclick="Learn.open('${id}')">Lesson</button>` : ''}<button class="btn small ghost" onclick="Learn.drill('ts','${w.ts}')">Drill</button></div>`;
    }).join('') + `<p class="muted small">From your answers in every mode: task statements with 2+ questions seen and under 75% right.</p></div>`;
  },

  /* drills started from Learn come back to Learn (the lesson, or the path for the placement check) */
  drill(kind, arg) {
    const pred = kind === 'ts' ? q => q.ts === arg : kind === 'domain' ? q => Bank.domainOf(q) === arg : q => q.scenario === arg;
    const label = kind === 'ts' ? `${arg} · ${(GUIDE.taskStatements.find(t => t.id === arg) || {}).title}`
      : kind === 'domain' ? `${arg} · ${DOMAINS[arg].label}` : 'Scenario · ' + GUIDE.scenarios.find(x => x.id === arg).name;
    this.startDrill(Blueprint.pick(Blueprint.refsFor(pred), 10, kind !== 'ts'), label, this.cur ? 'lesson' : 'learn');
  },
  startDrill(refs, label, back) {
    const name = back === 'lesson' ? '← Lesson' : '← Learn';
    Drill.start(refs, label, { back: [back, name], onDone: (right, n, xp) => this.drillDone(right, n, xp, label, back, name) });
  },
  drillDone(right, n, xp, label, back, name) {
    const good = right / n >= 0.75;
    document.getElementById('r-emoji').textContent = good ? '🎓' : '📖';
    const t = document.getElementById('r-title');
    t.textContent = good ? 'DRILL DONE' : 'KEEP STUDYING'; t.className = good ? 'win' : 'lose';
    document.getElementById('r-sub').textContent = label;
    document.getElementById('r-stats').innerHTML = [['Score', right + '/' + n], ['XP earned', '+' + xp]]
      .map(([k, v]) => `<div class="stat-card"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
    const acts = document.getElementById('r-actions');
    acts.innerHTML = '';
    const go = (text, cls, fn) => { const b = document.createElement('button'); b.className = 'btn ' + cls; b.textContent = text; b.onclick = fn; acts.appendChild(b); };
    if (back === 'lesson' && this.cur) {
      go('↩ Back to the lesson', 'primary', () => this.open(this.cur.id));
      const nx = this.all()[this.all().indexOf(this.cur) + 1];
      if (nx) go(`Next lesson: ${nx.short || nx.title} →`, 'ghost', () => this.open(nx.id));
    } else go('↩ Back to Learn', 'primary', () => UI.go('learn'));
    good ? Sound.win() : Sound.lose();
    UI.go('result');
  },

  /* 15 questions spread by exam weight (D1 4, D2 3, D3 3, D4 3, D5 2), unseen first */
  placement() {
    const quota = { D1: 4, D2: 3, D3: 3, D4: 3, D5: 2 };
    const refs = Object.entries(quota).flatMap(([d, n]) => {
      // one per task statement first, so the check touches as many as possible
      const pool = Blueprint.pick(Blueprint.refsFor(q => Bank.domainOf(q) === d), 99), seenTs = new Set(), out = [];
      pool.forEach(r => { if (out.length < n && !seenTs.has(r.q.ts)) { seenTs.add(r.q.ts); out.push(r); } });
      pool.forEach(r => { if (out.length < n && !out.includes(r)) out.push(r); });
      return out;
    });
    this.cur = null;
    this.startDrill(shuffle(refs), 'Placement check · 15 questions', 'learn');
  },

  renderResources() {
    const R = window.LEARN_RES || {};
    const li = x => `<li><a href="${x.url}" target="_blank" rel="noopener">${this.esc(x.title)}</a>${x.note ? ` <span class="muted">· ${this.esc(x.note)}</span>` : ''}</li>`;
    const groups = (R.courses || []);
    if (!groups.length) return '';
    return `<section class="ln-stage"><h3>Official courses and reading</h3>
      <p>Free material from Anthropic that goes deeper than these lessons, grouped by stage. Links open the official sites.</p>
      <div class="ln-res">${groups.map(g => `<div class="box"><h3>${this.esc(g.title)}</h3><ul>${g.items.map(li).join('')}</ul></div>`).join('')}</div></section>`;
  },

  open(id) {
    const l = this.byId(id);
    if (!l) return;
    this.cur = l;
    this.slide = Math.min(this.state().slide[id] || 0, this.deck(l).length - 1);
    this.tab = l.video ? 'video' : 'slides';
    UI.go('lesson');
    this.renderLesson();
  },

  renderLesson() {
    const l = this.cur, el = document.getElementById('ls-body');
    document.getElementById('ls-title').textContent = l.title;
    const stage = STAGES.find(s => s.id === l.stage);
    const chips = [`<span class="ls-chip">Stage ${stage.n} · ${stage.label}</span>`];
    if (l.domain) chips.push(`<span class="ls-chip dom" style="--dc:${this.domainColor(l.domain)}">${l.domain} · ${DOMAINS[l.domain].label}</span>`);
    if (l.kind === 'ts') chips.push(`<span class="ls-chip">Task statement ${l.ts[0]}</span>`);
    (l.scenarios || []).forEach(n => { const sc = GUIDE.scenarios.find(s => s.id === n); if (sc) chips.push(`<span class="ls-chip">🎬 ${sc.name}</span>`); });
    chips.push(`<span class="ls-chip">⏱️ ${l.minutes} min</span>`);
    if (this.isDone(l.id)) chips.push(`<span class="ls-chip">✅ done</span>`);

    const tabs = [l.video ? ['video', '🎬 Watch'] : null, ['slides', '🖼️ Slides'], l.check && l.check.length ? ['check', '✅ Quick check'] : null].filter(Boolean);
    el.innerHTML = `
      <div class="ls-chips">${chips.join('')}</div>
      <p class="ls-hook">${this.rich(l.hook)}</p>
      <div class="ls-tabs">${tabs.map(([k, t]) => `<button data-tab="${k}" class="${this.tab === k ? 'on' : ''}" onclick="Learn.setTab('${k}')">${t}</button>`).join('')}
        <a class="btn small ghost" style="margin-left:auto" href="learn/deck.html#${l.id}" target="_blank" rel="noopener">Open deck full screen ↗</a></div>
      <div id="ls-pane"></div>
      ${l.docsToday ? `<div class="ls-delta">🔄 <strong>Docs today:</strong> ${this.rich(l.docsToday)} The exam keeps the guide's terms.</div>` : ''}
      ${this.renderLab(l)}
      ${this.renderGlossary(l)}
      ${this.renderVideos(l)}
      ${this.renderSources(l)}
      <div class="ls-foot">${this.footButtons(l)}</div>`;
    this.renderPane();
  },

  setTab(t) {
    this.stopMedia();
    this.tab = t;
    document.querySelectorAll('#ls-body .ls-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    this.renderPane();
  },

  renderPane() {
    const l = this.cur, pane = document.getElementById('ls-pane');
    if (this.tab === 'video' && l.video) {
      pane.innerHTML = `<div class="ls-player"><video id="ls-video" controls preload="metadata" playsinline poster="${l.video.poster}">
          <source src="${l.video.src}" type="video/mp4"><track kind="captions" srclang="en" label="English" src="${l.video.vtt}" default></video></div>
        <p class="muted small mt">AI-narrated video of this lesson's slides (narration: Kokoro open-source text-to-speech). Captions on by default; turn them off in the player.</p>`;
      document.getElementById('ls-video').addEventListener('ended', () => { if (!(l.check || []).length) this.markDone(l.id); });
    } else if (this.tab === 'check') {
      pane.innerHTML = l.check.map((c, qi) => `<div class="ls-check"><div class="q-text">${qi + 1}. ${this.rich(c.q)}</div><div class="answers" id="lc-${qi}"></div><div id="lcw-${qi}"></div></div>`).join('') +
        `<p class="muted small">These two are original practice items for this lesson. For exam-style practice, drill the question bank below.</p>`;
      this.answered = {};
      l.check.forEach((c, qi) => this.renderCheck(c, qi));
    } else {
      pane.innerHTML = `<div class="ldeck" id="ls-deck"></div>
        <div class="ls-deckbar"><button class="btn small ghost" onclick="Learn.go(-1)">← Prev</button><span class="count" id="ls-count"></span>
        <button class="btn small primary" onclick="Learn.go(1)">Next →</button><span class="grow"></span><div class="ls-dots" id="ls-dots"></div>
        <button class="btn small ghost" onclick="Learn.toggleNotes()">🗒️ Notes</button></div>
        <div class="ls-note" id="ls-note" style="display:${this.showNotes ? 'block' : 'none'}"></div>`;
      this.drawSlide();
    }
  },

  renderCheck(c, qi) {
    // shuffle the options so the answer position carries no signal
    const order = typeof shuffle === 'function' ? shuffle(c.options.map((_, i) => i)) : c.options.map((_, i) => i);
    const box = document.getElementById('lc-' + qi);
    const btns = order.map((oi, k) => {
      const b = document.createElement('button');
      b.className = 'answer';
      b.innerHTML = `<span class="key">${k + 1}</span><span>${this.rich(c.options[oi])}</span>`;
      b.onclick = () => {
        if (this.answered[qi] !== undefined) return;
        const ok = oi === c.answer;
        this.answered[qi] = ok;
        btns.forEach((x, j) => { x.classList.add('disabled'); if (order[j] === c.answer) x.classList.add('correct'); else if (x === b) x.classList.add('wrong'); else x.classList.add('dim'); });
        document.getElementById('lcw-' + qi).innerHTML = `<div class="ls-why${ok ? '' : ' bad'}">${ok ? '✅ Right.' : '❌ Not quite.'} ${this.rich(c.why)}</div>`;
        if (typeof Sound !== 'undefined') ok ? Sound.good() : Sound.bad();
        if (Object.keys(this.answered).length === this.cur.check.length) this.markDone(this.cur.id);
      };
      box.appendChild(b);
      return b;
    });
  },

  drawSlide() {
    const l = this.cur, d = this.deck(l);
    const box = document.getElementById('ls-deck');
    if (!box) return;
    box.innerHTML = this.slideHTML(l, this.slide);
    this.fit(box.firstElementChild);
    document.getElementById('ls-count').textContent = `${this.slide + 1} / ${d.length}`;
    document.getElementById('ls-dots').innerHTML = d.map((_, i) => `<i class="${i === this.slide ? 'on' : ''}" onclick="Learn.goto(${i})"></i>`).join('');
    document.getElementById('ls-note').innerHTML = '🗒️ ' + this.rich(d[this.slide].note || '');
    this.state().slide[l.id] = this.slide; this.save();
    if (this.slide === d.length - 1 && !(l.check || []).length) this.markDone(l.id);
  },
  go(step) { this.goto(this.slide + step); },
  goto(i) {
    const n = this.deck(this.cur).length;
    if (i >= n && this.cur.check && this.cur.check.length) { this.setTab('check'); return; }
    this.slide = Math.max(0, Math.min(n - 1, i));
    this.drawSlide();
  },
  toggleNotes() {
    this.showNotes = !this.showNotes;
    const n = document.getElementById('ls-note'); if (n) n.style.display = this.showNotes ? 'block' : 'none';
  },
  stopMedia() { const v = document.getElementById('ls-video'); if (v) v.pause(); },

  renderLab(l) {
    const b = l.lab;
    if (!b) return '';
    return `<div class="ls-section"><h3>🛠️ Try it yourself${b.minutes ? ` <span class="muted small">· about ${b.minutes} min</span>` : ''}</h3>
      <div class="ls-lab"><b>${this.rich(b.title)}</b><ol>${b.steps.map(x => `<li>${this.rich(x)}</li>`).join('')}</ol>
      ${b.expect ? `<p><strong>What to look for:</strong> ${this.rich(b.expect)}</p>` : ''}</div>
      <p class="muted small">The exam rewards people who have built these things. Ten minutes of hands-on time beats another read-through.</p></div>`;
  },

  renderGlossary(l) {
    if (!l.glossary || !l.glossary.length) return '';
    return `<div class="ls-section"><h3>📖 Words to know</h3><div class="ls-gloss">${l.glossary.map(g => `<div><b>${this.rich(g.term)}</b>${this.rich(g.def)}</div>`).join('')}</div></div>`;
  },

  videosFor(l) {
    const V = (window.LEARN_RES || {}).videos || [];
    if (l.videos) return l.videos.map(id => V.find(v => v.id === id)).filter(Boolean);
    return [];
  },

  renderVideos(l) {
    const vs = this.videosFor(l);
    if (!vs.length) return '';
    return `<div class="ls-section"><h3>📺 Talks from Anthropic</h3><div class="ls-vids">${vs.map(v => `
      <div class="ls-vid"><button class="frame" style="background-image:url('https://i.ytimg.com/vi/${v.id}/hqdefault.jpg')" onclick="Learn.embed(this,'${v.id}')" aria-label="Play here: ${this.esc(v.title)}"><span>▶ Play here</span></button>
      <div class="cap"><b>${this.esc(v.title)}</b><span class="muted">${this.esc(v.channel)}${v.minutes ? ` · ${v.minutes} min` : ''}${v.why ? ` · ${this.esc(v.why)}` : ''} · <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">YouTube ↗</a></span></div></div>`).join('')}</div>
      <p class="muted small mt">Talks by Anthropic staff, on Anthropic's channel or the AI Engineer conference channel. Embedded from YouTube (privacy-enhanced mode) only when you press play.</p></div>`;
  },
  embed(btn, id) {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.title = 'YouTube video';
    btn.replaceWith(f);
  },

  renderSources(l) {
    const src = l.sources || [];
    const more = l.kind === 'ts' ? ((GUIDE.docs || {})[l.ts[0]] || []).filter(x => !src.some(s => s.url === x.url)) : [];
    const all = src.concat(more);
    const courses = l.courses || [];
    if (!all.length && !courses.length) return '';
    return `<div class="ls-section"><h3>📚 Go deeper</h3><ul class="ls-src">${all.map(x => `<li><a href="${x.url}" target="_blank" rel="noopener">${this.esc(x.title)}</a></li>`).join('')}
      ${courses.map(x => `<li>🎓 <a href="${x.url}" target="_blank" rel="noopener">${this.esc(x.title)}</a>${x.note ? ` <span class="muted small">· ${this.esc(x.note)}</span>` : ''}</li>`).join('')}</ul></div>`;
  },

  footButtons(l) {
    const b = [];
    const dr = l.drill || {};
    const count = pred => Math.min(10, Blueprint.refsFor(pred).length);
    if (dr.ts) { const n = count(q => q.ts === dr.ts); b.push(`<button class="btn primary" ${n ? '' : 'disabled'} onclick="Learn.drill('ts','${dr.ts}')">🎯 Drill ${dr.ts}: ${n} questions</button>`); }
    if (dr.domain) b.push(`<button class="btn primary" onclick="Learn.drill('domain','${dr.domain}')">🎯 Drill ${dr.domain}: ${count(q => Bank.domainOf(q) === dr.domain)} questions</button>`);
    if (dr.scenario) b.push(`<button class="btn primary" onclick="Learn.drill('scenario',${dr.scenario})">🎯 Drill this scenario: ${count(q => q.scenario === dr.scenario)} questions</button>`);
    if (dr.exam) b.push(`<button class="btn primary" onclick="UI.go('examintro')">📋 Sit the mock exam</button>`);
    if (!this.isDone(l.id)) b.push(`<button class="btn ghost" onclick="Learn.markDone('${l.id}');Learn.renderLesson()">Mark as done</button>`);
    const i = this.all().indexOf(l), nx = this.all()[i + 1];
    if (nx) b.push(`<button class="btn ghost" onclick="Learn.open('${nx.id}')">Next lesson: ${this.esc(nx.short || nx.title)} →</button>`);
    return b.join('');
  },

  key(e) {
    if (typeof UI === 'undefined' || UI.current !== 'lesson' || !this.cur) return;
    if (e.target && /INPUT|TEXTAREA|VIDEO/.test(e.target.tagName)) return;
    if (this.tab === 'slides') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { this.go(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { this.go(-1); e.preventDefault(); }
      if (e.key === 'n') this.toggleNotes();
    }
  },
};

window.Learn = Learn;
document.addEventListener('keydown', e => Learn.key(e));
// swipe between slides on touch screens
(() => {
  let x0 = null;
  document.addEventListener('touchstart', e => { if (e.target.closest && e.target.closest('#ls-deck')) x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) Learn.go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
