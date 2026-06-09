#!/usr/bin/env python3
"""Regenerate practice-tests/*.md from questions.js (the single source of truth).

Usage: python3 scripts/build_tests.py
"""
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "practice-tests"

FLOORS = [
    ("floor-01", "The Loop Chamber", "D1", "Agentic loop mechanics"),
    ("floor-02", "Coordination Hall", "D1", "Multi-agent orchestration"),
    ("floor-03", "The Hook Forge", "D1", "Hooks & deterministic enforcement"),
    ("floor-04", "The Tool Armory", "D2", "Tool design & MCP"),
    ("floor-05", "The Config Maze", "D3", "CLAUDE.md, rules, skills, commands"),
    ("floor-06", "The Pipeline Forge", "D3", "Plan mode & CI/CD"),
    ("floor-07", "Prompt Workshop", "D4", "Prompts & structured output"),
    ("floor-08", "Validation Gauntlet", "D4", "Retry loops, batch, multi-pass"),
    ("floor-09", "The Memory Halls", "D5", "Context management & escalation"),
    ("floor-10", "Synthesis Chamber", "D5", "Provenance, sampling, degradation"),
]

DOMAINS = {
    "D1": ("Agentic Architecture & Orchestration", 27, 16),
    "D2": ("Tool Design & MCP Integration", 18, 11),
    "D3": ("Claude Code Configuration & Workflows", 20, 12),
    "D4": ("Prompt Engineering & Structured Output", 20, 12),
    "D5": ("Context Management & Reliability", 15, 9),
}

LETTERS = "ABCD"


def load_bank():
    src = (ROOT / "questions.js").read_text()
    payload = src[src.index("{", src.index("window.BANK")):src.rindex("}") + 1]
    return json.loads(payload)


def render_question(n, q):
    lines = [f"## Question {n}", q["q"], ""]
    for i, opt in enumerate(q["options"]):
        lines.append(f"{LETTERS[i]}) {opt}")
    lines += [
        "",
        "<details>",
        "<summary>Answer & explanation</summary>",
        "",
        f"**{LETTERS[q['correct']]})** {q['explanation']}",
        "",
        f"*Hint if stuck: {q['hint']}*",
        "</details>",
        "",
        "---",
        "",
    ]
    return "\n".join(lines)


def build_floor_tests(bank):
    for i, (fid, name, dom, focus) in enumerate(FLOORS, 1):
        dlabel, weight, _ = DOMAINS[dom]
        qs = bank[fid]
        body = [
            f"# Practice Test {i:02d}: {name}",
            f"**{dom}: {dlabel}** ({weight}% of the exam) — {focus}",
            "",
            f"{len(qs)} questions. Exam pace is 2 minutes per question; aim for {len(qs) * 2} minutes.",
            "Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.",
            "",
            "---",
            "",
        ]
        body += [render_question(n + 1, q) for n, q in enumerate(qs)]
        out = OUT / f"test-{i:02d}-{fid}.md"
        out.write_text("\n".join(body))
        print(f"wrote {out.relative_to(ROOT)} ({len(qs)} questions)")


def build_full_exam(bank, seed=2026):
    rng = random.Random(seed)
    pools = {d: [] for d in DOMAINS}
    for fid, _, dom, _ in FLOORS:
        pools[dom].extend(bank[fid])
    for fid in ("exam-mix-1", "exam-mix-2"):
        for q in bank[fid]:
            tag = (q.get("tags") or ["d1"])[0].upper()
            pools.get(tag if tag in pools else "D1").append(q)
    picked = []
    for dom, (_, _, count) in DOMAINS.items():
        picked.extend((dom, q) for q in rng.sample(pools[dom], count))
    rng.shuffle(picked)

    body = [
        "# Full Practice Exam — CCA-F simulation",
        "",
        "Faithful to the real blueprint as of June 2026: **60 questions, 120 minutes,",
        "scaled score out of 1000, pass at 720** (~44 of 60). Domain weighting:",
        "D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.",
        "",
        "Set a timer. No notes, no docs — the real exam is proctored.",
        "For the interactive version with the clock, flags, and a score report, open the game.",
        "",
        "---",
        "",
    ]
    body += [render_question(n + 1, q) for n, (dom, q) in enumerate(picked)]
    key = "".join(LETTERS[q["correct"]] for _, q in picked)
    body += [
        "## Answer key (no peeking until scored)",
        "",
        " ".join(f"{n+1}:{k}" for n, k in enumerate(key)),
        "",
    ]
    out = OUT / "full-exam-01.md"
    out.write_text("\n".join(body))
    print(f"wrote {out.relative_to(ROOT)} (60 questions, seed {seed})")


def build_hunt(bank):
    qs = bank["hunt"]
    body = [
        "# The Anti-Pattern Hunt — printable edition",
        "",
        "Twelve production war stories. Exactly one monster of bad architecture lurks in each.",
        "Name it. (The interactive version in the game awards bestiary cards.)",
        "",
        "---",
        "",
    ]
    body += [render_question(n + 1, q) for n, q in enumerate(qs)]
    out = OUT / "anti-pattern-hunt.md"
    out.write_text("\n".join(body))
    print(f"wrote {out.relative_to(ROOT)} ({len(qs)} vignettes)")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    bank = load_bank()
    total = sum(len(v) for v in bank.values())
    print(f"loaded {total} questions from questions.js")
    build_floor_tests(bank)
    build_full_exam(bank)
    build_hunt(bank)
