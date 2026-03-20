-- Migration: allow_students_to_update_offers
-- Description: Adds a Row Level Security policy to consultation_offers to allow students to update (accept/reject) offers on their own requests.

CREATE POLICY "Students can update offers on their own requests"
  ON public.consultation_offers FOR UPDATE
  USING (
    request_id IN (
      SELECT id FROM public.consultation_requests
      WHERE student_profile_id = public.get_active_profile_id()
    )
  )
  WITH CHECK (
    request_id IN (
      SELECT id FROM public.consultation_requests
      WHERE student_profile_id = public.get_active_profile_id()
    )
  );
