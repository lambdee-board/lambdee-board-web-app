# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Lambdee Board is a scriptable agile project management app. The backend is a Rails 7 REST API; the frontend is a React 18 SPA bundled with esbuild, served by Rails. Background jobs run via Sidekiq (Redis-backed). PostgreSQL is the database.

## Development Commands

```bash
bin/setup          # First-time setup (installs deps, creates configs, runs migrations)
bin/dev            # Start everything: Rails, React watch build, Sidekiq
bin/dev --nw       # Skip frontend watch build
bin/dev --ns       # Skip Sidekiq
bin/build          # Build frontend once (-o/--one-time also works)
bin/console        # Rails console
bin/seed           # Seed the database with generated data
```

## Testing

```bash
# Run all tests
bin/test

# Backend unit tests (Rails test framework)
bin/rails test
bin/rails test test/path/to/test_file.rb
bin/rails test test/path/to/test_file.rb:42  # specific line

# Backend request specs (RSpec)
bundle exec rspec
bundle exec rspec spec/requests/api/scripts_spec.rb
bundle exec rspec spec/requests/api/scripts_spec.rb:10

# Frontend E2E (Cypress)
bin/cypress open   # interactive
bin/cypress run    # headless
bin/cypress run --spec "cypress/integration/path/to/spec.js"
```

## Linting & Security

```bash
bundle exec rubocop --parallel        # Ruby lint
npm run lint                          # JS/React lint (ESLint)
bundle exec brakeman -I               # Rails security scan
bundle exec bundle audit --update     # Gem vulnerability audit
```

CI requires minimum 75% code coverage (SimpleCov).

## Architecture

### Backend (`app/`)

- **Controllers** live under `app/controllers/api/` in the `API::` namespace — all endpoints are scoped to `/api`.
- **Models** live under `app/models/db/` in the `DB::` namespace (e.g., `DB::User`, `DB::Task`).
- **Service objects / POROs** live in `app/internal/` — query building, chart generation, script service integration, time tracking.
- **JSON serialization** uses Jbuilder views in `app/views/api/`.
- **Admin dashboard** uses Trestle (`app/admin/`), accessible to `DB::AdminUser`.
- **Authentication**: Devise + devise-jwt; `JwtDenylist` model blacklists revoked tokens.
- **Authorization**: CanCanCan; see `app/models/ability.rb`.
- **Pagination/filtering**: Kaminari + custom `QueryAPI` in `app/internal/`.
- **Background jobs**: Sidekiq jobs in `app/jobs/`.
- **API docs**: rswag generates OpenAPI spec from RSpec; viewable at `/api-docs`.

### Frontend (`frontend/src/`)

- **Data fetching**: SWR (caches and revalidates API responses).
- **UI state**: Zustand stores in `frontend/src/stores/`.
- **HTTP**: Axios with axios-case-converter (auto-converts snake_case ↔ camelCase between Rails and React).
- **API layer**: `frontend/src/api/` — one file per resource.
- **Routing**: React Router 6.
- **UI**: Material-UI v5, FontAwesome icons, Emotion for CSS-in-JS.
- **Build**: esbuild configs in `frontend/build.*.mjs` (dev/test/prod variants).

### Naming Conventions

- Ruby: `snake_case` files/methods, `PascalCase` classes.
- JS: `camelCase` variables/functions, `PascalCase` components, `kebab-case` file names for components.
- DB models always namespaced: `DB::ModelName`.
- API controllers always namespaced: `API::ResourcesController`.
