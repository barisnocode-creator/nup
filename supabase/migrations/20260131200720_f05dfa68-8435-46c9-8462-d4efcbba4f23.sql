-- Create storage bucket for user-uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', true);

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own images
CREATE POLICY "Users can read their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to read user images (for website display)
CREATE POLICY "Public can read user images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);