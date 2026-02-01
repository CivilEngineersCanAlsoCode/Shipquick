# Shipquick

**BMAD Method + SAFe 6.0.1 + Beads State Management**

One-command setup for AI-powered agile development.

## Quick Start

```bash
npx shipquick install
```

This will:

1. ✅ Copy `_bmad-safe/` to your project
2. ✅ Install Beads CLI globally
3. ✅ Initialize Beads for task tracking

## What's Included

### BMAD Method Agents (17 AI Agents)

- **Analyst** - Business analysis & market research
- **PM** - Product management & PRD creation
- **Architect** - System architecture design
- **RTE** - Release Train Engineer (PI Planning)
- **PO** - Product Owner (Story management)
- **SM** - Scrum Master (Sprint management)
- **Dev** - Development execution
- **QA** - Quality assurance
- And more...

### SAFe 6.0.1 Templates

- Theme, Epic, Capability, Feature, Story, Task
- PI Objectives, ROAM Risks, WSJF Calculator
- Flow Metrics, Iteration Plan

### Beads State Management

- Hierarchical task tracking
- Enhanced ID format (T-001, E-T1-01, etc.)
- Parent-child relationship visibility

## After Installation

```bash
# View task hierarchy
bd list

# See next task
bd ready

# Mark task complete
bd done <id>

# Create new task
bd create "Task name"
```

## Configuration

Edit `_bmad-safe/bmm-safe/config.yaml`:

```yaml
user_name: "Your Name"
communication_language: "Romanised Hindi"
output_folder: "{project-root}/_bmad-output"
```

## SAFe Hierarchy

```
Theme → Epic → Capability → Feature → Story → Task
  T-001   E-T1-01   C-E1-01   F-C1-01   US-F1-01   TK-S1-01
```

## License

MIT

## Links

- [GitHub](https://github.com/CivilEngineersCanAlsoCode/Shipquick)
- [Beads](https://github.com/steveyegge/beads)
