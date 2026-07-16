# Contributing to PipelineIQ

First off, thanks for taking the time to contribute! 

## Development Workflow

1. **Feature Branches:** All work should be done in a dedicated feature branch (`feature/your-feature-name`).
2. **Commit Messages:** We follow Conventional Commits format (e.g., `feat: added task drawer`).
3. **Pull Requests:** When ready, open a PR against the `main` branch. A maintainer will review your code.

## Coding Standards

### Architecture (Feature-Based)
Please ensure all new code is co-located by feature domain rather than globally distributed. If you are building a new feature (e.g. `Invoices`), create a new directory under `src/features/invoices/` and place your components, actions, and schemas there.

### Security & Data Integrity
1. **Never Trust the Client:** All incoming data in Server Actions MUST be validated using Zod schemas located in `src/lib/validators.ts`.
2. **Row-Level Security:** Every database mutation (`update`, `delete`) must verify that the authenticated user owns the resource.
3. **Soft Deletes Only:** Never use `prisma.model.delete()`. Always use `prisma.model.update()` to set the `deletedAt` timestamp.

### UI & UX
1. **The Four States:** All data-fetching components must explicitly handle and design for Empty, Loading, Error, and Success states.
2. **Aesthetics:** This app uses a dark glassmorphic theme. Ensure you are using `backdrop-blur-md` and `bg-white/5` for cards/modals.

## Reporting Bugs

Please use the GitHub Issue Tracker to report bugs. Include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
