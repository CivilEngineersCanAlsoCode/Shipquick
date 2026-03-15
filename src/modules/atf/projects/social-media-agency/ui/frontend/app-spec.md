# Frontend Application Specification

**Framework:** React 18 + TypeScript
**Design system:** Material 3 (via `@mui/material` v6 with M3 theme)
**State management:** TanStack Query (React Query) v5
**Routing:** React Router v6
**Charts:** Recharts (M3-themed)
**Build:** Vite
**Target:** Desktop-first (1440px optimal, 1024px min)

---

## Pages

### 1. Dashboard (`/dashboard`)

Pipeline overview — answers "What needs my attention?"

| Section | Data Source | Refresh |
|---------|-----------|---------|
| Pipeline funnel | `GET /api/pipeline` | Auto-poll 60s |
| Action items | `GET /api/pipeline` | Auto-poll 60s |
| Weekly calendar | `GET /api/pipeline` | Auto-poll 60s |
| Quick stats | `GET /api/analytics?period=7d` | On page load |

**Interactions:**
- Click funnel stage → navigate to `/posts?status={stage}`
- "Publish Now" → confirmation dialog → `POST /api/publish/:id` → snackbar
- "Review Now" → navigate to `/posts/:id`
- "Start Ideation" → open ChatGPT in new tab
- Calendar day click → navigate to `/posts/:id`

### 2. Posts List (`/posts`)

Browse, filter, sort all posts.

| Feature | Implementation |
|---------|---------------|
| Filters | Status chips (multi-select), Pillar chips, date range picker |
| Search | Full-text `SearchBar` → query param `?q=` |
| Sort | Dropdown: scheduled_date, status, score, engagement |
| Pagination | 10 per page, prev/next buttons + page numbers |

**Data source:** `GET /api/posts?status=...&pillar=...&sort=...&page=...`
**Refresh:** On-demand (manual refresh button, after any mutation)

### 3. Post Detail (`/posts/:id`)

Full post view with status stepper, metadata, preview, history, engagement.

| Section | Data Source |
|---------|-----------|
| Status stepper | Post document `.status` |
| Metadata panel | Post document fields |
| Content preview | Post document `.content` |
| History timeline | Post document `.history[]` |
| Engagement table | Post document `.metrics_history[]` |

**Interactions:**
- Actions menu: Publish, Approve, Reject, Edit, Reschedule, Cancel
- Edit → inline content editor → `PUT /api/posts/:id`
- Publish → confirmation → `POST /api/publish/:id`
- Status changes → `PUT /api/posts/:id { status }`

### 4. Analytics (`/analytics`)

Performance metrics, trends, rankings.

| Section | Data Source |
|---------|-----------|
| Overview cards (4) | `GET /api/analytics?period=7d` |
| Engagement chart | analytics response `.posts` |
| By Pillar bars | analytics response `.byPillar` |
| By Framework bars | analytics response `.byFramework` |
| Post rankings table | analytics response `.posts` |
| Collection schedule | analytics response `.collectionSchedule` |

**Interactions:**
- Period selector dropdown (7d, 30d, 90d)
- Click post row → navigate to `/posts/:id`
- Refresh button → refetch

### 5. Settings (`/settings`)

Manage 7 config documents across tabs.

| Tab | Config Document | Key Controls |
|-----|----------------|-------------|
| Scoring | `scoring_weights` + `scoring_scales` | Fibonacci sliders, threshold inputs, impact preview |
| Schedule | `posting_schedule` | Day chips (Mon–Sun), time picker, max posts/day |
| Formatting | `formatting_config` | Switches, number inputs |
| Engagement | `engagement_config` | Threshold inputs, resurgence % |
| Review | `review_config` | Switches, text fields |
| Analytics | `analytics_config` | Collection day intervals, benchmark settings |

