-- =============================================================================
-- iSectAI Control Center — fictional sample data
--
-- Everything here is made up. Runs automatically on `npm run db:reset`
-- (local Supabase CLI). For a hosted project, paste it into the SQL editor.
--
-- Dates are relative to "now", so the dashboard always looks current.
-- Row counts match the design mockups:
--   30-day records  Clearview 482 · Lakefront 336 · Northstar 430  (= 1,248)
--   Open records    18 + 11 + 13 = 42      All-time records: 8,642
-- =============================================================================

-- 1. Demo accounts (DEV ONLY — change or delete these before going live) --------
--    Admin:    alex.morgan@isectai.com   /  ChangeMe!2026   (iSectAI staff)
--    Customer: office@lakefront.example  /  ChangeMe!2026   (Lakefront staff;
--              proves a customer account is rejected by the admin dashboard)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', '9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10',
   'authenticated', 'authenticated', 'alex.morgan@isectai.com',
   crypt('ChangeMe!2026', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Alex Morgan"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36',
   'authenticated', 'authenticated', 'office@lakefront.example',
   crypt('ChangeMe!2026', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Lakefront Front Desk"}',
   now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values
  (gen_random_uuid(), '9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10', '9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10',
   jsonb_build_object('sub', '9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10', 'email', 'alex.morgan@isectai.com', 'email_verified', true),
   'email', now(), now(), now()),
  (gen_random_uuid(), '5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36', '5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36',
   jsonb_build_object('sub', '5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36', 'email', 'office@lakefront.example', 'email_verified', true),
   'email', now(), now(), now());

insert into core.platform_admins (user_id, full_name, role) values
  ('9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10', 'Alex Morgan', 'platform_admin');

-- 2. Industries --------------------------------------------------------------------
insert into core.industries (id, slug, name, sector, record_type, record_label) values
  ('a0000000-0000-4000-8000-000000000001', 'medical-clinic', 'Medical clinic', 'Healthcare', 'appointment', 'Appointments'),
  ('a0000000-0000-4000-8000-000000000002', 'plumbing', 'Plumbing', 'Home services', 'job', 'Service jobs');

-- 3. Businesses (tenants) ----------------------------------------------------------
insert into core.businesses (
  id, industry_id, tenant_code, name, legal_name, primary_contact, email, phone,
  city, state, timezone, plan, status, uptime_pct, storage_used_gb, storage_limit_gb, joined_at
) values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'b_clv_2026_01',
   'Clearview Family Clinic', 'Clearview Family Medicine, PLLC', 'Dr. Maya Reynolds',
   'admin@clearview.example', '(512) 555-0148', 'Austin', 'TX', 'America/Chicago',
   'growth', 'active', 92.0, 6.8, 10, '2026-01-12'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'b_lfo_2026_01',
   'Lakefront Orthopedics', 'Lakefront Ortho Group, LLC', 'Dr. Oliver Grant',
   'office@lakefront.example', '(312) 555-0186', 'Chicago', 'IL', 'America/Chicago',
   'professional', 'active', 87.0, 6.8, 10, '2026-03-03'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002', 'b_nph_2026_01',
   'Northstar Plumbing & Heating', 'Northstar Mechanical, Inc.', 'Jamie Foster',
   'dispatch@northstar.example', '(303) 555-0191', 'Denver', 'CO', 'America/Denver',
   'growth', 'active', 96.0, 6.8, 10, '2026-05-22');

-- Customer-side login for Lakefront (see demo accounts above)
insert into core.business_members (user_id, business_id, role) values
  ('5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36', 'b0000000-0000-4000-8000-000000000002', 'manager');

-- 4. Locations ---------------------------------------------------------------------
insert into core.locations (id, business_id, name, address_line, city, state, postal_code, is_primary) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Westlake clinic', '2401 Westlake Ave, Suite 210', 'Austin', 'TX', '78746', true),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'South Austin clinic', '1200 S Lamar Blvd', 'Austin', 'TX', '78704', false),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Harbor Drive office', '815 North Harbor Drive, Floor 4', 'Chicago', 'IL', '60611', true),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000003', 'West 38th shop', '4730 West 38th Avenue', 'Denver', 'CO', '80212', true),
  ('c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003', 'Lakewood dispatch yard', '1650 Kipling Street', 'Lakewood', 'CO', '80215', false);

