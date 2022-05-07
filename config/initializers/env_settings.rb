# frozen_string_literal: true

module Config
  # @return [Hash{String => Object}]
  ENV_SETTINGS = load_yaml('env_settings.yml')
  ::Rails.application.default_url_options.merge!(ENV_SETTINGS['default_url_options'].transform_keys(&:to_sym))
end
