# frozen_string_literal: true

# === Users ===

admin = ::FactoryBot.create(:user, email: 'admin@example.com', name: 'Admin',         role: :admin)
alice = ::FactoryBot.create(:user, email: 'alice@example.com', name: 'Alice Johnson', role: :manager)
bob   = ::FactoryBot.create(:user, email: 'bob@example.com',   name: 'Bob Smith',     role: :developer)
carol = ::FactoryBot.create(:user, email: 'carol@example.com', name: 'Carol White',   role: :developer)
dave  = ::FactoryBot.create(:user, email: 'dave@example.com',  name: 'Dave Brown',    role: :developer)

# === Workspace ===

wrk = ::FactoryBot.create(:workspace, name: 'Lambdee')
wrk.users << admin << alice << bob << carol << dave

# === Board: Web App ===

web_app = ::FactoryBot.create(:board, name: 'Web App', workspace: wrk, color: '#4A6CF7')

tag_backend     = ::FactoryBot.create(:tag, name: 'Backend',     board: web_app, color: '#294590')
tag_frontend    = ::FactoryBot.create(:tag, name: 'Frontend',    board: web_app, color: '#b82a94')
tag_bug         = ::FactoryBot.create(:tag, name: 'Bug',         board: web_app, color: '#c0392b')
tag_feature     = ::FactoryBot.create(:tag, name: 'Feature',     board: web_app, color: '#27ae60')
tag_performance = ::FactoryBot.create(:tag, name: 'Performance', board: web_app, color: '#e67e22')

backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: web_app, visible: false)
todo    = ::FactoryBot.create(:list, name: 'To Do',       board: web_app, visible: true)
doing   = ::FactoryBot.create(:list, name: 'In Progress', board: web_app, visible: true)
review  = ::FactoryBot.create(:list, name: 'Review',      board: web_app, visible: true)
done    = ::FactoryBot.create(:list, name: 'Done',         board: web_app, visible: true)

# Backlog
task = ::FactoryBot.create(:task, list: backlog, name: 'Set up CI/CD pipeline', author: alice, priority: :high, points: 8,
  description: 'Automate build, test, and deployment workflows using GitHub Actions.')
task.tags << tag_feature

task = ::FactoryBot.create(:task, list: backlog, name: 'Add rate limiting to API', author: bob, priority: :medium, points: 5,
  description: 'Prevent abuse by limiting requests per client per minute.')
task.tags << tag_backend

# To Do
task = ::FactoryBot.create(:task, list: todo, name: 'Implement user profile page', author: alice, priority: :medium, points: 5,
  description: 'Allow users to view and edit their profile information.')
task.tags << tag_frontend
task.users << carol

task = ::FactoryBot.create(:task, list: todo, name: 'Fix password reset email', author: alice, priority: :high, points: 3,
  description: 'The password reset email is not being sent reliably. Investigate and fix.')
task.tags << tag_bug
task.users << dave

# In Progress
task_search = ::FactoryBot.create(:task, list: doing, name: 'Add search functionality', author: alice, priority: :high, points: 13,
  description: 'Implement full-text search across boards and tasks.')
task_search.tags << tag_frontend << tag_backend
task_search.users << bob
::FactoryBot.create(:comment, task: task_search, author: alice, body: 'Should we use Elasticsearch or Postgres full-text search?')

task_db = ::FactoryBot.create(:task, list: doing, name: 'Optimise database queries', author: alice, priority: :medium, points: 8,
  description: 'Several slow queries identified in production. Add indices and rewrite N+1 queries.')
task_db.tags << tag_backend << tag_performance
task_db.users << carol

# Review
task_auth = ::FactoryBot.create(:task, list: review, name: 'Refactor authentication middleware', author: alice, priority: :low, points: 5,
  description: 'Clean up auth middleware to improve readability and reduce duplication.')
task_auth.tags << tag_backend
task_auth.users << dave
::FactoryBot.create(:comment, task: task_auth, author: bob, body: 'Looks good overall. Left a few inline suggestions.')

# Done
task_setup = ::FactoryBot.create(:task, list: done, name: 'Set up project structure', author: alice, priority: :low, points: 2,
  description: 'Initialise the repository with linting, CI config, and folder conventions.')
task_setup.tags << tag_feature
task_setup.users << alice

task_validation = ::FactoryBot.create(:task, list: done, name: 'Add input validation', author: alice, priority: :medium, points: 3,
  description: 'Validate all API inputs to prevent invalid data from reaching the database.')
task_validation.tags << tag_backend << tag_bug
task_validation.users << bob

# Sprint 1 (completed — auto-creates SprintTasks for all visible-list tasks)
sprint = ::FactoryBot.create(:sprint, board: web_app, name: 'Sprint 1',
  started_at: 14.days.ago, expected_end_at: 7.days.ago, ended_at: 7.days.ago,
  final_list_name: 'Done')
sprint.sprint_tasks.update_all(added_at: 14.days.ago)
sprint.sprint_tasks.where(task_id: [task_setup.id, task_validation.id]).update_all(completed_at: 7.days.ago)

# === Board: Mobile App ===

mobile = ::FactoryBot.create(:board, name: 'Mobile App', workspace: wrk, color: '#27AE60')

tag_ios     = ::FactoryBot.create(:tag, name: 'iOS',     board: mobile, color: '#1abc9c')
tag_android = ::FactoryBot.create(:tag, name: 'Android', board: mobile, color: '#3498db')
tag_mob_bug = ::FactoryBot.create(:tag, name: 'Bug',     board: mobile, color: '#c0392b')
tag_mob_ftr = ::FactoryBot.create(:tag, name: 'Feature', board: mobile, color: '#27ae60')

mob_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: mobile, visible: false)
mob_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: mobile, visible: true)
mob_done    = ::FactoryBot.create(:list, name: 'Done',         board: mobile, visible: true)

task = ::FactoryBot.create(:task, list: mob_backlog, name: 'Design onboarding flow', author: alice, priority: :medium, points: 5,
  description: 'Create wireframes and implement the onboarding screens for new users.')
task.tags << tag_mob_ftr << tag_ios

task = ::FactoryBot.create(:task, list: mob_doing, name: 'Fix crash on Android 12', author: carol, priority: :high, points: 3,
  description: 'App crashes on launch on Android 12 devices. Reproduce and fix.')
task.tags << tag_mob_bug << tag_android
task.users << carol
::FactoryBot.create(:comment, task:, author: dave, body: 'I can reproduce on a Pixel 6. Looks like a permissions API change in Android 12.')

task = ::FactoryBot.create(:task, list: mob_done, name: 'Set up React Native project', author: bob, priority: :low, points: 2,
  description: 'Bootstrap the mobile app with React Native and core dependencies.')
task.tags << tag_mob_ftr
task.users << bob

# === Additional users ===

eve    = ::FactoryBot.create(:user, email: 'eve@example.com',          name: 'Eve Martinez',    role: :developer)
frank  = ::FactoryBot.create(:user, email: 'frank@example.com',        name: 'Frank Lee',       role: :manager)
grace  = ::FactoryBot.create(:user, email: 'grace@example.com',        name: 'Grace Kim',       role: :developer)
henry  = ::FactoryBot.create(:user, email: 'henry@example.com',        name: 'Henry Davis',     role: :developer)
isabel = ::FactoryBot.create(:user, email: 'isabel@example.com',       name: 'Isabel Chen',     role: :developer)
jack   = ::FactoryBot.create(:user, email: 'jack@example.com',         name: 'Jack Wilson',     role: :manager)
karen  = ::FactoryBot.create(:user, email: 'karen@example.com',        name: 'Karen Taylor',    role: :developer)
liam   = ::FactoryBot.create(:user, email: 'liam@example.com',         name: 'Liam Anderson',   role: :developer)
mia    = ::FactoryBot.create(:user, email: 'mia@example.com',          name: 'Mia Thompson',    role: :developer)
noah   = ::FactoryBot.create(:user, email: 'noah@example.com',         name: 'Noah Garcia',     role: :developer)
brice  = ::FactoryBot.create(:user, email: 'b-spinka@example.com',     name: 'Brice Spinka',    role: :developer)
herman = ::FactoryBot.create(:user, email: 'herman@example.com',       name: 'Herman Schmidt',  role: :manager)

# === Workspace: Netflux ===

netflux = ::FactoryBot.create(:workspace, name: 'Netflux')
netflux.users << admin << alice << bob << carol << dave << eve << frank << grace << brice << herman

# --- Board: Frontend UI ---

frontend_ui = ::FactoryBot.create(:board, name: 'Frontend UI', workspace: netflux, color: '#E74C3C')

tag_ui_react  = ::FactoryBot.create(:tag, name: 'React',       board: frontend_ui, color: '#61dafb')
tag_ui_ts     = ::FactoryBot.create(:tag, name: 'TypeScript',  board: frontend_ui, color: '#3178c6')
tag_ui_bug    = ::FactoryBot.create(:tag, name: 'Bug',         board: frontend_ui, color: '#c0392b')
tag_ui_feat   = ::FactoryBot.create(:tag, name: 'Feature',     board: frontend_ui, color: '#27ae60')
tag_library   = ::FactoryBot.create(:tag, name: 'Library',     board: frontend_ui, color: '#8e44ad')