-- 5. Staff (12 + 9 + 16 = 37) ------------------------------------------------------
-- Providers first, with fixed ids so the sample appointments/jobs can reference them.
insert into core.staff (id, business_id, location_id, full_name, role, is_provider) values
  ('e0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Dr. Maya Reynolds', 'Family physician', true),
  ('e0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Dr. Ethan Cole', 'Family physician', true),
  ('e0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'Dr. Priya Shah', 'Internal medicine physician', true),
  ('e0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Dr. Oliver Grant', 'Orthopedic surgeon', true),
  ('e0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Dr. Hannah Brooks', 'Sports medicine physician', true),
  ('e0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Dr. James Wu', 'Musculoskeletal radiologist', true),
  ('e0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Luis Ortega', 'Master plumber', true),
  ('e0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Taylor Greene', 'Journeyman plumber', true),
  ('e0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'Casey Bell', 'HVAC technician', true);

insert into core.staff (business_id, location_id, full_name, role, is_provider) values
  -- Clearview (9 more)
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'Marcus Webb', 'Nurse practitioner', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Lena Ortiz', 'Registered nurse', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Dev Patel', 'Registered nurse', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Ruth Alvarez', 'Medical assistant', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'Tomas Nguyen', 'Medical assistant', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Grace Holloway', 'Front desk lead', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'Ben Carter', 'Front desk', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Sofia Marin', 'Billing specialist', false),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Ian Brooks', 'Clinic manager', false),
  -- Lakefront (6 more)
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Elena Park', 'Physical therapist', false),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Marcus Lee', 'Physical therapist', false),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Nora Quinn', 'Orthopedic physician assistant', false),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Carla Mendes', 'X-ray technologist', false),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Peter Hale', 'Front desk coordinator', false),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'Dana Whitfield', 'Practice manager', false),
  -- Northstar (13 more)
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Marco Silva', 'Plumber', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Priya Nair', 'Plumber', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'Devon Hart', 'HVAC technician', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'Ana Ruiz', 'HVAC technician', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Kofi Mensah', 'Drain specialist', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'Jordan Blake', 'Boiler technician', true),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Eli Navarro', 'Apprentice', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'Hana Kobayashi', 'Apprentice', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Rosa Delgado', 'Dispatcher', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Walt Morrison', 'Dispatcher', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Bridget Shaw', 'Office manager', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Victor Lang', 'Estimator', false),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'Maya Kline', 'Customer service', false);

-- 6. Customers (1,246 + 824 + 967) -------------------------------------------------
-- 6a. Named customers used in the sample appointments / jobs below
insert into core.customers (id, business_id, display_name, contact_email, phone, created_at) values
  ('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Jordan Lee', 'jordan.lee@example.test', '(555) 0101-0001', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'Casey Morgan', 'casey.morgan@example.test', '(555) 0101-0002', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Riley Thompson', 'riley.thompson@example.test', '(555) 0101-0003', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000001', 'Avery Chen', 'avery.chen@example.test', '(555) 0101-0004', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Quinn Brooks', 'quinn.brooks@example.test', '(555) 0101-0005', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Taylor Reed', 'taylor.reed@example.test', '(555) 0102-0001', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000002', 'Drew Patel', 'drew.patel@example.test', '(555) 0102-0002', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000002', 'Sam Rivera', 'sam.rivera@example.test', '(555) 0102-0003', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000002', 'Alex Kim', 'alex.kim@example.test', '(555) 0102-0004', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000002', 'Morgan Ellis', 'morgan.ellis@example.test', '(555) 0102-0005', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000003', 'Morgan Hayes', 'morgan.hayes@example.test', '(555) 0103-0001', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000003', 'Dana Mitchell', 'dana.mitchell@example.test', '(555) 0103-0002', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000003', 'Cameron Price', 'cameron.price@example.test', '(555) 0103-0003', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000003', 'Skyler James', 'skyler.james@example.test', '(555) 0103-0004', now() - interval '45 days'),
  ('d0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000003', 'Rowan Blake', 'rowan.blake@example.test', '(555) 0103-0005', now() - interval '45 days');

