---
name: "{automation_name}"
created: "{date}"
status: "IN_PROGRESS"
stepsCompleted: []
complexity: null
workflow_id: null
workflow_url: null
---

# Automation: {automation_name}

## Requirement Brief

**Summary:** {one-line description}

**Trigger:**
- Type: {webhook | schedule | event}
- Details: {specific trigger info}

**Actions:**
{list of actions}

**Integrations:**
{list of services/platforms}

**Complexity:** {simple | moderate | complex}

---

## Workflow Design

**Architecture:**
```
{workflow diagram}
```

**Nodes:**
| # | Node Type | Name | Purpose |
|---|-----------|------|---------|
| 1 | ... | ... | ... |

**Connections:**
{connection map}

**Credentials Required:**
{list of credentials user needs to configure}

---

## Build Report

**Workflow ID:** {id}
**Workflow URL:** {url}

**Build Status:** {built | error}

**Nodes Created:** {count}
**Connections Made:** {count}

**Validation:**
- Structure: {pass | fail}
- Auto-fixed: {count} issues

---

## Test Report

**Test Status:** {passed | failed | partial}

**Tests Run:**
| Test | Status | Notes |
|------|--------|-------|
| Structure validation | ... | ... |
| Execution test | ... | ... |

**Ready for Activation:** {yes | no}

---

## Activation Instructions

1. Open workflow: {url}
2. Configure credentials:
   {list}
3. Activate workflow
4. Test with real data

---

## Learnings Captured

**Pattern:** {pattern type}
**Solution:** {what worked}
**Stored to:** ChromaDB ({collection})
