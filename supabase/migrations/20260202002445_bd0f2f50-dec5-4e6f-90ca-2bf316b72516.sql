-- projects tablosuna grapes_content sütunu ekle
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS grapes_content JSONB DEFAULT '{}';

-- Sütun hakkında açıklama ekle
COMMENT ON COLUMN projects.grapes_content IS 'GrapeJS editor content in JSON format including components, styles and assets';