-- 6b. Generated customers (deterministic, so every reset gives the same data)
do $$
declare
  cfg record;
  first_names text[] := array[
    'Jordan','Casey','Riley','Avery','Quinn','Taylor','Morgan','Alex','Sam','Drew','Cameron','Skyler',
    'Rowan','Jamie','Robin','Dana','Harper','Reese','Emerson','Finley','Kai','Logan','Parker','Sage'];
  last_names text[] := array[
    'Lee','Morgan','Thompson','Chen','Brooks','Reed','Patel','Rivera','Kim','Ellis','Hayes','Mitchell',
    'Price','James','Blake','Foster','Nguyen','Garcia','Bennett','Sullivan','Ortiz','Hughes','Coleman','Dawson'];
begin
  for cfg in
    select * from (values
      ('b0000000-0000-4000-8000-000000000001'::uuid, 'clv', 1241, 270),
      ('b0000000-0000-4000-8000-000000000002'::uuid, 'lfo',  819, 220),
      ('b0000000-0000-4000-8000-000000000003'::uuid, 'nph',  962, 140)
    ) as t(business_id, code, extra_customers, span_days)
  loop
    insert into core.customers (business_id, display_name, contact_email, phone, created_at)
    select
      cfg.business_id,
      first_names[1 + (g % 24)] || ' ' || last_names[1 + ((g / 24) % 24)],
      'customer' || g || '.' || cfg.code || '@example.test',
      '(555) 01' || lpad((g % 100)::text, 2, '0') || '-' || lpad(((g * 37) % 10000)::text, 4, '0'),
      now() - ((g * 193) % (cfg.span_days * 1440)) * interval '1 minute'
    from generate_series(1, cfg.extra_customers) as g;
  end loop;
end
$$;

-- 7. Appointments (clinics) --------------------------------------------------------
-- 7a. Today's and tomorrow's visible rows (all "open")
insert into medical.appointments (business_id, location_id, customer_id, provider_id, visit_type, starts_at, status, created_at) values
  -- Clearview
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001', 'Annual wellness visit',   (current_date + time '10:30') at time zone 'America/Chicago', 'confirmed',  now() - interval '2 days'),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000002', 'Follow-up consultation', (current_date + time '11:15') at time zone 'America/Chicago', 'checked_in', now() - interval '3 days'),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000001', 'Pediatric check-up',     (current_date + time '13:00') at time zone 'America/Chicago', 'confirmed',  now() - interval '4 days'),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000004', 'e0000000-0000-4000-8000-000000000003', 'Lab results review',    (current_date + time '14:30') at time zone 'America/Chicago', 'pending',    now() - interval '1 day'),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000005', 'e0000000-0000-4000-8000-000000000002', 'New patient visit',      ((current_date + 1) + time '09:00') at time zone 'America/Chicago', 'confirmed', now() - interval '2 days'),
  -- Lakefront
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000006', 'e0000000-0000-4000-8000-000000000004', 'Knee mobility evaluation', (current_date + time '09:45') at time zone 'America/Chicago', 'checked_in', now() - interval '3 days'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000005', 'Post-op follow-up',       (current_date + time '10:30') at time zone 'America/Chicago', 'confirmed',  now() - interval '5 days'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000008', 'e0000000-0000-4000-8000-000000000004', 'Shoulder consultation',   (current_date + time '13:15') at time zone 'America/Chicago', 'confirmed',  now() - interval '2 days'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000009', 'e0000000-0000-4000-8000-000000000005', 'Physical therapy review', (current_date + time '15:00') at time zone 'America/Chicago', 'pending',    now() - interval '1 day'),
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000010', 'e0000000-0000-4000-8000-000000000006', 'Imaging review',         ((current_date + 1) + time '08:30') at time zone 'America/Chicago', 'confirmed', now() - interval '2 days');