ui_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: frontend_ui, visible: false)
ui_todo    = ::FactoryBot.create(:list, name: 'To do',       board: frontend_ui, visible: true)
ui_doing   = ::FactoryBot.create(:list, name: 'Doing',       board: frontend_ui, visible: true)
ui_review  = ::FactoryBot.create(:list, name: 'Review',      board: frontend_ui, visible: true)
ui_done    = ::FactoryBot.create(:list, name: 'Done',        board: frontend_ui, visible: true)

task = ::FactoryBot.create(:task, list: ui_backlog, name: 'Upgrade to React 19', author: frank, priority: :low, points: 5,
  description: 'Evaluate breaking changes and upgrade the app to React 19.')
task.tags << tag_ui_react

task = ::FactoryBot.create(:task, list: ui_backlog, name: 'Add dark mode support', author: grace, priority: :medium, points: 8,
  description: 'Implement a theme toggle that persists user preference in localStorage.')
task.tags << tag_ui_feat

task_user_api = ::FactoryBot.create(:task, list: ui_todo, name: 'Implement the User API', author: frank, priority: :high, points: 8,
  description: 'Currently, there is no way to fetch or update user profile data from the frontend. Implement a full API layer for user resources.')
task_user_api.tags << tag_library << tag_ui_ts
task_user_api.users << grace
::FactoryBot.create(:comment, task: task_user_api, author: eve, body: 'Should we use SWR or React Query for this?')
::FactoryBot.create(:comment, task: task_user_api, author: frank, body: 'Lets go with SWR, its already in the project.')

task = ::FactoryBot.create(:task, list: ui_todo, name: 'Fix broken table pagination', author: alice, priority: :high, points: 3,
  description: 'Pagination resets to page 1 on every re-render. Track the page in URL params instead.')
task.tags << tag_ui_bug
task.users << carol

task = ::FactoryBot.create(:task, list: ui_doing, name: 'Refactor dashboard layout', author: frank, priority: :medium, points: 5,
  description: 'Extract shared layout components and remove duplicated grid logic from three views.')
task.tags << tag_ui_react << tag_ui_ts
task.users << eve

task = ::FactoryBot.create(:task, list: ui_doing, name: 'Migrate icons to MUI', author: grace, priority: :low, points: 3,
  description: 'Replace FontAwesome icon usage in forms with MUI icon equivalents.')
task.tags << tag_ui_feat

task = ::FactoryBot.create(:task, list: ui_review, name: 'Add loading skeletons', author: frank, priority: :medium, points: 3,
  description: 'Replace spinner placeholders with MUI Skeleton components for a better loading experience.')
task.tags << tag_ui_feat
task.users << grace

task = ::FactoryBot.create(:task, list: ui_done, name: 'Set up ESLint + Prettier', author: alice, priority: :low, points: 2,
  description: 'Agreed code style enforced via ESLint and Prettier with pre-commit hooks.')
task.tags << tag_ui_feat

task = ::FactoryBot.create(:task, list: ui_done, name: 'Create reusable Button component', author: grace, priority: :medium, points: 3,
  description: 'Wrap MUI Button with project-specific variants and export from the design system.')
task.tags << tag_ui_react << tag_library

# --- Board: Backend API ---

backend_api = ::FactoryBot.create(:board, name: 'Backend API', workspace: netflux, color: '#8E44AD')

tag_api_ruby   = ::FactoryBot.create(:tag, name: 'Ruby',       board: backend_api, color: '#cc342d')
tag_api_db     = ::FactoryBot.create(:tag, name: 'Database',   board: backend_api, color: '#336791')
tag_api_bug    = ::FactoryBot.create(:tag, name: 'Bug',        board: backend_api, color: '#c0392b')
tag_api_feat   = ::FactoryBot.create(:tag, name: 'Feature',    board: backend_api, color: '#27ae60')
tag_api_perf   = ::FactoryBot.create(:tag, name: 'Performance',board: backend_api, color: '#e67e22')

api_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: backend_api, visible: false)
api_todo    = ::FactoryBot.create(:list, name: 'To do',       board: backend_api, visible: true)
api_doing   = ::FactoryBot.create(:list, name: 'Doing',       board: backend_api, visible: true)
api_review  = ::FactoryBot.create(:list, name: 'Review',      board: backend_api, visible: true)
api_done    = ::FactoryBot.create(:list, name: 'Done',        board: backend_api, visible: true)

task = ::FactoryBot.create(:task, list: api_backlog, name: 'Add GraphQL endpoint', author: frank, priority: :low, points: 13,
  description: 'Evaluate adding a GraphQL API alongside the existing REST API.')
task.tags << tag_api_ruby << tag_api_feat

task = ::FactoryBot.create(:task, list: api_todo, name: 'Change the ORM', author: frank, priority: :medium, points: 13,
  description: 'Evaluate migrating from ActiveRecord to Sequel for better query composability.')
task.tags << tag_api_ruby << tag_api_db
task.users << henry

task = ::FactoryBot.create(:task, list: api_todo, name: 'Add request logging middleware', author: bob, priority: :medium, points: 3,
  description: 'Log all incoming API requests with method, path, duration, and response status.')
task.tags << tag_api_ruby
task.users << dave

task = ::FactoryBot.create(:task, list: api_doing, name: 'Implement webhook delivery', author: frank, priority: :high, points: 8,
  description: 'Allow users to register webhook URLs that receive POST events on task changes.')
task.tags << tag_api_feat
task.users << bob
::FactoryBot.create(:comment, task:, author: alice, body: 'Should we add retry logic for failed deliveries?')
::FactoryBot.create(:comment, task:, author: frank, body: 'Yes, exponential backoff with 3 retries.')

task = ::FactoryBot.create(:task, list: api_doing, name: 'Fix N+1 on workspaces index', author: alice, priority: :high, points: 3,
  description: 'The /api/workspaces endpoint is issuing one query per workspace member. Add eager loading.')
task.tags << tag_api_bug << tag_api_perf
task.users << carol

task = ::FactoryBot.create(:task, list: api_review, name: 'Add API versioning', author: frank, priority: :medium, points: 5,
  description: 'Introduce /api/v2 namespace so breaking changes can be rolled out gradually.')
task.tags << tag_api_ruby << tag_api_feat
task.users << henry

task = ::FactoryBot.create(:task, list: api_done, name: 'Bootstrap Rails project', author: alice, priority: :low, points: 2,
  description: 'Initialise the Rails app with Devise, CanCanCan, and the initial schema migration.')
task.tags << tag_api_ruby << tag_api_feat

task = ::FactoryBot.create(:task, list: api_done, name: 'Set up CI pipeline', author: alice, priority: :low, points: 3,
  description: 'GitHub Actions workflow that runs RSpec and Rubocop on every pull request.')
task.tags << tag_api_feat

# --- Board: DevOps ---

devops = ::FactoryBot.create(:board, name: 'DevOps', workspace: netflux, color: '#F39C12')

tag_ops_infra  = ::FactoryBot.create(:tag, name: 'Infrastructure', board: devops, color: '#2c3e50')
tag_ops_docker = ::FactoryBot.create(:tag, name: 'Docker',         board: devops, color: '#0db7ed')
tag_ops_k8s    = ::FactoryBot.create(:tag, name: 'Kubernetes',     board: devops, color: '#326ce5')
tag_ops_bug    = ::FactoryBot.create(:tag, name: 'Incident',       board: devops, color: '#c0392b')

ops_todo  = ::FactoryBot.create(:list, name: 'To do',       board: devops, visible: true)
ops_doing = ::FactoryBot.create(:list, name: 'Doing',       board: devops, visible: true)
ops_done  = ::FactoryBot.create(:list, name: 'Done',        board: devops, visible: true)

task = ::FactoryBot.create(:task, list: ops_todo, name: 'Set up Kubernetes cluster', author: frank, priority: :high, points: 13,
  description: 'Provision a managed K8s cluster on AWS EKS and deploy the staging environment.')
task.tags << tag_ops_k8s << tag_ops_infra
task.users << henry

task = ::FactoryBot.create(:task, list: ops_todo, name: 'Containerise the Rails app', author: henry, priority: :high, points: 8,
  description: 'Write a production-ready Dockerfile and docker-compose for local dev.')
task.tags << tag_ops_docker

task = ::FactoryBot.create(:task, list: ops_doing, name: 'Configure log aggregation', author: henry, priority: :medium, points: 5,
  description: 'Route all container logs to CloudWatch and set up alert rules for error spikes.')
task.tags << tag_ops_infra
task.users << frank

task = ::FactoryBot.create(:task, list: ops_done, name: 'Set up staging environment', author: frank, priority: :medium, points: 5,
  description: 'Provision staging server and automate deploys from the main branch.')
task.tags << tag_ops_infra << tag_ops_docker

# === Workspace: Acme Corp ===

acme = ::FactoryBot.create(:workspace, name: 'Acme Corp')
acme.users << admin << jack << karen << liam << mia << noah << isabel

# --- Board: E-commerce Platform ---

ecomm = ::FactoryBot.create(:board, name: 'E-commerce Platform', workspace: acme, color: '#16A085')

tag_ec_frontend = ::FactoryBot.create(:tag, name: 'Frontend',  board: ecomm, color: '#b82a94')
tag_ec_backend  = ::FactoryBot.create(:tag, name: 'Backend',   board: ecomm, color: '#294590')
tag_ec_bug      = ::FactoryBot.create(:tag, name: 'Bug',       board: ecomm, color: '#c0392b')
tag_ec_feat     = ::FactoryBot.create(:tag, name: 'Feature',   board: ecomm, color: '#27ae60')
tag_ec_ux       = ::FactoryBot.create(:tag, name: 'UX',        board: ecomm, color: '#e67e22')

