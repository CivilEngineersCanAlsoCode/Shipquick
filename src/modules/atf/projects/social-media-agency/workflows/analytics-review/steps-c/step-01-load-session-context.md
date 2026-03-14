# Step 01: Load Session Context

## Purpose
Initialize the analytics review session by loading configuration and determining the review period.

## What to Do

1. **Load Analytics Config:**
   - Read `workflow.yaml` for input file patterns and paths
   - Load analytics configuration from n8n via `sma-fetch-config` with `{ "doc_id": "analytics_config" }`
   - Confirm engagement scoring formula: `likes×1 + comments×3 + shares×2`

2. **Determine Review Period:**
   - Ask the user: "Review last week or last month?"
   - Calculate exact date range based on user's choice
   - Store `period_start`, `period_end`, and `period_label` in session context

3. **Check Prerequisites:**
   - Verify n8n webhooks are reachable
   - Confirm Notion KPIs database is accessible
   - Check that published posts exist for the selected period

4. **Initialize Session State:**
   - Set `workflow_code: E`
   - Set `current_step: 01-load-session-context`
   - Record session start timestamp
   - Store config and period in working memory

## Output
- Session context loaded with config, period, and prerequisites verified
- Ready to proceed to E.1 (Fetch Metrics)

## Error Handling
- If config fetch fails: use default scoring formula and notify user
- If no published posts found: inform user and suggest adjusting the period

## Next Step
-> `step-E1-fetch-metrics.md`
