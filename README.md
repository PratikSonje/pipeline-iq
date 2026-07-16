# PipelineIQ

PipelineIQ is a premium, modern Customer Relationship Management (CRM) platform built with Next.js 14, TailwindCSS, and Prisma. It is designed with a sleek, glassmorphic UI, real-time optimistic updates, and row-level security.

## Features

- **Dynamic Pipeline:** Drag-and-drop Kanban board for managing deals and stages.
- **Global Search:** Command Palette (⌘K) to instantly find deals, companies, and contacts.
- **Activity Feed:** Track calls, emails, notes, and meetings with automatic timestamps.
- **Row-Level Security:** Secure mutations powered by Clerk Auth and Prisma, ensuring users only access their own data.
- **Dark Mode UI:** A gorgeous, animated, premium dark theme utilizing framer-motion and backdrop-blur.

## Tech Stack

- **Framework:** Next.js (App Router, Server Actions)
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS + `framer-motion` + `lucide-react`
- **Validation:** Zod

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your keys
4. Setup database: `npx prisma db push`
5. Start development server: `npm run dev`

## Architecture

This project follows strict security guidelines, validating all data server-side using Zod and enforcing strict Row-Level Security checks on every mutation. We utilize soft deletes (via `deletedAt`) for critical entities to ensure data integrity.

## License
MIT License. See [LICENSE](LICENSE) for more information.
