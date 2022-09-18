# Load SimpleCov for code coverage if
# the `COVERAGE` environment variable is set
#
# SimpleCov has to be the first thing that is loaded
if ::ENV['COVERAGE'].present?
  require 'simplecov'
  require 'simplecov-cobertura'

  ::SimpleCov.formatter = ::SimpleCov::Formatter::MultiFormatter.new([
    ::SimpleCov::Formatter::HTMLFormatter,
    ::SimpleCov::Formatter::CoberturaFormatter
  ])

  ::SimpleCov.start 'rails' do
    add_filter '/test/'
    add_filter '/app/admin/'
    add_filter '/frontend/'
    add_filter '/lib/'
    add_filter '/vendor/'
  end
end

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