**Data source:** `GET /api/config` (all), `PUT /api/config` (per document)
**Interactions:**
- Edit fields → local state changes → "Save" button → `PUT /api/config`
- "Reset to Default" → confirmation dialog → reset local state
- Impact preview (Scoring tab) → computed client-side

---

## Components

### PostCard

Used on Posts List page. Renders a single post as an outlined card.

```tsx
interface PostCardProps {
  post: Post;
  onAction: (action: 'review' | 'publish' | 'draft' | 'analytics', id: string) => void;
}
```

| Element | M3 Component |
|---------|-------------|
| Container | `OutlinedCard` (clickable) |
| Status | `FilterChip` (tonal, status-colored) |
| Title | Typography `titleMedium` |
| Metadata row | Typography `bodySmall` + `onSurfaceVariant` |
| Framework chips | `AssistChip` (Hook, Tone) |
| Action buttons | `FilledTonalButton` / `OutlinedButton` |

### PipelineStatus

Dashboard funnel visualization showing count per status stage.

```tsx
interface PipelineStatusProps {
  counts: Record<PostStatus, number>;
  onStageClick: (status: PostStatus) => void;
}
```

| Element | M3 Component |
|---------|-------------|
| Stage card | `FilledCard` with status color |
| Count | Typography `headlineMedium` |
| Label | Typography `labelMedium` |
| Arrow connectors | SVG arrows between cards |

### EngagementChart

Line chart showing engagement score over time for analytics page.

```tsx
interface EngagementChartProps {
  data: { date: string; engagement: number }[];
  period: '7d' | '30d' | '90d';
}
```

Uses Recharts `LineChart` with M3 color tokens. Responsive container, tooltip on hover.

### ConfigEditor

Tab-based editor for settings page. Each tab renders controls for one config document.

```tsx
interface ConfigEditorProps {
  configs: Record<string, ConfigDocument>;
  onSave: (configId: string, data: ConfigDocument) => void;
}
```

| Element | M3 Component |
|---------|-------------|
| Tabs | `Tabs` (scrollable) |
| Sliders | `Slider` (discrete, Fibonacci steps) |
| Text inputs | `OutlinedTextField` |
| Switches | `Switch` |
| Save | `FilledButton` |
| Reset | `OutlinedButton` |

### StatusStepper

Horizontal step indicator on Post Detail showing pipeline progress.

```tsx
interface StatusStepperProps {
  currentStatus: PostStatus;
}
```

Renders 7 steps: Scheduled → Drafting → Drafted → Formatting → Previewed → Ready → Published. Current and past steps are filled; future steps are outlined.

### ActionItemCard

Dashboard action items (urgent tasks needing attention).

```tsx
interface ActionItemCardProps {
  item: ActionItem;
  onAction: (action: string, postId: string) => void;
}
```

| Priority | Color | Icon |
|----------|-------|------|
| Urgent (today) | `error` | Red circle |
| Soon (tomorrow) | `tertiary` | Yellow circle |
| Info (gap) | `surfaceVariant` | Grey circle |

### MetricCard

Small stat card used in Dashboard quick stats and Analytics overview.

```tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
}
```

---

## State Management