ec_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: ecomm, visible: false)
ec_todo    = ::FactoryBot.create(:list, name: 'To Do',       board: ecomm, visible: true)
ec_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: ecomm, visible: true)
ec_review  = ::FactoryBot.create(:list, name: 'Review',      board: ecomm, visible: true)
ec_done    = ::FactoryBot.create(:list, name: 'Done',        board: ecomm, visible: true)

task = ::FactoryBot.create(:task, list: ec_backlog, name: 'Add product recommendation engine', author: jack, priority: :low, points: 13,
  description: 'Implement collaborative filtering to show personalised product recommendations.')
task.tags << tag_ec_backend << tag_ec_feat

task = ::FactoryBot.create(:task, list: ec_backlog, name: 'Support multi-currency checkout', author: jack, priority: :medium, points: 8,
  description: 'Allow users to pay in their local currency by integrating FX rates at checkout.')
task.tags << tag_ec_backend << tag_ec_feat

task = ::FactoryBot.create(:task, list: ec_todo, name: 'Redesign product detail page', author: jack, priority: :high, points: 8,
  description: 'Improve image gallery, add size guide, and surface reviews above the fold.')
task.tags << tag_ec_frontend << tag_ec_ux
task.users << karen

task = ::FactoryBot.create(:task, list: ec_todo, name: 'Fix discount code not applying', author: liam, priority: :high, points: 3,
  description: 'Discount codes with a percentage type are silently ignored at checkout.')
task.tags << tag_ec_bug
task.users << liam

task = ::FactoryBot.create(:task, list: ec_doing, name: 'Implement wishlist feature', author: jack, priority: :medium, points: 5,
  description: 'Allow logged-in users to save products to a wishlist and share it via link.')
task.tags << tag_ec_feat << tag_ec_frontend
task.users << karen
::FactoryBot.create(:comment, task:, author: jack, body: 'Should wishlists be public by default?')
::FactoryBot.create(:comment, task:, author: karen, body: 'Private by default, shareable via opt-in link.')

task = ::FactoryBot.create(:task, list: ec_doing, name: 'Optimise image loading', author: mia, priority: :medium, points: 3,
  description: 'Add lazy loading and WebP conversion for all product images.')
task.tags << tag_ec_frontend << tag_ec_ux

task = ::FactoryBot.create(:task, list: ec_review, name: 'Add order history page', author: jack, priority: :medium, points: 5,
  description: 'Let users view past orders, track shipment status, and download invoices.')
task.tags << tag_ec_frontend << tag_ec_backend
task.users << noah

task = ::FactoryBot.create(:task, list: ec_done, name: 'Integrate Stripe payments', author: jack, priority: :high, points: 8,
  description: 'Replace manual card processing with Stripe Checkout.')
task.tags << tag_ec_backend << tag_ec_feat

task = ::FactoryBot.create(:task, list: ec_done, name: 'Set up product catalogue schema', author: jack, priority: :low, points: 3,
  description: 'Database schema for products, categories, variants, and pricing.')
task.tags << tag_ec_backend

# --- Board: Analytics Dashboard ---

analytics = ::FactoryBot.create(:board, name: 'Analytics Dashboard', workspace: acme, color: '#2980B9')

tag_an_viz  = ::FactoryBot.create(:tag, name: 'Visualisation', board: analytics, color: '#1abc9c')
tag_an_data = ::FactoryBot.create(:tag, name: 'Data',          board: analytics, color: '#3498db')
tag_an_bug  = ::FactoryBot.create(:tag, name: 'Bug',           board: analytics, color: '#c0392b')
tag_an_feat = ::FactoryBot.create(:tag, name: 'Feature',       board: analytics, color: '#27ae60')

an_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: analytics, visible: true)
an_doing = ::FactoryBot.create(:list, name: 'In Progress', board: analytics, visible: true)
an_done  = ::FactoryBot.create(:list, name: 'Done',        board: analytics, visible: true)

task = ::FactoryBot.create(:task, list: an_todo, name: 'Add revenue over time chart', author: jack, priority: :high, points: 5,
  description: 'Line chart showing daily, weekly, and monthly revenue with comparison to previous period.')
task.tags << tag_an_viz << tag_an_data
task.users << isabel

task = ::FactoryBot.create(:task, list: an_todo, name: 'Export reports as CSV', author: mia, priority: :medium, points: 3,
  description: 'Allow users to download any report as a CSV from the dashboard toolbar.')
task.tags << tag_an_feat

task = ::FactoryBot.create(:task, list: an_doing, name: 'Build funnel visualisation', author: jack, priority: :high, points: 8,
  description: 'Visualise drop-off rates across the checkout funnel steps.')
task.tags << tag_an_viz << tag_an_data
task.users << isabel
::FactoryBot.create(:comment, task:, author: jack, body: 'Use Recharts for consistency with the rest of the dashboard.')

task = ::FactoryBot.create(:task, list: an_doing, name: 'Fix date filter resetting on navigation', author: noah, priority: :high, points: 2,
  description: 'Date range filter loses its value when navigating between dashboard tabs.')
task.tags << tag_an_bug

task = ::FactoryBot.create(:task, list: an_done, name: 'Integrate Google Analytics 4', author: jack, priority: :medium, points: 5,
  description: 'Replace UA tracking with GA4 events for key user actions.')
task.tags << tag_an_data << tag_an_feat

task = ::FactoryBot.create(:task, list: an_done, name: 'Dashboard layout scaffolding', author: jack, priority: :low, points: 3,
  description: 'Initial responsive grid layout with placeholder chart widgets.')
task.tags << tag_an_viz

# --- Board: Customer Support Portal ---

support = ::FactoryBot.create(:board, name: 'Customer Support', workspace: acme, color: '#C0392B')

tag_sup_ux   = ::FactoryBot.create(:tag, name: 'UX',      board: support, color: '#e67e22')
tag_sup_feat = ::FactoryBot.create(:tag, name: 'Feature', board: support, color: '#27ae60')
tag_sup_bug  = ::FactoryBot.create(:tag, name: 'Bug',     board: support, color: '#c0392b')

sup_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: support, visible: true)
sup_doing = ::FactoryBot.create(:list, name: 'In Progress', board: support, visible: true)
sup_done  = ::FactoryBot.create(:list, name: 'Done',        board: support, visible: true)

task = ::FactoryBot.create(:task, list: sup_todo, name: 'Build ticket submission form', author: jack, priority: :high, points: 5,
  description: 'Form with category, priority, and file attachment support. Sends confirmation email.')
task.tags << tag_sup_feat << tag_sup_ux
task.users << karen

task = ::FactoryBot.create(:task, list: sup_todo, name: 'Add canned response library', author: mia, priority: :medium, points: 3,
  description: 'Let support agents save and reuse common reply templates.')
task.tags << tag_sup_feat

task = ::FactoryBot.create(:task, list: sup_doing, name: 'Implement ticket assignment', author: jack, priority: :high, points: 5,
  description: 'Allow supervisors to assign open tickets to agents and reassign when needed.')
task.tags << tag_sup_feat
task.users << liam
::FactoryBot.create(:comment, task:, author: mia, body: 'Should there be a notification when a ticket is assigned?')

task = ::FactoryBot.create(:task, list: sup_done, name: 'Ticket status tracking', author: jack, priority: :medium, points: 3,
  description: 'Statuses: Open, In Progress, Pending Customer, Resolved, Closed.')
task.tags << tag_sup_feat

# === Workspace: Startup Labs ===

startup = ::FactoryBot.create(:workspace, name: 'Startup Labs')
startup.users << admin << alice << bob << eve << grace << henry << karen << mia

# --- Board: Landing Page ---

landing = ::FactoryBot.create(:board, name: 'Landing Page', workspace: startup, color: '#D35400')

tag_lp_copy   = ::FactoryBot.create(:tag, name: 'Copywriting', board: landing, color: '#9b59b6')
tag_lp_design = ::FactoryBot.create(:tag, name: 'Design',      board: landing, color: '#e67e22')
tag_lp_dev    = ::FactoryBot.create(:tag, name: 'Dev',         board: landing, color: '#2980b9')
tag_lp_seo    = ::FactoryBot.create(:tag, name: 'SEO',         board: landing, color: '#27ae60')

lp_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: landing, visible: true)
lp_doing = ::FactoryBot.create(:list, name: 'In Progress', board: landing, visible: true)
lp_done  = ::FactoryBot.create(:list, name: 'Done',        board: landing, visible: true)

task = ::FactoryBot.create(:task, list: lp_todo, name: 'Write hero section copy', author: alice, priority: :high, points: 3,
  description: 'Headline, subheadline, and CTA button copy for the above-the-fold section.')
task.tags << tag_lp_copy
task.users << mia

task = ::FactoryBot.create(:task, list: lp_todo, name: 'Design pricing section', author: alice, priority: :medium, points: 5,
  description: 'Three-tier pricing table with feature comparison and most popular badge.')
task.tags << tag_lp_design
task.users << grace

task = ::FactoryBot.create(:task, list: lp_doing, name: 'Implement scroll animations', author: eve, priority: :low, points: 3,
  description: 'Subtle fade-in animations on section entry using Intersection Observer.')
task.tags << tag_lp_dev
task.users << eve

task = ::FactoryBot.create(:task, list: lp_doing, name: 'Set up analytics tracking', author: alice, priority: :medium, points: 2,
  description: 'Add GA4 events for CTA clicks, scroll depth, and form submissions.')
