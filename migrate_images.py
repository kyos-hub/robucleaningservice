#!/usr/bin/env python3
"""
Migrate all remote Unsplash image URLs in src/ to local files under
src/assets/photos/, and rewrite each source file to import them.

Usage (run from your project root, e.g. /workspaces/site-builder-database):
    python3 migrate_images.py

What it does:
  1. Finds every unique Unsplash photo URL referenced anywhere in src/**.
  2. Downloads each one once into src/assets/photos/<slug>.jpg
     (slug derived from the photo id, collision-safe).
  3. Rewrites each source file: replaces the quoted URL string with an
     imported identifier, and inserts the import at the top of the file
     (after the last top-of-file import, correctly, even past large
     comment blocks).
  4. Prints a summary and leaves a manifest at /tmp/image_migration.json
     so you can review exactly what changed.

Safe to re-run: already-downloaded images and already-migrated files are
skipped.
"""
import json
import os
import re
import subprocess
import sys

SRC_DIR = "src"
ASSETS_DIR = os.path.join(SRC_DIR, "assets", "photos")
MANIFEST_PATH = "/tmp/image_migration.json"

# Matches a full quoted Unsplash URL, e.g.
# "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80"
URL_RE = re.compile(
    r'(["\'])(https://images\.unsplash\.com/photo-([0-9a-z]+-[0-9a-f]+)\?[^"\']*)\1'
)


SOURCE_EXTS = (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".mdx", ".md")


def find_source_files():
    """Walk src/ in pure Python (no dependency on ripgrep/grep being installed)."""
    matches = []
    for root, _dirs, filenames in os.walk(SRC_DIR):
        for name in filenames:
            if not name.endswith(SOURCE_EXTS):
                continue
            path = os.path.join(root, name)
            try:
                with open(path, encoding="utf-8", errors="ignore") as fh:
                    if "images.unsplash.com" in fh.read():
                        matches.append(path)
            except OSError:
                continue
    return matches


def slug_for(photo_id: str, taken: dict) -> str:
    """Generate a short, unique, filesystem-safe slug for a photo id."""
    base = "p-" + photo_id[:12]
    if base not in taken or taken[base] == photo_id:
        taken[base] = photo_id
        return base
    # collision: fall back to the full id
    full = "p-" + photo_id
    taken[full] = photo_id
    return full


def ident_for(slug: str) -> str:
    parts = re.split(r"[-_]", slug)
    return "img" + "".join(p.capitalize() for p in parts if p)


def download(url: str, dest: str) -> bool:
    if os.path.exists(dest):
        return True
    dl_url = url.split("?")[0] + "?auto=format&fit=crop&w=1600&q=80&fm=jpg"
    r = subprocess.run(["curl", "-sfL", dl_url, "-o", dest])
    if r.returncode != 0 or not os.path.exists(dest) or os.path.getsize(dest) == 0:
        print(f"  FAILED to download: {url}", file=sys.stderr)
        if os.path.exists(dest):
            os.remove(dest)
        return False
    return True


def insert_import(lines: list, import_line: str) -> list:
    """Insert import_line after the last contiguous top-of-file import."""
    last_import_idx = -1
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("import "):
            last_import_idx = i
        elif stripped == "" or stripped.startswith("//"):
            continue
        else:
            break
    insert_at = last_import_idx + 1
    lines.insert(insert_at, import_line)
    return lines


def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    files = find_source_files()
    if not files:
        print("No files reference images.unsplash.com — nothing to do.")
        return

    # Pass 1: collect every unique photo id across all files.
    photo_ids = set()
    for f in files:
        content = open(f, encoding="utf-8").read()
        for m in URL_RE.finditer(content):
            photo_ids.add(m.group(3))

    print(f"Found {len(photo_ids)} unique Unsplash photos across {len(files)} files.")

    taken = {}
    photo_id_to_slug = {}
    for pid in sorted(photo_ids):
        photo_id_to_slug[pid] = slug_for(pid, taken)

    # Pass 2: download.
    print("Downloading...")
    ok_ids = set()
    for pid, slug in photo_id_to_slug.items():
        dest = os.path.join(ASSETS_DIR, f"{slug}.jpg")
        sample_url = f"https://images.unsplash.com/photo-{pid}"
        if download(sample_url, dest):
            ok_ids.add(pid)
            print(f"  ok  {slug}.jpg")

    # Pass 3: rewrite source files (only for successfully downloaded photos).
    manifest = {}
    changed_files = []
    for f in files:
        content = open(f, encoding="utf-8").read()
        used_idents = {}  # ident -> slug

        def repl(m):
            pid = m.group(3)
            if pid not in ok_ids:
                return m.group(0)  # leave untouched if download failed
            slug = photo_id_to_slug[pid]
            ident = ident_for(slug)
            used_idents[ident] = slug
            return ident  # bare identifier, no quotes — becomes a JS reference

        new_content = URL_RE.sub(repl, content)
        if not used_idents:
            continue

        lines = new_content.split("\n")
        for ident, slug in sorted(used_idents.items()):
            import_line = f'import {ident} from "@/assets/photos/{slug}.jpg";'
            if import_line not in new_content:
                lines = insert_import(lines, import_line)

        open(f, "w", encoding="utf-8").write("\n".join(lines))
        changed_files.append(f)
        manifest[f] = used_idents
        print(f"  rewrote {f} ({len(used_idents)} image(s))")

    json.dump(manifest, open(MANIFEST_PATH, "w"), indent=2)
    print(f"\nDone. {len(changed_files)} file(s) changed.")
    print(f"Manifest written to {MANIFEST_PATH}")
    print("\nNext steps:")
    print("  1. Run your typecheck (e.g. `bunx tsgo --noEmit` or `tsc --noEmit`).")
    print("  2. Restart your dev server and visually spot-check a few pages.")
    print("  3. `rg images.unsplash.com src` should return nothing left over")
    print("     (any remaining hits mean a download failed — check stderr above).")


if __name__ == "__main__":
    main()