-- Create Admin Chat Summary View for Performance
-- Group-by aggregation for unread counts and latest message info
DROP VIEW IF EXISTS public.admin_chat_summary;

CREATE OR REPLACE VIEW public.admin_chat_summary AS
WITH last_messages AS (
    -- Get the singular latest message per session
    SELECT DISTINCT ON (session_id)
        session_id,
        content,
        role,
        status,
        created_at
    FROM public.chat_messages
    ORDER BY session_id, created_at DESC
),
unread_counts AS (
    -- Count unread messages from 'user' per session
    SELECT 
        session_id,
        count(*) as count
    FROM public.chat_messages
    WHERE role = 'user' AND status != 'read'
    GROUP BY session_id
)
SELECT 
    s.id,
    s.customer_name,
    s.customer_phone,
    s.status,
    s.is_active,
    s.auto_reply,
    s.created_at,
    s.updated_at,
    COALESCE(u.count, 0)::INTEGER as unread_count,
    lm.content as last_message_content,
    lm.role as last_message_role,
    lm.status as last_message_status,
    lm.created_at as last_message_at
FROM public.chat_sessions s
LEFT JOIN last_messages lm ON s.id = lm.session_id
LEFT JOIN unread_counts u ON s.id = u.session_id;

-- Grant access to authenticated users (admins will use this)
GRANT SELECT ON public.admin_chat_summary TO authenticated;
GRANT SELECT ON public.admin_chat_summary TO service_role;
