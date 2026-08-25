#!/usr/bin/env python3
from pathlib import Path

p = Path("assets/js/app.js")
s = p.read_text(encoding="utf-8")
old = 'import { createQuizRunner, shuffleWith } from "./game/question-engine.js";'
new = 'import { createQuizRunner, makeQuestion, shuffleWith } from "./game/question-engine.js";'
assert old in s
p.write_text(s.replace(old, new, 1), encoding="utf-8", newline="\n")
print("import fixed")
