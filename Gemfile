# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.3'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 7.0.3'

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'sprockets-rails'

# Use pg as the database for Active Record
gem 'pg', '~> 1.1'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 5.0'
# gem 'unicorn'

# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem 'importmap-rails'

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jbuilder'

# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.0'

# Swagger OpenAPI docs UI
gem 'rswag-api'
gem 'rswag-ui'

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Sass to process CSS
# gem "sassc-rails"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

gem 'acts_as_paranoid'
gem 'cancancan', '~> 3.4'
gem 'chartkick'
gem 'csv'
gem 'devise'
gem 'devise-jwt'
gem 'factory_bot_rails'
# Easier Model record factories for tests
# Generate fake data for tests and seeding
gem 'faker'
gem 'faraday'
gem 'has_scope'
gem 'kaminari'
gem 'pg_search'
gem 'sass-rails'
gem 'shale' # object mapper and serializer for JSON and other formats
gem 'sidekiq'
gem 'trestle'
gem 'trestle-auth'
gem 'trestle-search'
gem 'trestle-sidekiq'

group :development, :test do
  gem 'brakeman'

  # The Bullet gem is designed to help increase application's performance by reducing the number of queries it makes.
  gem 'bullet'

  # Patch-level verification for Bundler
  gem 'bundler-audit'
  gem 'cypress-rails'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw], require: false

  # for running and managing many process at once (Procfile)
  gem 'foreman'
  gem 'letter_opener' # open emails in development mode

  # OpenAPI generating tests
  gem 'rspec-rails'
  gem 'rswag-specs', '~> 2.5.1'

  gem 'rubocop'
  gem 'rubocop-rails'
  gem 'ruby_audit'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'

  # provide better intellisense in IDEs supporting Solargraph
  gem 'rails-annotate-solargraph'

  # Solargraph is a Ruby gem that provides intellisense features through Microsoft's language server protocol. [https://solargraph.org/]
  gem 'solargraph'

  # A Ruby documentation tool [https://yardoc.org/]
  gem 'yard'

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  gem 'capybara'
  gem 'database_cleaner-active_record'

  gem 'selenium-webdriver'
  gem 'shoulda'
  gem 'vcr'
  gem 'webdrivers'

  # for generating test coverage
  gem 'simplecov', require: false

  # for live test coverage in Gitlab Merge Requests
  gem 'simplecov-cobertura', require: false
end
