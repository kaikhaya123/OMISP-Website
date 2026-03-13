-- Create founder_profiles table
CREATE TABLE public.founder_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  company_name TEXT,
  company_registered_date DATE,
  website_url TEXT,
  website_launched_date DATE,
  first_customer_date DATE,
  current_mrr DECIMAL DEFAULT 0,
  monthly_growth_rate DECIMAL DEFAULT 0,
  team_size INTEGER DEFAULT 1,
  total_funding_raised DECIMAL DEFAULT 0,
  previous_exits INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  has_advanced_degree BOOLEAN DEFAULT false,
  industry_experience TEXT,
  pivots_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table for Progress Velocity
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN (
    'company_registered', 'website_launched', 'first_customer',
    'mrr_10k', 'mrr_50k', 'mrr_100k', 'team_of_5', 'funding_100k', 'funding_1m'
  )),
  achieved_date DATE NOT NULL,
  proof_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  points_earned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create omi_chat_sessions for Founder Aptitude
CREATE TABLE public.omi_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  learning_signal_score DECIMAL DEFAULT 0 CHECK (learning_signal_score >= 0 AND learning_signal_score <= 1),
  topics_discussed TEXT[],
  duration_minutes INTEGER DEFAULT 0,
  feedback_receptiveness DECIMAL DEFAULT 0 CHECK (feedback_receptiveness >= 0 AND feedback_receptiveness <= 1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pitch_sessions for Behavioral Resilience
CREATE TABLE public.pitch_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pitch_score INTEGER DEFAULT 0 CHECK (pitch_score >= 0 AND pitch_score <= 100),
  toughness_score DECIMAL DEFAULT 0 CHECK (toughness_score >= 0 AND toughness_score <= 1),
  qa_handling_score INTEGER DEFAULT 0 CHECK (qa_handling_score >= 0 AND qa_handling_score <= 100),
  feedback TEXT,
  improvement_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_sessions for Execution Readiness
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  game_type TEXT NOT NULL CHECK (game_type IN ('build_a_biz', 'market_heartbeat')),
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  decision_speed_score INTEGER DEFAULT 0 CHECK (decision_speed_score >= 0 AND decision_speed_score <= 100),
  crisis_management_score INTEGER DEFAULT 0 CHECK (crisis_management_score >= 0 AND crisis_management_score <= 100),
  risk_appetite_score INTEGER DEFAULT 50 CHECK (risk_appetite_score >= 0 AND risk_appetite_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue_models for Idea Viability
CREATE TABLE public.revenue_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_quality_score INTEGER DEFAULT 0 CHECK (model_quality_score >= 0 AND model_quality_score <= 100),
  tam_value DECIMAL DEFAULT 0,
  market_growing BOOLEAN DEFAULT false,
  competitive_positioning_score INTEGER DEFAULT 0 CHECK (competitive_positioning_score >= 0 AND competitive_positioning_score <= 100),
  differentiation_clear BOOLEAN DEFAULT false,
  projections_realistic BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create omisp_scores table to store calculated scores
CREATE TABLE public.omisp_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  idea_viability DECIMAL DEFAULT 0 CHECK (idea_viability >= 0 AND idea_viability <= 20),
  founder_aptitude DECIMAL DEFAULT 0 CHECK (founder_aptitude >= 0 AND founder_aptitude <= 20),
  execution_readiness DECIMAL DEFAULT 0 CHECK (execution_readiness >= 0 AND execution_readiness <= 20),
  behavioral_resilience DECIMAL DEFAULT 0 CHECK (behavioral_resilience >= 0 AND behavioral_resilience <= 20),
  progress_velocity DECIMAL DEFAULT 0 CHECK (progress_velocity >= 0 AND progress_velocity <= 10),
  unicorn_potential DECIMAL DEFAULT 0 CHECK (unicorn_potential >= 0 AND unicorn_potential <= 10),
  total_score DECIMAL DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  is_vc_eligible BOOLEAN DEFAULT false,
  is_unicorn_potential BOOLEAN DEFAULT false,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(founder_id)
);

-- Create score_history for tracking changes
CREATE TABLE public.score_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL REFERENCES public.founder_profiles(id) ON DELETE CASCADE,
  previous_score DECIMAL,
  new_score DECIMAL,
  change_amount DECIMAL,
  change_reason TEXT,
  dimension_changed TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omi_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omisp_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for founder_profiles
CREATE POLICY "Users can view their own profile" ON public.founder_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.founder_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.founder_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for milestones
CREATE POLICY "Users can view their own milestones" ON public.milestones FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own milestones" ON public.milestones FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own milestones" ON public.milestones FOR UPDATE USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete their own milestones" ON public.milestones FOR DELETE USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for omi_chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.omi_chat_sessions FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own chat sessions" ON public.omi_chat_sessions FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for pitch_sessions
CREATE POLICY "Users can view their own pitch sessions" ON public.pitch_sessions FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own pitch sessions" ON public.pitch_sessions FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for game_sessions
CREATE POLICY "Users can view their own game sessions" ON public.game_sessions FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own game sessions" ON public.game_sessions FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for revenue_models
CREATE POLICY "Users can view their own revenue models" ON public.revenue_models FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own revenue models" ON public.revenue_models FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own revenue models" ON public.revenue_models FOR UPDATE USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for omisp_scores
CREATE POLICY "Users can view their own scores" ON public.omisp_scores FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own scores" ON public.omisp_scores FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own scores" ON public.omisp_scores FOR UPDATE USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- RLS Policies for score_history
CREATE POLICY "Users can view their own score history" ON public.score_history FOR SELECT USING (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own score history" ON public.score_history FOR INSERT WITH CHECK (founder_id IN (SELECT id FROM public.founder_profiles WHERE user_id = auth.uid()));

-- VCs can view all verified founder profiles and scores (public access for discovery)
CREATE POLICY "VCs can view verified founder profiles" ON public.founder_profiles FOR SELECT USING (true);
CREATE POLICY "VCs can view verified scores" ON public.omisp_scores FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON public.founder_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_models_updated_at BEFORE UPDATE ON public.revenue_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for scores (so dashboard updates live)
ALTER PUBLICATION supabase_realtime ADD TABLE public.omisp_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.score_history;