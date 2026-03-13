
-- ============================================================
-- OMISP MVP Schema Rebuild v2
-- ============================================================

-- 1. Drop all dependent tables first (in FK-safe order)
DROP TABLE IF EXISTS public.investor_views CASCADE;
DROP TABLE IF EXISTS public.omisp_scores CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.score_history CASCADE;
DROP TABLE IF EXISTS public.pitch_sessions CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.omi_chat_sessions CASCADE;
DROP TABLE IF EXISTS public.revenue_models CASCADE;
DROP TABLE IF EXISTS public.vc_watchlist CASCADE;
DROP TABLE IF EXISTS public.vc_intro_requests CASCADE;
DROP TABLE IF EXISTS public.vc_alert_preferences CASCADE;
DROP TABLE IF EXISTS public.founder_profiles CASCADE;
DROP TABLE IF EXISTS public.vc_profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop old enum if exists
DROP TYPE IF EXISTS public.app_role CASCADE;

-- ============================================================
-- 2. profiles  (central identity table, id = auth.users.id)
-- ============================================================
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY,
  role       text NOT NULL CHECK (role IN ('founder', 'investor')),
  full_name  text,
  industry   text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- ============================================================
-- 3. founder_profiles  (1-to-1 with profiles via founder_id PK)
-- ============================================================
CREATE TABLE public.founder_profiles (
  founder_id     uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name   text,
  tagline        text,
  industry       text,
  stage          text,
  location       text,
  mrr_usd        integer NOT NULL DEFAULT 0,
  team_size      integer NOT NULL DEFAULT 1,
  raised_usd     integer NOT NULL DEFAULT 0,
  growth_percent integer NOT NULL DEFAULT 0,
  logo_url       text,
  created_at     timestamp with time zone NOT NULL DEFAULT now(),
  updated_at     timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can insert their own profile"
  ON public.founder_profiles FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can update their own profile"
  ON public.founder_profiles FOR UPDATE
  USING (auth.uid() = founder_id);

CREATE POLICY "Founders can view their own profile"
  ON public.founder_profiles FOR SELECT
  USING (auth.uid() = founder_id);

CREATE POLICY "Anyone can view founder profiles"
  ON public.founder_profiles FOR SELECT
  USING (true);

CREATE TRIGGER update_founder_profiles_updated_at
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. omisp_scores  (1-to-1 with profiles via founder_id PK)
-- ============================================================
CREATE TABLE public.omisp_scores (
  founder_id       uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score      integer NOT NULL DEFAULT 0,
  velocity_score   integer NOT NULL DEFAULT 0,
  idea_score       integer NOT NULL DEFAULT 0,
  aptitude_score   integer NOT NULL DEFAULT 0,
  execution_score  integer NOT NULL DEFAULT 0,
  resilience_score integer NOT NULL DEFAULT 0,
  unicorn_score    integer NOT NULL DEFAULT 0,
  updated_at       timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.omisp_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can insert their own scores"
  ON public.omisp_scores FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can update their own scores"
  ON public.omisp_scores FOR UPDATE
  USING (auth.uid() = founder_id);

CREATE POLICY "Founders can view their own scores"
  ON public.omisp_scores FOR SELECT
  USING (auth.uid() = founder_id);

CREATE POLICY "Anyone can view scores"
  ON public.omisp_scores FOR SELECT
  USING (true);

CREATE TRIGGER update_omisp_scores_updated_at
  BEFORE UPDATE ON public.omisp_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. milestones  (many per founder)
-- ============================================================
CREATE TABLE public.milestones (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('registered','website','first_customer','revenue','team','funding')),
  value      text,
  proof_url  text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can insert their own milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can view their own milestones"
  ON public.milestones FOR SELECT
  USING (auth.uid() = founder_id);

CREATE POLICY "Founders can delete their own milestones"
  ON public.milestones FOR DELETE
  USING (auth.uid() = founder_id);

CREATE POLICY "Anyone can view milestones"
  ON public.milestones FOR SELECT
  USING (true);

-- ============================================================
-- 6. investor_views  (many per investor, many per founder)
-- ============================================================
CREATE TABLE public.investor_views (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  founder_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.investor_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can insert their own views"
  ON public.investor_views FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Investors can view their own views"
  ON public.investor_views FOR SELECT
  USING (auth.uid() = investor_id);

-- ============================================================
-- 7. vc_profiles  (1-to-1 with profiles)
-- ============================================================
CREATE TABLE public.vc_profiles (
  id                     uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  firm_name              text,
  fund_size              text,
  bio                    text,
  industries             text[] DEFAULT '{}',
  investment_stage_focus text[] DEFAULT '{}',
  avatar_url             text,
  created_at             timestamp with time zone NOT NULL DEFAULT now(),
  updated_at             timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vc_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can insert their own profile"
  ON public.vc_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "VCs can update their own profile"
  ON public.vc_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "VCs can view their own profile"
  ON public.vc_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE TRIGGER update_vc_profiles_updated_at
  BEFORE UPDATE ON public.vc_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 8. vc_alert_preferences
-- ============================================================
CREATE TABLE public.vc_alert_preferences (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  min_score  integer NOT NULL DEFAULT 0,
  enabled    boolean NOT NULL DEFAULT true,
  industries text[] DEFAULT '{}',
  stages     text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (vc_user_id)
);

ALTER TABLE public.vc_alert_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can insert their alert preferences"
  ON public.vc_alert_preferences FOR INSERT
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their alert preferences"
  ON public.vc_alert_preferences FOR UPDATE
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can view their own alert preferences"
  ON public.vc_alert_preferences FOR SELECT
  USING (auth.uid() = vc_user_id);

-- ============================================================
-- 9. vc_watchlist
-- ============================================================
CREATE TABLE public.vc_watchlist (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  founder_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pipeline_stage text NOT NULL DEFAULT 'watching',
  notes          text,
  created_at     timestamp with time zone NOT NULL DEFAULT now(),
  updated_at     timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (vc_user_id, founder_id)
);

ALTER TABLE public.vc_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can insert to their watchlist"
  ON public.vc_watchlist FOR INSERT
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their watchlist"
  ON public.vc_watchlist FOR UPDATE
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can view their own watchlist"
  ON public.vc_watchlist FOR SELECT
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can delete from their watchlist"
  ON public.vc_watchlist FOR DELETE
  USING (auth.uid() = vc_user_id);

CREATE TRIGGER update_vc_watchlist_updated_at
  BEFORE UPDATE ON public.vc_watchlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 10. vc_intro_requests
-- ============================================================
CREATE TABLE public.vc_intro_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  founder_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message    text,
  status     text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vc_intro_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can create intro requests"
  ON public.vc_intro_requests FOR INSERT
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their intro requests"
  ON public.vc_intro_requests FOR UPDATE
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can view their own intro requests"
  ON public.vc_intro_requests FOR SELECT
  USING (auth.uid() = vc_user_id);

CREATE TRIGGER update_vc_intro_requests_updated_at
  BEFORE UPDATE ON public.vc_intro_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 11. Recreate get_admin_stats for new schema
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_founders       bigint,
  total_investors      bigint,
  total_milestones     bigint,
  total_profile_views  bigint,
  avg_omisp_score      numeric,
  vc_eligible_founders bigint,
  unicorn_candidates   bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.profiles WHERE role = 'founder')::bigint,
    (SELECT count(*) FROM public.profiles WHERE role = 'investor')::bigint,
    (SELECT count(*) FROM public.milestones)::bigint,
    (SELECT count(*) FROM public.investor_views)::bigint,
    (SELECT COALESCE(avg(total_score), 0) FROM public.omisp_scores)::numeric,
    (SELECT count(*) FROM public.omisp_scores WHERE total_score >= 70)::bigint,
    (SELECT count(*) FROM public.omisp_scores WHERE unicorn_score >= 8)::bigint;
$$;
