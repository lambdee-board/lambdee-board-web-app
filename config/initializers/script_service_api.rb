# frozen_string_literal: true

module Config
  SCRIPT_SERVICE_API = load_yaml('script_service_api.yml')
  SCRIPT_SERVICE_API['url'] = "#{SCRIPT_SERVICE_API['protocol']}://#{SCRIPT_SERVICE_API['host']}/api"
end
