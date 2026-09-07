
-- ============ CORE PEOPLE ============
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  employee_code text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  date_of_birth date,
  gender text,
  address text,
  emergency_contact text,
  emergency_phone text,
  position text,
  department text,
  location text,
  system_role text NOT NULL DEFAULT 'staff' CHECK (system_role IN ('admin','supervisor','staff')),
  supervisor_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  employment_date date,
  status text NOT NULL DEFAULT 'onboarding' CHECK (status IN ('active','inactive','suspended','onboarding','probation','terminated')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_employees_supervisor ON public.employees(supervisor_id);
CREATE INDEX idx_employees_role ON public.employees(system_role);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- helper functions
CREATE OR REPLACE FUNCTION public.my_employee_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.my_system_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT system_role FROM public.employees WHERE user_id = auth.uid() LIMIT 1),
    CASE WHEN public.is_admin(auth.uid()) THEN 'admin' ELSE NULL END
  );
$$;

CREATE OR REPLACE FUNCTION public.rcms_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(auth.uid()) OR public.my_system_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.supervises(_employee_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.id = _employee_id AND e.supervisor_id = public.my_employee_id()
  );
$$;

CREATE POLICY "employees admin all" ON public.employees FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "employees self read" ON public.employees FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "employees self update" ON public.employees FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "employees supervisor read team" ON public.employees FOR SELECT TO authenticated
  USING (supervisor_id = public.my_employee_id());

