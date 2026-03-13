
-- Cascade id update to all child tables, then update founder_profiles.id = user_id
-- Use a transaction with deferred FK checks

-- Temporarily drop FK constraints, update ids, then re-add them
ALTER TABLE public.omisp_scores DROP CONSTRAINT IF EXISTS omisp_scores_founder_id_fkey;
ALTER TABLE public.milestones DROP CONSTRAINT IF EXISTS milestones_founder_id_fkey;
ALTER TABLE public.pitch_sessions DROP CONSTRAINT IF EXISTS pitch_sessions_founder_id_fkey;
ALTER TABLE public.game_sessions DROP CONSTRAINT IF EXISTS game_sessions_founder_id_fkey;
ALTER TABLE public.omi_chat_sessions DROP CONSTRAINT IF EXISTS omi_chat_sessions_founder_id_fkey;
ALTER TABLE public.revenue_models DROP CONSTRAINT IF EXISTS revenue_models_founder_id_fkey;
ALTER TABLE public.score_history DROP CONSTRAINT IF EXISTS score_history_founder_id_fkey;
ALTER TABLE public.investor_views DROP CONSTRAINT IF EXISTS investor_views_founder_id_fkey;
ALTER TABLE public.vc_watchlist DROP CONSTRAINT IF EXISTS vc_watchlist_founder_id_fkey;
ALTER TABLE public.vc_intro_requests DROP CONSTRAINT IF EXISTS vc_intro_requests_founder_id_fkey;

-- Update child tables founder_id to match new id (= user_id)
UPDATE public.omisp_scores os
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE os.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.milestones m
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE m.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.pitch_sessions ps
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE ps.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.game_sessions gs
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE gs.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.omi_chat_sessions ocs
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE ocs.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.revenue_models rm
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE rm.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.score_history sh
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE sh.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.investor_views iv
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE iv.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.vc_watchlist vw
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE vw.founder_id = fp.id AND fp.id != fp.user_id;

UPDATE public.vc_intro_requests vir
  SET founder_id = fp.user_id
  FROM public.founder_profiles fp
  WHERE vir.founder_id = fp.id AND fp.id != fp.user_id;

-- Now update founder_profiles.id = user_id
UPDATE public.founder_profiles SET id = user_id WHERE id != user_id;

-- Update vc_profiles.id = user_id
UPDATE public.vc_profiles SET id = user_id WHERE id != user_id;

-- Drop auto-generated defaults so id must be provided explicitly
ALTER TABLE public.founder_profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.vc_profiles ALTER COLUMN id DROP DEFAULT;

-- Add unique constraints on user_id
ALTER TABLE public.founder_profiles DROP CONSTRAINT IF EXISTS founder_profiles_user_id_key;
ALTER TABLE public.founder_profiles ADD CONSTRAINT founder_profiles_user_id_key UNIQUE (user_id);
ALTER TABLE public.vc_profiles DROP CONSTRAINT IF EXISTS vc_profiles_user_id_key;
ALTER TABLE public.vc_profiles ADD CONSTRAINT vc_profiles_user_id_key UNIQUE (user_id);

-- Re-add FK constraints
ALTER TABLE public.omisp_scores ADD CONSTRAINT omisp_scores_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.milestones ADD CONSTRAINT milestones_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.pitch_sessions ADD CONSTRAINT pitch_sessions_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.game_sessions ADD CONSTRAINT game_sessions_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.omi_chat_sessions ADD CONSTRAINT omi_chat_sessions_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.revenue_models ADD CONSTRAINT revenue_models_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.score_history ADD CONSTRAINT score_history_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.investor_views ADD CONSTRAINT investor_views_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.vc_watchlist ADD CONSTRAINT vc_watchlist_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);

ALTER TABLE public.vc_intro_requests ADD CONSTRAINT vc_intro_requests_founder_id_fkey
  FOREIGN KEY (founder_id) REFERENCES public.founder_profiles(id);