-- 7b. Bulk generated history + extra open rows
do $$
declare
  cfg record;
  locs uuid[];
  providers uuid[];
  custs uuid[];
  visit_types text[];
  open_statuses text[] := array['confirmed', 'pending', 'confirmed', 'checked_in'];
  tz text;
  history_days int;
begin
  for cfg in
    -- recent_closed: past visits created in the last 30 days
    -- historic:      older visits (before the last 30 days)
    -- open_extra:    additional upcoming visits, so open totals are 18 and 11
    select * from (values
      ('b0000000-0000-4000-8000-000000000001'::uuid, 464, 3100, 13,
        array['Annual wellness visit', 'Follow-up consultation', 'Pediatric check-up', 'Lab results review',
              'New patient visit', 'Sick visit', 'Vaccination appointment']),
      ('b0000000-0000-4000-8000-000000000002'::uuid, 325, 2244, 6,
        array['Knee mobility evaluation', 'Post-op follow-up', 'Shoulder consultation',
              'Physical therapy review', 'Imaging review', 'Initial consultation'])
    ) as t(business_id, recent_closed, historic, open_extra, visit_types_list)
  loop
    visit_types := cfg.visit_types_list;

    select array_agg(id order by id) into locs from core.locations where business_id = cfg.business_id;
    select array_agg(id order by id) into providers from core.staff where business_id = cfg.business_id and is_provider;
    select array_agg(id order by id) into custs from core.customers where business_id = cfg.business_id;
    select timezone, greatest((current_date - joined_at) - 36, 10)
      into tz, history_days
      from core.businesses where id = cfg.business_id;

    -- Recent past visits: 1-24 days ago, 08:00-16:30 local time
    insert into medical.appointments (business_id, location_id, customer_id, provider_id, visit_type, starts_at, status, created_at)
    select
      cfg.business_id,
      locs[1 + (g % cardinality(locs))],
      custs[1 + ((g * 31) % cardinality(custs))],
      providers[1 + ((g * 7) % cardinality(providers))],
      visit_types[1 + ((g * 5) % cardinality(visit_types))],
      slot.starts_at,
      case when g % 11 = 0 then 'cancelled' when g % 23 = 0 then 'no_show' else 'completed' end,
      slot.starts_at - ((g % 3) + 1) * interval '1 day'
    from generate_series(1, cfg.recent_closed) as g
    cross join lateral (
      select (((current_date - (1 + (g * 13) % 24))::timestamp + interval '8 hours'
               + (g % 18) * interval '30 minutes') at time zone tz) as starts_at
    ) as slot;

    -- Historic visits: from 33 days ago back to shortly after the business joined
    insert into medical.appointments (business_id, location_id, customer_id, provider_id, visit_type, starts_at, status, created_at)
    select
      cfg.business_id,
      locs[1 + (g % cardinality(locs))],
      custs[1 + ((g * 31) % cardinality(custs))],
      providers[1 + ((g * 7) % cardinality(providers))],
      visit_types[1 + ((g * 5) % cardinality(visit_types))],
      slot.starts_at,
      case when g % 11 = 0 then 'cancelled' when g % 23 = 0 then 'no_show' else 'completed' end,
      slot.starts_at - ((g % 3) + 1) * interval '1 day'
    from generate_series(1, cfg.historic) as g
    cross join lateral (
      select (((current_date - (33 + (g * 17) % history_days))::timestamp + interval '8 hours'
               + (g % 18) * interval '30 minutes') at time zone tz) as starts_at
    ) as slot;

    -- Extra upcoming (open) visits over the next three days
    insert into medical.appointments (business_id, location_id, customer_id, provider_id, visit_type, starts_at, status, created_at)
    select
      cfg.business_id,
      locs[1 + (g % cardinality(locs))],
      custs[1 + ((g * 31) % cardinality(custs))],
      providers[1 + ((g * 7) % cardinality(providers))],
      visit_types[1 + ((g * 5) % cardinality(visit_types))],
      (((current_date + (g % 3))::timestamp + interval '8 hours' + (g % 16) * interval '30 minutes') at time zone tz),
      open_statuses[1 + (g % 4)],
      now() - ((g * 97) % 2880) * interval '1 minute'
    from generate_series(1, cfg.open_extra) as g;
  end loop;