task.tags << tag_lp_seo << tag_lp_dev

task = ::FactoryBot.create(:task, list: lp_done, name: 'Create initial wireframes', author: alice, priority: :high, points: 3,
  description: 'Wireframes for hero, features, pricing, testimonials, and footer sections.')
task.tags << tag_lp_design

task = ::FactoryBot.create(:task, list: lp_done, name: 'Set up Next.js project', author: bob, priority: :low, points: 2,
  description: 'Bootstrap project with TypeScript, Tailwind CSS, and ESLint.')
task.tags << tag_lp_dev

# --- Board: Payment Integration ---

payments = ::FactoryBot.create(:board, name: 'Payment Integration', workspace: startup, color: '#27AE60')

tag_pay_stripe = ::FactoryBot.create(:tag, name: 'Stripe',    board: payments, color: '#6772e5')
tag_pay_sec    = ::FactoryBot.create(:tag, name: 'Security',  board: payments, color: '#c0392b')
tag_pay_test   = ::FactoryBot.create(:tag, name: 'Testing',   board: payments, color: '#f39c12')
tag_pay_feat   = ::FactoryBot.create(:tag, name: 'Feature',   board: payments, color: '#27ae60')

pay_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: payments, visible: true)
pay_doing = ::FactoryBot.create(:list, name: 'In Progress', board: payments, visible: true)
pay_done  = ::FactoryBot.create(:list, name: 'Done',        board: payments, visible: true)

task = ::FactoryBot.create(:task, list: pay_todo, name: 'Handle subscription upgrades/downgrades', author: alice, priority: :medium, points: 8,
  description: 'Pro-rate billing changes when users switch plans mid-cycle.')
task.tags << tag_pay_stripe << tag_pay_feat
task.users << henry

task = ::FactoryBot.create(:task, list: pay_todo, name: 'Add invoice PDF generation', author: bob, priority: :low, points: 5,
  description: 'Generate a branded PDF invoice for every successful payment and email it to the customer.')
task.tags << tag_pay_feat

task = ::FactoryBot.create(:task, list: pay_doing, name: 'Implement Stripe webhooks', author: alice, priority: :high, points: 5,
  description: 'Handle payment_intent.succeeded, invoice.payment_failed, and customer.subscription.deleted events.')
task.tags << tag_pay_stripe << tag_pay_sec
task.users << bob
::FactoryBot.create(:comment, task:, author: henry, body: 'Make sure to verify the webhook signature before processing.')

task = ::FactoryBot.create(:task, list: pay_doing, name: 'Write payment flow integration tests', author: bob, priority: :high, points: 5,
  description: 'Cover happy path, card decline, and webhook delivery using Stripe test mode.')
task.tags << tag_pay_test
task.users << grace

task = ::FactoryBot.create(:task, list: pay_done, name: 'Set up Stripe account and keys', author: alice, priority: :low, points: 1,
  description: 'Create Stripe account, configure test/live API keys in environment config.')
task.tags << tag_pay_stripe

task = ::FactoryBot.create(:task, list: pay_done, name: 'Basic checkout session', author: alice, priority: :high, points: 5,
  description: 'Integrate Stripe Checkout for one-time payments.')
task.tags << tag_pay_stripe << tag_pay_feat

# --- Board: User Research ---

research = ::FactoryBot.create(:board, name: 'User Research', workspace: startup, color: '#8E44AD')

tag_res_int  = ::FactoryBot.create(:tag, name: 'Interviews',  board: research, color: '#1abc9c')
tag_res_surv = ::FactoryBot.create(:tag, name: 'Survey',      board: research, color: '#3498db')
tag_res_anal = ::FactoryBot.create(:tag, name: 'Analysis',    board: research, color: '#9b59b6')

res_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: research, visible: true)
res_doing = ::FactoryBot.create(:list, name: 'In Progress', board: research, visible: true)
res_done  = ::FactoryBot.create(:list, name: 'Done',        board: research, visible: true)

task = ::FactoryBot.create(:task, list: res_todo, name: 'Recruit 10 interview participants', author: alice, priority: :high, points: 3,
  description: 'Reach out via email and LinkedIn to recruit early adopters for 30-minute user interviews.')
task.tags << tag_res_int
task.users << mia

task = ::FactoryBot.create(:task, list: res_doing, name: 'Run usability testing on onboarding', author: alice, priority: :high, points: 5,
  description: 'Observe 5 participants completing the onboarding flow and note friction points.')
task.tags << tag_res_int << tag_res_anal
task.users << grace
::FactoryBot.create(:comment, task:, author: mia, body: 'Session recordings are in Loom. Tagging moments in the shared sheet.')

task = ::FactoryBot.create(:task, list: res_done, name: 'Send post-launch NPS survey', author: alice, priority: :medium, points: 2,
  description: 'Deploy NPS survey via Typeform to all users 7 days after first login.')
task.tags << tag_res_surv

task = ::FactoryBot.create(:task, list: res_done, name: 'Analyse onboarding drop-off data', author: alice, priority: :medium, points: 3,
  description: 'Review GA4 funnel data and identify the step with the highest drop-off rate.')
task.tags << tag_res_anal

# === Workspace: HealthPlus ===

health = ::FactoryBot.create(:workspace, name: 'HealthPlus')
health.users << admin << alice << carol << dave << isabel << karen << liam << noah << herman

# --- Board: Patient Portal ---

portal = ::FactoryBot.create(:board, name: 'Patient Portal', workspace: health, color: '#1ABC9C')

tag_hp_ux    = ::FactoryBot.create(:tag, name: 'UX',          board: portal, color: '#e67e22')
tag_hp_api   = ::FactoryBot.create(:tag, name: 'API',         board: portal, color: '#2980b9')
tag_hp_sec   = ::FactoryBot.create(:tag, name: 'Security',    board: portal, color: '#c0392b')
tag_hp_feat  = ::FactoryBot.create(:tag, name: 'Feature',     board: portal, color: '#27ae60')
tag_hp_a11y  = ::FactoryBot.create(:tag, name: 'Accessibility',board: portal, color: '#8e44ad')

pp_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: portal, visible: false)
pp_todo    = ::FactoryBot.create(:list, name: 'To Do',       board: portal, visible: true)
pp_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: portal, visible: true)
pp_review  = ::FactoryBot.create(:list, name: 'Review',      board: portal, visible: true)
pp_done    = ::FactoryBot.create(:list, name: 'Done',        board: portal, visible: true)

task = ::FactoryBot.create(:task, list: pp_backlog, name: 'Add telehealth video consultation', author: alice, priority: :high, points: 13,
  description: 'Integrate WebRTC-based video calls so patients can consult doctors remotely.')
task.tags << tag_hp_feat << tag_hp_api

task = ::FactoryBot.create(:task, list: pp_backlog, name: 'Implement prescription refill requests', author: carol, priority: :medium, points: 8,
  description: 'Allow patients to request prescription refills through the portal.')
task.tags << tag_hp_feat

task = ::FactoryBot.create(:task, list: pp_todo, name: 'Build medication tracker', author: alice, priority: :high, points: 8,
  description: 'Let patients log daily medications with dosage and set reminder notifications.')
task.tags << tag_hp_feat << tag_hp_ux
task.users << karen

task = ::FactoryBot.create(:task, list: pp_todo, name: 'Audit WCAG 2.1 compliance', author: alice, priority: :high, points: 5,
  description: 'Run accessibility audit across all portal views and fix Level A and AA violations.')
task.tags << tag_hp_a11y
task.users << liam

task = ::FactoryBot.create(:task, list: pp_todo, name: 'Fix session timeout not logging out', author: dave, priority: :high, points: 3,
  description: 'Idle session should trigger logout after 15 minutes but the token is never invalidated.')
task.tags << tag_hp_sec
task.users << dave

task = ::FactoryBot.create(:task, list: pp_doing, name: 'Lab results viewer', author: alice, priority: :high, points: 8,
  description: 'Display lab results in a structured table with reference ranges highlighted for abnormal values.')
task.tags << tag_hp_feat << tag_hp_ux
task.users << isabel
::FactoryBot.create(:comment, task:, author: carol, body: 'We need a doctor sign-off before displaying results to avoid patient anxiety.')
::FactoryBot.create(:comment, task:, author: alice, body: 'Adding a "reviewed by" flag to the result record.')

task = ::FactoryBot.create(:task, list: pp_doing, name: 'Migrate auth to OAuth 2.0', author: alice, priority: :medium, points: 8,
  description: 'Replace session cookies with OAuth 2.0 tokens to support future SSO integrations.')
task.tags << tag_hp_sec << tag_hp_api
task.users << noah

task = ::FactoryBot.create(:task, list: pp_review, name: 'Appointment history page', author: alice, priority: :medium, points: 5,
  description: 'Show past appointments with doctor name, date, and notes. Allow PDF download.')
task.tags << tag_hp_feat << tag_hp_ux
task.users << karen

task = ::FactoryBot.create(:task, list: pp_done, name: 'Patient registration flow', author: alice, priority: :high, points: 8,
  description: 'Multi-step registration: personal details, insurance info, and emergency contacts.')
task.tags << tag_hp_feat << tag_hp_ux

task = ::FactoryBot.create(:task, list: pp_done, name: 'Encrypt PII at rest', author: alice, priority: :high, points: 5,
  description: 'Use AES-256 encryption for all personally identifiable health data stored in the database.')
task.tags << tag_hp_sec

# --- Board: Appointment Scheduling ---

