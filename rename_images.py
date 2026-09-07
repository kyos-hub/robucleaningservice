#!/usr/bin/env python3
"""
Renames src/assets/photos/p-*.jpg files to descriptive names based on
where each one is used, and updates every import + identifier across
src/ to match.

Run from your project root:
    python3 rename_images.py

Safe to preview first — pass --dry-run to see the plan without changing
any files:
    python3 rename_images.py --dry-run
"""
import os
import re
import sys

SRC_DIR = "src"
ASSETS_DIR = os.path.join(SRC_DIR, "assets", "photos")
SOURCE_EXTS = (".ts", ".tsx", ".js", ".jsx")

IMPORT_RE = re.compile(
    r'import\s+(\w+)\s+from\s+"@/assets/photos/([\w\-]+)\.jpg";'
)


def find_source_files():
    matches = []
    for root, _dirs, filenames in os.walk(SRC_DIR):
        for name in filenames:
            if name.endswith(SOURCE_EXTS):
                matches.append(os.path.join(root, name))
    return matches


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def to_ident(slug: str) -> str:
    parts = slug.split("-")
    return "img" + "".join(p.capitalize() for p in parts if p)


def nearest_slug_above(lines: list, idx: int) -> str | None:
    """Look a few lines above `idx` for a `slug: "..."` field (used in
    lib/products.ts and lib/blog-posts.ts, where each entry has one)."""
    for i in range(idx, max(idx - 12, -1), -1):
        m = re.search(r'slug:\s*"([\w\-]+)"', lines[i])
        if m:
            return m.group(1)
    return None


def nearest_name_field_above(lines: list, idx: int) -> str | None:
    for i in range(idx, max(idx - 12, -1), -1):
        m = re.search(r'name:\s*"([^"]+)"', lines[i])
        if m:
            return slugify(m.group(1))
        m = re.search(r'title:\s*"([^"]+)"', lines[i])
        if m:
            return slugify(m.group(1))
    return None


def descriptive_name_for(filepath: str, content: str, ident: str) -> str:
    """Figure out a good descriptive name for one usage of an image."""
    lines = content.split("\n")

    # Where is this identifier actually *used* (not the import line itself)?
    usage_idx = None
    for i, line in enumerate(lines):
        if f"import {ident} " in line:
            continue
        if re.search(rf"\b{re.escape(ident)}\b", line):
            usage_idx = i
            break

    base = os.path.splitext(os.path.basename(filepath))[0]
    base = base.replace(".$", "-").replace(".", "-")

    if usage_idx is not None:
        slug = nearest_slug_above(lines, usage_idx)
        if slug:
            return slug
        name = nearest_name_field_above(lines, usage_idx)
        if name:
            return name

    return base  # fall back to the file it's used in, e.g. "about", "careers"


def main():
    dry_run = "--dry-run" in sys.argv

    files = find_source_files()
    file_contents = {f: open(f, encoding="utf-8").read() for f in files}

    # old_slug -> chosen new descriptive slug
    rename_plan: dict[str, str] = {}
    used_names: dict[str, int] = {}

    for f, content in file_contents.items():
        for m in IMPORT_RE.finditer(content):
            ident, old_slug = m.group(1), m.group(2)
            if old_slug in rename_plan:
                continue
            desc = descriptive_name_for(f, content, ident)
            desc = slugify(desc) or old_slug
            # de-duplicate if two different photos would get the same name
            count = used_names.get(desc, 0)
            used_names[desc] = count + 1
            final = desc if count == 0 else f"{desc}-{count + 1}"
            rename_plan[old_slug] = final

    print(f"Planned renames ({len(rename_plan)}):")
    for old, new in sorted(rename_plan.items()):
        print(f"  {old}.jpg  ->  {new}.jpg")

    if dry_run:
        print("\n(dry run — no files changed)")
        return

    # 1. Rename the actual files on disk.
    for old, new in rename_plan.items():
        old_path = os.path.join(ASSETS_DIR, f"{old}.jpg")
        new_path = os.path.join(ASSETS_DIR, f"{new}.jpg")
        if os.path.exists(old_path) and old_path != new_path:
            if os.path.exists(new_path):
                print(f"  WARN: {new_path} already exists, skipping rename of {old_path}")
                continue
            os.rename(old_path, new_path)

    # 2. Update every import statement + identifier in every source file.
    changed_files = 0
    for f, content in file_contents.items():
        new_content = content
        replaced_any = False

        def repl(m, _f=f):
            nonlocal replaced_any
            old_ident, old_slug = m.group(1), m.group(2)
            new_slug = rename_plan.get(old_slug, old_slug)
            new_ident = to_ident(new_slug)
            replaced_any = True
            return f'import {new_ident} from "@/assets/photos/{new_slug}.jpg";'

        new_content = IMPORT_RE.sub(repl, new_content)

        if replaced_any:
            # Also rename identifier usages elsewhere in the file.
            for m in IMPORT_RE.finditer(content):
                old_ident, old_slug = m.group(1), m.group(2)
                new_slug = rename_plan.get(old_slug, old_slug)
                new_ident = to_ident(new_slug)
                if new_ident != old_ident:
                    new_content = re.sub(
                        rf"\b{re.escape(old_ident)}\b", new_ident, new_content
                    )

        if new_content != content:
            open(f, "w", encoding="utf-8").write(new_content)
            changed_files += 1
            print(f"  updated {f}")

    print(f"\nDone. {len(rename_plan)} file(s) renamed, {changed_files} source file(s) updated.")
    print("Now run: npx tsc --noEmit")


if __name__ == "__main__":
    main()
