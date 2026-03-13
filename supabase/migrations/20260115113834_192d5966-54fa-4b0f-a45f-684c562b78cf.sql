-- Create storage bucket for founder uploads (pitch decks, proofs, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('founder-uploads', 'founder-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for founder uploads bucket
CREATE POLICY "Anyone can view founder uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'founder-uploads');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'founder-uploads');

CREATE POLICY "Users can update their uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'founder-uploads');

CREATE POLICY "Users can delete their uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'founder-uploads');