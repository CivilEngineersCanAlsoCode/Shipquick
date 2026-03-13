# /atf-help - AutoFlow Help System

Display available AutoFlow commands and guide users to the right workflow.

## Usage
```
/atf-help              # Show all commands
/atf-help scout        # Show Scout agent commands
/atf-help build        # Show build-related commands
```

## Execution

1. Load the help catalog from `{project-root}/src/modules/atf/docs/module-help.csv`

2. Parse user query (if any) to filter commands

3. Display commands grouped by agent:

---

## 🏭 AutoFlow: Intelligent Workflow Automation

**Quick Start:** `/autoflow "your automation idea"`

---

### 🔍 Scout (Requirements Analyst)

| Command | Code | Description |
|---------|------|-------------|
| Create Automation | `CA` | Start the full assembly line |
| Chat | `CH` | Ask about requirements or platforms |

**Load:** `/atf-scout` then use code

---

### 📐 Blueprint (Specs Architect)

| Command | Code | Description |
|---------|------|-------------|
| Mock Data | `MK` | Generate test data from specs |
| Chat | `CH` | Ask about data schemas |

**Load:** `/atf-blueprint` then use code

---

### ⚙️ Forge Master (Automation Architect)

| Command | Code | Description |
|---------|------|-------------|
| Node Discovery | `ND` | Find and compare n8n nodes |
| Chat | `CH` | Ask about nodes and integrations |

**Load:** `/atf-forge-master` then use code

---

### 🔥 Welder (Workflow Builder)

| Command | Code | Description |
|---------|------|-------------|
| Deploy to n8n | `DN` | Push workflow to n8n instance |
| Chat | `CH` | Ask about build progress |

**Load:** `/atf-welder` then use code

---

### 🔎 Inspector (QA Engineer)

| Command | Code | Description |
|---------|------|-------------|
| Test & Validate | `TV` | Run QA validation loop |
| Alternative Suggest | `AS` | Propose alternatives on failure |
| Chat | `CH` | Ask about test results |

**Load:** `/atf-inspector` then use code

---

### 🌐 Universal Commands (Any Agent)

| Command | Code | Description |
|---------|------|-------------|
| Workflow Status | `WS` | Check assembly line progress |
| Handoff | `HO` | Transfer to next agent |
| Escalate | `ES` | Request human decision |
| Help | `HP` | Show this help |

---

## Workflows

| Workflow | Steps | Command |
|----------|-------|---------|
| create-automation | 7 | `/autoflow` |
| node-discovery | 4 | `/atf-forge-master` → `ND` |
| test-validate | 4 | `/atf-inspector` → `TV` |
| Others | 1 | Via agent codes |

---

## Example Usage

```
# Full pipeline
/autoflow "Email me when new row added to Google Sheet"

# Just find nodes
/atf-forge-master
> ND
> "send email"

# Validate existing workflow
/atf-inspector
> TV
> FE0Ovwp0qVqX1dep
```

---

**Tip:** Use `/autoflow` for end-to-end builds. Use individual agents for specific tasks.
