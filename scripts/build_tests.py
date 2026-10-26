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

# (bank-independent) floor -> task statements, mirroring FLOORS in game.js
FLOORS = [
    ("floor-01", "The Loop Chamber", "D1", ["1.1"]),
    ("floor-02", "Coordination Hall", "D1", ["1.2", "1.3", "1.6"]),
    ("floor-03", "The Hook Forge", "D1", ["1.4", "1.5", "1.7"]),
    ("floor-04", "The Tool Armory", "D2", ["2.1", "2.2", "2.3", "2.4", "2.5"]),
    ("floor-05", "The Config Maze", "D3", ["3.1", "3.2", "3.3"]),
    ("floor-06", "The Pipeline Forge", "D3", ["3.4", "3.5", "3.6"]),
    ("floor-07", "Prompt Workshop", "D4", ["4.1", "4.2", "4.3"]),
    ("floor-08", "Validation Gauntlet", "D4", ["4.4", "4.5", "4.6"]),
    ("floor-09", "The Memory Halls", "D5", ["5.1", "5.2", "5.3"]),
    ("floor-10", "Synthesis Chamber", "D5", ["5.4", "5.5", "5.6"]),
]
FULL_EXAMS = 3

DOMAINS = {
    "D1": ("Agentic Architecture & Orchestration", 27, 16),
    "D2": ("Tool Design & MCP Integration", 18, 11),
    "D3": ("Claude Code Configuration & Workflows", 20, 12),
    "D4": ("Prompt Engineering & Structured Output", 20, 12),
    "D5": ("Context Management & Reliability", 15, 9),
}

LETTERS = "ABCDE"


def is_mr(q):
    return q.get("type") == "mr"


def key_letters(q):
    """answer key as letters: "B" for MC, "B, D" for multiple-response"""
    return ", ".join(LETTERS[i] for i in (q["correct"] if is_mr(q) else [q["correct"]]))


def load_bank():
    src = (ROOT / "questions.js").read_text()
    payload = src[src.index("{", src.index("window.BANK")):src.rindex("}") + 1]
    return json.loads(payload)


def render_question(n, q):
    stem = q["q"] + (" (Choose two.)" if is_mr(q) else "")
    lines = [f"## Question {n}", stem, ""]
    for i, opt in enumerate(q["options"]):
        lines.append(f"{LETTERS[i]}) {opt}")
    lines += [
        "",
        "<details>",
        "<summary>Answer & explanation</summary>",
        "",
        f"**{key_letters(q)}** {q['explanation']}" if is_mr(q) else f"**{key_letters(q)})** {q['explanation']}",
        "",
        f"*Hint if stuck: {q['hint']}*",
        "</details>",
        "",
        "---",
        "",
    ]
    return "\n".join(lines)


def all_questions(bank):
    return [q for qs in bank.values() for q in qs]


def build_floor_tests(bank):
    allq = all_questions(bank)
    for i, (fid, name, dom, ts) in enumerate(FLOORS, 1):
        dlabel, weight, _ = DOMAINS[dom]
        qs = sorted((q for q in allq if q["ts"] in ts), key=lambda q: (q["ts"], q["id"]))
        body = [
            f"# Practice Test {i:02d}: {name}",
            f"**{dom}: {dlabel}** ({weight}% of the exam) · task statements {', '.join(ts)}",
            "",
            f"{len(qs)} questions. Exam pace is 2 minutes per question.",
            "",
            "---",
            "",
        ]
        body += [render_question(n + 1, q) for n, q in enumerate(qs)]
        out = OUT / f"test-{i:02d}-{fid}.md"
        out.write_text("\n".join(body))
        print(f"wrote {out.relative_to(ROOT)} ({len(qs)} questions)")


def build_full_exams(bank, seed=2026):
    """FULL_EXAMS mock exams at exact domain weights, with no question shared between them"""
    rng = random.Random(seed)
    pools = {d: [] for d in DOMAINS}
    for q in all_questions(bank):
        pools["D" + q["ts"][0]].append(q)
    for d in pools:
        rng.shuffle(pools[d])
    for k in range(1, FULL_EXAMS + 1):
        picked = []
        for dom, (_, _, count) in DOMAINS.items():
            picked += pools[dom][:count]
            pools[dom] = pools[dom][count:]
        rng.shuffle(picked)
        body = [
            f"# Full Practice Exam {k:02d} — CCAR-F simulation",
            "",
            "Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,",
            "pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.",
            f"No question here appears in the other {FULL_EXAMS - 1} printable exams.",
            "",
            "Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.",
            "",
            "---",
            "",
        ]
        body += [render_question(n + 1, q) for n, q in enumerate(picked)]
        key = [key_letters(q).replace(" ", "") for q in picked]
        body += ["## Answer key (no peeking until scored)", "", " ".join(f"{n+1}:{c}" for n, c in enumerate(key)), ""]
        out = OUT / f"full-exam-{k:02d}.md"
        out.write_text("\n".join(body))
        print(f"wrote {out.relative_to(ROOT)} (60 questions)")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    bank = load_bank()
    total = sum(len(v) for v in bank.values())
    print(f"loaded {total} questions from questions.js")
    build_floor_tests(bank)
    build_full_exams(bank)