scheduling = ::FactoryBot.create(:board, name: 'Appointment Scheduling', workspace: health, color: '#2ECC71')

tag_sch_cal  = ::FactoryBot.create(:tag, name: 'Calendar',  board: scheduling, color: '#3498db')
tag_sch_notif= ::FactoryBot.create(:tag, name: 'Notifications', board: scheduling, color: '#f39c12')
tag_sch_feat = ::FactoryBot.create(:tag, name: 'Feature',   board: scheduling, color: '#27ae60')
tag_sch_bug  = ::FactoryBot.create(:tag, name: 'Bug',       board: scheduling, color: '#c0392b')

sch_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: scheduling, visible: true)
sch_doing = ::FactoryBot.create(:list, name: 'In Progress', board: scheduling, visible: true)
sch_done  = ::FactoryBot.create(:list, name: 'Done',        board: scheduling, visible: true)

task = ::FactoryBot.create(:task, list: sch_todo, name: 'Add recurring appointment support', author: carol, priority: :medium, points: 8,
  description: 'Allow scheduling weekly or monthly recurring appointments with exception handling.')
task.tags << tag_sch_cal << tag_sch_feat
task.users << liam

task = ::FactoryBot.create(:task, list: sch_todo, name: 'Send SMS appointment reminders', author: alice, priority: :high, points: 5,
  description: 'Send SMS reminders 24h and 1h before each appointment via Twilio.')
task.tags << tag_sch_notif << tag_sch_feat
task.users << noah

task = ::FactoryBot.create(:task, list: sch_doing, name: 'Integrate Google Calendar sync', author: carol, priority: :medium, points: 8,
  description: 'Two-way sync appointments with patients Google or Outlook calendars via OAuth.')
task.tags << tag_sch_cal << tag_sch_feat
task.users << isabel
::FactoryBot.create(:comment, task:, author: alice, body: 'Scope the OAuth request to calendar.events only.')

task = ::FactoryBot.create(:task, list: sch_doing, name: 'Fix double-booking race condition', author: dave, priority: :high, points: 3,
  description: 'Two patients can book the same slot if requests arrive within milliseconds of each other.')
task.tags << tag_sch_bug
task.users << dave

task = ::FactoryBot.create(:task, list: sch_done, name: 'Basic slot availability API', author: alice, priority: :high, points: 5,
  description: 'REST endpoint returning available appointment slots for a given doctor and date range.')
task.tags << tag_sch_feat

task = ::FactoryBot.create(:task, list: sch_done, name: 'Email confirmation on booking', author: carol, priority: :medium, points: 2,
  description: 'Send a confirmation email with appointment details and a calendar .ics attachment.')
task.tags << tag_sch_notif << tag_sch_feat

# --- Board: Billing System ---

billing = ::FactoryBot.create(:board, name: 'Billing System', workspace: health, color: '#E67E22')

tag_bil_inv  = ::FactoryBot.create(:tag, name: 'Invoice',    board: billing, color: '#27ae60')
tag_bil_ins  = ::FactoryBot.create(:tag, name: 'Insurance',  board: billing, color: '#2980b9')
tag_bil_bug  = ::FactoryBot.create(:tag, name: 'Bug',        board: billing, color: '#c0392b')
tag_bil_comp = ::FactoryBot.create(:tag, name: 'Compliance', board: billing, color: '#8e44ad')

bil_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: billing, visible: true)
bil_doing = ::FactoryBot.create(:list, name: 'In Progress', board: billing, visible: true)
bil_done  = ::FactoryBot.create(:list, name: 'Done',        board: billing, visible: true)

task = ::FactoryBot.create(:task, list: bil_todo, name: 'Insurance claim submission', author: alice, priority: :high, points: 13,
  description: 'Automate EDI 837 claim submission to insurance providers on appointment completion.')
task.tags << tag_bil_ins << tag_bil_comp
task.users << herman

task = ::FactoryBot.create(:task, list: bil_todo, name: 'Add payment plan support', author: carol, priority: :medium, points: 8,
  description: 'Allow patients to split outstanding balances into monthly instalments.')
task.tags << tag_bil_inv << tag_bil_feat if defined?(tag_bil_feat)
task.tags << tag_bil_inv

task = ::FactoryBot.create(:task, list: bil_doing, name: 'Generate itemised invoices', author: alice, priority: :high, points: 5,
  description: 'Produce PDF invoices breaking down each service, copay, and insurance adjustment.')
task.tags << tag_bil_inv
task.users << noah
::FactoryBot.create(:comment, task:, author: herman, body: 'Invoices must include NPI number and ICD-10 codes for insurance compliance.')

task = ::FactoryBot.create(:task, list: bil_doing, name: 'Fix copay calculation for PPO plans', author: dave, priority: :high, points: 3,
  description: 'PPO copay is being calculated as a fixed amount instead of a percentage of allowed amount.')
task.tags << tag_bil_bug << tag_bil_ins
task.users << dave

task = ::FactoryBot.create(:task, list: bil_done, name: 'Set up billing database schema', author: alice, priority: :low, points: 3,
  description: 'Tables for invoices, line items, payments, insurance claims, and adjustments.')
task.tags << tag_bil_inv

# === Workspace: EduFlow ===

edu = ::FactoryBot.create(:workspace, name: 'EduFlow')
edu.users << admin << alice << bob << frank << grace << henry << mia << liam

# --- Board: Course Builder ---

course_builder = ::FactoryBot.create(:board, name: 'Course Builder', workspace: edu, color: '#F39C12')

tag_cb_content = ::FactoryBot.create(:tag, name: 'Content',  board: course_builder, color: '#e67e22')
tag_cb_ui      = ::FactoryBot.create(:tag, name: 'UI',       board: course_builder, color: '#3498db')
tag_cb_media   = ::FactoryBot.create(:tag, name: 'Media',    board: course_builder, color: '#9b59b6')
tag_cb_feat    = ::FactoryBot.create(:tag, name: 'Feature',  board: course_builder, color: '#27ae60')
tag_cb_bug     = ::FactoryBot.create(:tag, name: 'Bug',      board: course_builder, color: '#c0392b')

cb_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: course_builder, visible: false)
cb_todo    = ::FactoryBot.create(:list, name: 'To Do',       board: course_builder, visible: true)
cb_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: course_builder, visible: true)
cb_review  = ::FactoryBot.create(:list, name: 'Review',      board: course_builder, visible: true)
cb_done    = ::FactoryBot.create(:list, name: 'Done',        board: course_builder, visible: true)

task = ::FactoryBot.create(:task, list: cb_backlog, name: 'AI-powered quiz generation', author: frank, priority: :low, points: 13,
  description: 'Use an LLM to auto-generate quiz questions from lesson text content.')
task.tags << tag_cb_content << tag_cb_feat

task = ::FactoryBot.create(:task, list: cb_backlog, name: 'Course certificate generation', author: alice, priority: :medium, points: 5,
  description: 'Auto-generate and email a PDF certificate when a student completes a course.')
task.tags << tag_cb_feat

task = ::FactoryBot.create(:task, list: cb_todo, name: 'Drag-and-drop lesson ordering', author: frank, priority: :high, points: 5,
  description: 'Allow instructors to reorder lessons within a module using drag and drop.')
task.tags << tag_cb_ui << tag_cb_feat
task.users << grace

task = ::FactoryBot.create(:task, list: cb_todo, name: 'Rich text editor for lesson content', author: alice, priority: :high, points: 8,
  description: 'Integrate a rich text editor with support for headings, code blocks, images, and embeds.')
task.tags << tag_cb_content << tag_cb_ui
task.users << mia

task = ::FactoryBot.create(:task, list: cb_todo, name: 'Fix video upload progress bar stalling', author: henry, priority: :high, points: 3,
  description: 'Upload progress bar freezes at 99% even though the upload completes successfully.')
task.tags << tag_cb_bug << tag_cb_media
task.users << henry

task = ::FactoryBot.create(:task, list: cb_doing, name: 'Video transcoding pipeline', author: frank, priority: :high, points: 13,
  description: 'Transcode uploaded videos to HLS format with multiple quality levels using FFmpeg.')
task.tags << tag_cb_media << tag_cb_feat
task.users << henry
::FactoryBot.create(:comment, task:, author: grace, body: 'Should we use AWS Elastic Transcoder or a self-hosted FFmpeg worker?')
::FactoryBot.create(:comment, task:, author: frank, body: 'Self-hosted for cost control. We can move to managed later.')

task = ::FactoryBot.create(:task, list: cb_doing, name: 'Module completion tracking', author: alice, priority: :medium, points: 5,
  description: 'Track which lessons a student has completed and show progress per module.')
task.tags << tag_cb_feat
task.users << liam

task = ::FactoryBot.create(:task, list: cb_review, name: 'Course preview for unpublished content', author: frank, priority: :medium, points: 3,
  description: 'Allow instructors to preview the student view of a course before publishing.')
task.tags << tag_cb_ui << tag_cb_feat
task.users << grace

task = ::FactoryBot.create(:task, list: cb_done, name: 'Course CRUD API', author: alice, priority: :high, points: 5,
  description: 'REST API for creating, reading, updating, and deleting courses and modules.')
task.tags << tag_cb_feat

task = ::FactoryBot.create(:task, list: cb_done, name: 'File upload to S3', author: henry, priority: :medium, points: 3,
  description: 'Direct-to-S3 upload for course assets using presigned URLs.')
task.tags << tag_cb_media << tag_cb_feat

