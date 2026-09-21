CREATE OR REPLACE FUNCTION public.get_public_feedback_summary()
RETURNS TABLE (
  ngo_id uuid,
  response_count bigint,
  overall_average numeric,
  cleanliness_average numeric,
  staff_behaviour_average numeric,
  facilities_average numeric,
  safety_average numeric,
  promised_services_percentage numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    f.ngo_id,
    count(*)::bigint,
    round(avg(f.overall_rating), 1),
    round(avg(f.cleanliness_rating), 1),
    round(avg(f.staff_behaviour_rating), 1),
    round(avg(f.facilities_rating), 1),
    round(avg(f.safety_rating), 1),
    round(100.0 * count(*) FILTER (WHERE f.promised_services) / NULLIF(count(*), 0), 0)
  FROM public.beneficiary_feedback f
  GROUP BY f.ngo_id
$$;
GRANT EXECUTE ON FUNCTION public.get_public_feedback_summary() TO anon, authenticated, service_role;