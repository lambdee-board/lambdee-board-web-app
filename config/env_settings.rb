# frozen_string_literal: true

module Config
  # @return [Hash{String => Object}]
  ENV_SETTINGS = load_yaml('env_settings.yml')
end
