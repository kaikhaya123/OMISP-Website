
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('founder', 'vc');

-- 2. Create user_roles table (per security guidelines - roles in separate table)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own role (during signup)
CREATE POLICY "Users can insert their own role"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. VC Profiles table
CREATE TABLE public.vc_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  firm_name TEXT,
  fund_size TEXT,
  investment_stage_focus TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vc_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can view their own profile"
  ON public.vc_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "VCs can insert their own profile"
  ON public.vc_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "VCs can update their own profile"
  ON public.vc_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_vc_profiles_updated_at
  BEFORE UPDATE ON public.vc_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. VC Watchlist table
CREATE TABLE public.vc_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id UUID NOT NULL,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  pipeline_stage TEXT NOT NULL DEFAULT 'watching',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (vc_user_id, founder_id)
);

ALTER TABLE public.vc_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can view their own watchlist"
  ON public.vc_watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can insert to their watchlist"
  ON public.vc_watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their watchlist"
  ON public.vc_watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can delete from their watchlist"
  ON public.vc_watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE TRIGGER update_vc_watchlist_updated_at
  BEFORE UPDATE ON public.vc_watchlist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. VC Intro Requests table
CREATE TABLE public.vc_intro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id UUID NOT NULL,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vc_intro_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can view their own intro requests"
  ON public.vc_intro_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can create intro requests"
  ON public.vc_intro_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their intro requests"
  ON public.vc_intro_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE TRIGGER update_vc_intro_requests_updated_at
  BEFORE UPDATE ON public.vc_intro_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. VC Alert Preferences table
CREATE TABLE public.vc_alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vc_user_id UUID NOT NULL UNIQUE,
  min_score NUMERIC DEFAULT 0,
  industries TEXT[] DEFAULT '{}',
  stages TEXT[] DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vc_alert_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can view their own alert preferences"
  ON public.vc_alert_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can insert their alert preferences"
  ON public.vc_alert_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their alert preferences"
  ON public.vc_alert_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = vc_user_id);
