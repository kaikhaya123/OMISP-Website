
-- Allow VCs to read milestones for any founder (needed for founder detail page)
DROP POLICY IF EXISTS "VCs can view founder milestones" ON public.milestones;
CREATE POLICY "VCs can view founder milestones"
  ON public.milestones FOR SELECT
  USING (
    public.has_role(auth.uid(), 'vc')
  );

-- Allow VCs to read founder scores (already has permissive policy, keep as-is)
-- investor_views: already correct (VCs see only their own)

-- Create admin_stats view for admin dashboard
-- We use security definer functions to safely expose aggregate counts
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
  total_founders bigint,
  total_investors bigint,
  total_milestones bigint,
  total_profile_views bigint,
  avg_omisp_score numeric,
  vc_eligible_founders bigint,
  unicorn_candidates bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.founder_profiles)::bigint AS total_founders,
    (SELECT count(*) FROM public.user_roles WHERE role = 'vc')::bigint AS total_investors,
    (SELECT count(*) FROM public.milestones)::bigint AS total_milestones,
    (SELECT count(*) FROM public.investor_views)::bigint AS total_profile_views,
    (SELECT COALESCE(avg(total_score), 0) FROM public.omisp_scores)::numeric AS avg_omisp_score,
    (SELECT count(*) FROM public.omisp_scores WHERE is_vc_eligible = true)::bigint AS vc_eligible_founders,
    (SELECT count(*) FROM public.omisp_scores WHERE is_unicorn_potential = true)::bigint AS unicorn_candidates;
$$;

-- Only admins (we'll check via a special admin role approach using user_metadata or email)
-- For now, the function is security definer so it runs as owner, callable by authenticated users
-- We'll restrict the page in the frontend to known admin emails
