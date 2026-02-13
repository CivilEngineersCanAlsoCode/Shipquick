# Beads: The Ultimate Memory Upgrade for Coding Agents

Beads is a distributed, git-backed graph issue tracker designed specifically for AI agents. It replaces traditional markdown checklists with a dependency-aware graph, providing persistent memory for long-horizon tasks. Think of it as a "brain" for your coding assistant that never forgets what it was doing, even if it has to stop and start again later.

---

## 👥 Understanding Roles in Beads

Before diving into the setup, it is important to understand who is who in the Beads ecosystem. Choosing the right role ensures that your project stays organized without unnecessary clutter.

### The Maintainer

The **Maintainer** is the "Captain" or "Head Chef" of the project who has full authority to change the recipe. In Beads, a Maintainer has direct write access to the main repository and can approve or merge changes into the official project timeline. They are responsible for keeping the issue tracker clean and setting the overall direction for everyone else.

**Real-Life Examples:**

- **The Construction Foreman:** Only the foreman has the official blueprints and the authority to sign off on specific floor plan changes that everyone must follow.
- **The Lead Author:** In a co-authored book, the lead author decides which chapters make the final cut and has the final "save" button on the shared manuscript.
- **The Group Chat Admin:** Only the admin can change the group name, description, or add/remove official rules that the whole group follows.

### The Contributor

The **Contributor** is a "Guest Artist" or "Helper" who wants to suggest improvements but doesn't have the key to the front door. They typically work on their own copy of the project (a fork) and send their changes to the Maintainer for review. In Beads, Contributors use special modes to track their tasks locally without cluttering the Maintainer's official issue list until their work is ready to be shared.

**Real-Life Examples:**

- **The Freelance Designer:** A designer creates three different logo versions on their own computer and then sends the best one to the client for approval.
- **The Wiki Editor:** Someone who fixes a typo on a public page; they suggest the change, but an official moderator has to "approve" it to make it permanent.
- **The Open Source Volunteer:** A hobbyist who writes a new feature for a free app but has to wait for the app's creator to include it in the next update.

---

## 🚀 Quick Setup

### 1. Installation

Installing Beads is simply placing the "tools" in your digital toolbox so you can use them anywhere on your computer.

````carousel
```bash
# Via Homebrew
brew install beads
```
<!-- slide -->
```bash
# Via npm
npm install -g @beads/bd
```
<!-- slide -->
```bash
# Via cURL (Quick Script)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```
````

Each of these commands is like a different door into the same store; whether you use Homebrew (a package shop), npm (a tool library), or cURL (a direct download), the end result is the same: you get the `bd` tool installed globally.

**Real-Life Examples:**

- **Installing a Mobile App:** Whether you get an app from the Apple App Store or the Google Play Store, you end up with the same tool on your phone to use whenever you need it.
- **Buying a Hammer:** You can buy a hammer at a hardware store, an online shop, or a local flea market—once it's in your toolbox, it works the same way for every nail.

### 2. Initialization

Initialization is the act of telling Beads, "I want to start tracking issues for _this_ specific project right here."

```bash
cd your-project
bd init
```

Running `bd init` creates a hidden folder that stores all your project's tasks, notes, and history, similar to how a new diary needs its first page dated before you start writing.

**Real-Life Examples:**

- **Starting a New Notebook:** You label the cover "Math Notes" so you know exactly which subject's information belongs inside those pages.
- **Opening a New Bank Account:** Before you can save money, you have to "initialize" the account with the bank so they know where to track your specific transactions.

---

## 🛠 Basic Usage

### Creating Tasks

Creating a task is like writing down a specific "To-Do" item so it doesn't just stay in your head.

```bash
# Create an Epic (Priority 0)
bd create "User Authentication System" -p 0

# Create a Task under an Epic
bd create "Implement JWT Login" --parent bd-a1b2 -p 1

# Create a Sub-task
bd create "Setup salt hashing" --parent bd-a3f8.1 -p 2
```

In Beads, you can group tasks into "Epics" (huge goals), "Tasks" (specific steps), and "Sub-tasks" (tiny details), creating a clear hierarchy that looks like a family tree of work.

**Real-Life Examples:**

- **Planning a Wedding:** The "Epic" is the Wedding day; "Tasks" include finding a caterer and booking a DJ; "Sub-tasks" are specific items like "Tasting the chicken" or "Selecting the first dance song."
- **Building a Lego Set:** The "Epic" is finishing the Castle; "Tasks" are completing Bag #1 and Bag #2; "Sub-tasks" are finding specific tiny pieces for the drawbridge.

### Updating & Managing Tasks