CREATE TRIGGER employees_updated BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ EMPLOYEE DOCUMENTS (ADMIN + OWNER ONLY) ============
CREATE TABLE public.employee_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  doc_number text,
  file_path text,
  file_name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('missing','pending','verified','rejected')),
  rejection_reason text,
  admin_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_empdocs_employee ON public.employee_documents(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_documents TO authenticated;
GRANT ALL ON public.employee_documents TO service_role;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs admin all" ON public.employee_documents FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "docs owner read" ON public.employee_documents FOR SELECT TO authenticated
  USING (employee_id = public.my_employee_id());
CREATE POLICY "docs owner insert" ON public.employee_documents FOR INSERT TO authenticated
  WITH CHECK (employee_id = public.my_employee_id());
CREATE POLICY "docs owner update" ON public.employee_documents FOR UPDATE TO authenticated
  USING (employee_id = public.my_employee_id() AND status <> 'verified')
  WITH CHECK (employee_id = public.my_employee_id());
CREATE TRIGGER empdocs_updated BEFORE UPDATE ON public.employee_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ONBOARDING ============
CREATE TABLE public.onboarding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','pending_review','completed','rejected')),
  progress integer NOT NULL DEFAULT 0,
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_records TO authenticated;
GRANT ALL ON public.onboarding_records TO service_role;
ALTER TABLE public.onboarding_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onb admin all" ON public.onboarding_records FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "onb owner read" ON public.onboarding_records FOR SELECT TO authenticated
  USING (employee_id = public.my_employee_id());
CREATE POLICY "onb owner update" ON public.onboarding_records FOR UPDATE TO authenticated
  USING (employee_id = public.my_employee_id()) WITH CHECK (employee_id = public.my_employee_id());
CREATE POLICY "onb supervisor read" ON public.onboarding_records FOR SELECT TO authenticated
  USING (public.supervises(employee_id));
CREATE TRIGGER onb_updated BEFORE UPDATE ON public.onboarding_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid NOT NULL REFERENCES public.onboarding_records(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_onbsteps_record ON public.onboarding_steps(record_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_steps TO authenticated;
GRANT ALL ON public.onboarding_steps TO service_role;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onbstep admin all" ON public.onboarding_steps FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "onbstep owner rw" ON public.onboarding_steps FOR ALL TO authenticated
  USING (record_id IN (SELECT id FROM public.onboarding_records WHERE employee_id = public.my_employee_id()))
  WITH CHECK (record_id IN (SELECT id FROM public.onboarding_records WHERE employee_id = public.my_employee_id()));

-- ============ CLIENTS ============
CREATE TABLE public.cleaning_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text,
  phone text,
  email text,
  address text,
  contract_ref text,
  contract_start date,
  contract_end date,
  supervisor_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','pending')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_clients TO authenticated;
GRANT ALL ON public.cleaning_clients TO service_role;
ALTER TABLE public.cleaning_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients admin all" ON public.cleaning_clients FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "clients staff read" ON public.cleaning_clients FOR SELECT TO authenticated
  USING (public.my_system_role() IN ('supervisor','staff'));
CREATE TRIGGER cclients_updated BEFORE UPDATE ON public.cleaning_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.client_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.cleaning_clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  city text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cloc_client ON public.client_locations(client_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_locations TO authenticated;
GRANT ALL ON public.client_locations TO service_role;
ALTER TABLE public.client_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cloc admin all" ON public.client_locations FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "cloc staff read" ON public.client_locations FOR SELECT TO authenticated
  USING (public.my_system_role() IN ('supervisor','staff'));

-- ============ SERVICES ============
CREATE TABLE public.cleaning_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  estimated_duration_mins integer DEFAULT 120,
  required_staff integer DEFAULT 1,
  equipment text[] NOT NULL DEFAULT '{}',
  price numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_services TO authenticated;
GRANT ALL ON public.cleaning_services TO service_role;
ALTER TABLE public.cleaning_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services admin all" ON public.cleaning_services FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "services read" ON public.cleaning_services FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);
CREATE TRIGGER cservices_updated BEFORE UPDATE ON public.cleaning_services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.service_checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.cleaning_services(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_checklist_templates TO authenticated;
GRANT ALL ON public.service_checklist_templates TO service_role;
ALTER TABLE public.service_checklist_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sctpl admin all" ON public.service_checklist_templates FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "sctpl read" ON public.service_checklist_templates FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);

-- ============ JOBS ============
CREATE TABLE public.cleaning_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code text NOT NULL UNIQUE,
  client_id uuid REFERENCES public.cleaning_clients(id) ON DELETE SET NULL,
  location_id uuid REFERENCES public.client_locations(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.cleaning_services(id) ON DELETE SET NULL,
  supervisor_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time time,
  end_time time,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  instructions text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','assigned','in_progress','pending','completed','requires_correction','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_jobs_date ON public.cleaning_jobs(scheduled_date);
CREATE INDEX idx_jobs_supervisor ON public.cleaning_jobs(supervisor_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_jobs TO authenticated;
GRANT ALL ON public.cleaning_jobs TO service_role;
ALTER TABLE public.cleaning_jobs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.job_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.cleaning_jobs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  role_on_job text DEFAULT 'cleaner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, employee_id)
);
CREATE INDEX idx_jassign_emp ON public.job_assignments(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_assignments TO authenticated;
GRANT ALL ON public.job_assignments TO service_role;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.assigned_to_job(_job_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.job_assignments ja WHERE ja.job_id = _job_id AND ja.employee_id = public.my_employee_id());
$$;

CREATE POLICY "jobs admin all" ON public.cleaning_jobs FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "jobs supervisor rw" ON public.cleaning_jobs FOR ALL TO authenticated
  USING (supervisor_id = public.my_employee_id()) WITH CHECK (supervisor_id = public.my_employee_id());
CREATE POLICY "jobs staff read" ON public.cleaning_jobs FOR SELECT TO authenticated
  USING (public.assigned_to_job(id));
CREATE POLICY "jobs staff update" ON public.cleaning_jobs FOR UPDATE TO authenticated
  USING (public.assigned_to_job(id)) WITH CHECK (public.assigned_to_job(id));
CREATE TRIGGER cjobs_updated BEFORE UPDATE ON public.cleaning_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "jassign admin all" ON public.job_assignments FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "jassign supervisor rw" ON public.job_assignments FOR ALL TO authenticated
  USING (job_id IN (SELECT id FROM public.cleaning_jobs WHERE supervisor_id = public.my_employee_id()))
  WITH CHECK (job_id IN (SELECT id FROM public.cleaning_jobs WHERE supervisor_id = public.my_employee_id()));
CREATE POLICY "jassign self read" ON public.job_assignments FOR SELECT TO authenticated
  USING (employee_id = public.my_employee_id());

CREATE TABLE public.job_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.cleaning_jobs(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_by uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_jcheck_job ON public.job_checklist_items(job_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_checklist_items TO authenticated;
GRANT ALL ON public.job_checklist_items TO service_role;
ALTER TABLE public.job_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jcheck admin all" ON public.job_checklist_items FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "jcheck supervisor rw" ON public.job_checklist_items FOR ALL TO authenticated
  USING (job_id IN (SELECT id FROM public.cleaning_jobs WHERE supervisor_id = public.my_employee_id()))
  WITH CHECK (job_id IN (SELECT id FROM public.cleaning_jobs WHERE supervisor_id = public.my_employee_id()));
CREATE POLICY "jcheck staff rw" ON public.job_checklist_items FOR SELECT TO authenticated
  USING (public.assigned_to_job(job_id));
CREATE POLICY "jcheck staff update" ON public.job_checklist_items FOR UPDATE TO authenticated
  USING (public.assigned_to_job(job_id)) WITH CHECK (public.assigned_to_job(job_id));

CREATE TABLE public.job_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.cleaning_jobs(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  phase text NOT NULL DEFAULT 'before' CHECK (phase IN ('before','after','issue')),
  file_path text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_jphotos_job ON public.job_photos(job_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_photos TO authenticated;
GRANT ALL ON public.job_photos TO service_role;
ALTER TABLE public.job_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jphotos admin all" ON public.job_photos FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "jphotos supervisor read" ON public.job_photos FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.cleaning_jobs WHERE supervisor_id = public.my_employee_id()));
CREATE POLICY "jphotos staff rw" ON public.job_photos FOR SELECT TO authenticated
  USING (public.assigned_to_job(job_id));
CREATE POLICY "jphotos staff insert" ON public.job_photos FOR INSERT TO authenticated
  WITH CHECK (public.assigned_to_job(job_id) AND employee_id = public.my_employee_id());

-- ============ ATTENDANCE ============
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  work_date date NOT NULL DEFAULT CURRENT_DATE,
  clock_in timestamptz,
  clock_out timestamptz,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present','late','absent','on_leave','early_out')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, work_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "att admin all" ON public.attendance FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "att supervisor read" ON public.attendance FOR SELECT TO authenticated
  USING (public.supervises(employee_id));
CREATE POLICY "att self read" ON public.attendance FOR SELECT TO authenticated
  USING (employee_id = public.my_employee_id());
CREATE POLICY "att self insert" ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (employee_id = public.my_employee_id());
CREATE POLICY "att self update" ON public.attendance FOR UPDATE TO authenticated
  USING (employee_id = public.my_employee_id()) WITH CHECK (employee_id = public.my_employee_id());

-- ============ LEAVE ============
CREATE TABLE public.leave_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  requires_document text NOT NULL DEFAULT 'optional' CHECK (requires_document IN ('required','optional','disabled')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_types TO authenticated;
GRANT ALL ON public.leave_types TO service_role;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ltypes admin all" ON public.leave_types FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "ltypes read" ON public.leave_types FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);

CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id uuid REFERENCES public.leave_types(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  notes text,
  document_path text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','supervisor_approved','approved','rejected','cancelled')),
  supervisor_comment text,
  admin_comment text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_leave_emp ON public.leave_requests(employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leave admin all" ON public.leave_requests FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "leave supervisor read" ON public.leave_requests FOR SELECT TO authenticated
  USING (public.supervises(employee_id));
CREATE POLICY "leave supervisor update" ON public.leave_requests FOR UPDATE TO authenticated
  USING (public.supervises(employee_id)) WITH CHECK (public.supervises(employee_id));
CREATE POLICY "leave self read" ON public.leave_requests FOR SELECT TO authenticated
  USING (employee_id = public.my_employee_id());
CREATE POLICY "leave self insert" ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (employee_id = public.my_employee_id());
CREATE POLICY "leave self cancel" ON public.leave_requests FOR UPDATE TO authenticated
  USING (employee_id = public.my_employee_id() AND status = 'pending')
  WITH CHECK (employee_id = public.my_employee_id());
CREATE TRIGGER leave_updated BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ WEEKLY UPDATES & REPORTS ============
CREATE TABLE public.weekly_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_staff integer DEFAULT 0,
  active_staff integer DEFAULT 0,
  absent_staff integer DEFAULT 0,
  jobs_assigned integer DEFAULT 0,
  jobs_completed integer DEFAULT 0,
  jobs_pending integer DEFAULT 0,
  jobs_delayed integer DEFAULT 0,
  staff_performance text,
  client_feedback text,
  problems text,
  equipment_problems text,
  supply_problems text,
  incidents text,
  recommendations text,
  comments text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','reviewed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_updates TO authenticated;
GRANT ALL ON public.weekly_updates TO service_role;
ALTER TABLE public.weekly_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wupd admin all" ON public.weekly_updates FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "wupd own rw" ON public.weekly_updates FOR ALL TO authenticated
  USING (supervisor_id = public.my_employee_id()) WITH CHECK (supervisor_id = public.my_employee_id());
CREATE TRIGGER wupd_updated BEFORE UPDATE ON public.weekly_updates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  sections jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','reviewed','requires_revision','approved')),
  admin_comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_reports TO authenticated;
GRANT ALL ON public.weekly_reports TO service_role;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wrep admin all" ON public.weekly_reports FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "wrep own rw" ON public.weekly_reports FOR ALL TO authenticated
  USING (supervisor_id = public.my_employee_id()) WITH CHECK (supervisor_id = public.my_employee_id());
CREATE TRIGGER wrep_updated BEFORE UPDATE ON public.weekly_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ STAFF REQUESTS ============
CREATE TABLE public.staff_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  request_type text NOT NULL CHECK (request_type IN ('additional_staff','replacement_staff','equipment','supplies')),
  reason text,
  quantity integer DEFAULT 1,
  location text,
  required_date date,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','fulfilled')),
  admin_comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_requests TO authenticated;
GRANT ALL ON public.staff_requests TO service_role;
ALTER TABLE public.staff_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sreq admin all" ON public.staff_requests FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "sreq own rw" ON public.staff_requests FOR ALL TO authenticated
  USING (supervisor_id = public.my_employee_id()) WITH CHECK (supervisor_id = public.my_employee_id());
CREATE TRIGGER sreq_updated BEFORE UPDATE ON public.staff_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ EQUIPMENT & SUPPLIES ============
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  asset_code text UNIQUE,
  category text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','assigned','damaged','maintenance','missing')),
  location text,
  assigned_employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  last_maintenance date,
  next_maintenance date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment TO authenticated;
GRANT ALL ON public.equipment TO service_role;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "equip admin all" ON public.equipment FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "equip read" ON public.equipment FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);
CREATE TRIGGER equip_updated BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unit text DEFAULT 'unit',
  current_stock numeric NOT NULL DEFAULT 0,
  minimum_stock numeric NOT NULL DEFAULT 0,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplies TO authenticated;
GRANT ALL ON public.supplies TO service_role;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supplies admin all" ON public.supplies FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "supplies read" ON public.supplies FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);
CREATE TRIGGER supplies_updated BEFORE UPDATE ON public.supplies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ISSUES ============
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'other',
  location text,
  occurred_on date DEFAULT CURRENT_DATE,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  images text[] NOT NULL DEFAULT '{}',
  reported_by uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  job_id uuid REFERENCES public.cleaning_jobs(id) ON DELETE SET NULL,
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issues admin all" ON public.issues FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "issues reporter rw" ON public.issues FOR SELECT TO authenticated
  USING (reported_by = public.my_employee_id() OR public.supervises(reported_by));
CREATE POLICY "issues insert" ON public.issues FOR INSERT TO authenticated
  WITH CHECK (reported_by = public.my_employee_id());
CREATE POLICY "issues supervisor update" ON public.issues FOR UPDATE TO authenticated
  USING (public.supervises(reported_by) OR reported_by = public.my_employee_id())
  WITH CHECK (public.supervises(reported_by) OR reported_by = public.my_employee_id());
CREATE TRIGGER issues_updated BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CLIENT FEEDBACK ============
CREATE TABLE public.client_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.cleaning_clients(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.cleaning_jobs(id) ON DELETE SET NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment text,
  recorded_by uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  feedback_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_feedback TO authenticated;
GRANT ALL ON public.client_feedback TO service_role;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback admin all" ON public.client_feedback FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "feedback supervisor read" ON public.client_feedback FOR SELECT TO authenticated
  USING (public.my_system_role() = 'supervisor');
CREATE POLICY "feedback supervisor insert" ON public.client_feedback FOR INSERT TO authenticated
  WITH CHECK (recorded_by = public.my_employee_id());

-- ============ NOTIFICATIONS / MESSAGES / ANNOUNCEMENTS ============
CREATE TABLE public.app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  kind text NOT NULL DEFAULT 'info',
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_recipient ON public.app_notifications(recipient_employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_notifications TO authenticated;
GRANT ALL ON public.app_notifications TO service_role;
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif admin all" ON public.app_notifications FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "notif own read" ON public.app_notifications FOR SELECT TO authenticated
  USING (recipient_employee_id = public.my_employee_id());
CREATE POLICY "notif own update" ON public.app_notifications FOR UPDATE TO authenticated
  USING (recipient_employee_id = public.my_employee_id()) WITH CHECK (recipient_employee_id = public.my_employee_id());
CREATE POLICY "notif insert" ON public.app_notifications FOR INSERT TO authenticated
  WITH CHECK (public.my_system_role() IN ('admin','supervisor'));

CREATE TABLE public.internal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_msg_pair ON public.internal_messages(sender_id, recipient_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_messages TO authenticated;
GRANT ALL ON public.internal_messages TO service_role;
ALTER TABLE public.internal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg admin all" ON public.internal_messages FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "msg participant read" ON public.internal_messages FOR SELECT TO authenticated
  USING (sender_id = public.my_employee_id() OR recipient_id = public.my_employee_id());
CREATE POLICY "msg send" ON public.internal_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = public.my_employee_id());
CREATE POLICY "msg mark read" ON public.internal_messages FOR UPDATE TO authenticated
  USING (recipient_id = public.my_employee_id()) WITH CHECK (recipient_id = public.my_employee_id());

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  target text NOT NULL DEFAULT 'all' CHECK (target IN ('all','staff','supervisors','team','individual')),
  target_employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  target_supervisor_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  publish_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ann admin all" ON public.announcements FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "ann read" ON public.announcements FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL AND publish_at <= now() AND (expires_at IS NULL OR expires_at > now()));
CREATE TRIGGER ann_updated BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TRAINING ============
CREATE TABLE public.training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions text,
  video_url text,
  document_path text,
  required boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_modules TO authenticated;
GRANT ALL ON public.training_modules TO service_role;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "train admin all" ON public.training_modules FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "train read" ON public.training_modules FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL AND active);
CREATE TRIGGER train_updated BEFORE UPDATE ON public.training_modules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_progress TO authenticated;
GRANT ALL ON public.training_progress TO service_role;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tprog admin all" ON public.training_progress FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "tprog supervisor read" ON public.training_progress FOR SELECT TO authenticated
  USING (public.supervises(employee_id));
CREATE POLICY "tprog own rw" ON public.training_progress FOR ALL TO authenticated
  USING (employee_id = public.my_employee_id()) WITH CHECK (employee_id = public.my_employee_id());

-- ============ AUDIT / SETTINGS ============
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  actor_name text,
  actor_role text,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.rcms_is_admin());
CREATE POLICY "audit insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.my_system_role() IS NOT NULL);

CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings admin all" ON public.system_settings FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "settings read" ON public.system_settings FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);

CREATE TABLE public.staff_panel_settings (
  feature_key text PRIMARY KEY,
  label text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_panel_settings TO authenticated;
GRANT ALL ON public.staff_panel_settings TO service_role;
ALTER TABLE public.staff_panel_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sps admin all" ON public.staff_panel_settings FOR ALL TO authenticated
  USING (public.rcms_is_admin()) WITH CHECK (public.rcms_is_admin());
CREATE POLICY "sps read" ON public.staff_panel_settings FOR SELECT TO authenticated
  USING (public.my_system_role() IS NOT NULL);

-- ============ SEED: settings ============
INSERT INTO public.staff_panel_settings (feature_key, label, description, enabled, sort_order) VALUES
 ('dashboard','Dashboard','Personal overview screen for staff', true, 1),
 ('profile','Profile','Staff can view and edit their profile', true, 2),
 ('profile_image','Profile Image','Allow staff to upload or capture a profile photo', true, 3),
 ('documents','Documents','Staff can upload required identity documents', true, 4),
 ('onboarding','Onboarding','Guided onboarding checklist', true, 5),
 ('leave','Leave','Apply for and track leave requests', true, 6),
 ('current_job','Current Job','View the job currently assigned', true, 7),
 ('completed_jobs','Completed Jobs','History of finished jobs', true, 8),
 ('attendance','Attendance','Clock in and clock out', true, 9),
 ('job_checklist','Job Checklist','Task checklist per job', true, 10),
 ('job_photos','Job Photos','Before and after photo evidence', true, 11),
 ('training','Training','Training modules and completion', true, 12),
 ('announcements','Announcements','Company announcements', true, 13),
 ('notifications','Notifications','In-app notifications', true, 14),
 ('support','Help & Support','Support and contact information', true, 15),
 ('settings','Settings','Account preferences', true, 16);

INSERT INTO public.system_settings (key, value) VALUES
 ('company_profile','{"name":"Robu Cleaning Company","email":"robu.cleaning@yahoo.com","phone":"+254 722 762 198","address":"Eldoret, Kenya"}'::jsonb),
 ('leave_settings','{"supervisor_approval_required":true,"document_policy":"optional"}'::jsonb),
 ('attendance_settings','{"enabled":true,"late_after":"08:15"}'::jsonb),
 ('feature_settings','{"job_checklist":true,"job_photos":true}'::jsonb);

INSERT INTO public.leave_types (name, requires_document) VALUES
 ('Annual Leave','optional'),('Sick Leave','required'),('Emergency Leave','optional'),
 ('Family Leave','optional'),('Maternity Leave','required'),('Paternity Leave','optional'),
 ('Study Leave','optional'),('Other','optional');

-- ============ SEED: demo people ============
INSERT INTO public.employees (id, employee_code, full_name, email, phone, position, department, location, system_role, status, employment_date) VALUES
 ('11111111-1111-1111-1111-111111111101','ROBU-001','System Administrator','admin@robu-cleaning.test','+254700000001','Administrator','Management','Eldoret HQ','admin','active','2024-01-08'),
 ('11111111-1111-1111-1111-111111111102','ROBU-010','James Mwangi','supervisor@robu-cleaning.test','+254700000010','Operations Supervisor','Operations','Nairobi','supervisor','active','2024-02-12'),
 ('11111111-1111-1111-1111-111111111103','ROBU-011','Grace Wambui','grace.wambui@robu-cleaning.test','+254700000011','Operations Supervisor','Operations','Nakuru','supervisor','active','2024-03-04');

INSERT INTO public.employees (id, employee_code, full_name, email, phone, position, department, location, system_role, status, supervisor_id, employment_date) VALUES
 ('11111111-1111-1111-1111-111111111201','ROBU-025','Brian Mwangi','staff@robu-cleaning.test','+254700000025','Cleaner','Commercial','Westlands','staff','active','11111111-1111-1111-1111-111111111102','2025-08-26'),
 ('11111111-1111-1111-1111-111111111202','ROBU-026','Mary Wanjiku','mary.wanjiku@robu-cleaning.test','+254700000026','Cleaner','Commercial','Westlands','staff','active','11111111-1111-1111-1111-111111111102','2025-05-14'),
 ('11111111-1111-1111-1111-111111111203','ROBU-027','Peter Kamau','peter.kamau@robu-cleaning.test','+254700000027','Team Lead Cleaner','Residential','Kilimani','staff','active','11111111-1111-1111-1111-111111111102','2025-01-20'),
 ('11111111-1111-1111-1111-111111111204','ROBU-028','Jane Njeri','jane.njeri@robu-cleaning.test','+254700000028','Cleaner','Residential','Nakuru Town','staff','probation','11111111-1111-1111-1111-111111111103','2026-06-01'),
 ('11111111-1111-1111-1111-111111111205','ROBU-029','David Otieno','david.otieno@robu-cleaning.test','+254700000029','Machine Operator','Specialised','Nakuru Town','staff','onboarding','11111111-1111-1111-1111-111111111103','2026-08-10');

INSERT INTO public.onboarding_records (employee_id, status, progress) VALUES
 ('11111111-1111-1111-1111-111111111201','completed',100),
 ('11111111-1111-1111-1111-111111111202','completed',100),
 ('11111111-1111-1111-1111-111111111203','completed',100),
 ('11111111-1111-1111-1111-111111111204','in_progress',72),
 ('11111111-1111-1111-1111-111111111205','pending_review',45);

INSERT INTO public.employee_documents (employee_id, doc_type, doc_number, status) VALUES
 ('11111111-1111-1111-1111-111111111201','National ID','********','verified'),
 ('11111111-1111-1111-1111-111111111204','National ID',NULL,'pending'),
 ('11111111-1111-1111-1111-111111111205','National ID',NULL,'missing'),
 ('11111111-1111-1111-1111-111111111205','Certificate',NULL,'rejected');

INSERT INTO public.cleaning_clients (id, company_name, contact_person, phone, email, address, supervisor_id, status) VALUES
 ('22222222-2222-2222-2222-222222222201','Prime Business Centre','Alice Kimani','+254711000001','facilities@primebusiness.test','Prime Plaza, Westlands, Nairobi','11111111-1111-1111-1111-111111111102','active'),
 ('22222222-2222-2222-2222-222222222202','Green Valley Apartments','Samuel Ochieng','+254711000002','admin@greenvalley.test','Green Valley Rd, Kilimani, Nairobi','11111111-1111-1111-1111-111111111102','active'),
 ('22222222-2222-2222-2222-222222222203','Westlands Corporate Offices','Nancy Achieng','+254711000003','ops@westlandscorp.test','Waiyaki Way, Westlands, Nairobi','11111111-1111-1111-1111-111111111102','active'),
 ('22222222-2222-2222-2222-222222222204','Sunrise Apartments','Kevin Rotich','+254711000004','care@sunrise.test','Milimani, Nakuru','11111111-1111-1111-1111-111111111103','pending');

INSERT INTO public.client_locations (id, client_id, name, address, city) VALUES
 ('33333333-3333-3333-3333-333333333301','22222222-2222-2222-2222-222222222201','Prime Plaza — Floors 1-4','Prime Plaza, Westlands','Nairobi'),
 ('33333333-3333-3333-3333-333333333302','22222222-2222-2222-2222-222222222202','Block A & B','Green Valley Rd, Kilimani','Nairobi'),
 ('33333333-3333-3333-3333-333333333303','22222222-2222-2222-2222-222222222203','Corporate Tower — Level 7','Waiyaki Way','Nairobi'),
 ('33333333-3333-3333-3333-333333333304','22222222-2222-2222-2222-222222222204','Sunrise Court','Milimani','Nakuru');

INSERT INTO public.cleaning_services (id, name, description, estimated_duration_mins, required_staff, price) VALUES
 ('44444444-4444-4444-4444-444444444401','Office Cleaning','Daily office cleaning covering floors, desks, bins and washrooms.',180,2,8500),
 ('44444444-4444-4444-4444-444444444402','Deep Cleaning','Intensive scheduled deep clean of the entire premises.',480,4,32000),
 ('44444444-4444-4444-4444-444444444403','Residential Cleaning','Apartment and home cleaning for residential clients.',150,2,6000),
 ('44444444-4444-4444-4444-444444444404','Window Cleaning','Interior and exterior glass and facade cleaning.',240,3,15000),
 ('44444444-4444-4444-4444-444444444405','Commercial Cleaning','Retail and commercial floor space cleaning programme.',300,3,18000),
 ('44444444-4444-4444-4444-444444444406','Post-Construction Cleaning','Debris removal and finish cleaning after construction works.',600,5,45000);

INSERT INTO public.service_checklist_templates (service_id, title, sort_order) VALUES
 ('44444444-4444-4444-4444-444444444401','Sweep floors',1),
 ('44444444-4444-4444-4444-444444444401','Mop floors',2),
 ('44444444-4444-4444-4444-444444444401','Clean desks',3),
 ('44444444-4444-4444-4444-444444444401','Empty bins',4),
 ('44444444-4444-4444-4444-444444444401','Clean windows',5),
 ('44444444-4444-4444-4444-444444444401','Clean washrooms',6),
 ('44444444-4444-4444-4444-444444444401','Restock supplies',7);

INSERT INTO public.cleaning_jobs (id, job_code, client_id, location_id, service_id, supervisor_id, scheduled_date, start_time, end_time, priority, status, instructions) VALUES
 ('55555555-5555-5555-5555-555555555501','JOB-1041','22222222-2222-2222-2222-222222222201','33333333-3333-3333-3333-333333333301','44444444-4444-4444-4444-444444444401','11111111-1111-1111-1111-111111111102',CURRENT_DATE,'08:00','11:00','high','in_progress','Reception and boardroom to be finished before 09:30.'),
 ('55555555-5555-5555-5555-555555555502','JOB-1042','22222222-2222-2222-2222-222222222203','33333333-3333-3333-3333-333333333303','44444444-4444-4444-4444-444444444404','11111111-1111-1111-1111-111111111102',CURRENT_DATE,'12:00','16:00','medium','assigned','Use safety harness for exterior panes.'),
 ('55555555-5555-5555-5555-555555555503','JOB-1043','22222222-2222-2222-2222-222222222202','33333333-3333-3333-3333-333333333302','44444444-4444-4444-4444-444444444403','11111111-1111-1111-1111-111111111102',CURRENT_DATE + 1,'09:00','12:00','medium','scheduled','Two units in Block B, keys at the gate office.'),
 ('55555555-5555-5555-5555-555555555504','JOB-1044','22222222-2222-2222-2222-222222222204','33333333-3333-3333-3333-333333333304','44444444-4444-4444-4444-444444444402','11111111-1111-1111-1111-111111111103',CURRENT_DATE + 2,'08:00','16:00','critical','scheduled','Full deep clean before handover inspection.'),
 ('55555555-5555-5555-5555-555555555505','JOB-1039','22222222-2222-2222-2222-222222222201','33333333-3333-3333-3333-333333333301','44444444-4444-4444-4444-444444444401','11111111-1111-1111-1111-111111111102',CURRENT_DATE - 1,'08:00','11:00','medium','completed','Routine daily clean.'),
 ('55555555-5555-5555-5555-555555555506','JOB-1038','22222222-2222-2222-2222-222222222203','33333333-3333-3333-3333-333333333303','44444444-4444-4444-4444-444444444406','11111111-1111-1111-1111-111111111103',CURRENT_DATE - 3,'07:00','17:00','high','completed','Post-construction handover clean.');

INSERT INTO public.job_assignments (job_id, employee_id) VALUES
 ('55555555-5555-5555-5555-555555555501','11111111-1111-1111-1111-111111111201'),
 ('55555555-5555-5555-5555-555555555501','11111111-1111-1111-1111-111111111202'),
 ('55555555-5555-5555-5555-555555555502','11111111-1111-1111-1111-111111111203'),
 ('55555555-5555-5555-5555-555555555503','11111111-1111-1111-1111-111111111202'),
 ('55555555-5555-5555-5555-555555555504','11111111-1111-1111-1111-111111111204'),
 ('55555555-5555-5555-5555-555555555504','11111111-1111-1111-1111-111111111205'),
 ('55555555-5555-5555-5555-555555555505','11111111-1111-1111-1111-111111111201'),
 ('55555555-5555-5555-5555-555555555506','11111111-1111-1111-1111-111111111205');

INSERT INTO public.job_checklist_items (job_id, title, sort_order, completed) VALUES
 ('55555555-5555-5555-5555-555555555501','Sweep floors',1,true),
 ('55555555-5555-5555-5555-555555555501','Mop floors',2,true),
 ('55555555-5555-5555-5555-555555555501','Clean desks',3,true),
 ('55555555-5555-5555-5555-555555555501','Empty bins',4,true),
 ('55555555-5555-5555-5555-555555555501','Clean windows',5,false),
 ('55555555-5555-5555-5555-555555555501','Clean washrooms',6,false),
 ('55555555-5555-5555-5555-555555555501','Restock supplies',7,false);

INSERT INTO public.equipment (name, asset_code, category, status, location, assigned_employee_id) VALUES
 ('Industrial Vacuum','EQ-001','Machines','assigned','Prime Plaza','11111111-1111-1111-1111-111111111201'),
 ('Floor Polisher','EQ-002','Machines','available','Eldoret HQ',NULL),
 ('Pressure Washer','EQ-003','Machines','maintenance','Nairobi Store',NULL),
 ('Window Cleaning Kit','EQ-004','Tools','assigned','Corporate Tower','11111111-1111-1111-1111-111111111203'),
 ('Safety Harness Set','EQ-005','Protective Equipment','available','Nairobi Store',NULL),
 ('Wet & Dry Vacuum','EQ-006','Machines','damaged','Nakuru Store',NULL);

INSERT INTO public.supplies (name, unit, current_stock, minimum_stock, location) VALUES
 ('Disinfectant Concentrate','litre',48,20,'Nairobi Store'),
 ('Nitrile Gloves','pair',35,50,'Nairobi Store'),
 ('Microfibre Mops','unit',12,10,'Eldoret HQ'),
 ('Buckets','unit',24,10,'Eldoret HQ'),
 ('Trash Bags','roll',6,15,'Nakuru Store'),
 ('Paper Towels','pack',0,12,'Nakuru Store'),
 ('Glass Cleaner','litre',22,10,'Nairobi Store');

INSERT INTO public.leave_requests (employee_id, leave_type_id, start_date, end_date, reason, status) VALUES
 ('11111111-1111-1111-1111-111111111202',(SELECT id FROM public.leave_types WHERE name='Annual Leave'),CURRENT_DATE + 6,CURRENT_DATE + 10,'Family holiday','pending'),
 ('11111111-1111-1111-1111-111111111203',(SELECT id FROM public.leave_types WHERE name='Sick Leave'),CURRENT_DATE - 2,CURRENT_DATE - 1,'Flu, doctor advised rest','approved'),
 ('11111111-1111-1111-1111-111111111204',(SELECT id FROM public.leave_types WHERE name='Emergency Leave'),CURRENT_DATE + 1,CURRENT_DATE + 2,'Family emergency upcountry','supervisor_approved');

INSERT INTO public.attendance (employee_id, work_date, clock_in, clock_out, status) VALUES
 ('11111111-1111-1111-1111-111111111201',CURRENT_DATE, now() - interval '3 hours', NULL,'present'),
 ('11111111-1111-1111-1111-111111111202',CURRENT_DATE, now() - interval '2 hours', NULL,'late'),
 ('11111111-1111-1111-1111-111111111203',CURRENT_DATE, now() - interval '4 hours', NULL,'present'),
 ('11111111-1111-1111-1111-111111111204',CURRENT_DATE, NULL, NULL,'absent');

INSERT INTO public.issues (title, description, category, location, priority, status, reported_by, job_id) VALUES
 ('Pressure washer not starting','Unit trips the breaker when powered on.','equipment','Nairobi Store','high','in_progress','11111111-1111-1111-1111-111111111203',NULL),
 ('Client requested re-clean of boardroom','Carpet stain still visible after service.','client','Prime Plaza','medium','open','11111111-1111-1111-1111-111111111201','55555555-5555-5555-5555-555555555505'),
 ('Low stock of trash bags','Nakuru store almost out of trash bags.','supply','Nakuru Store','low','open','11111111-1111-1111-1111-111111111205',NULL);

INSERT INTO public.client_feedback (client_id, job_id, rating, comment, recorded_by) VALUES
 ('22222222-2222-2222-2222-222222222201','55555555-5555-5555-5555-555555555505',5,'Excellent turnaround, reception looked spotless.','11111111-1111-1111-1111-111111111102'),
 ('22222222-2222-2222-2222-222222222203','55555555-5555-5555-5555-555555555506',4,'Great work overall, minor dust left on window sills.','11111111-1111-1111-1111-111111111103');

INSERT INTO public.announcements (title, message, priority, target) VALUES
 ('New safety briefing every Monday','All field teams must attend the 07:30 safety briefing before deployment.','high','all'),
 ('Updated uniform policy','Branded uniforms and ID badges are mandatory on all client sites.','normal','staff');

INSERT INTO public.training_modules (title, description, instructions, required) VALUES
 ('Chemical Handling & Safety','Safe dilution, storage and handling of cleaning chemicals.','Read the guide and confirm completion.',true),
 ('Client Site Etiquette','Professional conduct while working on client premises.','Watch the briefing and mark complete.',true),
 ('Machine Operation Basics','Correct use of vacuums, polishers and pressure washers.','Complete supervised practice before marking done.',false);

INSERT INTO public.weekly_updates (supervisor_id, period_start, period_end, total_staff, active_staff, absent_staff, jobs_assigned, jobs_completed, jobs_pending, jobs_delayed, staff_performance, client_feedback, problems, recommendations, status) VALUES
 ('11111111-1111-1111-1111-111111111102',CURRENT_DATE - 7,CURRENT_DATE - 1,3,3,0,14,12,2,1,'Team performing consistently; Peter leading well.','Positive feedback from Prime Business Centre.','Pressure washer out of service.','Approve replacement pressure washer.','submitted');

INSERT INTO public.audit_logs (actor_id, actor_name, actor_role, action, target_type, description) VALUES
 ('11111111-1111-1111-1111-111111111101','System Administrator','admin','Added staff member','employee','Created employee record for Brian Mwangi'),
 ('11111111-1111-1111-1111-111111111102','James Mwangi','supervisor','Submitted weekly report','weekly_report','Weekly operations report submitted for review'),
 ('11111111-1111-1111-1111-111111111101','System Administrator','admin','Verified staff document','employee_document','Verified National ID document');
