create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('tap-media', 'tap-media', true)
on conflict (id) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text not null unique,
  city text not null default '',
  bio text not null default '',
  website text not null default '',
  mention text not null default '',
  avatar_url text not null default '',
  tags text[] not null default '{}',
  is_private boolean not null default false,
  verified_meet boolean not null default false,
  followers integer not null default 0,
  friends integer not null default 0,
  meet_taps integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  username text not null,
  city text not null default '',
  bio text not null default '',
  tags text[] not null default '{}',
  avatar_url text not null default '',
  relationship text not null default 'Follower',
  is_following boolean not null default false,
  is_private boolean not null default false,
  last_meet text,
  taps integer not null default 0,
  days_known integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  username text not null,
  city text not null default '',
  moment_type text not null default 'status',
  caption text not null default '',
  image_url text,
  signals integer not null default 0,
  liked_by_me boolean not null default false,
  saved boolean not null default false,
  created_label text not null default 'now',
  created_at timestamptz not null default now()
);

create table if not exists public.moment_comments (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  username text not null,
  image_url text not null,
  body text not null default '',
  featured boolean not null default false,
  is_friend boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text not null,
  actionable boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  username text not null,
  title text not null,
  featured boolean not null default false,
  is_friend boolean not null default false,
  viewers integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_news (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  title text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  request_type text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id, person_id, request_type)
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  username text not null,
  relationship text not null default 'Follower',
  last_meet text,
  taps integer not null default 0,
  days_known integer not null default 0,
  unread_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.seed_new_user_content(user_id uuid, username_value text, full_name_value text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ava_id uuid := gen_random_uuid();
  noah_id uuid := gen_random_uuid();
  emily_id uuid := gen_random_uuid();
  leo_id uuid := gen_random_uuid();
  ava_thread uuid := gen_random_uuid();
  noah_thread uuid := gen_random_uuid();
  leo_thread uuid := gen_random_uuid();
  ava_moment uuid := gen_random_uuid();
  noah_moment uuid := gen_random_uuid();
  leo_moment uuid := gen_random_uuid();
begin
  insert into public.people (
    id, owner_user_id, full_name, username, city, bio, tags, relationship, is_following, is_private, last_meet, taps, days_known, featured
  )
  values
    (ava_id, user_id, 'Ava Reed', 'ava.reed', 'Manchester', 'Coffee, long conversations, and elegant evenings.', '{"Coffee","Luxury","Friends"}', 'Friend', true, false, 'Soho House', 3, 18, true),
    (noah_id, user_id, 'Noah Vale', 'noah.vale', 'London', 'Building beautiful products around real people.', '{"Build","Design","City"}', 'Tap Connected', true, false, 'Shoreditch Studio', 2, 11, false),
    (emily_id, user_id, 'Emily Hart', 'emily.hart', 'Birmingham', 'Weekend edits, soft style, and thoughtful stories.', '{"Style","Travel","Moments"}', 'Follower', false, true, null, 0, 4, true),
    (leo_id, user_id, 'Leo Quinn', 'leo.quinn', 'Leeds', 'Night drives, cinema frames, and quiet confidence.', '{"Cars","Nightlife","Film"}', 'Met', true, false, 'Mayfair Rooftop', 5, 31, true)
  on conflict do nothing;

  insert into public.moments (id, owner_user_id, author_name, username, city, moment_type, caption, image_url, signals, liked_by_me, saved, created_label)
  values
    (ava_moment, user_id, 'Ava Reed', 'ava.reed', 'Manchester', 'photo', 'Late coffee, soft light, and one conversation worth keeping.', null, 1284, false, false, '2h ago'),
    (noah_moment, user_id, 'Noah Vale', 'noah.vale', 'London', 'thought', 'Tap should help people discover publicly and keep relationships privately.', null, 740, true, true, '5h ago'),
    (leo_moment, user_id, 'Leo Quinn', 'leo.quinn', 'Leeds', 'status', 'Rooftop tonight. Clean air, better people.', null, 960, false, false, '1d ago');

  insert into public.moment_comments (moment_id, author, body)
  values
    (ava_moment, 'Noah Vale', 'This feels premium.'),
    (ava_moment, full_name_value, 'Exactly the mood Tap should have.'),
    (noah_moment, 'Ava Reed', 'That split is what makes it different.');

  insert into public.stories (owner_user_id, author_name, username, image_url, body, featured, is_friend)
  values
    (user_id, 'Ava Reed', 'ava.reed', '', 'Friends first in stories.', false, true),
    (user_id, 'Leo Quinn', 'leo.quinn', '', 'Night drive notes.', false, true),
    (user_id, 'Emily Hart', 'emily.hart', '', 'Featured creator story.', true, false);

  insert into public.notifications (owner_user_id, notification_type, title, body, actionable)
  values
    (user_id, 'signal', '41 new signals', 'Your latest moment is getting attention.', false),
    (user_id, 'request', '5 follow requests', 'Private profile requests are waiting.', true),
    (user_id, 'tap', 'New TAP request', 'Emily Hart wants to connect.', true),
    (user_id, 'storyReply', 'Story reply from Ava', 'Replied to your story and moved into chat.', false);

  insert into public.live_sessions (owner_user_id, author_name, username, title, featured, is_friend, viewers)
  values
    (user_id, 'Ava Reed', 'ava.reed', 'Coffee walk live', false, true, 121),
    (user_id, 'Leo Quinn', 'leo.quinn', 'Night drive setup', true, false, 914);

  insert into public.daily_news (owner_user_id, category, title, summary)
  values
    (user_id, 'Culture', 'Luxury coffee lounges are becoming modern social hubs', 'Tap Daily News highlights spaces where discovery turns into real friendship.'),
    (user_id, 'Social', 'Private-mode communities are rising fast', 'People want calmer social spaces with trusted connections and less noise.'),
    (user_id, 'Tap Trend', 'Moments that feel editorial are outperforming casual posts', 'Premium typography, cleaner spacing, and strong identity are driving engagement.');

  insert into public.chat_threads (id, owner_user_id, full_name, username, relationship, last_meet, taps, days_known, unread_count)
  values
    (ava_thread, user_id, 'Ava Reed', 'ava.reed', 'Friend', 'Soho House', 3, 18, 2),
    (noah_thread, user_id, 'Noah Vale', 'noah.vale', 'Tap Connected', 'Shoreditch Studio', 2, 11, 0),
    (leo_thread, user_id, 'Leo Quinn', 'leo.quinn', 'Met', 'Mayfair Rooftop', 5, 31, 1);

  insert into public.chat_messages (thread_id, sender, body)
  values
    (ava_thread, 'them', 'Are you still coming to Soho later?'),
    (ava_thread, 'me', 'Yes. Twenty minutes.'),
    (noah_thread, 'them', 'The Public/Private split feels strong now.'),
    (leo_thread, 'them', 'Send me that rooftop moment later.');

  insert into public.connection_requests (owner_user_id, person_id, request_type, status)
  values
    (user_id, emily_id, 'follow', 'pending'),
    (user_id, emily_id, 'tap', 'pending')
  on conflict (owner_user_id, person_id, request_type) do nothing;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  username_value text := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  full_name_value text := coalesce(new.raw_user_meta_data->>'full_name', '');
begin
  insert into public.profiles (
    id,
    full_name,
    username,
    city,
    bio,
    website,
    mention,
    avatar_url,
    tags,
    is_private,
    verified_meet,
    followers,
    friends,
    meet_taps
  )
  values (
    new.id,
    full_name_value,
    username_value,
    '',
    '',
    '',
    '@' || username_value,
    '',
    '{}',
    false,
    false,
    0,
    0,
    0
  )
  on conflict (id) do nothing;

  perform public.seed_new_user_content(new.id, username_value, coalesce(nullif(full_name_value, ''), 'Tap User'));

  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute procedure public.handle_updated_at();

drop trigger if exists chat_threads_updated_at on public.chat_threads;
create trigger chat_threads_updated_at
before update on public.chat_threads
for each row
execute procedure public.handle_updated_at();

drop trigger if exists connection_requests_updated_at on public.connection_requests;
create trigger connection_requests_updated_at
before update on public.connection_requests
for each row
execute procedure public.handle_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.people enable row level security;
alter table public.moments enable row level security;
alter table public.moment_comments enable row level security;
alter table public.stories enable row level security;
alter table public.notifications enable row level security;
alter table public.live_sessions enable row level security;
alter table public.daily_news enable row level security;
alter table public.connection_requests enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "people_owner_all" on public.people;
create policy "people_owner_all" on public.people for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "moments_owner_all" on public.moments;
create policy "moments_owner_all" on public.moments for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "moment_comments_owner_select" on public.moment_comments;
create policy "moment_comments_owner_select"
on public.moment_comments
for select
using (
  exists (
    select 1 from public.moments
    where public.moments.id = public.moment_comments.moment_id
      and public.moments.owner_user_id = auth.uid()
  )
);

drop policy if exists "moment_comments_owner_insert" on public.moment_comments;
create policy "moment_comments_owner_insert"
on public.moment_comments
for insert
with check (
  exists (
    select 1 from public.moments
    where public.moments.id = public.moment_comments.moment_id
      and public.moments.owner_user_id = auth.uid()
  )
);

drop policy if exists "stories_owner_all" on public.stories;
create policy "stories_owner_all" on public.stories for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "notifications_owner_all" on public.notifications;
create policy "notifications_owner_all" on public.notifications for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "live_sessions_owner_all" on public.live_sessions;
create policy "live_sessions_owner_all" on public.live_sessions for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "daily_news_owner_all" on public.daily_news;
create policy "daily_news_owner_all" on public.daily_news for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "connection_requests_owner_all" on public.connection_requests;
create policy "connection_requests_owner_all" on public.connection_requests for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "chat_threads_owner_all" on public.chat_threads;
create policy "chat_threads_owner_all" on public.chat_threads for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

drop policy if exists "chat_messages_owner_select" on public.chat_messages;
create policy "chat_messages_owner_select"
on public.chat_messages
for select
using (
  exists (
    select 1 from public.chat_threads
    where public.chat_threads.id = public.chat_messages.thread_id
      and public.chat_threads.owner_user_id = auth.uid()
  )
);

drop policy if exists "chat_messages_owner_insert" on public.chat_messages;
create policy "chat_messages_owner_insert"
on public.chat_messages
for insert
with check (
  exists (
    select 1 from public.chat_threads
    where public.chat_threads.id = public.chat_messages.thread_id
      and public.chat_threads.owner_user_id = auth.uid()
  )
);

drop policy if exists "tap_media_public_read" on storage.objects;
create policy "tap_media_public_read"
on storage.objects
for select
using (bucket_id = 'tap-media');

drop policy if exists "tap_media_auth_upload" on storage.objects;
create policy "tap_media_auth_upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'tap-media');

drop policy if exists "tap_media_auth_update" on storage.objects;
create policy "tap_media_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'tap-media')
with check (bucket_id = 'tap-media');