Updating a task is how you tell everyone (and your AI) that progress is being made on a specific item.

```bash
# Claim and start a task
bd update bd-a1b2.1 --claim --status in_progress

# Update metadata
bd update bd-a1b2.1 --description "Using Argon2 for hashing" --acceptance "Tests pass"

# Close a task
bd close bd-a1b2.1 --reason "Implemented and verified"
```

Using flags (like `--description`) is like filling out a digital form instead of writing on a blank piece of paper; it ensures the information is structured so the AI can read it perfectly every time.

**Real-Life Examples:**

- **A Restaurant Order System:** A waiter "claims" a table, updates the status to "Appetizers Served," and finally "closes" the bill when the customer leaves.
- **Tracking a Delivery:** When you check a tracking number, you see updates like "Label Created" (Initial), "In Transit" (In Progress), and "Delivered" (Closed).

---

## 🔗 Customization & Modes

### Stealth Mode

Stealth mode allows you to track your personal notes without "polluting" the shared project file that everyone else sees.

```bash
bd init --stealth
```

It keeps your Beads data strictly on your own computer, meaning you get all the benefits of organization without making anyone else download your personal task list.

**Real-Life Examples:**

- **Sticky Notes on a Shared Calendar:** Everyone sees the office calendar, but only you can see the personal sticky notes you've stuck around your own monitor to remind you of your specific steps.
- **Incognito Browsing:** You are using the same internet as everyone else, but your specific history and "cookies" aren't being saved to the main shared family computer.

### Contributor Mode

Contributor mode is for when you are helping someone else's project and want to keep your "messy" planning separate from their "official" records.

```bash
bd init --contributor
```

This tells Beads to store your task list in a special folder like `~/.beads-planning` so it doesn't accidentally get included in the official changes you send to the Maintainer.

**Real-Life Examples:**

- **Drafting a Letter:** You write your messy first draft on a scrap piece of paper (Contributor Mode) and only type out the clean, final version on the official stationery to send to the recipient.
- **Architectural Sketches:** An architect draws 50 different "could-be" ideas in their personal sketchpad before showing the one official blueprint to the city planning committee.

---

## 🏥 Troubleshooting with the "Doctor"

Even with the best tools, sometimes things get slightly out of sync. Beads includes a built-in `bd doctor` command that acts like a "Health Check" for your project. It scans for common setup issues and offers to fix them automatically.

```bash
bd doctor --fix
```

Running this command is like taking your car for a diagnostic checkup; the doctor will identify what's "aching" and apply the necessary "medicine" to get you back to work.

### 1. Sync Divergence

**What it is:** This happens when your local Beads database and the official `.beads/` files in your project have different information. It’s like two people having different versions of the same story.

**The Fix:** The doctor automatically aligns the two versions so there is only one "Source of Truth." (Run `bd sync` if the doctor suggests it).

**Real-Life Examples:**

- **Double-Checking a Receipt:** You think you spent $50, but your bank says $52. A "Sync" is when you check your pockets, find the receipt for $2, and realize both you and the bank are now on the same page.
- **Clock Synchronization:** If your watch is 2 minutes fast, you "sync" it with the official wall clock so you aren't late for your next meeting.

### 2. Git Hooks

**What it is:** These are the "Automatic Reminders" that keep Beads in sync. If they are missing, Beads might forget to save your tasks whenever you save your code.

**The Fix:** The doctor re-installs these silent helpers (like `pre-commit` and `post-merge`) so you don't have to remember to sync manually.

**Real-Life Examples:**

- **Seatbelt Warning:** Your car doesn't wait for you to remember; it beeps (a hook) the moment you start driving without your seatbelt.
- **Auto-Save on a Laptop:** If you close your laptop, the computer "hooks" into that action to save your work and put the system to sleep automatically.

### 3. AI / Claude Integration

**What it is:** This tells Beads to share "Project Context" with your AI assistant. Without this, the AI might feel like it's starting every conversation with a blank memory.

**The Fix:** You can install the Beads plugin or run `bd setup claude` to give your AI "Session Memory."

**Real-Life Examples:**

- **Medical Records:** When you see a new specialist, they read your medical history (Integration) so you don't have to explain every past surgery or allergy from scratch.
- **A "Previously On..." Recap:** Before a new TV episode starts, the recap gives you the context you need to understand what's happening today.

### 4. Git Working Tree & Upstream

**What it is:** This means your project folder has unsaved changes, or you are "ahead" or "behind" the official version online.

