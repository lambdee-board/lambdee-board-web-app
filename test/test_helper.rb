require_relative 'simple_cov_initializer'
::SimpleCovInitializer.call 'test:unittest'

::ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'
require 'rails/test_help'
require 'debug'

::DatabaseCleaner.strategy = :truncation
::DatabaseCleaner.clean

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors) unless ::ENV['COVERAGE'].present?

  # Add more helper methods to be used by all tests here...
end
