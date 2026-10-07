# CLAUDE.md — KidKyzo/Ashram-Gandhi-Puri

Operational instructions, automated commands, development boundaries, commit standards, and GitHub lifecycle rules for Claude Code and automated contributors.

---

## 1. Project Overview & Context

- **Repository:** `KidKyzo/Ashram-Gandhi-Puri`
- **Purpose:** Community, educational, and cultural platform supporting Ashram Gandhi Puri initiatives (programs, donations, events, archives, and outreach).
- **Core Philosophy:** Minimal dependencies, high reliability, secure handling of visitor/donor data, accessible (WCAG 2.1 AA compliant), and responsive across low-bandwidth environments.

---

## 2. Hard Boundaries & Operational Rules

### Strict Prohibitions

- **Zero Direct Pushes:** Never push directly to `main` or `production`. All changes must be delivered via GitHub Pull Requests.
- **Zero Raw Secrets:** Never write credentials, private tokens, API keys, or connection strings into source files. Always use `.env.example` as a template and reference environment variables.
- **No Destructive DB Operations:** Never run blind schema drops or direct migrations against production databases without verified backups and rollback migrations.
- **Scope Discipline:** Touch only files related to the requested task. Do not reformat untouched directories or introduce unrequested dependencies inside feature branches.
- **No Unreviewed Packages:** Avoid introducing third-party SDKs without architectural justification.

### Production Readiness Guards

- All changes must pass static type checking, linting, and automated unit test suites prior to PR creation.
- Dynamic user inputs must be validated with explicit schema validation before reaching internal state or database models.
- Maintain localization readiness (English, Indonesian, and Balinese cultural context where applicable).

---

## 3. Automated Commands & Tooling

Run all commands using your preferred package manager (default: `pnpm` / `npm`):

### Environment Setup

```bash
# Setup local environment variables
cp .env.example .env.local

# Install dependencies with lockfile verification
pnpm install --frozen-lockfile
# OR: npm ci
```

## 4. Git & GitHub Change Lifecycle

### Step 1: Branch Management

Create a clean branch cut from the latest `main`:

    git checkout main
    git pull origin main
    git checkout -b <type></type>/<short-issue-description></short>

#### Allowed Branch Prefixes

- `feat/` — New feature or user-facing functionality
- `fix/` — Bug fix or patch
- `refactor/` — Code improvement without behavioral change
- `test/` — Adding or updating test suites
- `docs/` — Updating documentation or guides
- `chore/` — Dependency upgrades, configuration adjustments, or build scripts

Example: `git checkout -b feat/event-registration-portal`

---

### Step 2: Commit Standards (Conventional Commits)

Every commit must follow the standard syntax:

    <type></type>(<scope></scope>): <imperative summary></imperative>

    [optional body explaining 'why', not 'what']

    [optional footer: Resolves #issue-number]

#### Allowed Commit Types

- `feat`: A new user-facing feature or enhancement
- `fix`: A bug fix
- `refactor`: Internal logic change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `docs`: Documentation-only updates
- `chore`: Tooling, configs, or package updates
- `style`: Formatting, semicolons, spacing (no logic change)

#### Scopes

Common scopes for this project: `auth`, `events`, `donations`, `gallery`, `ui`, `api`, `db`, `seo`.

#### Verified Commit Examples

    # Feature commit
    git commit -m "feat(events): add capacity limit and RSVP cutoff verification"

    # Bug fix referencing an issue
    git commit -m "fix(donations): prevent duplicate payment gateway webhooks

    Resolves #42"

    # Maintenance chore
    git commit -m "chore(deps): update payment provider SDK to latest release"

---

### Step 3: Pull Request (PR) & GitHub Integration

When opening a Pull Request against `KidKyzo/Ashram-Gandhi-Puri`:

1. **PR Title:** Must match Conventional Commit format (e.g., `feat(gallery): add archival photo grid with lazy loading`).
2. **Issue Linking:** Use standard GitHub closing keywords in the PR description:

   - `Closes #<issue_number>`
   - `Fixes #<issue_number>`

3. **PR Template Checklist:**

   ## Context & Summary
   - Brief explanation of the feature or bug fix.

   ## Related Issues
   - Closes #<issue-id></issue>

   ## Validation & Testing Checklist
   - [ ] Type check passed with 0 errors.
   - [ ] Lint passed with 0 warnings.
   - [ ] Unit/Integration tests added or updated.
   - [ ] All tests passing locally.
   - [ ] Environment variables updated in .env.example (if applicable).
   - [ ] Tested on mobile viewport / responsive layout.

4. **Merge Protocol:** Maintain clean linear history using **Squash and Merge** or **Rebase and Merge**. Delete the feature branch immediately after merge.

---

## 5. Architectural Conventions

- **Directory Structure:**
  - `src/components/`: Reusable, presentation-only UI components.
  - `src/features/` or `src/modules/`: Domain-driven logic (events, donations, youth programs).
  - `src/lib/` or `src/utils/`: Pure helper functions, formatters, and third-party wrappers.
  - `src/types/`: Shared TypeScript interfaces and domain schemas.
- **Error Handling:** Standardized UI error boundaries with typed result envelopes `{ data, error }` across service boundaries.
- **Accessibility:** Semantic HTML elements (`<main>`, `<nav>`, `<article>`), explicit `alt` tags on all media, and full keyboard navigation for modals, menus, and forms.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
