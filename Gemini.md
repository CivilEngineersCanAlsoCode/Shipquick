# Gemini Learning & Mistake Protocol

- Every time a mistake is made, it MUST be documented here using the following template to ensure zero repetition.
- Use 'bd' for task tracking and memory management.

## 📋 Mistake Documentation Template

```markdown
### [Complexity/Category]: [Short Description]

- **Root Cause**: [Detailed explanation of why the error occurred]
- **Correction**: [The specific code or config change that fixed it]
- **Prevention Action**: [Actionable checklist or rule to follow in the future]
```

---

## 🚫 Mistakes That Must NEVER Repeat

### [Infrastructure]: Port Mapping Inconsistency

- **Root Cause**: Docker-compose mapped internal port 80 to host 5173, but the Vite app was actually serving on 5173 inside the container.
- **Correction**: Updated `compose.override.yml` to map `5173:5173`.
- **Prevention Action**: Always verify the `EXPOSE` port in `Dockerfile` and the app's config before defining `ports` in `docker-compose.yml`.

### [Frontend]: ReferenceError in useAuth.ts

- **Root Cause**: The `error` variable was used in the component logic without being destructured from the `useQuery` return object.
- **Correction**: Added `error` to the destructuring list of `useQuery`.
- **Prevention Action**: Run a quick lint check or verify variable visibility before using data returned from hooks.

### [Network]: Hardcoded Localhost API URL

- **Root Cause**: The frontend was hardcoded to call `localhost:5173` instead of the backend service on `localhost:8000`.
- **Correction**: Updated `frontend/src/main.tsx` to set `OpenAPI.BASE` via `import.meta.env.VITE_API_URL`.
- **Prevention Action**: Never hardcode URLs; always use environment variables and verify `OpenAPI.BASE` during initialization.

### [Testing]: Missing Vitest JSDOM Polyfills

- **Root Cause**: Radix UI components failed in tests because JSDOM lacks certain browser APIs like `ResizeObserver`.
- **Correction**: Added polyfills for `ResizeObserver`, `PointerEvent`, and `scrollIntoView` in `src/setupTests.ts`.
- **Prevention Action**: Before testing UI libraries (Radix, Shadcn), ensure `setupTests.ts` includes common browser API polyfills.

### [Database]: Data Migration Constraint Violation

- **Root Cause**: Attempted to add a `NOT NULL` column (`token_version`) to a table that already had existing rows.
- **Correction**: Sequential migration: 1) Add as nullable, 2) Set defaults via `UPDATE`, 3) Alter to `NOT NULL`.
- **Prevention Action**: For any new column in an existing table, always assume data exists and use the 3-step nullable-to-not-null pattern.

### [E2E]: Playwright Concurrent Session Conflict

- **Root Cause**: Single-context tests shared the same storage state, preventing simulation of multi-user/concurrent login scenarios.
- **Correction**: Used `browser.newContext()` to isolate sessions for different users within the same test.
- **Prevention Action**: Use isolated contexts for any test requiring more than one distinct user state.

### [Security]: Shell Expansion / Secret Leaks

- **Root Cause**: Special characters (e.g., `!`) in passwords caused `curl` or shell scripts to hang or leak data without proper quoting.
- **Correction**: Enforce single quotes for shell variables or use simple ASCII for test credentials.
- **Prevention Action**: Always wrap shell command inputs in single quotes (`'`) and avoid special characters in default test passwords.

### [Logic]: Performance/Timing Attack Bias

- **Root Cause**: Misidentified authentication stalls as "Argon2 hangs" when the `user` table was actually empty, triggering `DUMMY_HASH` logic.
- **Correction**: Verify data presence (`SELECT count(*)`) before diagnosing performance bottlenecks.
- **Prevention Action**: Check DB state first. Remember that `DUMMY_HASH` verification is a security feature (constant time), not a bug.

### [Infrastructure]: Parallel Test Session Invalidation

- **Root Cause**: Backend's "Concurrent Login Prevention" (`token_version` increment) invalidated existing worker sessions when parallel Playwright workers logged in simultaneously as the same superuser.
- **Correction**: Ran E2E suites with `--workers=1` for stable auth verification or bypassed increment in `local` environment.
- **Prevention Action**: Be aware of global state increments in the DB during parallel testing; use single-worker mode or unique test users if the logic enforces one-session-at-a-time.

### [Infrastructure]: Database Schema Drift

