require_relative 'simple_cov_initializer'
::SimpleCovInitializer.call 'test:unittest'

::ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'
require 'rails/test_help'
require 'debug'
require 'devise/jwt/test_helpers'

::DatabaseCleaner.strategy = :truncation
::DatabaseCleaner.clean

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  # parallelize(workers: :number_of_processors) unless ::ENV['COVERAGE'].present?

  # Add more helper methods to be used by all tests here...

  # Generates a JWT token for given user.
  # Returns all needed headers for authentication.
  # **Example:** Test GET controller action:
  # ```
  # user = ::FactoryBot.create(:user)
  # get 'api/boards/1', headers: auth_headers(user)
  # ```
  #
  # @param user[DB::User]
  # @return [Hash]
  def auth_headers(user)
    headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
    auth_headers = ::Devise::JWT::TestHelpers.auth_headers(headers, user)
  end
end
