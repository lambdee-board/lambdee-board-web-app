# Admin
admin = ::FactoryBot.create(:user, name: 'Bee Trantow', email: 'bee.trantow@example.com', role: :admin)

# === Netflux workspace ===

wrk = ::FactoryBot.create :workspace, name: 'Netflux'

# users for Netflux
wrk.users << user_brice = ::FactoryBot.create(:user, name: 'Brice Spinka', email: 'b-spinka@example.com', role: :manager)
wrk.users << user_tomasz = ::FactoryBot.create(:user, name: 'Tomasz Dziegeć', email: 't-dziegec@example.com', role: :developer)
wrk.users << user_bjorn = ::FactoryBot.create(:user, name: 'Björn Surströmming', email: 'b-surstromming@example.com', role: :developer)
wrk.users << user_thorsten = ::FactoryBot.create(:user, name: 'Thorsten Andersson', email: 't-andersson@example.com', role: :developer)
wrk.users << user_johan = ::FactoryBot.create(:user, name: 'Johan Johansson', email: 'j-johansson@example.com', role: :developer)
wrk.users << user_wojcislaw = ::FactoryBot.create(:user, name: 'Wojcisław Janicki', email: 'w-janicki@example.com', role: :developer)
wrk.users << user_bozydar = ::FactoryBot.create(:user, name: 'Bożydar Starosielski', email: 'b-starosielski@example.com', role: :developer)
wrk.users << user_potezny = ::FactoryBot.create(:user, name: 'Potężny Warmianin', email: 'p-warmianin@example.com', role: :developer)
wrk.users << user_rupert = ::FactoryBot.create(:user, name: 'Rupert Reichel', email: 'r-reichel@example.com', role: :manager)

# boards for Netflux

board = ::FactoryBot.create(:board, name: 'Backend API', workspace: wrk, colour: '#111190')

# tags
tag_database = ::FactoryBot.create(:tag, name: 'Database', board:, colour: '#b82a94')
tag_rest_api = ::FactoryBot.create(:tag, name: 'REST API', board:, colour: '#294590')
tag_streaming_api = ::FactoryBot.create(:tag, name: 'Streaming API', board:, colour: '#824222')
tag_version = ::FactoryBot.create(:tag, name: 'v2.2.10', board:, colour: '#226222')
tag_ruby = ::FactoryBot.create(:tag, name: 'Ruby', board:, colour: '#922222')
tag_devops = ::FactoryBot.create(:tag, name: 'DevOps', board:, colour: '#027770')
tag_open_source = ::FactoryBot.create(:tag, name: 'Open Source', board:, colour: '#527770')
tag_library = ::FactoryBot.create(:tag, name: 'Library', board:, colour: '#52ff70')

# Backlog list
list = ::FactoryBot.create(:list, name: 'Backlog', visible: false, board:)

task = ::FactoryBot.create(:task, list:, name: 'Fix JWT authentication', author: user_bjorn, priority: :high, points: 5, description: <<~MD)
  ## JWT authentication is broken

  There is a bug in our API's authentication system.
  It is susceptible to timing attacks.

  We should transition to a safer implementation.

  While we're at it we could switch the names of JWT attributes,
  we use custom non-standard names.

  AC:

  - Authentication is not susceptible to timing attacks
  - Data saved in JWT use standard names
MD
task.tags << tag_rest_api

::FactoryBot.create(:comment, task:, author: user_rupert, body: <<~MD)
  This is not a joke. Every second this issue stays unresolved
  we risk a potential attack.

  This must be fixed immediately!
MD

task = ::FactoryBot.create(:task, list:, name: 'Improve the video streaming API performance', author: user_rupert, priority: :medium, points: 10, description: <<~MD)
  Our *Video streaming API* is putting an extreme load
  on our servers.

  We should skim through the codebase and find ways to make it less
  **resource intensive**.
MD
task.tags << tag_streaming_api