end
$$;

-- 8. Jobs (Northstar Plumbing & Heating) ---------------------------------------------
insert into field_service.jobs (business_id, location_id, customer_id, technician_id, service_type, service_address, scheduled_at, status, created_at) values
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000011', 'e0000000-0000-4000-8000-000000000007', 'Water heater repair', '1128 Pine St, Denver',        (current_date + time '10:00') at time zone 'America/Denver', 'in_progress', now() - interval '2 days'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000012', 'e0000000-0000-4000-8000-000000000008', 'Drain inspection',     '350 W 12th Ave, Denver',     (current_date + time '11:30') at time zone 'America/Denver', 'scheduled',   now() - interval '3 days'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000013', 'e0000000-0000-4000-8000-000000000007', 'Leak detection',       '88 Birch Ct, Lakewood',      (current_date + time '13:00') at time zone 'America/Denver', 'scheduled',   now() - interval '1 day'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000014', 'e0000000-0000-4000-8000-000000000009', 'Boiler maintenance',   '7140 Lowell Blvd, Westminster', (current_date + time '14:30') at time zone 'America/Denver', 'in_progress', now() - interval '4 days'),
  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000015', 'e0000000-0000-4000-8000-000000000008', 'Pipe replacement',     '26 Aspen Way, Arvada',       ((current_date + 1) + time '08:00') at time zone 'America/Denver', 'scheduled', now() - interval '2 days');

do $$
declare
  business uuid := 'b0000000-0000-4000-8000-000000000003';
  locs uuid[];
  technicians uuid[];
  custs uuid[];
  service_types text[] := array[
    'Water heater repair', 'Drain inspection', 'Leak detection', 'Boiler maintenance',
    'Pipe replacement', 'Fixture installation', 'Sewer camera inspection', 'Furnace tune-up'];
  streets text[] := array[
    'Pine St', 'W 12th Ave', 'Birch Ct', 'Lowell Blvd', 'Aspen Way',
    'Colfax Ave', 'Wadsworth Blvd', 'Sheridan Blvd', 'Federal Blvd', 'Alameda Ave'];
  towns text[] := array['Denver', 'Lakewood', 'Westminster', 'Arvada', 'Wheat Ridge', 'Englewood'];
  open_statuses text[] := array['scheduled', 'in_progress', 'scheduled', 'scheduled'];
  tz text;
  history_days int;
