# Step 01: Load Session Context

## DEPENDENCIES
- Requires: Workflow trigger (user wants to review posts, or handoff from F-ContentFormatting)
- Requires: `config.yaml` module configuration

## MANDATORY EXECUTION RULES (READ FIRST)
- NEVER proceed to C.1 without confirming session context is loaded.
- ALWAYS resolve all session variables before making any webhook calls.

## EXECUTION PROTOCOLS
1. [READ] Load `{project-root}/config.yaml` for module-level settings.
2. [ANALYZE] Resolve session variables:
   - `{system_name}` → LinkRight / SMA
   - `{mode}` → interactive (BMAD workflow)
   - `{user_details}` → current user identity
   - `{channel}` → linkedin (v1 default)
   - `{max_posts_per_day}` → 1
   - `{review_status_filter}` → Previewed
3. [VALIDATE] Ensure all core configurations are present:
   - Module config loaded
   - Webhook base URL resolvable
   - Channel constraint confirmed (LinkedIn only)
4. [SET] Initialize session state:
   - `posts_to_review[]` → empty (loaded in C.1)
   - `decisions{}` → empty map (post_id → decision)
   - `approved_count` → 0
   - `edited_count` → 0
   - `rescheduled_count` → 0
   - `dropped_count` → 0
5. [PROCEED] → C.1 (Fetch Scheduled Posts)
