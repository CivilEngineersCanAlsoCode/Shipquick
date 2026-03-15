# QA Validation Report: UX, Strategy & A/B Testing

**Validator:** Grid (flex-craft-qa)
**Date:** 2026-03-15
**Scope:** UX personas, journeys, wireframes, IA, states, content strategy, A/B testing, posting schedule, knowledge base

---

## Summary

| # | Check | Verdict | Issues |
|---|-------|---------|--------|
| 1 | Persona: satvik-persona.md | **WARN** | No USER.md exists to cross-reference; persona internally consistent but goals differ from content-strategy.md |
| 2 | Journeys: J1–J6 | **WARN** | Touchpoints mostly match webhooks; 3 journey-only endpoints not in API bridge |
| 3 | Wireframes: dashboard-spec.md | **PASS** | M3 components valid; matches pipeline dashboard decision |
| 4 | Sitemap: sitemap.md | **PASS** | Pages match wireframe spec |
| 5 | States: states.md | **PASS** | Error/empty/loading states defined per view |
| 6 | Content Strategy: content-strategy.md | **FAIL** | Pillar weights sum to 100% but pillars differ from persona |
| 7 | A/B Testing: ab-testing-framework.md | **WARN** | Metrics partially align with E workflow; timeline realistic but aggressive |
| 8 | Posting Schedule: posting-schedule.yaml | **PASS** | 3/week Mon/Wed/Fri, 6-7 PM IST, configurable via variants |
| 9 | LinkedIn Algorithm: linkedin-algorithm.md | **PASS** | Factually accurate for 2024-2026 |
| 10 | Engagement Benchmarks: engagement-benchmarks.md | **PASS** | Numbers realistic for PM/tech content |
| 11 | Target Audience Profile: target-audience-profile.md | **FAIL** | Significant mismatch with persona's stated goals and content-strategy pillars |

**Overall: 5 PASS, 4 WARN, 2 FAIL**

---

## Detailed Findings

### 1. Persona: satvik-persona.md — WARN

**What was checked:** Does persona match USER.md context? Are goals accurate?

**Findings:**

- **No USER.md exists** anywhere in the repository. Cannot cross-reference persona against a canonical user definition. The persona is the only source of truth for user context.
- **Internal consistency:** The persona is well-structured, with detailed demographics, goals, daily workflow, tech stack, and scenarios. Internally coherent.
- **Goal mismatch with content-strategy.md:**
  - Persona goals: "Build consistent LinkedIn presence" with pillars `Career growth, personal stories, skill-building, leadership, tech insights`
  - Content strategy pillars: `ai_automation (25%), startup (20%), pm (20%), career (15%), hottake (10%), personal (5%), howto (5%)`
  - The persona does NOT mention `ai_automation`, `startup`, `hottake`, or `howto` as content pillars
  - The persona says "1 post/day, 5-7 posts/week" but content-strategy.md says "3 posts per week"
  - The persona says posting time "varies — uses random 0–60 min delay" but content-strategy.md says "6:00-7:00 PM IST"
- **Target audience mismatch:** Persona does not mention VCs, founders, YC alumni, or international recruiters. Persona focuses on PM brand building, not investor/founder targeting.

**Evidence:**
- `satvik-persona.md:14` — "1 post/day, professionally crafted"
- `content-strategy.md:60` — "Frequency: 3 posts per week"
- `satvik-persona.md:74` — Pillars: "Career growth, personal stories, skill-building, leadership, tech insights"
- `content-strategy.md:25-32` — Pillars: ai_automation, startup, pm, career, hottake, personal, howto

**Recommendation:** Either update the persona to reflect the evolved content strategy (3/week, VCs/founders target, new pillars), or update the content strategy to match the persona. These docs appear to have been written at different times with different assumptions.

---

### 2. Journeys: J1–J6 — WARN

**What was checked:** Do touchpoints match actual webhook endpoints? Are status transitions correct?

**Findings:**

**Status transitions — PASS:**
All journeys use consistent status flow:
```
Scheduled_NoDraft → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published
```
Failure states: `Publish_Failed`, `Cancelled` — consistent across J4 and dashboard-spec.

**Webhook alignment — WARN:**

Webhooks referenced in journeys vs. API bridge spec:

| Webhook | In Journeys | In API Bridge | Status |
|---------|------------|---------------|--------|
| `/sma-fetch-post` | J1-J6 | Yes | PASS |
| `/sma-update-post` | J2-J4, J6 | Yes | PASS |
| `/sma-fetch-config` | J1, J5, J6 | Yes | PASS |
| `/sma-save-config` | J1, J5, J6 | Yes | PASS |
| `/sma-publish-linkedin` | J4 | Yes | PASS |
| `/sma-notify-telegram` | J4 | Yes | PASS |
| `/sma-analytics-collect` | J5 | Yes | PASS |
| `/sma-fetch-briefs` | J1 (A.1) | **No** | **WARN** |
| `/sma-search-experiences` | J1 (A.3), J2 (B.2) | **No** | **WARN** |
| `/sma-fetch-past-posts` | J1 (A.2, A.7), J2 (B.2) | **No** | **WARN** |
| `/sma-update-sheet-status` | J1 (A.6, A.8) | **No** | **WARN** |
| `/sma-save-post` | J1 (A.8) | **No** | **WARN** |
| `/sma-save-to-notion` | J1 (A.8) | **No** | **WARN** |
| `/sma-save-experience` | J1 (edge), J2 (edge) | **No** | **WARN** |

**Analysis:** 7 webhook endpoints are referenced in journeys but NOT in the API bridge spec. This is expected if those webhooks are called directly by the ChatGPT agent (not through the dashboard UI). However, this should be documented explicitly. The API bridge only proxies dashboard-facing endpoints, while ChatGPT-triggered workflows call n8n directly.

**Evidence:**
- `J1-content-ideation.md:27` — `POST /sma-fetch-briefs` (not in api-bridge-spec.md)
- `api-bridge-spec.md:329-340` — Route summary shows only 8 routes

**Recommendation:** Add a note to api-bridge-spec.md clarifying that ChatGPT-triggered workflow webhooks (fetch-briefs, search-experiences, etc.) are called directly by the agent, not through the API bridge.

---

### 3. Wireframes: dashboard-spec.md — PASS

**What was checked:** Material 3 components valid? Matches pipeline dashboard decision?

**Findings:**

- **M3 Components — PASS:** All referenced components are valid Material 3 components:
  - `NavigationRail`, `TopAppBar`, `FilledCard`, `OutlinedCard`, `FilterChip`, `AssistChip`, `DataTable`, `ExtendedFAB`, `AlertDialog`, `FullScreenDialog`, `Snackbar`, `LinearProgress`, `CircularProgress`, `Badge`, `IconButton`, `DropdownMenu`, `Tabs`, `PlainTooltip`, `Divider`, `Switch`, `OutlinedTextField`, `Slider`
  - All are legitimate M3 components as documented in the Material Design 3 spec.

- **Design tokens — PASS:** Color tokens in dashboard-spec.md:79-91 match exactly with m3-design-tokens.md:80-90. Status-to-color mapping is consistent.

- **Pipeline dashboard decision — PASS:** The wireframe explicitly states "Pipeline Status Dashboard (NOT chat-first)" which aligns with the architectural decision to build a standalone dashboard.

- **Responsive design — PASS:** Breakpoints at 1024px, 1440px, 768px with appropriate component swaps (NavigationRail → NavigationBar).

- **4 views defined:** Dashboard (`/dashboard`), Posts (`/posts`, `/posts/:id`), Analytics (`/analytics`), Settings (`/settings`) — all valid and well-specified.

**Evidence:**
- `dashboard-spec.md:4` — "Design system: Google Material 3"
- `dashboard-spec.md:44-64` — Component library table with valid M3 names
- `m3-design-tokens.md:1-7` — Confirms M3 Dynamic Color system with source color

---

### 4. Sitemap: sitemap.md — PASS

**What was checked:** Do pages match wireframe spec?

**Findings:**

**Page alignment — PASS:**

