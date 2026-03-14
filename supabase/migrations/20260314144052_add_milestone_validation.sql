-- Add milestone validation columns
-- This migration adds status tracking and admin validation to milestones

ALTER TABLE public.milestones 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES auth.users(id);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_founder_status ON public.milestones(founder_id, status);

-- Add RLS policy for admins to validate milestones
CREATE POLICY "Admins can update milestone validation status"
  ON public.milestones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Comment on columns
COMMENT ON COLUMN public.milestones.status IS 'Validation status: pending, approved, or rejected';
COMMENT ON COLUMN public.milestones.admin_notes IS 'Admin feedback or rejection reason';
COMMENT ON COLUMN public.milestones.validated_at IS 'Timestamp when admin validated the milestone';
COMMENT ON COLUMN public.milestones.validated_by IS 'Admin user who validated the milestone';
