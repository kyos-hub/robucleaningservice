#!/usr/bin/env python3
"""
One-time repair for files broken by the earlier version of
migrate_images.py, which could insert an image import in the middle of
a multi-line `import { ... } from "...";` statement.

Run from your project root:
    python3 fix_broken_imports.py

Safe to run multiple times — it's a no-op on files that are already fine.
"""
import re

FILES = [
    "src/routes/blog.index.tsx",
    "src/routes/careers.tsx",
    "src/routes/export-services.tsx",
    "src/routes/quality-compliance.tsx",
    "src/routes/services.$slug.tsx",
]

IMG_IMPORT_RE = re.compile(
    r'^import (img\w+) from "(@/assets/photos/[^"]+\.jpg)";\s*\n', re.MULTILINE
)


def fix_file(path: str) -> bool:
    content = open(path, encoding="utf-8").read()
    matches = list(IMG_IMPORT_RE.finditer(content))
    if not matches:
        print(f"  skip  {path} (no image import lines found)")
        return False

    # Remove every image import line from wherever it currently sits.
    pulled = []
    stripped = content
    # Remove in reverse so earlier match positions stay valid.
    for m in reversed(matches):
        pulled.append((m.group(1), m.group(2)))
        stripped = stripped[: m.start()] + stripped[m.end() :]
    pulled.reverse()

    # Find the true end of the top import block on the now-clean content:
    # scan full "import ... ;" statements (may span multiple lines).
    stmt_re = re.compile(r"^import\b[\s\S]*?;[ \t]*$", re.MULTILINE)
    last_end = 0
    pos = 0
    while True:
        m = stmt_re.match(stripped, pos)
        if m and (pos == 0 or stripped[pos : m.start()].strip() == ""):
            last_end = m.end()
            pos = m.end()
            while pos < len(stripped) and stripped[pos] == "\n":
                pos += 1
        else:
            break

    if last_end == 0:
        print(f"  WARN  {path}: no import block found, skipping to be safe")
        return False

    import_lines = "\n".join(
        f'import {ident} from "{p}";' for ident, p in pulled
    )
    fixed = stripped[:last_end] + "\n" + import_lines + stripped[last_end:]

    if fixed != content:
        open(path, "w", encoding="utf-8").write(fixed)
        print(f"  fixed {path} ({len(pulled)} import(s) relocated)")
        return True
    print(f"  skip  {path} (already fine)")
    return False


def main():
    changed = 0
    for f in FILES:
        try:
            if fix_file(f):
                changed += 1
        except FileNotFoundError:
            print(f"  WARN  {f}: file not found, skipping")
    print(f"\nDone. {changed} file(s) repaired.")
    print("Now run: npx tsc --noEmit")


if __name__ == "__main__":
    main()