- **Root Cause**: Backend models were updated with new mandatory fields (`location`, `description`), but the PostgreSQL database schema was not migrated, leading to "column does not exist" errors.
- **Correction**: Executed manual `ALTER TABLE` commands via `docker exec` (Add Nullable -> Update Defaults -> Set Not Null).
- **Prevention Action**: Always check the database schema against SQLModel definition after modification. Use the 3-step migration pattern for mandatory fields.

### [Logic]: Pydantic Validation Failure on NULL Data

- **Root Cause**: Adding non-nullable fields to existing models caused `read_jobs` to fail because existing database records had `NULL` values.
- **Correction**: Updated existing records with placeholder values (`Unknown`, `https://example.com`) and enforced `NOT NULL`.
- **Prevention Action**: When making a field mandatory, either ensure a DB-level default exists or update existing data before enforcing strict validation.

### [Frontend]: Missing Toaster Provider

- **Root Cause**: Integrated `Sonner` toasts but forgot to add the `<Toaster />` component to the `__root.tsx` layout, making notifications invisible.
- **Correction**: Added `<Toaster />` correctly to the root route component.
- **Prevention Action**: Verify that any UI feedback library has its global provider/container correctly placed in the root layout.

### [Logic]: Root Layout Syntax Error

- **Root Cause**: Introduced a syntax error (duplicate fragments/closing tags) in `__root.tsx` while adding the `Toaster`.
- **Correction**: Repaired the file structure and ensured proper JSX nesting.
- **Prevention Action**: Always double-check file integrity after manual edits. Verify build functionality before proceeding to E2E tests.

### [Testing]: Toast Locator Ambiguity

- **Root Cause**: Multiple instances of `Sonner` toasts in the DOM (or concurrent runs) caused `getByText` to fail due to multiple matches.
- **Correction**: Used `.first()` on toast locators in Playwright tests.
- **Prevention Action**: For ephemeral UI elements, always account for multiple matches or use more specific locators.

### [Architecture]: Missing Romanised Hindi Comments

- **Root Cause**: Dev agent failed to add mandated 1-line Romanised Hindi comments to new functions in `AddJobModal.tsx`.
- **Correction**: Added missing comments to `onSubmit` and `handleOpenChange` during code review phase.
- **Prevention Action**: Strictly adhere to file-level and function-level documentation rules defined in `architecture.md`.

### [Documentation]: Incomplete Story Sync

- **Root Cause**: The story file's `File List` was left empty and subtasks (Testing) were not properly checked before the first submission.
- **Correction**: Synchronized the story file with all 7 modified/new files and marked all tasks as complete.
- **Prevention Action**: Perform a documentation sweep before marking a story as `completed`. Cross-reference `git status` with the story's `File List`.

### [Architecture]: Config Source Bypass

- **Root Cause**: Relying on `os.getenv` directly in services (`ai_factory.py`) instead of using the centralized `Settings` class from `config.py`.
- **Correction**: Refactored `get_ai_provider` to use `settings.AI_PROVIDER`, `settings.GEMINI_API_KEY`, etc.
- **Prevention Action**: Always use the `settings` object for configuration. If a new variable is needed, add it to `config.py` first.

### [Logic]: Async/Sync Concurrency Mismatch in Background Tasks

- **Root Cause**: An `async def` background task used blocking `Session(engine)` calls, which would block the main event loop during DB/AI operations.
- **Correction**: Refactored `generate_probing_questions` to a synchronous function (FastAPI runs blocking background tasks in a thread pool) and used `asyncio.run` for internal async calls.
- **Prevention Action**: Always use sync functions for background tasks that require blocking DB sessions, or use async database drivers throughout.

### [Architecture]: API Schema Evolution Gap

- **Root Cause**: Implemented a new data model (`ProbingQuestion`) but forgot to update the public API response model (`JobPublic`), preventing the frontend from accessing the new data.
- **Correction**: Added `probing_questions` field to `JobPublic` SQLModel.
- **Prevention Action**: When adding related records to a model, immediately check if they need to be exposed in the corresponding `Public` schema.

### [Infrastructure]: AI Provider Fail-Safe

- **Root Cause**: The background task for question generation silently failed (logged error but job stayed Draft) when neither Ollama nor Gemini was available, confusing the user/tests.
- **Correction**: Improved `AIFactory` logging and ensured `settings` are used for proactive detection; documented the requirement in `walkthrough.md`.
- **Prevention Action**: Before running AI-dependent features, verify provider connectivity or ensure fallback logic is robust and communicates missing dependencies clearly in logs.

