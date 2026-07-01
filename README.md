# Debt Recovery Dashboard

Responsive personal debt management app built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- Dashboard totals for EMIs, salary, rent, friends debt, HDFC card bill, obligations, and salary gap
- Editable loan tracker with add, edit, delete, status, priority, notes, and remaining payable
- July 2026 payment calendar grouped by due date with overdue/upcoming highlighting
- HDFC credit-card planner with minimum due, extra payment, utilization, and remaining balance
- Month-by-month recovery projection from July 2026
- Insight cards and dependency-free charts
- Supabase Auth and hosted database persistence
- Reset sample data button

## Free Live Database Setup

Use a free Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL editor and run [supabase/schema.sql](/supabase/schema.sql).
3. In Supabase, go to Project Settings > API and copy:
   - Project URL
   - anon public key
4. Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

5. Fill in:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The app uses Supabase email/password auth. Each signed-in user gets one private `app_states` row protected by row-level security.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

The production output is generated in `dist/`.
