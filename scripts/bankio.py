"""Shared read/write helpers for questions.js (window.BANK = {...} as indent=1 JSON)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QFILE = ROOT / 'questions.js'


def split():
    src = QFILE.read_text()
    start = src.index('{', src.index('window.BANK'))
    end = src.rindex('}') + 1
    return src[:start], json.loads(src[start:end]), src[end:]


def load():
    return split()[1]


def save(bank, count_line=True):
    head, _, tail = split()
    if count_line:
        n = sum(len(v) for v in bank.values())
        lines = head.split('\n')
        lines = [f' * {n} scenario questions for the Claude Certified Architect — Foundations exam (2026).'
                 if 'scenario questions for the Claude Certified Architect' in l else l for l in lines]
        head = '\n'.join(lines)
    QFILE.write_text(head + json.dumps(bank, indent=1, ensure_ascii=False) + tail)
