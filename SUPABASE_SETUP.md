# Tap + Supabase Setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run [supabase/schema.sql](/Users/harrkerataulakh/Documents/New%20project/supabase/schema.sql).
   - If you already ran an older version, run the new full file again so the extra Tap tables and seed logic are created.
3. Copy `.env.example` to `.env`.
4. Fill in:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. In Supabase Auth settings:
   - add your local app URL, for example `http://localhost:5173`
   - decide whether email confirmation is required

6. In Supabase Realtime:
   - make sure your project has Realtime enabled
   - if needed, add the Tap public tables to the `supabase_realtime` publication

7. Storage:
   - the schema creates a public bucket named `tap-media`
   - rerun the schema if the bucket/policies were not created yet

8. Start the app:

```bash
npm install
npm run dev
```

What is connected now:
- Supabase auth signup/login/session restore
- `profiles` table sync for identity data
- profile updates and private-mode updates
- avatar sync to Supabase
- demo people loaded from Supabase
- moments feed loaded and updated from Supabase
- moment comments saved in Supabase
- stories loaded and created in Supabase
- notifications loaded and created in Supabase
- unified chat threads and messages loaded/sent in Supabase
- live sessions loaded from Supabase
- daily news loaded from Supabase
- follow and TAP request records stored in Supabase
- avatar, story, and moment uploads can use Supabase Storage
- realtime refresh is wired for messages, notifications, live sessions, and moments

What is still demo/local for now:
- full multi-user acceptance flows for other people approving requests
- broader cross-user network logic beyond the signed-in user dataset
- true push-style UI state instead of refresh-after-change in every interaction path

Tables created by the schema:
- `profiles`
- `people`
- `moments`
- `moment_comments`
- `stories`
- `notifications`
- `live_sessions`
- `daily_news`
- `connection_requests`
- `chat_threads`
- `chat_messages`
- storage bucket: `tap-media`

Notes:
- New users get seeded Tap demo content automatically through the database trigger.
- Search currently uses the `people` table loaded for the signed-in user experience.
- `follow` and `TAP` now update backend-backed people/chat/profile counters and request records, but the broader social graph is still a simplified product model.
- Run the full schema again if you previously stopped at an older version, because `live_sessions`, `daily_news`, and `connection_requests` were added later.
- Storage uploads use the Supabase `tap-media` bucket when environment keys are present.
- Realtime listeners refresh app data when supported tables change.
