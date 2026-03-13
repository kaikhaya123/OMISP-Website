

# VC Dashboard — Full Feature Plan

## Overview

Build an authenticated, sidebar-driven VC dashboard at `/vc-dashboard` that pulls real founder data from the database and provides VCs with professional deal-sourcing tools. The dashboard will have its own navigation, distinct from the Founder dashboard, using the Dark Navy theme established in the VC auth flow.

## Architecture

The VC dashboard will be a standalone layout with a collapsible sidebar, completely separate from the Founder dashboard. VCs will be redirected here after login based on the role they selected during signup.

```text
/vc-dashboard              -> Overview (stats, alerts, top founders)
/vc-dashboard/leaderboard  -> Full founder leaderboard with filters
/vc-dashboard/watchlist     -> Saved founders + pipeline stages
/vc-dashboard/analytics     -> Portfolio analytics & charts
/vc-dashboard/intros        -> Intro request manager
/vc-dashboard/compare       -> Side-by-side founder comparison
/vc-dashboard/reports       -> AI screening reports
/vc-dashboard/settings      -> VC profile & preferences
```

## Features

### 1. Founder Leaderboard (Core)
- Pulls real data from `founder_profiles` joined with `omisp_scores`
- Sortable by total score or any of the 6 dimensions
- Category/industry filters, stage filters, score range slider
- Search by founder name or company
- Click to expand full 6-dimension score breakdown
- Pagination for large datasets

### 2. Watchlist and Pipeline (Core)
- New `vc_watchlist` database table to persist saved founders
- Pipeline stages: Watching, In Review, Intro Requested, Meeting Scheduled, Passed
- Drag-and-drop Kanban-style view or list view toggle
- Notes field per watchlisted founder
- Timestamp tracking for when founders were added

### 3. Portfolio Analytics (Core)
- Charts built with Recharts (already installed)
- Industry breakdown pie chart of watched founders
- Score distribution histogram
- Deal flow timeline (intros requested over time)
- Average score trends of watched founders

### 4. Intro Request Manager (Core)
- New `vc_intro_requests` database table
- Status tracking: Pending, Accepted, Meeting Set, Declined
- Timestamp and message field
- Linked to founder profiles
- Email notification trigger (future)

### 5. AI Screening Reports (Advanced)
- Uses Lovable AI (gemini-2.5-flash) via an edge function
- Generates a summary of a founder's strengths, risks, and investment thesis fit
- Based on real score data, milestones, and profile info
- Rendered as a printable/downloadable card

### 6. Comparison Tool (Advanced)
- Select 2-3 founders from leaderboard or watchlist
- Side-by-side radar chart of 6 OMISP dimensions
- Table comparison of key metrics (MRR, growth, team, funding)

### 7. Deal Flow Alerts (Advanced)
- New `vc_alerts` table storing VC preferences (min score, industries, stages)
- Activity feed on the overview page showing recent score changes of watched founders
- Badge notifications in the sidebar when new alerts trigger

### 8. Activity Feed (Advanced)
- Real-time feed on the overview page
- Shows when watched founders log milestones, improve scores, or earn badges
- Powered by querying `score_history` and `milestones` tables for watched founders

## Database Changes

New tables required:

**`vc_profiles`** — VC-specific profile data
- `id`, `user_id`, `firm_name`, `fund_size`, `investment_stage_focus`, `industries`, `created_at`, `updated_at`
- RLS: users can only CRUD their own profile

**`vc_watchlist`** — Saved founders
- `id`, `vc_id` (references vc_profiles), `founder_id` (references founder_profiles), `pipeline_stage`, `notes`, `created_at`, `updated_at`
- RLS: VCs can only CRUD their own watchlist items

**`vc_intro_requests`** — Intro request tracking
- `id`, `vc_id`, `founder_id`, `message`, `status` (pending/accepted/meeting_set/declined), `created_at`, `updated_at`
- RLS: VCs can create and view their own requests

**`vc_alert_preferences`** — Alert configuration
- `id`, `vc_id`, `min_score`, `industries` (array), `stages` (array), `enabled`, `created_at`
- RLS: VCs can only CRUD their own preferences

## Routing and Auth

- After login, check the user's role (stored during signup metadata) and redirect Founders to `/dashboard` and VCs to `/vc-dashboard`
- All `/vc-dashboard/*` routes wrapped in `ProtectedRoute`
- The existing `ProtectedRoute` component will be reused

## UI and Layout

- Sidebar navigation using the Shadcn Sidebar component
- Dark navy color scheme consistent with the VC auth pages
- Sidebar items: Overview, Leaderboard, Watchlist, Analytics, Intros, Compare, Reports, Settings
- Collapsible sidebar with icons in mini mode
- Mobile-responsive with hamburger menu

## Implementation Sequence

1. Create database tables (`vc_profiles`, `vc_watchlist`, `vc_intro_requests`, `vc_alert_preferences`) with RLS
2. Build the VC sidebar layout component
3. Build the Overview page (stats cards, recent alerts, top 5 founders)
4. Build the Leaderboard page (real data from `founder_profiles` + `omisp_scores`)
5. Build the Watchlist and Pipeline page
6. Build the Intro Request Manager
7. Build the Analytics page with Recharts
8. Build the Comparison Tool
9. Create the AI Screening Report edge function and UI
10. Build the Deal Flow Alerts system
11. Wire up role-based redirect after login
12. Add Activity Feed to the Overview page

## Technical Notes

- All founder data queries will use the existing RLS policy "VCs can view verified founder profiles" (which currently allows `true` for SELECT — this is intentional for the VC discovery use case)
- The `omisp_scores` table also has a "VCs can view verified scores" policy allowing SELECT
- AI screening reports will use the `LOVABLE_API_KEY` secret (already configured) to call Lovable AI models
- Recharts is already installed for charts
- Framer Motion is already installed for transitions and animations