### [Infrastructure]: Defensive Background Task Programming (AC: 10)

- **Root Cause**: Background tasks can silently fail or crash if the underlying resource (e.g. Job) is deleted or if the AI provider is unavailable, leaving the system in an inconsistent state.
- **Correction**: Implemented "Zombie Check" (`if not job: return`), fallback generic probes for vague JDs, and tech-coded logging (`TECH_CODE: AI_UNAVAILABLE`).
- **Prevention Action**: Always start background tasks with a resource existence check and wrap external API calls in try-except blocks with explicit fallbacks and code-based logging.

### [Infrastructure]: Artifact Metadata Requirement

- **Root Cause**: Attempted to create an artifact file using `write_to_file` with `IsArtifact: true` but omitted the `ArtifactMetadata` object, causing a tool error.
- **Correction**: Added `ArtifactMetadata` with `ArtifactType` and `Summary` to the `write_to_file` call.
- **Prevention Action**: Always include `ArtifactMetadata` when `IsArtifact` is set to `true` in `write_to_file` or `multi_replace_file_content`.

### [Workspace]: Ghost File Discovery

- **Root Cause**: Assumed `Gemini.md` existed in standard root locations based on instructions, but it was missing, leading to multiple failed `view_file` calls.
- **Correction**: Initialized a new `Gemini.md` with the required protocol and rules.
- **Prevention Action**: If a mandatory file is missing after a thorough search (`find`), proactively initialize it with the correct template and notify the user.

### [Documentation]: Romanised Hindi Pivot

- **Root Cause**: Users often grasp complex agentic patterns better in their native phonetic language (Romanised Hindi) than in formal technical English.
- **Correction**: Refactored the entire project guide into Romanised Hindi, ensuring technical accuracy while using accessible vocabulary.
- **Prevention Action**: When specifically requested, prioritize Romanised Hindi for high-level frameworks (BMAD/Agentic) to ensure zero-gap understanding between the user and the agent.

### [Infrastructure]: Terminal Warning Proactivity

- **Root Cause**: Ignored initial setup warnings from `bd init`, leading to a "Setup Incomplete" state that required manual intervention.
- **Correction**: Used `bd doctor --fix` to resolve automated issues and documented manual fix procedures (e.g., `git pull --rebase`).
- **Prevention Action**: Always treat terminal warnings/errors in setup commands as high-priority; use built-in diagnostic tools (`doctor`, `lint`, `check`) immediately before proceeding with feature development.

### [Architecture]: Beads Type Hierarchy Conflict

- **Root Cause**: Beads enforces a strict `Epic > Task` hierarchy. We mapped Strategic Theme to `type=task` and Portfolio Epic to `type=epic`, which caused dependency errors because a Task cannot be a parent of an Epic.
- **Correction**: Remapped all high-level SAFe items (Strategic Theme, Portfolio Epic, Capability) to `type=epic` in Beads commands to allow arbitrary nesting depth.
- **Prevention Action**: When mapping external hierarchies (SAFe) to tool types (Beads), verify intrinsic constraints of the tool types first. Use consistent "container" types (like Epic) for all parent levels.

### [Architecture]: Wrong Beads Directory Assumption

- **Root Cause**: Assumed Beads uses `_memory/` directory for persistence. Actually, Beads uses `.beads/` with a SQLite database (`beads.db`). Created a fake `_memory/` directory with YAML files that Beads would never read.
- **Correction**: Removed `_memory/` directory. Used actual `bd create` CLI command which writes to `.beads/beads.db`.
- **Prevention Action**: ALWAYS read `BEADS_GUIDE.md` before making assumptions about Beads internals. Beads uses `.beads/` directory, SQLite DB, and `bd` CLI commands — NOT flat YAML files.

### [Infrastructure]: zsh Echo Escape Character Handling

- **Root Cause**: Used `echo "...\n..."` in zsh which interpreted `\n` as an unknown file attribute instead of a newline.
- **Correction**: Used heredoc (`cat << 'EOF'`) or single-quoted `echo` with `$'...\n...'` syntax for multi-line output.
- **Prevention Action**: In zsh, never use `echo "text\ntext"` for multi-line output. Use heredoc, `printf`, or `$'...'` quoting.

### [Workflow]: Missing bd init Pre-check in SQ Workflows

