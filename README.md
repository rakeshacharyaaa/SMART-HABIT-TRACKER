# SMART-HABIT-TRACKER
A dark-themed Smart Habit Tracker app with glassmorphism UI that helps users build and maintain habits using streaks, points, levels, and virtual rewards. Features include daily habit check-ins, progress analytics, reminders, and a gamified dashboard for better engagement. Built with modern full-stack tools and Supabase for backend.

![CI](https://img.shields.io/github/actions/workflow/status/rakeshacharyaaa/SMART-HABIT-TRACKER/ci.yml?branch=main)
![Releases](https://img.shields.io/github/v/release/rakeshacharyaaa/SMART-HABIT-TRACKER)
![License](https://img.shields.io/badge/license-MIT-black)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-black)

## Quick start
- Clone or download ZIP
- `pnpm install` (or `npm install`)
- Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `pnpm run dev` then open http://localhost:3000

## Screenshots
Add screenshots to `public/` and reference here:

```markdown
![Dashboard](public/placeholder.jpg)
![Settings](public/placeholder-user.jpg)
```

## Releases
- Download prebuilt artifacts from the Releases tab: [Latest Release](https://github.com/rakeshacharyaaa/SMART-HABIT-TRACKER/releases)
- Artifacts include the `.next` build output and static `public/` assets in a tarball.
- To run a release build locally:
  - Extract the archive
  - Provide env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - Install deps and start with `pnpm start` after `pnpm build` if needed

## Documentation
- Supabase schema: `supabase/schema.sql`
- PWA manifest: `public/manifest.json`
- Components and pages live under `components/` and `app/`

## License
MIT