# --- Board: Student Dashboard ---

student_dash = ::FactoryBot.create(:board, name: 'Student Dashboard', workspace: edu, color: '#3498DB')

tag_sd_ux    = ::FactoryBot.create(:tag, name: 'UX',        board: student_dash, color: '#e67e22')
tag_sd_perf  = ::FactoryBot.create(:tag, name: 'Performance',board: student_dash, color: '#c0392b')
tag_sd_feat  = ::FactoryBot.create(:tag, name: 'Feature',   board: student_dash, color: '#27ae60')
tag_sd_bug   = ::FactoryBot.create(:tag, name: 'Bug',       board: student_dash, color: '#e74c3c')

sd_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: student_dash, visible: true)
sd_doing = ::FactoryBot.create(:list, name: 'In Progress', board: student_dash, visible: true)
sd_done  = ::FactoryBot.create(:list, name: 'Done',        board: student_dash, visible: true)

task = ::FactoryBot.create(:task, list: sd_todo, name: 'Learning streak feature', author: frank, priority: :medium, points: 5,
  description: 'Show a daily streak counter to encourage consistent learning habits.')
task.tags << tag_sd_feat << tag_sd_ux
task.users << mia

task = ::FactoryBot.create(:task, list: sd_todo, name: 'Recommended courses widget', author: alice, priority: :medium, points: 5,
  description: 'Surface 3 course recommendations based on completed courses and browsing history.')
task.tags << tag_sd_feat << tag_sd_ux

task = ::FactoryBot.create(:task, list: sd_doing, name: 'Dashboard initial load optimisation', author: frank, priority: :high, points: 8,
  description: 'Dashboard takes 4+ seconds to load. Profile and fix the slowest API calls.')
task.tags << tag_sd_perf
task.users << henry
::FactoryBot.create(:comment, task:, author: frank, body: 'The enrolled courses query is doing a full table scan. Adding an index.')

task = ::FactoryBot.create(:task, list: sd_doing, name: 'Assignment submission status', author: alice, priority: :high, points: 5,
  description: 'Show submission status (Not submitted, Submitted, Graded) per assignment on the dashboard.')
task.tags << tag_sd_feat
task.users << liam

task = ::FactoryBot.create(:task, list: sd_done, name: 'Enrolled courses list', author: alice, priority: :high, points: 3,
  description: 'Show all enrolled courses with progress bar and last-accessed date.')
task.tags << tag_sd_feat << tag_sd_ux

task = ::FactoryBot.create(:task, list: sd_done, name: 'Fix broken links in course sidebar', author: grace, priority: :high, points: 2,
  description: 'Lesson links in the sidebar 404 when the course slug contains special characters.')
task.tags << tag_sd_bug

# --- Board: Assessment Engine ---

assessment = ::FactoryBot.create(:board, name: 'Assessment Engine', workspace: edu, color: '#9B59B6')

tag_ae_quiz  = ::FactoryBot.create(:tag, name: 'Quiz',      board: assessment, color: '#f39c12')
tag_ae_grade = ::FactoryBot.create(:tag, name: 'Grading',   board: assessment, color: '#27ae60')
tag_ae_feat  = ::FactoryBot.create(:tag, name: 'Feature',   board: assessment, color: '#3498db')
tag_ae_bug   = ::FactoryBot.create(:tag, name: 'Bug',       board: assessment, color: '#c0392b')

ae_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: assessment, visible: true)
ae_doing = ::FactoryBot.create(:list, name: 'In Progress', board: assessment, visible: true)
ae_done  = ::FactoryBot.create(:list, name: 'Done',        board: assessment, visible: true)

task = ::FactoryBot.create(:task, list: ae_todo, name: 'Timed quiz mode', author: frank, priority: :medium, points: 5,
  description: 'Add an optional countdown timer to quizzes. Auto-submit on expiry.')
task.tags << tag_ae_quiz << tag_ae_feat
task.users << grace

task = ::FactoryBot.create(:task, list: ae_todo, name: 'Instructor grade override', author: alice, priority: :low, points: 3,
  description: 'Allow instructors to manually adjust auto-graded scores with a comment.')
task.tags << tag_ae_grade << tag_ae_feat

task = ::FactoryBot.create(:task, list: ae_doing, name: 'Randomise question order', author: frank, priority: :medium, points: 3,
  description: 'Shuffle question order per attempt to reduce answer sharing between students.')
task.tags << tag_ae_quiz << tag_ae_feat
task.users << mia
::FactoryBot.create(:comment, task:, author: alice, body: 'Seed the shuffle with the attempt ID so retakes get a different order.')

task = ::FactoryBot.create(:task, list: ae_doing, name: 'Fix partial credit scoring', author: henry, priority: :high, points: 3,
  description: 'Multi-select questions award zero even when some correct options are chosen.')
task.tags << tag_ae_bug << tag_ae_grade
task.users << henry

task = ::FactoryBot.create(:task, list: ae_done, name: 'Multiple choice question type', author: frank, priority: :high, points: 5,
  description: 'Single and multi-select question types with automatic correct-answer grading.')
task.tags << tag_ae_quiz << tag_ae_feat

task = ::FactoryBot.create(:task, list: ae_done, name: 'Quiz attempt history', author: alice, priority: :medium, points: 3,
  description: 'Store each quiz attempt with score, answers, and timestamp for review.')
task.tags << tag_ae_feat

# === Workspace: MediaStream ===

media = ::FactoryBot.create(:workspace, name: 'MediaStream')
media.users << admin << bob << dave << eve << frank << grace << isabel << noah << brice

# --- Board: Content Management ---

cms = ::FactoryBot.create(:board, name: 'Content Management', workspace: media, color: '#2C3E50')

tag_cms_content = ::FactoryBot.create(:tag, name: 'Content',   board: cms, color: '#e67e22')
tag_cms_meta    = ::FactoryBot.create(:tag, name: 'Metadata',  board: cms, color: '#3498db')
tag_cms_feat    = ::FactoryBot.create(:tag, name: 'Feature',   board: cms, color: '#27ae60')
tag_cms_bug     = ::FactoryBot.create(:tag, name: 'Bug',       board: cms, color: '#c0392b')

cms_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: cms, visible: false)
cms_todo    = ::FactoryBot.create(:list, name: 'To Do',       board: cms, visible: true)
cms_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: cms, visible: true)
cms_review  = ::FactoryBot.create(:list, name: 'Review',      board: cms, visible: true)
cms_done    = ::FactoryBot.create(:list, name: 'Done',        board: cms, visible: true)

task = ::FactoryBot.create(:task, list: cms_backlog, name: 'Multi-language subtitle support', author: frank, priority: :medium, points: 8,
  description: 'Allow uploading and displaying subtitles in multiple languages per video.')
task.tags << tag_cms_content << tag_cms_feat

task = ::FactoryBot.create(:task, list: cms_backlog, name: 'Content scheduling and publishing', author: bob, priority: :medium, points: 5,
  description: 'Let editors schedule content to publish automatically at a future date and time.')
task.tags << tag_cms_content << tag_cms_feat

task = ::FactoryBot.create(:task, list: cms_todo, name: 'Bulk content import from CSV', author: frank, priority: :medium, points: 5,
  description: 'Allow editors to import video metadata in bulk via a CSV upload.')
task.tags << tag_cms_content << tag_cms_feat
task.users << isabel

task = ::FactoryBot.create(:task, list: cms_todo, name: 'Content moderation queue', author: bob, priority: :high, points: 8,
  description: 'Build a review queue where moderators approve or reject user-submitted content.')
task.tags << tag_cms_content << tag_cms_feat
task.users << eve

task = ::FactoryBot.create(:task, list: cms_todo, name: 'Fix broken thumbnail generation', author: dave, priority: :high, points: 3,
  description: 'Thumbnails are not generated for videos longer than 2 hours. FFmpeg timeout issue.')
task.tags << tag_cms_bug
task.users << dave

task = ::FactoryBot.create(:task, list: cms_doing, name: 'Tag and category taxonomy', author: frank, priority: :high, points: 5,
  description: 'Hierarchical category tree with free-form tags. Editors can assign multiple categories per title.')
task.tags << tag_cms_meta << tag_cms_feat
task.users << grace
::FactoryBot.create(:comment, task:, author: bob, body: 'Cap the category depth at 3 levels to keep queries simple.')

task = ::FactoryBot.create(:task, list: cms_doing, name: 'Version history for edited metadata', author: bob, priority: :medium, points: 5,
  description: 'Store a full edit history for title, description, and tags so changes can be reverted.')
task.tags << tag_cms_meta << tag_cms_feat
task.users << isabel

task = ::FactoryBot.create(:task, list: cms_review, name: 'Content search with filters', author: frank, priority: :high, points: 8,
  description: 'Full-text search over titles and descriptions, filterable by genre, year, and rating.')
task.tags << tag_cms_content << tag_cms_meta
task.users << noah

task = ::FactoryBot.create(:task, list: cms_done, name: 'Video metadata schema', author: bob, priority: :low, points: 3,
  description: 'Database schema for videos: title, description, duration, genre, cast, release year, ratings.')
task.tags << tag_cms_meta

task = ::FactoryBot.create(:task, list: cms_done, name: 'Admin content upload UI', author: frank, priority: :medium, points: 5,
  description: 'Upload form with drag-and-drop file input, metadata fields, and publish toggle.')
task.tags << tag_cms_content << tag_cms_feat

# --- Board: Video Encoding ---

