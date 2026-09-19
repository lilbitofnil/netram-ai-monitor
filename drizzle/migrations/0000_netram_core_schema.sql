-- Roles
create type public.app_role as enum ('admin','inspection_officer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  photo_url text,
  district text not null default 'Unassigned',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles select" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, photo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.email,''),
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'inspection_officer')
  on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- NGOs
create table public.ngos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  state text not null,
  district text not null,
  latitude double precision not null,
  longitude double precision not null,
  compliance integer not null default 0,
  cctv_status text not null default 'offline',
  risk_level text not null default 'low',
  expected_attendance integer not null default 20,
  last_inspection date,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.ngos to authenticated, anon;
grant all on public.ngos to service_role;
alter table public.ngos enable row level security;
create policy "ngos readable" on public.ngos for select to authenticated, anon using (true);

-- Inspections
create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  officer_id uuid not null references auth.users(id) on delete cascade,
  inspection_type text not null default 'Surprise Inspection',
  attendance_count integer,
  expected_attendance integer,
  attendance_difference integer,
  attendance_confidence numeric,
  checklist jsonb not null default '[]'::jsonb,
  remarks text,
  status text not null default 'in_progress',
  location_verified boolean not null default false,
  distance_meters integer,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.inspections to authenticated;
grant all on public.inspections to service_role;
alter table public.inspections enable row level security;
create policy "own inspections select" on public.inspections for select to authenticated using (auth.uid() = officer_id);
create policy "own inspections insert" on public.inspections for insert to authenticated with check (auth.uid() = officer_id);
create policy "own inspections update" on public.inspections for update to authenticated using (auth.uid() = officer_id);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  officer_id uuid not null references auth.users(id) on delete cascade,
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  image_url text not null,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);
grant select, insert on public.evidence to authenticated;
grant all on public.evidence to service_role;
alter table public.evidence enable row level security;
create policy "own evidence select" on public.evidence for select to authenticated using (auth.uid() = officer_id);
create policy "own evidence insert" on public.evidence for insert to authenticated with check (auth.uid() = officer_id);

create table public.attendance_results (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  officer_id uuid not null references auth.users(id) on delete cascade,
  people_count integer not null,
  expected_count integer not null,
  difference integer not null,
  confidence numeric not null,
  status text not null,
  image_url text,
  created_at timestamptz not null default now()
);
grant select, insert on public.attendance_results to authenticated;
grant all on public.attendance_results to service_role;
alter table public.attendance_results enable row level security;
create policy "own attendance select" on public.attendance_results for select to authenticated using (auth.uid() = officer_id);
create policy "own attendance insert" on public.attendance_results for insert to authenticated with check (auth.uid() = officer_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  officer_id uuid not null references auth.users(id) on delete cascade,
  officer_name text not null default '',
  overall_compliance integer not null default 0,
  ai_summary text,
  status text not null default 'under_review',
  review_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);
grant select, insert on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "own reports select" on public.reports for select to authenticated using (auth.uid() = officer_id);
create policy "own reports insert" on public.reports for insert to authenticated with check (auth.uid() = officer_id);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  severity text not null default 'low',
  alert_type text not null default 'general',
  ngo_id uuid references public.ngos(id) on delete cascade,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
grant select on public.alerts to authenticated, anon;
grant all on public.alerts to service_role;
alter table public.alerts enable row level security;
create policy "alerts readable" on public.alerts for select to authenticated, anon using (true);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  target text not null default '',
  created_at timestamptz not null default now()
);
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;

-- Demo seed data
insert into public.ngos (name, city, state, district, latitude, longitude, compliance, cctv_status, risk_level, expected_attendance, last_inspection) values
('Sahyog Welfare Foundation','Chandigarh','Punjab','Chandigarh',30.7333,76.7794,92,'active','low',24,'2026-09-17'),
('Asha Deep NGO','Kolkata','West Bengal','Kolkata',22.5726,88.3639,78,'active','medium',30,'2026-09-11'),
('Prayas Foundation','Lucknow','Uttar Pradesh','Lucknow',26.8467,80.9462,64,'offline','high',18,'2026-08-29'),
('Ujjwal Bharti Society','Jaipur','Rajasthan','Jaipur',26.9124,75.7873,88,'active','low',22,'2026-09-14'),
('Jeevan Aadhar Trust','New Delhi','Delhi','South Delhi',28.6139,77.2090,54,'offline','critical',26,'2026-08-12');

insert into public.alerts (title, description, severity, alert_type, ngo_id, status)
select 'Attendance Mismatch Detected','AI-assisted count differed from the expected beneficiary attendance.','high','attendance', id, 'open' from public.ngos where name='Prayas Foundation';
insert into public.alerts (title, description, severity, alert_type, ngo_id, status)
select 'CCTV Cameras Offline','No camera heartbeat received in the last 48 hours.','critical','cctv', id, 'open' from public.ngos where name='Jeevan Aadhar Trust';
insert into public.alerts (title, description, severity, alert_type, ngo_id, status)
select 'Inspection Overdue','No field inspection recorded in the last 30 days.','medium','inspection', id, 'open' from public.ngos where name='Asha Deep NGO';
insert into public.alerts (title, description, severity, alert_type, ngo_id, status)
select 'Compliance Score Drop','Compliance decreased compared with the previous quarter.','medium','compliance', id, 'open' from public.ngos where name='Asha Deep NGO';
insert into public.alerts (title, description, severity, alert_type, ngo_id, status)
select 'Location Verification Issue','An officer submitted evidence from outside the permitted radius.','low','location', id, 'acknowledged' from public.ngos where name='Ujjwal Bharti Society';