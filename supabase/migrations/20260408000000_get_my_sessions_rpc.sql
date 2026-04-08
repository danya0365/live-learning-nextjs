-- Function to let users fetch their own active sessions from Supabase Auth
CREATE OR REPLACE FUNCTION get_my_sessions()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  user_agent text,
  ip text
)
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    s.id, 
    s.created_at, 
    s.updated_at, 
    s.user_agent, 
    cast(s.ip as text) as ip
  FROM auth.sessions s
  WHERE s.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION get_my_sessions() TO authenticated;
