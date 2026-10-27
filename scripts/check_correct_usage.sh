#!/usr/bin/env bash
# One scoring path: only the Score module in game.js (between the SCORE-BEGIN and SCORE-END markers)
# may read an answer key (`.correct` / ['correct']). Everything else asks Score.
# Allowlisted: fields that merely share the name and are not answer keys —
#   totals.correct (lifetime counter in the save), h.correct / r.correct (exam history and result counts).
# Exit 0 when clean, 1 on a violation (each one printed as file:line: text).
set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(game.js learn.js guide.js)
status=0

for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  if [ "$f" = game.js ]; then
    begins=$(grep -c '^/\* SCORE-BEGIN \*/$' "$f" || true)
    ends=$(grep -c '^/\* SCORE-END \*/$' "$f" || true)
    if [ "$begins" != 1 ] || [ "$ends" != 1 ]; then
      echo "check_correct_usage: game.js must contain exactly one SCORE-BEGIN and one SCORE-END marker" >&2
      exit 1
    fi
  fi
  hits=$(awk '
    FILENAME == "game.js" && /^\/\* SCORE-BEGIN \*\/$/ { inside = 1 }
    FILENAME == "game.js" && /^\/\* SCORE-END \*\/$/   { inside = 0; next }
    !inside && /(\.correct([^A-Za-z0-9_$]|$)|\[["'\'']correct["'\'']\])/ {
      line = $0
      gsub(/totals\.correct|(^|[^A-Za-z0-9_$])h\.correct|(^|[^A-Za-z0-9_$])r\.correct/, "", line)
      if (line ~ /(\.correct([^A-Za-z0-9_$]|$)|\[["'\'']correct["'\'']\])/) printf "%s:%d: %s\n", FILENAME, FNR, $0
    }' "$f")
  if [ -n "$hits" ]; then
    echo "$hits"
    status=1
  fi
done

if [ "$status" -ne 0 ]; then
  echo "check_correct_usage: answer keys must be read through Score (game.js SCORE-BEGIN..SCORE-END)" >&2
else
  echo "check_correct_usage: OK (only Score reads .correct)"
fi
exit "$status"
