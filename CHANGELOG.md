# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Global Task Management:** Slide-out drawer to manage tasks with complete CRUD operations.
- **Activity Feed:** Modal to log calls, emails, and meetings on deals.
- **Kanban Board:** Drag and drop interface for deals.
- **Command Palette:** Global search feature triggered by `Cmd+K`.

### Changed
- Refactored server actions to enforce strict Row-Level Security (`userId` checking).
- Migrated all manual API validation to centralized Zod schemas in `validators.ts`.

### Security
- Converted hard deletion of Tasks and Activities to Soft Deletes using `deletedAt`.
- Enforced strict authorization on `updateDealStage` and `deleteDeal`.
