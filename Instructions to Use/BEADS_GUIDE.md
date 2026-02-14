# Beads: BMAD Agents ki "Digital Yaaddasht" (Memory)

Beads ek distributed, git-backed graph issue tracker hai jo khaas karke AI agents ke liye banaya gaya hai. **BMAD (Breakthrough Method of Agile Driven AI Product Developement)** method mein, Beads ek "Source of Truth" ka kaam karta hai. Ye ensure karta hai ki PM, Architect, Dev, aur QA agents ke beech mein koi communication gap na rahe aur har agent ko pata ho ki "Next Best Action" kya hai.

---

## 👥 BMAD Agent Roles & Permissons

BMAD mein har agent ka apna ek zimma (responsibility) hota hai. Beads in roles ko define karne mein madad karta hai.

### 🛡️ The Maintainer (PM aur Architect Agents)

Maintainer wo hota hai jo project ka vision control karta hai (jaise ki "Head Chef").

**BMAD Scenarios:**

- **Story Breakdown (PM Agent)**: PRD padhne ke baad, PM Agent `bd create` command use karke Epics ko chhote-chhote "Stories" mein break karta hai.
- **Architectural Rules (Architect Agent)**: Architect ensure karta hai ki "Migration" wala task "API Implementation" se pehle khatam ho. Iske liye wo `bd dep add` use karta hai.
- **Project Pulse**: `bd stats` dekh kar PM check karta hai ki sprint on-track hai ya nahi.

### 🛠️ The Contributor (Dev aur QA Agents)

Contributor wo hota hai jo actual kaam (execution) karta hai.

**BMAD Scenarios:**

- **Work Discovery (Dev Agent)**: Dev Agent hamesha `bd ready` check karke apna agla unblocked task uthata hai.
- **Bug Reporting (QA Agent)**: Testing ke waqt agar kuch phat gaya, toh QA Agent `bd create --type bug` karke issue record karta hai.
- **Turn Updates**: Task khatam hone pe `bd close` karke doosre agents ko signal dena ki rasta saaf hai.

---

## 🚀 Setup aur Initialization

### 1. `bd init`: Yaaddasht Start Karna

Ye command project folder mein `.beads/` directory banata hai. Ye project ki "Long-Term Memory" hai.

- **Usage**: `bd init`
- **BMAD Tip**: Project start hote hi sabse pehle ye chalao taaki agents track par rahein.

### 2. `bd setup claude`: Claude ke saath Connection

Ye Claude ko batata hai ki Beads use karna hai. Isse Claude har session ke start mein project ka status khud hi samajh jayega.

- **Usage**: `bd setup claude`
- **Analogy**: Ye agent ko "Medical History" dene jaisa hai taaki use har baar purani baatein na batani padein.

---

## 🛠️ Main Workflow Commands (BMAD style)

### 📋 `bd create`: Naya Kaam Register Karna

Jab koi naya feature ya task sochna ho.

- **Command**: `bd create "Database Setup" --type task --priority 1`
- **BMAD Scenario**: PM Agent jab Epics banata hai, toh wo ensure karta hai ki har "Story" ka ek unique ID ho (jaise `beads-a1b2`).

### ⛓️ `bd dep add`: Dependency Lagana

Ye batata hai ki "B" task tabhi start hoga jab "A" khatam ho jayega.

- **Command**: `bd dep add <task_B_id> <task_A_id>`
- **BMAD Scenario**: Architect order fix karta hai: "Implementation" tabhi shuru ho jab "Technical Design" approved ho.

### 🚦 `bd ready`: Agla Kaam Dhundhna

Sabse important command for Dev Agents. Ye sirf wo tasks dikhata hai jo unblocked hain.

- **Command**: `bd ready`
- **BMAD Scenario**: Dev Agent session start karke `bd ready` karta hai aur highest priority wala task pick karta hai. "Bina ready check kiye kaam shuru mat karo!"

### 📝 `bd update`: Status aur Notes

Kaam ki progress batane ke liye.

- **Command**: `bd update <id> --status in_progress --claim`
- **BMAD Scenario**: Dev Agent jab story pe kaam shuru karta hai, toh use "Claim" kar leta hai taaki doosre agents (ya users) ko pata chale ki ye occupied hai.

### 💬 `bd message`: Agent-to-Agent Feedback

Discussion ko task level pe rakhna.

- **Command**: `bd message <id> "API structure revised" --thread`
- **BMAD Scenario**: QA Agent bug report karte waqt error logs ko `bd message` mein daal deta hai taaki Dev ko context mil jaye.

---

## 🔄 Handover Protocol (Turn-Saving)

Jab ek agent ka turn khatam hota hai aur doosre ka shuru, toh persistence sabse zaroori hai.

### 🏁 `bd sync --flush-only`: Progress Save Karna

Session khatam karne se pehle ye zaroor chalao.

- **Kyun?**: Ye database ko human-readable JSON files mein convert karke Git ke liye ready karta hai.
- **BMAD Rule**: "Bina flush kiye session end matlab amnesia (yaaddasht kho jana)."

### 🎬 `bd prime`: Context Recovery

Naye session mein agent ko "Warm Start" dena.

- **Kyun?**: Ye command agent ko batata hai ki "Pichle session mein yahan tak kaam hua tha, aur ab ye tasks pending hain."
- **Note**: Setup correctly hai toh Claude ise apne aap chala lega.

---

## 🏥 Troubleshooting (The Project Doctor)

### `bd doctor`: Cheezon ko dobara sahi karna

Agar agents ke beech mein sync kharab ho jaye ya files miss ho jayein.

- **Command**: `bd doctor --fix`
- **BMAD Case**: Agar do agents ne ek saath same file edit kar di aur Git conflict aa gaya, toh doctor use sahi karne ke raste batayega.

---

## 🤖 Agent Session Best Practices (IMPORTANT)

1. **Commit Step**: Git commands (`git add . && git commit`) hamesha chalao taaki `.beads/` ki changes history mein save ho jayein.
2. **Never `bd edit`**: Agents ko `bd edit` use karne se mana karo kyunki ye terminal editor (Vim) khol deta hai jo agent ko hang kar dega. Hamesha `bd update` flags use karo.
3. **Hierarchy Matters**: Hamesha base Tasks banayein aur unke andar Sub-tasks. Isse context windows "clean" rehti hain.
4. **Final Flush**: `bd sync --flush-only` is mandatory.

> [!TIP]
> **Persistence hi Intelligence hai.** Agar agent ko apna pichla kaam yaad nahi, toh wo efficient nahi ban sakta. Beads uses that "Memory" for you.