encoding = ::FactoryBot.create(:board, name: 'Video Encoding', workspace: media, color: '#E74C3C')

tag_enc_perf   = ::FactoryBot.create(:tag, name: 'Performance', board: encoding, color: '#e67e22')
tag_enc_infra  = ::FactoryBot.create(:tag, name: 'Infrastructure',board: encoding, color: '#2c3e50')
tag_enc_feat   = ::FactoryBot.create(:tag, name: 'Feature',    board: encoding, color: '#27ae60')
tag_enc_bug    = ::FactoryBot.create(:tag, name: 'Bug',        board: encoding, color: '#c0392b')

enc_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: encoding, visible: true)
enc_doing = ::FactoryBot.create(:list, name: 'In Progress', board: encoding, visible: true)
enc_done  = ::FactoryBot.create(:list, name: 'Done',        board: encoding, visible: true)

task = ::FactoryBot.create(:task, list: enc_todo, name: 'Add 4K encoding profile', author: frank, priority: :medium, points: 8,
  description: 'Add a 2160p H.265 encoding profile alongside the existing 1080p and 720p outputs.')
task.tags << tag_enc_feat << tag_enc_perf
task.users << dave

task = ::FactoryBot.create(:task, list: enc_todo, name: 'Per-scene quality optimisation', author: dave, priority: :low, points: 13,
  description: 'Use scene-change detection to dynamically vary bitrate for better quality-per-byte.')
task.tags << tag_enc_perf << tag_enc_feat

task = ::FactoryBot.create(:task, list: enc_doing, name: 'Distributed encoding job queue', author: frank, priority: :high, points: 13,
  description: 'Replace the single-server FFmpeg worker with a distributed job queue using Sidekiq and Redis.')
task.tags << tag_enc_infra << tag_enc_feat
task.users << dave
::FactoryBot.create(:comment, task:, author: bob, body: 'Each worker should claim jobs via Redis RPOPLPUSH for atomic assignment.')

task = ::FactoryBot.create(:task, list: enc_doing, name: 'Fix audio sync drift on long videos', author: dave, priority: :high, points: 5,
  description: 'Videos over 90 minutes develop A/V sync drift of up to 2 seconds by the end.')
task.tags << tag_enc_bug
task.users << dave

task = ::FactoryBot.create(:task, list: enc_done, name: 'HLS output with adaptive bitrate', author: frank, priority: :high, points: 8,
  description: 'Encode videos to HLS with 360p/720p/1080p renditions for adaptive streaming.')
task.tags << tag_enc_feat

task = ::FactoryBot.create(:task, list: enc_done, name: 'Encoding progress webhook', author: bob, priority: :medium, points: 3,
  description: 'Fire a webhook event at 0%, 50%, and 100% encoding progress so the CMS can update status.')
task.tags << tag_enc_feat

# --- Board: Recommendation Engine ---

reco = ::FactoryBot.create(:board, name: 'Recommendation Engine', workspace: media, color: '#8E44AD')

tag_rec_ml   = ::FactoryBot.create(:tag, name: 'ML',        board: reco, color: '#9b59b6')
tag_rec_data = ::FactoryBot.create(:tag, name: 'Data',      board: reco, color: '#3498db')
tag_rec_feat = ::FactoryBot.create(:tag, name: 'Feature',   board: reco, color: '#27ae60')
tag_rec_bug  = ::FactoryBot.create(:tag, name: 'Bug',       board: reco, color: '#c0392b')

rec_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: reco, visible: true)
rec_doing = ::FactoryBot.create(:list, name: 'In Progress', board: reco, visible: true)
rec_done  = ::FactoryBot.create(:list, name: 'Done',        board: reco, visible: true)

task = ::FactoryBot.create(:task, list: rec_todo, name: 'A/B test recommendation algorithms', author: frank, priority: :medium, points: 8,
  description: 'Run an A/B test between collaborative filtering and content-based filtering to measure CTR.')
task.tags << tag_rec_ml << tag_rec_data
task.users << grace

task = ::FactoryBot.create(:task, list: rec_todo, name: 'Trending content ranking', author: bob, priority: :medium, points: 5,
  description: 'Rank trending titles by view velocity over the last 24 hours, weighted by completion rate.')
task.tags << tag_rec_data << tag_rec_feat

task = ::FactoryBot.create(:task, list: rec_doing, name: 'Train collaborative filtering model', author: frank, priority: :high, points: 13,
  description: 'Train a matrix factorisation model on user watch history using implicit feedback signals.')
task.tags << tag_rec_ml << tag_rec_data
task.users << grace
::FactoryBot.create(:comment, task:, author: frank, body: 'Using ALS from Spark MLlib. Training data in the data warehouse.')

task = ::FactoryBot.create(:task, list: rec_doing, name: 'Fix recommendations including already-watched titles', author: isabel, priority: :high, points: 3,
  description: 'Completed titles are appearing in the recommendations row. Filter them out post-scoring.')
task.tags << tag_rec_bug
task.users << isabel

task = ::FactoryBot.create(:task, list: rec_done, name: 'Watch history data pipeline', author: frank, priority: :high, points: 8,
  description: 'Stream play events from the player to Kafka, aggregate in Flink, and land in the data warehouse.')
task.tags << tag_rec_data << tag_rec_feat

task = ::FactoryBot.create(:task, list: rec_done, name: 'Recommendations API endpoint', author: bob, priority: :high, points: 5,
  description: 'GET /api/recommendations returns a ranked list of content IDs for the current user.')
task.tags << tag_rec_feat

# --- Board: Mobile Player ---

player = ::FactoryBot.create(:board, name: 'Mobile Player', workspace: media, color: '#1ABC9C')

tag_pl_ios     = ::FactoryBot.create(:tag, name: 'iOS',      board: player, color: '#1abc9c')
tag_pl_android = ::FactoryBot.create(:tag, name: 'Android',  board: player, color: '#3498db')
tag_pl_bug     = ::FactoryBot.create(:tag, name: 'Bug',      board: player, color: '#c0392b')
tag_pl_feat    = ::FactoryBot.create(:tag, name: 'Feature',  board: player, color: '#27ae60')

pl_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: player, visible: true)
pl_doing = ::FactoryBot.create(:list, name: 'In Progress', board: player, visible: true)
pl_done  = ::FactoryBot.create(:list, name: 'Done',        board: player, visible: true)

task = ::FactoryBot.create(:task, list: pl_todo, name: 'Picture-in-picture mode', author: bob, priority: :medium, points: 5,
  description: 'Support native PiP on both iOS and Android so playback continues while using other apps.')
task.tags << tag_pl_ios << tag_pl_android << tag_pl_feat
task.users << eve

task = ::FactoryBot.create(:task, list: pl_todo, name: 'Download for offline playback', author: frank, priority: :high, points: 13,
  description: 'Allow users to download titles to device storage for offline viewing. DRM protected.')
task.tags << tag_pl_feat
task.users << noah

task = ::FactoryBot.create(:task, list: pl_doing, name: 'Chromecast support', author: bob, priority: :medium, points: 8,
  description: 'Integrate the Google Cast SDK to enable casting from the mobile app to Chromecast devices.')
task.tags << tag_pl_feat << tag_pl_android
task.users << brice
::FactoryBot.create(:comment, task:, author: frank, body: 'We need to test with both Cast-enabled TVs and Chromecast dongles.')

task = ::FactoryBot.create(:task, list: pl_doing, name: 'Fix seek bar position on iPhone 15 Pro', author: eve, priority: :high, points: 2,
  description: 'The seek bar overlaps the home indicator on iPhone 15 Pro due to the dynamic island inset.')
task.tags << tag_pl_bug << tag_pl_ios
task.users << eve

task = ::FactoryBot.create(:task, list: pl_done, name: 'HLS adaptive streaming player', author: frank, priority: :high, points: 8,
  description: 'Integrate AVPlayer (iOS) and ExoPlayer (Android) for HLS adaptive bitrate playback.')
task.tags << tag_pl_ios << tag_pl_android << tag_pl_feat

task = ::FactoryBot.create(:task, list: pl_done, name: 'Resume playback from last position', author: bob, priority: :medium, points: 3,
  description: 'Store playback position server-side and resume from where the user left off on any device.')
task.tags << tag_pl_feat

# === Workspace: GlobalBank ===

bank = ::FactoryBot.create(:workspace, name: 'GlobalBank')
bank.users << admin << alice << carol << henry << isabel << jack << liam << noah << herman

# --- Board: Core Banking Platform ---

core_banking = ::FactoryBot.create(:board, name: 'Core Banking Platform', workspace: bank, color: '#2C3E50')

tag_bk_api  = ::FactoryBot.create(:tag, name: 'API',        board: core_banking, color: '#3498db')
tag_bk_sec  = ::FactoryBot.create(:tag, name: 'Security',   board: core_banking, color: '#c0392b')
tag_bk_db   = ::FactoryBot.create(:tag, name: 'Database',   board: core_banking, color: '#336791')
tag_bk_comp = ::FactoryBot.create(:tag, name: 'Compliance', board: core_banking, color: '#8e44ad')
tag_bk_feat = ::FactoryBot.create(:tag, name: 'Feature',    board: core_banking, color: '#27ae60')

