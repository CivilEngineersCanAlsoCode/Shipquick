# Step 01: Load Session Context

## DEPENDENCIES
- Requires: Workflow trigger (user says "Let's brainstorm" / "Ideas do" / starts ideation)
- Requires: `config.yaml` module configuration

## MANDATORY EXECUTION RULES (READ FIRST)
- NEVER proceed to A.1 without confirming session context is loaded.
- ALWAYS resolve all session variables before making any webhook calls.

## EXECUTION PROTOCOLS
1. [READ] Load `{project-root}/config.yaml` for module-level settings.
2. [ANALYZE] Resolve session variables:
   - `{system_name}` → LinkRight / SMA
   - `{mode}` → interactive (BMAD workflow)
   - `{user_details}` → current user identity
   - `{channel}` → linkedin (v1 default)
   - `{max_posts}` → 3 (from config)
   - `{lookback_days}` → 14 (from config)
   - `{similarity_threshold}` → 0.80 (from config)
3. [VALIDATE] Ensure all core configurations are present:
   - Module config loaded
   - Webhook base URL resolvable
   - Channel constraint confirmed (LinkedIn only)
4. [SET] Initialize session state:
   - `briefs[]` → empty
   - `past_posts[]` → empty
   - `scoring_config` → null (loaded in A.4)
   - `selected_briefs[]` → empty
   - `scheduled_posts[]` → empty
5. [PROCEED] → A.1 (Fetch Briefs)