begin
  select array_agg(id order by id) into locs from core.locations where business_id = business;
  select array_agg(id order by id) into technicians from core.staff where business_id = business and is_provider;
  select array_agg(id order by id) into custs from core.customers where business_id = business;
  select timezone, greatest((current_date - joined_at) - 36, 10)
    into tz, history_days
    from core.businesses where id = business;

  -- 417 recent completed/cancelled jobs (last 24 days)
  insert into field_service.jobs (business_id, location_id, customer_id, technician_id, service_type, service_address, scheduled_at, status, created_at)
  select
    business,
    locs[1 + (g % cardinality(locs))],
    custs[1 + ((g * 31) % cardinality(custs))],
    technicians[1 + ((g * 7) % cardinality(technicians))],
    service_types[1 + ((g * 5) % cardinality(service_types))],
    (100 + (g * 37) % 9000)::text || ' ' || streets[1 + (g % cardinality(streets))] || ', ' || towns[1 + ((g * 3) % cardinality(towns))],
    slot.scheduled_at,
    case when g % 13 = 0 then 'cancelled' else 'completed' end,
    slot.scheduled_at - ((g % 3) + 1) * interval '1 day'
  from generate_series(1, 417) as g
  cross join lateral (
    select (((current_date - (1 + (g * 13) % 24))::timestamp + interval '7 hours'
             + (g % 20) * interval '30 minutes') at time zone tz) as scheduled_at
  ) as slot;

  -- 2,050 historic jobs
  insert into field_service.jobs (business_id, location_id, customer_id, technician_id, service_type, service_address, scheduled_at, status, created_at)
  select
    business,
    locs[1 + (g % cardinality(locs))],
    custs[1 + ((g * 31) % cardinality(custs))],
    technicians[1 + ((g * 7) % cardinality(technicians))],
    service_types[1 + ((g * 5) % cardinality(service_types))],
    (100 + (g * 37) % 9000)::text || ' ' || streets[1 + (g % cardinality(streets))] || ', ' || towns[1 + ((g * 3) % cardinality(towns))],
    slot.scheduled_at,
    case when g % 13 = 0 then 'cancelled' else 'completed' end,
    slot.scheduled_at - ((g % 3) + 1) * interval '1 day'
  from generate_series(1, 2050) as g
  cross join lateral (
    select (((current_date - (33 + (g * 17) % history_days))::timestamp + interval '7 hours'
             + (g % 20) * interval '30 minutes') at time zone tz) as scheduled_at
  ) as slot;

  -- 8 more upcoming (open) jobs, so open total is 13
  insert into field_service.jobs (business_id, location_id, customer_id, technician_id, service_type, service_address, scheduled_at, status, created_at)
  select
    business,
    locs[1 + (g % cardinality(locs))],
    custs[1 + ((g * 31) % cardinality(custs))],
    technicians[1 + ((g * 7) % cardinality(technicians))],
    service_types[1 + ((g * 5) % cardinality(service_types))],
    (100 + (g * 37) % 9000)::text || ' ' || streets[1 + (g % cardinality(streets))] || ', ' || towns[1 + ((g * 3) % cardinality(towns))],
    (((current_date + (g % 3))::timestamp + interval '7 hours' + (g % 16) * interval '30 minutes') at time zone tz),
    open_statuses[1 + (g % 4)],
    now() - ((g * 97) % 2880) * interval '1 minute'
  from generate_series(1, 8) as g;
end
$$;

-- 9. Activity feed -----------------------------------------------------------------------
insert into core.activity_events (business_id, event_type, title, detail, created_at) values
  ('b0000000-0000-4000-8000-000000000001', 'appointment_booked', 'New appointment booked',    'Pediatric check-up · Riley Thompson',        now() - interval '18 minutes'),
  ('b0000000-0000-4000-8000-000000000003', 'job_completed',      'Job marked complete',       'Sewer camera inspection · Wheat Ridge',      now() - interval '39 minutes'),
  ('b0000000-0000-4000-8000-000000000002', 'appointment_booked', 'New appointment booked',    'Shoulder consultation · Sam Rivera',         now() - interval '2 hours'),
  ('b0000000-0000-4000-8000-000000000002', 'schedule_synced',    'Provider schedule synced',  '3 providers · 0 conflicts',                  now() - interval '1 day'),
  ('b0000000-0000-4000-8000-000000000001', 'customer_added',     'New customer added',        'Jordan Lee',                                 now() - interval '1 day 3 hours'),
  ('b0000000-0000-4000-8000-000000000003', 'job_completed',      'Job marked complete',       'Furnace tune-up · Englewood',                now() - interval '1 day 5 hours'),
  ('b0000000-0000-4000-8000-000000000001', 'schedule_synced',    'Provider schedule synced',  '3 providers · 1 conflict resolved',          now() - interval '2 days'),
  ('b0000000-0000-4000-8000-000000000003', 'appointment_booked', 'New job scheduled',         'Pipe replacement · Rowan Blake',             now() - interval '2 days 2 hours'),
  ('b0000000-0000-4000-8000-000000000002', 'business_updated',   'Business profile updated',  'Primary contact confirmed',                  now() - interval '3 days'),
  ('b0000000-0000-4000-8000-000000000003', 'schedule_synced',    'Dispatch schedule synced',  '9 technicians · 0 conflicts',                now() - interval '4 days');