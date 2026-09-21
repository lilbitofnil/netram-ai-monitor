CREATE TABLE public.beneficiary_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id uuid NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  submission_key uuid NOT NULL,
  overall_rating smallint NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  cleanliness_rating smallint NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
  staff_behaviour_rating smallint NOT NULL CHECK (staff_behaviour_rating BETWEEN 1 AND 5),
  facilities_rating smallint NOT NULL CHECK (facilities_rating BETWEEN 1 AND 5),
  safety_rating smallint NOT NULL CHECK (safety_rating BETWEEN 1 AND 5),
  promised_services boolean NOT NULL,
  comments text CHECK (comments IS NULL OR char_length(comments) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ngo_id, submission_key)
);
GRANT INSERT ON public.beneficiary_feedback TO anon, authenticated;
GRANT ALL ON public.beneficiary_feedback TO service_role;
ALTER TABLE public.beneficiary_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anonymous feedback submission"
ON public.beneficiary_feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (
  overall_rating BETWEEN 1 AND 5
  AND cleanliness_rating BETWEEN 1 AND 5
  AND staff_behaviour_rating BETWEEN 1 AND 5
  AND facilities_rating BETWEEN 1 AND 5
  AND safety_rating BETWEEN 1 AND 5
  AND (comments IS NULL OR char_length(comments) <= 1000)
);
CREATE INDEX beneficiary_feedback_ngo_created_idx
ON public.beneficiary_feedback (ngo_id, created_at DESC);