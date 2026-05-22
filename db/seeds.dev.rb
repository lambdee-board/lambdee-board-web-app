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

# === Recent boards ===

admin.update!(recent_boards: [web_app.id.to_s])

# === Script ===

script = ::FactoryBot.create(:script, name: 'Log subject ID', author: admin,
  content: 'puts "Action: #{action} on #{subject&.class} ##{subject&.id}"')
::FactoryBot.create(:ui_script_trigger, script:, author: admin, subject: web_app, text: 'Log ID')
