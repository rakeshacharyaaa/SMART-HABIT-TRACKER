# Supabase Setup

## 1. Create Supabase Project
1. Go to https://app.supabase.com/ and create a new project (or use an existing one).
2. In your project dashboard, go to Project Settings > API.
3. Copy the `Project URL` and `anon public` key.

## 2. Set Environment Variables
1. In the root of your project, create a file named `.env.local` (if it doesn't exist).
2. Add the following lines to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

3. Replace the values with your actual Supabase credentials.

## 3. Set Up Database Schema
1. In your Supabase project dashboard, go to the SQL Editor.
2. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor.
3. This will create all necessary tables, indexes, and Row Level Security policies.

## 4. Enable Realtime
1. In your Supabase dashboard, go to Database > Replication.
2. Enable realtime for the following tables:
   - `habits`
   - `habit_completions`
   - `habit_streaks`

## 5. Restart Your App
1. Restart your dev server after adding environment variables:
   ```
   pnpm run dev
   ```

## Features Enabled
- ✅ User authentication (signup/login)
- ✅ Real-time habit tracking
- ✅ Live dashboard updates
- ✅ Automatic streak calculation
- ✅ Row Level Security (users can only see their own data)
- ✅ Real-time subscriptions for instant updates
