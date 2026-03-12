#!/usr/bin/env python3
"""
bmad_to_beads.py — Parse BMAD epics/stories markdown → Beads hierarchy via bd CLI

Usage:
  python3 bmad_to_beads.py <epics-file.md> [--project <name>] [--dry-run]

Examples:
  python3 bmad_to_beads.py docs/epics.md --project lifeos
  python3 bmad_to_beads.py docs/epics.md --dry-run   # Preview without creating

The script parses BMAD-style epic/story markdown and creates Beads issues.
Expected markdown format:
  # Epic: <title>
  ## Feature: <title>  (or ## <title>)
  ### Story: <title>   (or ### <title>)
  - Task: <title>      (or - <title>)
    - Subtask: <title>

Dependencies are parsed from lines like:
  > depends on: <epic/feature title>
  > blocks: <epic/feature title>
"""

import subprocess, sys, re, argparse, json, time

BEADS_DIR = "/home/ubuntu/MasterWorkspace/shipquick"

def run_bd(args, dry_run=False):
    cmd = ["bd"] + args
    if dry_run:
        print(f"  [DRY] {' '.join(cmd)}")
        return f"dry-{hash(str(args))}"
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=BEADS_DIR)
    if result.returncode != 0:
        print(f"  ⚠️  Error: {result.stderr.strip()}")
        return None
    # Extract created issue ID
    match = re.search(r'shipquick-[a-z0-9]+(?:\.[0-9]+)*', result.stdout)
    return match.group(0) if match else None

def parse_epics_file(filepath):
    with open(filepath) as f:
        lines = f.readlines()

    structure = []
    current_epic = current_feature = current_story = None
    depends_pattern = re.compile(r'>\s*depends[_ ]?on[: ]+(.+)', re.I)
    blocks_pattern  = re.compile(r'>\s*blocks[: ]+(.+)', re.I)

    for line in lines:
        stripped = line.strip()

        # Epic
        if re.match(r'^#{1,2}\s+(Epic[: ]+|🎯\s*)', stripped, re.I) or \
           (stripped.startswith('# ') and 'epic' not in stripped.lower() and not current_epic):
            title = re.sub(r'^#+\s*(Epic[: ]*|🎯\s*)', '', stripped, flags=re.I).strip()
            title = re.sub(r'^#+\s*', '', title).strip()  # strip any remaining # chars
            current_epic = {"type": "epic", "title": title, "children": [], "deps": [], "blocks": []}
            structure.append(current_epic)
            current_feature = current_story = None

        # Feature
        elif re.match(r'^#{2,3}\s+(Feature[: ]+)?', stripped) and current_epic:
            title = re.sub(r'^#+\s*(Feature[: ]*)?', '', stripped, flags=re.I).strip()
            if title and not title.lower().startswith('story') and not title.lower().startswith('task'):
                current_feature = {"type": "feature", "title": title, "children": [], "deps": []}
                current_epic["children"].append(current_feature)
                current_story = None

        # Story
        elif re.match(r'^#{3,4}\s+(Story[: ]+)?', stripped) and current_feature:
            title = re.sub(r'^#+\s*(Story[: ]*)?', '', stripped, flags=re.I).strip()
            if title:
                current_story = {"type": "story", "title": title, "children": []}
                current_feature["children"].append(current_story)

        # Task (bullet points)
        elif re.match(r'^[-*]\s+(Task[: ]+)?', stripped) and current_story:
            title = re.sub(r'^[-*]\s+(Task[: ]*)?', '', stripped, flags=re.I).strip()
            if title and len(title) > 3:
                current_story["children"].append({"type": "task", "title": title, "children": []})

        # Dependencies
        elif depends_pattern.match(stripped) and current_epic:
            dep = depends_pattern.match(stripped).group(1).strip()
            current_epic["deps"].append(dep)
        elif blocks_pattern.match(stripped) and current_epic:
            blk = blocks_pattern.match(stripped).group(1).strip()
            current_epic["blocks"].append(blk)

    return structure

def create_hierarchy(structure, dry_run=False):
    created = {}  # title → beads_id

    for epic in structure:
        print(f"\n📌 Epic: {epic['title']}")
        epic_id = run_bd(["create", "--type", "epic", "--title", epic["title"], "-p", "0"], dry_run)
        if epic_id:
            created[epic["title"]] = epic_id
            print(f"  ✅ {epic_id}")
            time.sleep(0.3)

        # Always add Bug Fixing feature
        bug_feature_id = run_bd(["create", "--type", "feature", "--parent", epic_id or "epic",
                                   "--title", "Bug Fixing & Refactors", "-p", "2"], dry_run)
        if bug_feature_id:
            created[f"{epic['title']}::bugs"] = bug_feature_id

        for feature in epic.get("children", []):
            print(f"  📁 Feature: {feature['title']}")
            feat_id = run_bd(["create", "--type", "feature", "--parent", epic_id or "epic",
                               "--title", feature["title"], "-p", "1"], dry_run)
            if feat_id:
                created[feature["title"]] = feat_id
                time.sleep(0.2)

            for story in feature.get("children", []):
                story_id = run_bd(["create", "--parent", feat_id or "feature",
                                    "--title", story["title"]], dry_run)
                if story_id:
                    created[story["title"]] = story_id
                    time.sleep(0.2)

                for task in story.get("children", []):
                    task_id = run_bd(["create", "--parent", story_id or "story",
                                       "--title", task["title"]], dry_run)
                    if task_id:
                        created[task["title"]] = task_id
                        time.sleep(0.1)

    # Wire dependencies
    print("\n🔗 Wiring dependencies...")
    for epic in structure:
        epic_id = created.get(epic["title"])
        if not epic_id:
            continue
        for dep_title in epic.get("deps", []):
            dep_id = created.get(dep_title)
            if dep_id:
                run_bd(["dep", dep_id, "--blocks", epic_id], dry_run)
                print(f"  {dep_title} → blocks → {epic['title']}")
        for blk_title in epic.get("blocks", []):
            blk_id = created.get(blk_title)
            if blk_id:
                run_bd(["dep", epic_id, "--blocks", blk_id], dry_run)
                print(f"  {epic['title']} → blocks → {blk_title}")

    return created

def main():
    parser = argparse.ArgumentParser(description="BMAD epics → Beads hierarchy")
    parser.add_argument("filepath", help="Path to BMAD epics markdown file")
    parser.add_argument("--dry-run", action="store_true", help="Preview without creating")
    args = parser.parse_args()

    print(f"📖 Parsing: {args.filepath}")
    structure = parse_epics_file(args.filepath)
    print(f"Found: {len(structure)} epics")
    for e in structure:
        print(f"  📌 {e['title']} → {len(e['children'])} features")

    if not args.dry_run:
        print("\n🔨 Creating in Beads...")
        # Start dolt if needed
        subprocess.run(["bd", "dolt", "start"], capture_output=True, cwd=BEADS_DIR)
        time.sleep(2)

    created = create_hierarchy(structure, args.dry_run)

    print(f"\n✅ Done! Created {len(created)} issues")
    print("\n📋 Run 'bd list' to see full tree")
    if not args.dry_run:
        subprocess.run(["bd", "list"], cwd=BEADS_DIR)

if __name__ == "__main__":
    main()
