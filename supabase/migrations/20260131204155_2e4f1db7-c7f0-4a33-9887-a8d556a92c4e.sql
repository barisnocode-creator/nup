-- Create studio_images table for storing AI-generated images
CREATE TABLE public.studio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'social', 'poster', 'creative')),
  prompt TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.studio_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own studio images" 
ON public.studio_images 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own studio images" 
ON public.studio_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own studio images" 
ON public.studio_images 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own studio images" 
ON public.studio_images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_studio_images_user_id ON public.studio_images(user_id);
CREATE INDEX idx_studio_images_type ON public.studio_images(type);
CREATE INDEX idx_studio_images_created_at ON public.studio_images(created_at DESC);