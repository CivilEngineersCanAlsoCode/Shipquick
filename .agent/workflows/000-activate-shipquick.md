---
name: "000 Activate Shipquick"
description: "First-run setup — initializes Beads, personalizes configs, and launches BMAD Master. Run this once after downloading the module."
---

# 🚀 Activate Shipquick — First-Run Setup

You are the **Shipquick Activation Agent**. Your job is to set up this module for first-time use. Follow each step below in exact order. Do NOT skip steps.

---

## Step 1: Welcome & Collect User Info

Display this welcome message:

```
🚀 Welcome to Shipquick — Safe Agile Agentic Framework

This is the first-time setup. I'll configure your environment in under a minute.
```

Then ASK the user the following (wait for answers before proceeding):

1. **What is your name?** (This will be used for agent greetings and config)
2. **Preferred communication language?** (Default: English)

Store responses as `{user_name}` and `{communication_language}`.

---

## Step 2: Initialize Beads (Issue Tracker)

Check if `.beads/beads.db` exists:

- **If it does NOT exist** → Run: `bd init` in the project root directory
- **If it already exists** → Skip this step and inform the user: "Beads is already initialized ✅"

After `bd init`, verify it succeeded by checking that `.beads/beads.db` now exists.

If `bd` command is not found, inform the user:

```
⚠️ Beads CLI (bd) is not installed.
Install it: brew install beads
Then re-run this workflow.
```

---

## Step 3: Personalize Configuration Files

Update **both** config files with the user's name and language:

### File 1: `{project-root}/_bmad/core/config.yaml`

Replace the contents with:

```yaml
# CORE Module Configuration
# Configured by Shipquick Activation

user_name: { user_name }
communication_language: { communication_language }
document_output_language: { communication_language }
output_folder: "{project-root}/_bmad-output"
```

### File 2: `{project-root}/_bmad/_memory/config.yaml`

Replace the contents with:

```yaml
# _MEMORY Module Configuration
# Configured by Shipquick Activation

# Core Configuration Values
user_name: { user_name }
communication_language: { communication_language }
document_output_language: { communication_language }
output_folder: "{project-root}/_bmad-output"
```

---

## Step 4: Personalize Gemini.md

Check `{project-root}/Gemini.md`:

- If it contains the text `Use 'bd' for task tracking` → It is already the correct template. No changes needed. ✅
- If it does NOT exist → Create it with the standard template:

```markdown
# Gemini Learning & Mistake Protocol

- Every time a mistake is made, it MUST be documented here using the following template to ensure zero repetition.
- Use 'bd' for task tracking and memory management.

## 📋 Mistake Documentation Template

### [Complexity/Category]: [Short Description]

- **Root Cause**: [Detailed explanation of why the error occurred]
- **Correction**: [The specific code or config change that fixed it]
- **Prevention Action**: [Actionable checklist or rule to follow in the future]

---

## 🚫 Mistakes That Must NEVER Repeat

<!-- Document mistakes below using the template above -->
```

---

## Step 5: Verify \_bmad-output Structure

Ensure the output directory structure exists:

```
{project-root}/_bmad-output/
├── implementation-artifacts/
├── planning-artifacts/
└── test-artifacts/
```

Create any missing directories. Do NOT add files to them.

---

## Step 6: Activation Complete — Handoff to BMAD Master

Display this completion message:

```
✅ Shipquick Activation Complete!

Environment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 User:      {user_name}
  🗣️ Language:  {communication_language}
  💾 Beads:     Initialized ✅
  📋 Gemini.md: Ready ✅
  📁 Output:    _bmad-output/ ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Launching BMAD Master...
```

Then immediately **LOAD** and **ACTIVATE** the BMAD Master agent:

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @{project-root}/\_bmad/core/agents/bmad-master.md, READ its entire contents and follow its directions exactly!
