# Step 01: Load Session Context

## DEPENDENCIES
- Requires: Workflow trigger (user wants to draft content, or handoff from A-ContentIdeation)
- Requires: `config.yaml` module configuration

## MANDATORY EXECUTION RULES (READ FIRST)
- NEVER proceed to B.1 without confirming session context is loaded.
- ALWAYS resolve all session variables before making any webhook calls.

## EXECUTION PROTOCOLS
1. [READ] Load `{project-root}/config.yaml` for module-level settings.
2. [ANALYZE] Resolve session variables:
   - `{system_name}` → LinkRight / SMA
   - `{mode}` → interactive (BMAD workflow)
   - `{user_details}` → current user identity
   - `{channel}` → linkedin (v1 default)
   - `{max_iterations}` → 3 (refinement cap)
   - `{char_min}` → 800 (LinkedIn minimum)
   - `{char_max}` → 1600 (LinkedIn maximum)
   - `{similarity_threshold}` → 0.80
3. [VALIDATE] Ensure all core configurations are present:
   - Module config loaded
   - Webhook base URL resolvable
   - Framework CSV files accessible
   - Channel constraint confirmed (LinkedIn only)
4. [SET] Initialize session state:
   - `selected_post` → null (loaded in B.1)
   - `frameworks` → {} (loaded in B.2)
   - `draft_content` → null
   - `iteration_count` → 0
   - `user_selections` → {} (framework picks)
5. [PROCEED] → B.1 (Pick Post)
