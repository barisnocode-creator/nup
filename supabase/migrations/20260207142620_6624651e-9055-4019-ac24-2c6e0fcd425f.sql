-- Fix: Restrict public read access on user-images bucket to published projects only
-- Drop the overly permissive blanket public read policy
DROP POLICY IF EXISTS "Public can read user images" ON storage.objects;

-- Add a targeted policy: public can ONLY read images that belong to a published project
-- Storage path format: {user_id}/{project_id}/{filename}
CREATE POLICY "Public can read published project images"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id = 'user-images' AND
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.is_published = true
    AND p.user_id::text = (storage.foldername(name))[1]
    AND p.id::text = (storage.foldername(name))[2]
  )
);