cb_bk_backlog = ::FactoryBot.create(:list, name: 'Backlog',     board: core_banking, visible: false)
cb_bk_todo    = ::FactoryBot.create(:list, name: 'To Do',       board: core_banking, visible: true)
cb_bk_doing   = ::FactoryBot.create(:list, name: 'In Progress', board: core_banking, visible: true)
cb_bk_review  = ::FactoryBot.create(:list, name: 'Review',      board: core_banking, visible: true)
cb_bk_done    = ::FactoryBot.create(:list, name: 'Done',        board: core_banking, visible: true)

task = ::FactoryBot.create(:task, list: cb_bk_backlog, name: 'Open Banking API (PSD2)', author: alice, priority: :high, points: 21,
  description: 'Expose account and payment initiation APIs conformant with PSD2 and the OpenBanking standard.')
task.tags << tag_bk_api << tag_bk_comp

task = ::FactoryBot.create(:task, list: cb_bk_backlog, name: 'Real-time payment rails (ISO 20022)', author: herman, priority: :high, points: 13,
  description: 'Integrate with the national real-time payment scheme using ISO 20022 message format.')
task.tags << tag_bk_api << tag_bk_comp

task = ::FactoryBot.create(:task, list: cb_bk_todo, name: 'GDPR data deletion workflow', author: alice, priority: :high, points: 8,
  description: 'Implement the right-to-erasure workflow. Anonymise closed-account data within 30 days.')
task.tags << tag_bk_comp << tag_bk_sec
task.users << herman

task = ::FactoryBot.create(:task, list: cb_bk_todo, name: 'Multi-currency account support', author: jack, priority: :high, points: 13,
  description: 'Allow customers to hold balances in up to 5 currencies with real-time FX conversion.')
task.tags << tag_bk_feat << tag_bk_db
task.users << liam

task = ::FactoryBot.create(:task, list: cb_bk_todo, name: 'Audit log for all account mutations', author: alice, priority: :high, points: 5,
  description: 'Write an immutable audit record for every balance change, including actor and timestamp.')
task.tags << tag_bk_comp << tag_bk_db
task.users << noah

task = ::FactoryBot.create(:task, list: cb_bk_doing, name: 'Ledger double-entry engine', author: alice, priority: :high, points: 13,
  description: 'Implement a double-entry bookkeeping engine to ensure debit/credit balance on every transaction.')
task.tags << tag_bk_db << tag_bk_feat
task.users << henry
::FactoryBot.create(:comment, task:, author: herman, body: 'Every journal entry must be atomic. Use a serialised transaction with a unique idempotency key.')
::FactoryBot.create(:comment, task:, author: henry, body: 'Using PostgreSQL advisory locks to prevent concurrent entries on the same account.')

task = ::FactoryBot.create(:task, list: cb_bk_doing, name: 'PCI-DSS tokenisation layer', author: alice, priority: :high, points: 8,
  description: 'Replace raw card numbers in storage and transit with PCI-compliant tokens via a vault service.')
task.tags << tag_bk_sec << tag_bk_comp
task.users << carol

task = ::FactoryBot.create(:task, list: cb_bk_review, name: 'Beneficiary management API', author: jack, priority: :medium, points: 5,
  description: 'CRUD endpoints for managing saved payment beneficiaries with IBAN validation.')
task.tags << tag_bk_api << tag_bk_feat
task.users << isabel

task = ::FactoryBot.create(:task, list: cb_bk_done, name: 'Account opening KYC checks', author: alice, priority: :high, points: 8,
  description: 'Integrate identity verification provider for document upload and liveness checks.')
task.tags << tag_bk_comp << tag_bk_sec

task = ::FactoryBot.create(:task, list: cb_bk_done, name: 'Core schema and migrations', author: alice, priority: :low, points: 5,
  description: 'Initial schema: accounts, transactions, customers, beneficiaries, and audit_logs tables.')
task.tags << tag_bk_db

# --- Board: Fraud Detection ---

fraud = ::FactoryBot.create(:board, name: 'Fraud Detection', workspace: bank, color: '#C0392B')

tag_fr_ml    = ::FactoryBot.create(:tag, name: 'ML',        board: fraud, color: '#9b59b6')
tag_fr_rules = ::FactoryBot.create(:tag, name: 'Rules',     board: fraud, color: '#e67e22')
tag_fr_alert = ::FactoryBot.create(:tag, name: 'Alerting',  board: fraud, color: '#c0392b')
tag_fr_feat  = ::FactoryBot.create(:tag, name: 'Feature',   board: fraud, color: '#27ae60')

fr_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: fraud, visible: true)
fr_doing = ::FactoryBot.create(:list, name: 'In Progress', board: fraud, visible: true)
fr_done  = ::FactoryBot.create(:list, name: 'Done',        board: fraud, visible: true)

task = ::FactoryBot.create(:task, list: fr_todo, name: 'Real-time transaction scoring', author: alice, priority: :high, points: 13,
  description: 'Score every transaction in under 100ms using a lightweight ML model served via REST.')
task.tags << tag_fr_ml << tag_fr_feat
task.users << henry

task = ::FactoryBot.create(:task, list: fr_todo, name: 'Device fingerprinting', author: carol, priority: :medium, points: 8,
  description: 'Collect device signals at login to detect account takeover from unknown devices.')
task.tags << tag_fr_feat << tag_fr_rules
task.users << noah

task = ::FactoryBot.create(:task, list: fr_doing, name: 'Velocity rule engine', author: alice, priority: :high, points: 8,
  description: 'Block transactions that exceed configurable thresholds: amount per day, count per hour, etc.')
task.tags << tag_fr_rules << tag_fr_feat
task.users << henry
::FactoryBot.create(:comment, task:, author: herman, body: 'Rules must be hot-reloadable without a deployment. Store in the database.')

task = ::FactoryBot.create(:task, list: fr_doing, name: 'Case management UI for analysts', author: jack, priority: :high, points: 8,
  description: 'UI for fraud analysts to review flagged transactions, add notes, and mark as fraud or false positive.')
task.tags << tag_fr_alert << tag_fr_feat
task.users << isabel

task = ::FactoryBot.create(:task, list: fr_done, name: 'IP geolocation risk scoring', author: alice, priority: :medium, points: 5,
  description: 'Add a risk signal based on transaction IP country vs account country of residence.')
task.tags << tag_fr_rules << tag_fr_ml

task = ::FactoryBot.create(:task, list: fr_done, name: 'Customer transaction alert emails', author: carol, priority: :medium, points: 3,
  description: 'Email customers immediately for transactions above a configurable threshold.')
task.tags << tag_fr_alert << tag_fr_feat

# --- Board: Compliance & Reporting ---

compliance = ::FactoryBot.create(:board, name: 'Compliance & Reporting', workspace: bank, color: '#8E44AD')

tag_co_reg  = ::FactoryBot.create(:tag, name: 'Regulatory', board: compliance, color: '#8e44ad')
tag_co_rep  = ::FactoryBot.create(:tag, name: 'Reporting',  board: compliance, color: '#3498db')
tag_co_audit= ::FactoryBot.create(:tag, name: 'Audit',      board: compliance, color: '#e67e22')
tag_co_feat = ::FactoryBot.create(:tag, name: 'Feature',    board: compliance, color: '#27ae60')

co_todo  = ::FactoryBot.create(:list, name: 'To Do',       board: compliance, visible: true)
co_doing = ::FactoryBot.create(:list, name: 'In Progress', board: compliance, visible: true)
co_done  = ::FactoryBot.create(:list, name: 'Done',        board: compliance, visible: true)

task = ::FactoryBot.create(:task, list: co_todo, name: 'Automated SAR filing', author: alice, priority: :high, points: 13,
  description: 'Auto-generate Suspicious Activity Reports and submit to FinCEN via the BSA E-Filing API.')
task.tags << tag_co_reg << tag_co_feat
task.users << herman

task = ::FactoryBot.create(:task, list: co_todo, name: 'FATCA reporting export', author: herman, priority: :medium, points: 8,
  description: 'Generate XML exports for annual FATCA reporting to the IRS.')
task.tags << tag_co_reg << tag_co_rep

task = ::FactoryBot.create(:task, list: co_doing, name: 'AML transaction monitoring reports', author: alice, priority: :high, points: 8,
  description: 'Scheduled daily reports flagging transactions that match AML typologies.')
task.tags << tag_co_reg << tag_co_rep
task.users << liam
::FactoryBot.create(:comment, task:, author: herman, body: 'Reports must be retained for 7 years per BSA requirements.')

task = ::FactoryBot.create(:task, list: co_doing, name: 'Regulatory change tracker', author: herman, priority: :medium, points: 5,
  description: 'Internal tool to track upcoming regulatory changes, assign owners, and monitor remediation progress.')
task.tags << tag_co_reg << tag_co_feat
task.users << alice

task = ::FactoryBot.create(:task, list: co_done, name: 'SOX-compliant access control audit', author: alice, priority: :high, points: 5,
  description: 'Quarterly report of all privileged access grants and revocations for SOX compliance.')
task.tags << tag_co_audit << tag_co_reg

task = ::FactoryBot.create(:task, list: co_done, name: 'Data retention policy enforcement', author: alice, priority: :medium, points: 3,
  description: 'Automated job that purges or archives records past their retention period per data class.')
task.tags << tag_co_audit << tag_co_feat

# === Recent boards ===

admin.update!(recent_boards: [web_app.id.to_s])

# === Script ===

script = ::FactoryBot.create(:script, name: 'Log subject ID', author: admin,
  content: 'puts "Action: #{action} on #{subject&.class} ##{subject&.id}"')
::FactoryBot.create(:ui_script_trigger, script:, author: admin, subject: web_app, text: 'Log ID')