**Special Case: The "Unstaged Changes" Error**
If you see an error saying `cannot pull with rebase: You have unstaged changes`, it means you have edited files but haven't "officially saved" them yet. Git is being protective; it doesn't want to bring in new updates that might accidentally clash with your unsaved work.

**The Fix:** You must either "Commit" (finish the job) or "Stash" (put it in a temporary box).

1. Run `git add .` to prepare your changes.
2. Run `git commit -m "Saving my latest work"` to secure them.
3. Now, run `git pull --rebase` again.

**Real-Life Examples:**

- **The Group Presentation:** If you've written your slides but haven't uploaded them to the shared Google Drive (Upstream), your teammates can't see them yet.
- **The Landlord and the Painting:** You are painting your room (Unstaged changes). Your landlord wants to install a new official light fixture (Git Pull). They say: "I can't work while you have wet paint everywhere! Either finish the wall (Commit) or put your tools away (Stash) so I can safely enter."

---

## ⚡ Advanced Features

### Dolt-Powered Backend

Beads uses a technology called **Dolt**, which is basically "Google Docs for Data."

Dolt allows multiple people to work on the same issue list at the same time and intelligently merges their changes, even if they both edited the exact same task.

**Real-Life Examples:**

- **Shared Shopping List:** If two people add different items to a digital grocery list at the same time, the list doesn't crash; it simply shows both "Milk" and "Eggs" when they both hit refresh.
- **Undo Button for History:** If you accidentally delete a task, Dolt's "History" feature allows you to travel back in time and see exactly what was there yesterday, just like "Revision History" in a Word doc.

### Git Sync Hooks

Hooks are like "Automatic Reminders" that fire off whenever you do something important in your project.

```bash
bd hooks install
```

When you save your code (a commit), these hooks automatically save your Beads tasks too, ensuring that your task list always matches the version of the code you are working on.

**Real-Life Examples:**

- **Auto-Syncing Photos:** When you take a picture on your phone, a "hook" automatically uploads it to the cloud so you don't have to remember to do it manually every night.
- **Automatic Car Lights:** A sensor acts as a "hook" that turns your headlights on automatically when it detects it's getting dark outside, so you don't have to flip a switch.

### Protected Branch Sync

This is a "Bridge" for projects that have very strict rules about who can change the main files directly.

```bash
bd init --branch beads-sync
```

Instead of trying to force changes into the protected main file, Beads creates a "Shadow Branch" where it saves all the updates. Later, you can gracefully merge that shadow branch into the main one once you have permission.

**Real-Life Examples:**

- **A Suggestion Box:** Instead of rewriting the employee handbook yourself, you put a note in the suggestion box (the shadow branch). The boss then reads all the suggestions and updates the handbook once a month.
- **The "Holding Area" at a Museum:** New artifacts aren't put straight onto the display floor; they stay in a secure "Holding Area" (Shadow Branch) for inspection before they are officially moved into the main gallery.

---

## 🔍 The "Whole House" Problem: Why `git status` is so long

If you run `git status` and see thousands of files you don't recognize (like `.DS_Store`, `Applications/`, or `Downloads/`), it means your Git "Time Machine" is set to watch your **entire computer** instead of just this one project.

**What happened:** Git was likely initialized in your main "User" folder (like `/Users/Satvik/`) instead of inside the `Safe Agile Agentic Framework` folder. This is like trying to monitor one specific desk, but pointing the security camera so it sees the entire city—it's too much information!

**The Fix: Narrowing the Vision**
To fix this and make Git focus only on your project:

1. **Initialize Git in your project folder:** Open your terminal inside your project and run:
   ```bash
   git init
   ```
2. **The "Doctor" Check:** Run `bd doctor --fix` again. It will now see the local project settings and help you set up the "Sync Branch" correctly for just this folder.

**Real-Life Examples:**

- **The Security Camera:** If you want to watch your front door, you don't point the camera at the whole neighborhood; you zoom in until only the door is in the frame.
- **Library Organization:** If you are organizing your personal bookshelf, you don't start by indexing every book in the entire City Library—you focus only on the shelves in your own room.

---

## 🤖 Agent Session Best Practices

1. **Start with `bd ready`**: Identify the next logical step that has all its requirements met.
2. **Claim the task**: `bd update <id> --claim` tells other agents that _this_ task is officially assigned to you.
3. **Use `--thread`**: Keep discussions clean by grouping messages together under a specific task.
   ```bash
   bd message bd-a1b2.1 "Checking API availability" --thread
   ```
4. **End with `bd sync`**: Ensures all your organzied memory is safely saved and pushed to the online repository.

> [!IMPORTANT]
> Never use `bd edit` as an agent. It will hang the session by opening a terminal text editor.
