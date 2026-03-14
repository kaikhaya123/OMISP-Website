-- Add VC interest tracking for founders
-- Track when VCs view founder profiles, add to watchlist, or request intros

-- Create founder_profile_views table
CREATE TABLE IF NOT EXISTS public.founder_profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(founder_id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  source TEXT DEFAULT 'discovery' -- discovery, leaderboard, search, etc.
);

-- Enable RLS
ALTER TABLE public.founder_profile_views ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_vc ON public.founder_profile_views(vc_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_founder ON public.founder_profile_views(founder_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_founder_date ON public.founder_profile_views(founder_id, viewed_at DESC);

-- RLS policies
CREATE POLICY "VCs can insert their own profile views"
  ON public.founder_profile_views FOR INSERT
  WITH CHECK (auth.uid() = vc_id);

CREATE POLICY "VCs can view their own profile views"
  ON public.founder_profile_views FOR SELECT
  USING (auth.uid() = vc_id);

CREATE POLICY "Founders can view their profile views"
  ON public.founder_profile_views FOR SELECT
  USING (
    auth.uid() = founder_id OR
    EXISTS (
      SELECT 1 FROM public.founder_profiles 
      WHERE founder_id = auth.uid()
    )
  );

-- Create view for founder interest metrics
CREATE OR REPLACE VIEW public.founder_interest_stats AS
SELECT 
  founder_id,
  COUNT(DISTINCT vc_id) FILTER (WHERE viewed_at >= now() - interval '7 days') as views_last_7_days,
  COUNT(DISTINCT vc_id) FILTER (WHERE viewed_at >= now() - interval '30 days') as views_last_30_days,
  COUNT(DISTINCT vc_id) as total_views,
  MAX(viewed_at) as last_viewed_at,
  (
    SELECT COUNT(*) FROM public.vc_watchlist 
    WHERE vc_watchlist.founder_id = founder_profile_views.founder_id
  ) as watchlist_count,
  (
    SELECT COUNT(*) FROM public.vc_intro_requests 
    WHERE vc_intro_requests.founder_id = founder_profile_views.founder_id
  ) as intro_request_count
FROM public.founder_profile_views
GROUP BY founder_id;

-- Grant access to the view
GRANT SELECT ON public.founder_interest_stats TO authenticated;

-- Comment on table
COMMENT ON TABLE public.founder_profile_views IS 'Track VC views of founder profiles for interest analytics';
COMMENT ON VIEW public.founder_interest_stats IS 'Aggregate VC interest metrics per founder';