task = ::FactoryBot.create(:task, list:, name: 'Add film groups', author: user_rupert, priority: :low)
task.destroy

# To do list
list = ::FactoryBot.create(:list, name: 'To do', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Implement the User API', author: user_rupert, priority: :low, points: 15, description: <<~MD)
  Currently, there is no way to get user data through the REST API.

  We should add a full CRUD for users.
MD
task.tags << tag_rest_api
task.tags << tag_database
task.tags << tag_streaming_api
task.tags << tag_ruby
task.tags << tag_version
task.users << user_brice
task.users << user_tomasz
task.users << user_bjorn
task.users << user_thorsten
task.users << user_johan
task.users << user_wojcislaw
task.users << user_bozydar
task.users << user_potezny
task.users << user_rupert
task.users << admin

task = ::FactoryBot.create(:task, list:, name: 'Add automatic deployments', author: user_bjorn, priority: :medium, points: 12, description: <<~MD)
  Deployment automation is what enables you to deploy your software to testing and production environments with the push of a button. Automation is essential to reduce the risk of production deployments. It's also essential for providing fast feedback on the quality of your software by allowing teams to do comprehensive testing as soon as possible after changes.

  An automated deployment process has the following inputs:

  - Packages created by the continuous integration (CI) process (these packages should be deployable to any environment, including production).
  - Scripts to configure the environment, deploy the packages, and perform a deployment test (sometimes known as a smoke test).
  - Environment-specific configuration information
MD
task.users << user_tomasz
task.tags << tag_devops

# Doing list
list = ::FactoryBot.create(:list, name: 'Doing', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Change the ORM', author: user_bjorn, priority: :high, points: 30, description: <<~MD)
  Our current ORM limits what we can do to optimise our **performance**.

  We should change it to something more _versatile_.
MD
task.tags << tag_database
task.users << user_brice

::FactoryBot.create(:comment, task:, author: user_bjorn, body: <<~MD)
  I think `ActiveRecord` is a good choice.

  Here's a brief [Overview](https://guides.rubyonrails.org/active_record_basics.html).
MD

::FactoryBot.create(:comment, task:, author: user_brice, body: <<~MD)
  I'll consider it, though I initially thought about `Sinatra`.
MD

task = ::FactoryBot.create(:task, list:, name: 'Add movie groups to the admin panel', author: user_bjorn, priority: :very_low, points: 5, description: <<~MD)
  The admin panel lacks proper views for
  managing *movie groups*.

  Someone must have forgotten about it.
MD
task.users << user_tomasz

# Done list
list = ::FactoryBot.create(:list, name: 'Done', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Implement user groups', author: user_bjorn, priority: :very_high, points: 8, description: <<~MD)
  Currently there is no way of grouping users.

  We should a concept of `familes` as groups of users
  that share a library of movies and a subscription.
MD
task.users << user_bjorn

task = ::FactoryBot.create(:task, list:, name: 'Add automatic Tests', author: user_rupert, priority: :medium, points: 12, description: <<~MD)
  The key to building quality into software is getting fast feedback on the impact of changes throughout the software delivery lifecycle. Traditionally, teams relied on manual testing and code inspection to verify systems' correctness. These inspections and tests typically occurred in a separate phase after "dev complete." This approach has the following drawbacks:

  - Manual regression testing is time-consuming to execute and expensive to perform, which makes it a bottleneck in the process. Software can't be released frequently and developers can't get quick feedback.
  - Manual tests and inspections are not reliable, because people are poor at repetitive tasks like manual regression tests, and it is hard to predict the impact of changes on a complex software system through inspection.
  - Once software is "dev complete", developers have to wait a long time to get feedback on their changes. This usually results in substantial work to triage defects and fix them. Performance, security, and reliability problems often require design changes that are even more expensive to address when discovered at this stage.
  - Long feedback cycles also make it harder for developers to learn how to build quality code, and under schedule pressure development teams can sometimes treat quality as "somebody else's problem".
  - When developers aren't responsible for testing their own code it's hard for them to learn how to write testable code.
  - For systems that evolve over time, keeping test documentation up to date requires considerable effort.

  Instead, teams should:

  - Perform all types of testing continuously throughout the software delivery lifecycle.
  - Create and curate fast, reliable suites of automated tests which are run as part of your continuous delivery pipelines.
MD
task.users << user_brice
task.tags << tag_devops

board = ::FactoryBot.create(:board, name: 'Empty', workspace: wrk, colour: '#008811')

# === Shortify workspace ===

wrk = ::FactoryBot.create :workspace, name: 'Shortify'

# users for Netflux
wrk.users << user_madonna = ::FactoryBot.create(:user, name: 'Madonna Berge', email: 'madonna.berge@example.com', role: :regular)
wrk.users << user_elizabeta = ::FactoryBot.create(:user, name: 'Elizabeta Kostel', email: 'elizabeta.kostel@example.com', role: :regular)
wrk.users << user_herman = ::FactoryBot.create(:user, name: 'Herman Schmidt', email: 'herman.schmidt@example.com', role: :manager)

# boards for Shortify

# Kanban board
board = ::FactoryBot.create(:board, name: 'Kanban', workspace: wrk, colour: '#005599')

# tags
tag_js = ::FactoryBot.create(:tag, name: 'JS', board:, colour: '#E3F51D')
tag_ruby = ::FactoryBot.create(:tag, name: 'Ruby', board:, colour: '#FF271D')
tag_open_source = ::FactoryBot.create(:tag, name: 'Open Source', board:, colour: '#FF771D')
tag_soap_api = ::FactoryBot.create(:tag, name: 'SOAP API', board:, colour: '#294590')
tag_php = ::FactoryBot.create(:tag, name: 'PHP', board:, colour: '#021299')

# Backlog list
list = ::FactoryBot.create(:list, name: 'Backlog', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Fix PHP', author: user_herman, priority: :very_low, points: 30, description: <<~MD)
  It's absolutely a viable choice for web development, and it's entirely possible to code consistent, well-tested & documented projects using modern programming concepts and methodologies in PHP. As well as one bad reason that it's derided by many (bandwagon hatred), here are four good reasons why it's derided by many:

  1. It's a goddamn mess, and refuses to break compatibility in order to reform. The global namespace is a rat's nest, unicode support is strange and inconsistent, function names and arguments aren't consistent, sometimes you get errors and other times you get exceptions… in many places it's just plain ugly.
  1. Most people who hate PHP formed that opinion years ago when it was much worse than it is now (which isn't to say it's any less of a goddamn mess, but now there are namespaces, lambdas, stronger OO, reflection, good testing/documentation/development frameworks, two large libraries of good code, etc etc).
  1. Many (most?) popular open source PHP projects are coded spectacularly, unrelentingly badly; either poorly written or poorly designed. It's hard to defend PHP when there's stuff like Wordpress out there. Supporting or dealing with these projects forms the bulk of most non-PHP coders' experience of PHP, so no wonder they hate it.
  1. Unlike some newer, more fashionable languages, or languages that are led by a strong authority, there's little cohesiveness among PHP coders; instead, there are hundreds of minor communities usually organised around specific projects. They're largely siloed and don't present a strong voice, share code, or even think similarly. There's no "Zen of PHP". It seems to me that this is less true that it has been in the past; there's more sharing of ideas and code, and more interoperability between projects and libraries. But we've got a long way to go before we can present a united front.
MD
task.users << user_elizabeta
task.tags << tag_open_source
task.tags << tag_php

::FactoryBot.create(:comment, task:, author: user_elizabeta, body: <<~MD)
  You must be kidding me.
  This is **impossible**!

  PHP is a steaming pile of **dung** that can't and shouldn't be fixed.
MD

task = ::FactoryBot.create(:task, list:, name: 'Make JS consistent', author: user_herman, priority: :very_low, points: 30, description: <<~MD)
  Take a look at official ECMAScript Language Specification at the 13.6.7 section - The If Statement - Runtime Semantics: Evaluation.
  A whole document contains a clear description of how all things works in ECMAScript.
  Right now, let's focus on this specific behavior.

  Our If Statement contains empty array

  ```js
  if ([]) { }
  ```
  We would consider first two steps from the official specification. The document says:

  1. Let `exprRef` be the result of evaluating Expression.
  1. Let `exprValue` be `ToBoolean(GetValue(exprRef))`.

  Our exprRef should be a result of evaluating Expression.
  However, we don't need to evaluate anything, because we supplied an object (empty array) in place of Expression.

  Subsequently, we need to obtain exprValue which
  is a result of the composition of two functions GetValue and ToBoolean.
  I don't want to dig into the first, just assume,
  that the result of GetValue(exprRef) is simply an empty array.
MD
task.tags << tag_js

::FactoryBot.create(:comment, task:, author: user_madonna, body: <<~MD)
  We'd have to break half of the worlds websites 😥

  I don't think that's possible.
MD

# To Do list
list = ::FactoryBot.create(:list, name: 'To Do', visible: true, board:)


# In Progress list
list = ::FactoryBot.create(:list, name: 'In Progress', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Improve the Ruby Just in Time Compiler', author: user_herman, priority: :very_low, points: 30, description: <<~MD)
  The Ruby community has released Ruby 3.1,
  an upgrade to the open source dynamic programming language that introduces
  a new in-process JIT (just-in-time) compiler to improve the performance of Ruby applications.

  Introduced on Christmas Day, Ruby 3.1, or Ruby 3.1.0,
  adds the YJIT (Yet Another Ruby JIT),
  a lightweight, minimalistic Ruby JIT built inside CRuby.

  YJIT uses a Basic Block Versioning architecture, with a JIT compiler inside of it.
  YJIT achieves fast warmup and performance improvements on most real-world software,
  Ruby's developers said. But YJIT still is in an experimental stage and is disabled by default.

  To use it, developers must specify the `-yjit` command-line option.
  YJIT currently is limited to Unix-like x86-64 platforms.
MD
task.users << user_madonna
task.users << user_elizabeta
task.tags << tag_open_source
task.tags << tag_ruby

::FactoryBot.create(:comment, task:, author: user_madonna, body: <<~MD)
  Yes, let's goo!!

  Let's make Ruby faster 💕😘💎
MD

# Testing list
list = ::FactoryBot.create(:list, name: 'Testing', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Add decorators to JavaScript', author: user_herman, priority: :medium, points: 10, description: <<~MD)
  Decorators have become popular thanks to their use in Angular 2+.
  In Angular, decorators are available thanks to TypeScript, but in
  JavaScript they're currently a stage 2 proposal,
  meaning they should be part of a future update to the language.

  Let's take a look at what decorators are,
  and how they can be used to make your code cleaner and more easily understandable.
MD
task.users << user_madonna
task.users << user_elizabeta
task.tags << tag_js

# Code Review list
list = ::FactoryBot.create(:list, name: 'Code Review', visible: true, board:)

# Done list
list = ::FactoryBot.create(:list, name: 'Done', visible: true, board:)

task = ::FactoryBot.create(:task, list:, name: 'Add caching for Ruby class variables', author: user_herman, priority: :medium, points: 10, description: <<~MD)
  It sounds like a very specific situation, but in order to avoid the need for a per-process in-memory cache (i.e. your class variables) to naturally warm up, I'd be investigating the feasibility of scripting the warm-up process and running it from inside an initializer... your app may take longer to start up, but your users would not have to wait.

  EDIT | Note that if you were using something like Unicorn, which supports pre-loading application code before forking worker processes, you could minimize the impact of such initialization.
MD
task.users << user_madonna
task.users << admin
task.tags << tag_open_source
task.tags << tag_ruby

# === Empty workspace ===

wrk = ::FactoryBot.create :workspace, name: 'Empty'
