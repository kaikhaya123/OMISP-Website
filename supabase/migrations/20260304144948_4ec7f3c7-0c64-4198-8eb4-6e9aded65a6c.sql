CREATE TABLE public.investor_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vc_user_id UUID NOT NULL,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (vc_user_id, founder_id)
);

ALTER TABLE public.investor_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCs can insert their views"
  ON public.investor_views FOR INSERT
  WITH CHECK (auth.uid() = vc_user_id);

CREATE POLICY "VCs can view their own views"
  ON public.investor_views FOR SELECT
  USING (auth.uid() = vc_user_id);

CREATE POLICY "VCs can update their own views"
  ON public.investor_views FOR UPDATE
  USING (auth.uid() = vc_user_id);