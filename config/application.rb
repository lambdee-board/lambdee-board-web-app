require_relative "boot"

require "rails/all"


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

puts "RAILS_ENV: #{Rails.env}"

require_relative 'config'
require_relative 'env_settings'

module LambdeeBoardWebApp
  class Application < Rails::Application
    attr_accessor :version, :ascii_logo
    self.version = ::File.read(::Config::ROOT / '.version').strip
    self.ascii_logo = ::File.read(::Config::ROOT / 'ascii_logo.txt')

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.active_job.queue_adapter = :sidekiq
    default_url_options.merge!(::Config::ENV_SETTINGS['default_url_options'].transform_keys(&:to_sym))
    config.active_record.encryption.tap do |e|
      e.primary_key = ::Config::ENV_SETTINGS.dig('encryption', 'primary_key')
      e.deterministic_key = ::Config::ENV_SETTINGS.dig('encryption', 'deterministic_key')
      e.key_derivation_salt = ::Config::ENV_SETTINGS.dig('encryption', 'key_derivation_salt')
    end

    config.generators do |g|
      g.api true
      g.system_tests false
      g.template_engine :jbuilder
      g.test_framework :test_unit, fixture: false
    end
  end
end
