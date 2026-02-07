
-- Create website-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all website images
CREATE POLICY "Website images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

-- Allow service role and authenticated users to upload images for their projects
CREATE POLICY "Users can upload website images for their projects"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'website-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own project images
CREATE POLICY "Users can update website images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'website-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own project images
CREATE POLICY "Users can delete website images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'website-images'
  AND auth.role() = 'authenticated'
);
