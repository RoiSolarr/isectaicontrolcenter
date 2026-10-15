-- =============================================================================
-- iSectAI Control Center — core multi-tenant schema
--
-- Design: a shared `core` schema for every business (tenant) plus one schema per
-- industry (`medical`, `field_service`).
--   * Shared foundation : industries, businesses, locations, staff, customers
--   * Industry records  : appointments (clinics) and jobs (field service)
--   * Platform access   : platform_admins (iSectAI staff), business_members (customers)
--
-- Every tenant-owned row carries business_id. Composite foreign keys
-- (child.business_id, child.parent_id) -> (parent.business_id, parent.id)
-- make it impossible for a row to reference another tenant's data,
-- even if application code has a bug.
-- =============================================================================

create schema if not exists core;
create schema if not exists medical;
create schema if not exists field_service;

-- Reference data ---------------------------------------------------------------
create table core.industries (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  sector       text not null,
  -- Tells the UI which operational table holds this industry's records.
  record_type  text not null check (record_type in ('appointment', 'job')),
  record_label text not null,
  created_at   timestamptz not null default now()
);

-- Tenants ----------------------------------------------------------------------
create table core.businesses (
  id               uuid primary key default gen_random_uuid(),
  industry_id      uuid not null references core.industries (id),
  tenant_code      text not null unique,
  name             text not null,
  legal_name       text not null,
  primary_contact  text not null,
  email            text not null,
  phone            text not null,
  city             text not null,
  state            text not null,
  timezone         text not null default 'America/Chicago',
  plan             text not null default 'growth'
                   check (plan in ('starter', 'growth', 'professional')),
  status           text not null default 'active'
                   check (status in ('onboarding', 'active', 'paused', 'suspended')),
  uptime_pct       numeric(4, 1) not null default 99.0 check (uptime_pct between 0 and 100),
  storage_used_gb  numeric(6, 2) not null default 0 check (storage_used_gb >= 0),
  storage_limit_gb numeric(6, 2) not null default 10 check (storage_limit_gb > 0),
  joined_at        date not null default current_date,
  created_at       timestamptz not null default now()
);

-- Shared foundation (all tenant-owned) ---------------------------------------
create table core.locations (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references core.businesses (id) on delete cascade,
  name         text not null,
  address_line text not null,
  city         text not null,
  state        text not null,
  postal_code  text not null,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (id, business_id)
);
create unique index locations_one_primary_per_business on core.locations (business_id) where is_primary;
create index locations_business_idx on core.locations (business_id);

create table core.staff (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references core.businesses (id) on delete cascade,
  location_id uuid,
  full_name   text not null,
  role        text not null,
  -- true for people who deliver the service (doctors, technicians)
  is_provider boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (id, business_id),
  foreign key (location_id, business_id) references core.locations (id, business_id)
);
create index staff_business_idx on core.staff (business_id);

create table core.customers (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references core.businesses (id) on delete cascade,
  display_name  text not null,
  contact_email text,
  phone         text,
  created_at    timestamptz not null default now(),
  unique (id, business_id)
);
create index customers_business_idx on core.customers (business_id);

-- Industry-specific records ----------------------------------------------------
create table medical.appointments (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references core.businesses (id) on delete cascade,
  location_id uuid not null,
  customer_id uuid not null,
  provider_id uuid,
  visit_type  text not null,
  starts_at   timestamptz not null,
  status      text not null default 'pending'
              check (status in ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
  created_at  timestamptz not null default now(),
  foreign key (location_id, business_id) references core.locations (id, business_id),
  foreign key (customer_id, business_id) references core.customers (id, business_id),
  foreign key (provider_id, business_id) references core.staff (id, business_id)
);
create index appointments_business_starts_idx on medical.appointments (business_id, starts_at desc);
create index appointments_business_status_idx on medical.appointments (business_id, status);

create table field_service.jobs (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references core.businesses (id) on delete cascade,
  location_id     uuid not null,
  customer_id     uuid not null,
  technician_id   uuid,
  service_type    text not null,
  service_address text not null,
  scheduled_at    timestamptz not null,
  status          text not null default 'scheduled'
                  check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at      timestamptz not null default now(),
  foreign key (location_id, business_id) references core.locations (id, business_id),
  foreign key (customer_id, business_id) references core.customers (id, business_id),
  foreign key (technician_id, business_id) references core.staff (id, business_id)
);
create index jobs_business_scheduled_idx on field_service.jobs (business_id, scheduled_at desc);
create index jobs_business_status_idx on field_service.jobs (business_id, status);

-- Platform activity feed -------------------------------------------------------
create table core.activity_events (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references core.businesses (id) on delete cascade,
  event_type  text not null,
  title       text not null,
  detail      text,
  created_at  timestamptz not null default now()
);
create index activity_events_created_idx on core.activity_events (created_at desc);
create index activity_events_business_idx on core.activity_events (business_id);

-- Who is allowed in? -----------------------------------------------------------
-- iSectAI staff: can open the admin dashboard and see every business.
create table core.platform_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  role       text not null default 'platform_admin' check (role in ('platform_admin', 'support')),
  created_at timestamptz not null default now()
);

-- Customer users: each belongs to one or more businesses and sees only those.
create table core.business_members (
  user_id     uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references core.businesses (id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'manager', 'member')),
  created_at  timestamptz not null default now(),
  primary key (user_id, business_id)
);
create index business_members_business_idx on core.business_members (business_id);