| Wireframe View | Sitemap Page | Match |
|----------------|-------------|-------|
| View 1: Pipeline Overview | `/dashboard` | PASS |
| View 2: Posts List | `/posts` | PASS |
| View 2: Post Detail | `/posts/:id` | PASS |
| View 3: Analytics Summary | `/analytics` | PASS |
| — | `/analytics/post/:id` | PASS (sitemap adds detail view not explicitly wireframed, but referenced in wireframe's post rankings table) |
| View 4: Settings | `/settings` with 7 tabs | PASS |

**Navigation structure — PASS:** Sidebar nav items (Dashboard, Posts, Analytics, Settings) match wireframe sidebar and sitemap root pages.

**Cross-page navigation — PASS:** Sitemap documents 7 navigation flows (e.g., Dashboard → Post Detail, Analytics → Post Analytics) that are consistent with wireframe interaction patterns.

**Content inventory — PASS:** Sitemap includes content inventory tables for each page with data sources and update frequencies, matching wireframe data refresh strategy.

**Evidence:**
- `sitemap.md:13-126` — Full sitemap tree matches wireframe Views 1-4
- `dashboard-spec.md:97,166,287,361` — View URLs match sitemap paths

---

### 5. States: states.md — PASS

**What was checked:** Error/empty/loading states per view?

**Findings:**

**Coverage — PASS:** All views have all three state types defined:

| View | Loading | Empty | Error |
|------|---------|-------|-------|
| Dashboard | Skeleton shimmer with pipeline card placeholders | "Pipeline is empty" + CTA to Google Sheets/ChatGPT | n8n unreachable banner |
| Posts List | 3-4 skeleton cards | "No posts yet" + CTA | Load error + retry |
| Posts (filtered) | Content fade | "No matching posts" + clear filters | Same as list |
| Post Detail | Skeleton panels for metadata/preview/history | 404 page | Load error + back |
| Analytics | Skeleton charts + cards | "No data" / "No metrics" / "Insufficient data" (3 variants) | Load error |
| Settings | Shimmer form fields | "Config not found" + initialize defaults | Save error with change list |

**Analytics empty states — noteworthy:** Three distinct empty states for analytics (no published posts, published but no metrics, insufficient data for recommendations) — excellent granularity.

**Notification patterns — PASS:** Comprehensive snackbar (transient) and banner (persistent) patterns defined with M3 component mappings.

**Confirmation dialogs — PASS:** Destructive actions (Drop post, Reset config) require confirmation; publish has one-shot warning.

**Evidence:**
- `states.md:486-492` — State transition summary table
- `states.md:7-9` — Global loading pattern with 300ms threshold

---

### 6. Content Strategy: content-strategy.md — FAIL

**What was checked:** Do pillar weights sum to 100%? Does target audience match discussion?

**Findings:**

**Pillar weights — PASS:** 25% + 20% + 20% + 15% + 10% + 5% + 5% = **100%**. Verified.

**Target audience — FAIL (mismatch with persona):**

| Aspect | content-strategy.md | satvik-persona.md | Match |
|--------|--------------------|--------------------|-------|
| Target audience | VCs, Founders, YC, MAANG, Intl Recruiters | Not specified (PM brand focus) | **FAIL** |
| Posting frequency | 3/week | 1/day (5-7/week) | **FAIL** |
| Posting time | 6-7 PM IST | Varies with random delay | **WARN** |
| Content pillars (count) | 7 pillars | 5 pillars | **FAIL** |
| Content pillars (names) | ai_automation, startup, pm, career, hottake, personal, howto | Career growth, personal stories, skill-building, leadership, tech insights | **FAIL** |

**Pillar mismatch detail:**

| Persona Pillar | Content Strategy Equivalent | Notes |
|---|---|---|
| Career growth | `career` (15%) | Matched but lower priority than persona implies |
| Personal stories | `personal` (5%) | Drastically reduced from persona's emphasis |
| Skill-building | `howto` (5%) ? | Weak match; persona emphasizes this heavily |
| Leadership | Not present | **Missing** |
| Tech insights | `ai_automation` (25%) ? | Broader in strategy; not a direct match |
| — | `startup` (20%) | **Not in persona** |
| — | `hottake` (10%) | **Not in persona** |
| — | `pm` (20%) | Not explicitly named in persona |

**Evidence:**
- `content-strategy.md:25-32` — 7 pillars with weights
- `satvik-persona.md:74` — 5 different pillars
- `content-strategy.md:60` — "3 posts per week"
- `satvik-persona.md:73` — "1 post/day, 5–7 posts/week target"

**Bug Description:**

> **BUG-UX-001: Content strategy pillars and frequency conflict with user persona**
>
> **Severity:** High
> **Files:** `docs/content-strategy.md`, `ux/personas/satvik-persona.md`
>
> The content strategy defines 7 pillars (ai_automation, startup, pm, career, hottake, personal, howto) and 3 posts/week, while the persona defines 5 different pillars (career growth, personal stories, skill-building, leadership, tech insights) and 1 post/day (5-7/week). The persona does not reference VCs, founders, or YC alumni as target audience, while the content strategy makes these the primary targets. These documents need reconciliation — one represents the evolved strategy and the other is outdated. The content strategy appears to be the more evolved document.
>
> **Fix:** Update `satvik-persona.md` to reflect the current strategy: 3 posts/week, 7 content pillars, VC/founder targeting. OR reconcile both into a consistent view.

---

### 7. A/B Testing: ab-testing-framework.md — WARN

**What was checked:** Do measurement metrics align with E workflow? Is experiment timeline realistic?

**Findings:**

**Metric alignment with E workflow — PARTIAL PASS:**

| A/B Metric | E Workflow Coverage | Status |
|---|---|---|
| `engagement_rate` | E.2 calculates `engagement_score / follower_count × 100` | **WARN** — E uses follower-based; A/B spec says impression-based, normalized by follower count. Different formulas. |
| `follower_quality_score` | Not in E workflow | **FAIL** — E workflow has no mechanism to evaluate follower quality (title matching, etc.) |
| `comment_quality_score` | Not in E workflow | **FAIL** — E workflow tracks comment count, not comment quality or source |

**Analysis:** The A/B testing framework's primary metrics (40% engagement_rate, 35% follower_quality, 25% comment_quality) are only partially supported by the E workflow. The E workflow can calculate engagement rate but cannot measure follower quality score or comment quality score. These would require LinkedIn API access or manual evaluation not currently in the system.

**Timeline — PASS with caveats:**
- 2-week cycles with 6 posts per cycle (3/week × 2) — mathematically correct
- 8-week initial strategy lock (baseline + 3 tests) — reasonable and disciplined
- Post-lock monthly testing — realistic cadence
- **Caveat:** 6 posts per cycle is a small sample size for statistical significance. The framework acknowledges this is "directional, not statistically significant" which is honest.

**Target audience — PASS:** A/B framework target audience exactly matches content-strategy.md target audience (VCs, founders, YC, MAANG, intl recruiters). Consistent.

**Evidence:**
- `ab-testing-framework.md:38-43` — Primary metrics with weights
- `J5-analytics-review.md:88-94` — E.2 calculations (no follower quality or comment quality)
- `workflows/analytics-review/steps-c/step-E1-fetch-metrics.md:45-46` — engagement_score formula

**Bug Description:**

> **BUG-UX-002: A/B testing primary metrics not supported by E workflow**
>
> **Severity:** Medium
> **Files:** `docs/ab-testing-framework.md`, `ux/journeys/J5-analytics-review.md`
>
> The A/B testing framework assigns 60% weight to metrics (`follower_quality_score` 35% + `comment_quality_score` 25%) that the E-Analytics workflow cannot calculate. The E workflow only tracks engagement counts (likes, comments, shares, impressions) — it has no ability to evaluate follower titles or comment authorship. Either:
> (a) Add follower/comment quality evaluation to the E workflow, or
> (b) Adjust A/B metrics to use only what E can measure, or
> (c) Document that follower/comment quality requires manual evaluation outside the automated workflow.

---

### 8. Posting Schedule: posting-schedule.yaml — PASS

**What was checked:** 3/week Mon/Wed/Fri? 6-7 PM IST? Configurable?

**Findings:**

- **Frequency — PASS:** `frequency: 3` with `days: ["Monday", "Wednesday", "Friday"]`
- **Time — PASS:** `start: "18:00"` / `end: "19:00"` (6-7 PM IST) with `timezone: "Asia/Kolkata"`
- **Configurable — PASS:** 4 A/B test variants defined:
  - `morning_test`: 8-9 AM, same days
  - `tue_thu_sat`: alternate days, same time
  - `lunch_hour`: 12-1 PM, same days
  - `four_per_week`: Mon/Tue/Thu/Fri, same time
- **Holiday overrides — PASS:** 5 skip dates (Republic Day, Independence Day, Diwali, Christmas, NYE) and 2 bonus dates
- **Event overrides — PASS:** product_launch, funding_announcement, major_ai_release handlers
- **Constraints — PASS:** max 1/day, 20hr min gap, 5/week hard cap, no consecutive same pillar

**Note:** The `random_delay_minutes: 15` in the YAML differs from `delay_jitter_seconds: [0, 3600]` in the publishing section (0-60 min). This is likely intentional — 15 min jitter within the time window vs. 0-60 min delay before publishing. Could be confusing but functionally distinct.

**Evidence:**
- `posting-schedule.yaml:6-14` — Default schedule config
- `posting-schedule.yaml:17-47` — 4 variant configurations
- `posting-schedule.yaml:50-84` — Override configurations

---

### 9. LinkedIn Algorithm: linkedin-algorithm.md — PASS

**What was checked:** Factually accurate for 2024-2026?

**Findings:**

- **Distribution phases — PASS:** 4-phase model (Quality Filter → Test Audience → Extended Network → Viral) is consistent with known LinkedIn algorithm behavior. The ~8-12% test audience percentage and 2-hour evaluation window align with industry observations.

- **Key ranking signals — PASS:**
  - Dwell time weighted more heavily since 2024 — **accurate** (LinkedIn confirmed this shift)
  - Comments > 15 words boost distribution — **accurate** (well-documented)
  - Creator replies within 2 hours boost Phase 2→3 — **accurate**
  - External links get 40-60% less distribution — **accurate** (widely reported, consistent with LinkedIn's on-platform strategy)

- **Engagement bait penalties — PASS:** LinkedIn's 2024 crackdown on "like if you agree" and engagement pods is accurately described.

- **Optimal post characteristics — PASS:**
  - 800-1,300 chars optimal — **accurate** for text posts
  - Tue-Thu best engagement days — **accurate** (broadly consistent with industry data)
  - 3-5 hashtags — **accurate** (LinkedIn's own recommendation)

- **One factual note:** The doc says "Tuesday–Thursday: highest engagement days" for timing, but the SMA system defaults to Mon/Wed/Fri. This is a deliberate strategic choice documented in the posting schedule, not an error.

- **Resurgence triggers — PASS:** 5 triggers described are all plausible and align with observed LinkedIn behavior.

**Evidence:**
- `linkedin-algorithm.md:19-20` — "8-12% of connections" test audience
- `linkedin-algorithm.md:52` — "Dwell time is weighted more heavily than reactions since 2024"
- `linkedin-algorithm.md:90-91` — "40-60% less distribution" for external links

---

### 10. Engagement Benchmarks: engagement-benchmarks.md — PASS

**What was checked:** Numbers realistic for PM/tech content?

**Findings:**

**Follower tier benchmarks — PASS:**

| Tier | "Good" Eng Rate | Industry Reality | Verdict |
|---|---|---|---|
| 1K-5K | 3-6% | 3-7% typical | PASS |
| 5K-10K | 2.5-5% | 2-5% typical | PASS |
| 10K-50K | 2-4% | 1.5-4% typical | PASS |
| 50K+ | 1.5-3% | 1-3% typical | PASS |

The inverse relationship between follower count and engagement rate is correctly modeled.

**PM/Tech content benchmarks — PASS:**
- Contrarian PM takes: 6-12% engagement — realistic for provocative content
- Product strategy frameworks: 3.5-5% — accurate for niche professional content
- AI/ML practical applications: 5-10% — accurately reflects the current AI content boom
- Failure/pivot stories: 8-15% — realistic for vulnerability-driven content

**Comment-to-like ratio — PASS:** The 0.15-0.30 target for thought leadership is a well-established benchmark. The description of what drives high ratios (questions, contrarian opinions, vulnerability) is accurate.

**Satvik's targets — PASS:** Near-term >4% engagement rate with 2K-5K impressions is realistic for a new creator in the 1K-5K follower tier posting PM/tech content.

**One note:** Benchmarks say "Posting cadence: 4-5x per week" in near-term targets (line 172) while content-strategy.md says 3/week. Minor inconsistency.

**Evidence:**
- `engagement-benchmarks.md:22-28` — 1K-5K tier benchmarks
- `engagement-benchmarks.md:119-127` — PM content benchmarks
- `engagement-benchmarks.md:172` — Near-term posting cadence target

---

### 11. Target Audience Profile: target-audience-profile.md — FAIL

**What was checked:** Does it match Satvik's stated goals in persona?

**Findings:**

**Audience alignment with content-strategy.md — PASS:** Target audience profile matches content-strategy.md perfectly (VCs, founders, MAANG PMs, intl recruiters).

**Audience alignment with persona — FAIL:**

| Aspect | target-audience-profile.md | satvik-persona.md | Match |
|---|---|---|---|
| Positioning | IIT Delhi → AmEx PM → GoGoGo founder | Senior PM at American Express | **FAIL** — persona has no mention of GoGoGo or founder role |
| Primary audience | VCs, Founders, YC alumni | Not specified | **FAIL** |
| Content pillars | AI+Product 40%, Founder Journey 30%, PM Career 20%, Global Tech 10% | Career growth, personal stories, skill-building, leadership, tech insights | **FAIL** — completely different pillar structure |
| Posting frequency | 5 posts/week in weekly template | 1 post/day (5-7/week) | **WARN** — close but not exact match |

**Additionally:** The target audience profile introduces a **third set of pillar weights** (AI+Product 40%, Founder Journey 30%, PM 20%, Global Tech 10%) that differs from BOTH the content-strategy.md pillars (7 pillars, different percentages) AND the persona pillars (5 pillars, no percentages).

**Three-way pillar conflict:**

| Source | Pillars |
|---|---|
| satvik-persona.md | Career growth, personal stories, skill-building, leadership, tech insights |
| content-strategy.md | ai_automation 25%, startup 20%, pm 20%, career 15%, hottake 10%, personal 5%, howto 5% |
| target-audience-profile.md | AI+Product 40%, Founder Journey 30%, PM Career 20%, Global Tech 10% |

**Evidence:**
- `target-audience-profile.md:5` — "GoGoGo founder" — not in persona
- `target-audience-profile.md:141-144` — 4 pillars with different weights
- `content-strategy.md:25-32` — 7 pillars with different weights
- `satvik-persona.md:74` — 5 pillars, no weights

**Bug Description:**

> **BUG-UX-003: Three-way pillar weight conflict across persona, content strategy, and target audience profile**
>
> **Severity:** High
> **Files:** `ux/personas/satvik-persona.md`, `docs/content-strategy.md`, `knowledge/target-audience-profile.md`
>
> Three documents define content pillars with different names, counts, and weights:
> - Persona: 5 pillars (career growth, personal stories, skill-building, leadership, tech insights)
> - Content strategy: 7 pillars (ai_automation 25%, startup 20%, pm 20%, career 15%, hottake 10%, personal 5%, howto 5%)
> - Target audience: 4 pillars (AI+Product 40%, Founder Journey 30%, PM Career 20%, Global Tech 10%)
>
> Additionally, persona describes Satvik as "Senior PM at American Express" while target audience profile describes him as "GoGoGo founder" — different life stages / narrative frames.
>
> **Fix:** Designate ONE canonical source for content pillars and weights. Recommend content-strategy.md as the canonical source (most detailed), then update persona and target-audience-profile to reference it rather than defining their own.

---

## Bug Summary

| Bug ID | Severity | Title | Files |
|--------|----------|-------|-------|
| BUG-UX-001 | High | Content strategy pillars and frequency conflict with user persona | `docs/content-strategy.md`, `ux/personas/satvik-persona.md` |
| BUG-UX-002 | Medium | A/B testing primary metrics not supported by E workflow | `docs/ab-testing-framework.md`, `ux/journeys/J5-analytics-review.md` |
| BUG-UX-003 | High | Three-way pillar weight conflict across persona, content strategy, and target audience profile | `ux/personas/satvik-persona.md`, `docs/content-strategy.md`, `knowledge/target-audience-profile.md` |

---

## Recommendations

1. **Reconcile persona with content strategy (P0):** The persona appears to be an earlier version that predates the VC/founder targeting pivot. Update persona to reflect current 3/week cadence, 7-pillar system, and VC/founder audience.

2. **Canonicalize pillar definitions (P0):** Designate `content-strategy.md` as the single source of truth for pillar names and weights. Remove duplicate pillar definitions from `target-audience-profile.md` and `satvik-persona.md`, replacing them with references.

3. **Create USER.md (P1):** No USER.md exists in the repo. Creating one would provide a canonical reference for persona validation and ensure all downstream docs stay aligned.

4. **Document webhook scope in API bridge (P1):** Clarify that 7 webhooks used in J1-J2 journeys (fetch-briefs, search-experiences, etc.) are ChatGPT-direct endpoints not proxied through the API bridge.

5. **Address A/B metric gap (P1):** Either add follower quality and comment quality evaluation capability to the E workflow, or adjust the A/B framework to use only measurable metrics (engagement rate).

6. **Fix posting cadence inconsistency (P2):** Engagement benchmarks say "4-5x per week" target but content strategy says "3 per week." Align these.