### React Query Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s before refetch
      retry: 1,                // single retry on failure
      refetchOnWindowFocus: true,
    },
  },
});
```

### Query Keys

| Key | Endpoint | Options |
|-----|----------|---------|
| `['pipeline']` | `GET /api/pipeline` | `refetchInterval: 60_000` |
| `['posts', filters]` | `GET /api/posts?...` | Paginated |
| `['posts', id]` | `GET /api/posts/:id` | Single post |
| `['config']` | `GET /api/config` | Cached until settings page |
| `['config', type]` | `GET /api/config?type=...` | Single config |
| `['analytics', period]` | `GET /api/analytics?period=...` | On-demand |

### Mutations

| Mutation | Endpoint | Invalidates |
|----------|----------|-------------|
| `updatePost` | `PUT /api/posts/:id` | `['posts']`, `['posts', id]`, `['pipeline']` |
| `publishPost` | `POST /api/publish/:id` | `['posts']`, `['posts', id]`, `['pipeline']` |
| `saveConfig` | `PUT /api/config` | `['config']` |

---

## Routing

```tsx
<Routes>
  <Route path="/" element={<Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/posts" element={<PostsListPage />} />
  <Route path="/posts/:id" element={<PostDetailPage />} />
  <Route path="/analytics" element={<AnalyticsPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Routes>
```

### Layout

```tsx
<AppLayout>
  <TopAppBar />
  <Box sx={{ display: 'flex' }}>
    <NavigationRail />         {/* sidebar */}
    <Box component="main">
      <Outlet />               {/* page content */}
    </Box>
  </Box>
</AppLayout>
```

---

## API Client

```tsx
// lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-key-change-me';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error.error, error.code, res.status);
  }
  return res.json();
}
```

---

## TypeScript Types

```tsx
type PostStatus =
  | 'Scheduled_NoDraft'
  | 'Drafting'
  | 'Drafted'
  | 'Formatting'
  | 'Previewed'
  | 'Ready_ToPublish'
  | 'Published'
  | 'Publish_Failed'
  | 'Cancelled';

interface Post {
  _id: string;
  title: string;
  content?: string;
  status: PostStatus;
  pillar: string;
  scheduled_date: string;
  score?: { freshness: number; personal: number; research: number; total: number };
  hook_type?: string;
  narrative_type?: string;
  cta_type?: string;
  tone?: string;
  char_count?: number;
  fk_grade?: number;
  emoji_count?: number;
  hashtag_count?: number;
  hindi_count?: number;
  experience?: { text: string; similarity: number };
  linkedin_post_urn?: string;
  published_at?: string;
  metrics_history?: MetricPoint[];
  history?: HistoryEntry[];
}

interface MetricPoint {
  day: number;           // 1, 3, 7, 14, 30
  collected_at: string;
  likes: number;
  comments: number;
  shares: number;
  engagement_score: number;
  engagement_rate: number;
}

interface HistoryEntry {
  timestamp: string;
  status: PostStatus;
  source: string;        // e.g., "A.8", "B.4", "C.2"
  note?: string;
}

interface ActionItem {
  priority: 'urgent' | 'soon' | 'info';
  label: string;
  postId?: string;
  action: string;
}

interface ConfigDocument {
  _id: string;
  config_id: string;
  data: Record<string, unknown>;
  updated_at: string;
}
```

---

## Project Structure

```
ui/frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── src/
│   ├── main.tsx                  # App entry, QueryClientProvider, Router
│   ├── App.tsx                   # Layout + Routes
│   ├── theme.ts                  # M3 theme (see m3-design-tokens.md)
│   ├── lib/
│   │   ├── api.ts                # API client (fetch wrapper)
│   │   └── types.ts              # TypeScript interfaces
│   ├── hooks/
│   │   ├── usePipeline.ts        # useQuery(['pipeline'])
│   │   ├── usePosts.ts           # useQuery(['posts', filters])
│   │   ├── usePost.ts            # useQuery(['posts', id])
│   │   ├── useAnalytics.ts       # useQuery(['analytics', period])
│   │   ├── useConfig.ts          # useQuery(['config'])
│   │   ├── useUpdatePost.ts      # useMutation
│   │   ├── usePublishPost.ts     # useMutation
│   │   └── useSaveConfig.ts      # useMutation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── TopAppBar.tsx
│   │   │   └── NavigationRail.tsx
│   │   ├── PostCard.tsx
│   │   ├── PipelineStatus.tsx
│   │   ├── StatusStepper.tsx
│   │   ├── EngagementChart.tsx
│   │   ├── ConfigEditor.tsx
│   │   ├── ActionItemCard.tsx
│   │   ├── MetricCard.tsx
│   │   └── WeekCalendar.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── PostsListPage.tsx
│   │   ├── PostDetailPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   └── assets/
│       └── logo.svg
```
