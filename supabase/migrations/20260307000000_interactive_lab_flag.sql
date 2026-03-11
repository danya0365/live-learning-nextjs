-- Add flag for interactive lab content
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS has_interactive_lab BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS interactive_lab_slug TEXT;
