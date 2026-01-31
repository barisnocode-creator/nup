-- Mevcut constraint'i kaldır
ALTER TABLE public.studio_images 
DROP CONSTRAINT studio_images_type_check;

-- Yeni constraint'i favicon dahil olarak ekle
ALTER TABLE public.studio_images 
ADD CONSTRAINT studio_images_type_check 
CHECK (type = ANY (ARRAY['logo'::text, 'favicon'::text, 'social'::text, 'poster'::text, 'creative'::text]));