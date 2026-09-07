
REVOKE EXECUTE ON FUNCTION public.my_employee_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.my_system_role() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.rcms_is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.supervises(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.assigned_to_job(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.my_employee_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_system_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.rcms_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.supervises(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assigned_to_job(uuid) TO authenticated;
