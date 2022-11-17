# frozen_string_literal: true

require_relative 'simple_cov_initializer'
::SimpleCovInitializer.call 'test:unittest'

::ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'
require 'rails/test_help'
require 'debug'
require 'devise/jwt/test_helpers'
require 'vcr'

::DatabaseCleaner.strategy = :truncation
::DatabaseCleaner.clean

::RELATIVE_CASSETTE_DIR = 'test/factories/cassettes'

::VCR.configure do |config|
  config.cassette_library_dir = ::RELATIVE_CASSETTE_DIR
  config.hook_into :faraday
end

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  # parallelize(workers: :number_of_processors) unless ::ENV['COVERAGE'].present?

  # Add more helper methods to be used by all tests here...

  # Generates a JWT token for the given user.
  # Returns all needed headers for authentication.
  #
  # **Example:** GET controller action:
  # ```
  # user = ::FactoryBot.create(:user)
  # get 'api/boards/1', headers: auth_headers(user)
  # ```
  #
  # @param user [DB::User]
  # @return [Hash]
  def auth_headers(user)
    headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
    auth_headers = ::Devise::JWT::TestHelpers.auth_headers(headers, user)
  end

  # Authorisation headers used by the script service.
  #
  # @return [Hash]
  def script_service_auth_headers
    {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json',
      'Authorization' => "ScriptService #{::Config::ENV_SETTINGS['script_service_secret']}"
    }
  end
end