- **Root Cause**: SQ workflow entry points (`workflow-sq-init.md`) assume Beads is already initialized (`bd init` run) but don't verify this. If `.beads/` doesn't exist, `bd create` in step-04-register.md would fail silently.
- **Correction**: Need to add a Beads health check to the initialization sequence of `workflow-sq-init.md`.
- **Prevention Action**: Any workflow that uses `bd` commands must verify `.beads/` exists or run `bd init` as part of its initialization sequence.

### [Workflow]: Phantom `bd link` Command

- **Root Cause**: Workflow instructions referenced `bd link` to establish parent-child relationships, assuming it existed. In reality, Beads uses `bd create --parent <id>` or `bd update --parent <id>`.
- **Correction**: Updated `step-04-register.md` to instruct users to create the parent first, copy the ID, and then create the child with `--parent <ID>`.
- **Prevention Action**: Verify CLI commands in the actual tool (`--help`) before writing them into workflow instructions.

---

### Mistake #6: Beads Process Hang

- **Mistake**: Long-running `bd create` command chain hung for >20 mins. Likely due to depth limit error leaving a lock file or process deadlock.
- **Correction**: User to manually kill process.
- **Rescue Plan**:
  1. Kill hung processes: `pkill -f bd`
  2. Remove locks: `rm .beads/*.lock`
  3. Verify state: `bd list --type task`
  4. Manually create Story 2 if missing: `bd create "Story: On This Day Matcher" --type task --priority 2` (then link to Feature)

### Mistake #7: Beads Hierarchy Depth Limit

- **Mistake**: Attempted to use `bd create --parent` for Tasks at depth 4 (Story children). Beads errored with "maximum hierarchy depth (3) exceeded".
- **Correction**: Used `bd create` (standalone) followed by `bd link` (dep add) for items below depth 3.
- **Prevention**: In deep hierarchies (Story -> Task), avoid strict ID nesting; use loose linking.

### Dry Run: Letter App (SQ Module Integration)

_Tracking SAFe 6.0 compliance and SQ module performance during "Letter" app development._

### Phase 1: sq-init (COMPLETE)

- ✅ **THEME-001 created**: `theme-THEME-001.md` saved to `sq-artifacts/`
- ✅ **EPIC-001 created**: `epic-EPIC-001.md` saved to `sq-artifacts/` (WSJF: 6.88)
- ✅ **Beads registration**: Theme (`...-qtc`) and Epic (`...-grp`) created and linked
- 🐛 **3 mistakes found and documented** (wrong directory, zsh echo, missing pre-check)

### Phase 2: sq-analyze (COMPLETE)

- ✅ **Lean Business Case**: Problem, Hypothesis, Indicators, NFRs added to `epic-EPIC-001.md`
- ✅ **MVP**: Defined as "Slow Mode" (~1 PI duration)
- ✅ **Beads Update**: Status → `ANALYZING` (Label: `kanban:analyzing`)

### Phase 3: sq-solve (COMPLETE)

- ✅ **Capabilities Created**: `CAP-001` (Engine), `CAP-002` (Vault), `CAP-003` (Identity)
- ✅ **Beads Registration**: All 3 linked to EPIC-001 (Type=Epic, Parent-Child)
- ✅ **Validation**: No orphans, Gherkin ACs present.

### Phase 4: sq-plan (COMPLETE)

- ✅ **Features Created**: `FEAT-001` (Algorithm), `FEAT-002` (Scheduler) for CAP-001
- ✅ **Beads Registration**: Linked to CAP-001 (Type=Feature, Parent-Child)
- ✅ **Readiness**: Verified Gherkin ACs and Benefit Hypothesis.

### Phase 5: sq-exec (BLOCKED / PARTIAL)

- ✅ **Stories**: `STORY-001` created. `STORY-002` likely missing.
- ❌ **Hang**: Process hung during Story 2 creation.
- **Action Required**: Execute Rescue Plan (see Mistake #6) to finish Story 2 creation and linking.

### Phase 6: sq-audit (AWAITING START)

- **Action**: Run `/sq-audit` to verify hierarchy integrity and look for orphans.

### [Tooling]: Artifact Path Mismatch

- **Root Cause**: Attempted to use `IsArtifact: true` in `write_to_file` for a path outside the designated artifact directory (`/Users/satvikjain/.gemini/antigravity/brain/012842aa-1852-497a-ba7b-b533bd2cbf23`).
- **Correction**: Set `IsArtifact: false` for project-internal documents (sq-artifacts) to ensure they are written correctly to the workspace.
- **Prevention Action**: Only set `IsArtifact: true` for planning/walkthrough files in the brain folder. Project-specific artifacts like SAFe Themes/Epics should be standard files.
