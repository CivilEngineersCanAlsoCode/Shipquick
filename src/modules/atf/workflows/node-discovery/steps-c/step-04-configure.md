---
name: 'step-04-configure'
description: 'Help configure the node for use'
---

# Step 4: Configure

## STEP GOAL:
Help user configure the selected node for their specific use case.

## SEQUENCE

### 1. Gather Use Case
"**Let's configure {node_name} for your needs.**

**What operation do you want to perform?**
{list_operations_as_numbered_options}"

### 2. Build Configuration
Based on selected operation, guide through parameters:

"**Configuring: {operation_name}**

**Required Parameters:**"

For each required parameter:
"- **{param_name}**: {description}
  Type: {type}
  Example: {example}
  **Your value:** [waiting for input]"

### 3. Validate Configuration
```
validate_node({
  nodeType: "{type}",
  parameters: {configured_params}
})
```

### 4. Display Final Configuration
"**✅ Node Configuration Complete**

```json
{
  "type": "{type}",
  "name": "{suggested_name}",
  "parameters": {
    {configured_parameters}
  },
  "credentials": {
    "{credential_type}": "configure_in_n8n"
  }
}
```

**Credential Setup:**
{step_by_step_credential_instructions}

---

**Copy this configuration to use in your workflow.**"

### 5. Offer Final Options
"**What's next?**

[U] Use in create-automation — Build a workflow with this node
[A] Add another node — Find more nodes
[D] Done — All set!"

### 6. Handle Response
- IF U: Handoff to create-automation workflow
- IF A: Load step-01-search.md
- IF D: End with summary

---

## SUCCESS METRICS
✅ Operation selected
✅ Parameters configured
✅ Configuration validated
✅ Ready-to-use JSON provided
✅ Credential setup explained
