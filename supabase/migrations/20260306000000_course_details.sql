-- Add new columns for rich course details
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS syllabus JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS about_course TEXT DEFAULT '';
