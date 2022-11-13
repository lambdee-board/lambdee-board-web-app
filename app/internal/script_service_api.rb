# frozen_string_literal: true

# Wraps the Script Service API.
module ScriptServiceAPI
  class << self
    # @return [Faraday::Connection]
    def http_connection
      ::Faraday.new(::Config::SCRIPT_SERVICE_API['url']) do |f|
        f.request :authorization, 'basic', ::Config::SCRIPT_SERVICE_API['username'], ::Config::SCRIPT_SERVICE_API['password']
        f.adapter :net_http
      end
    end

    # @param body [String]
    # @return [Faraday::Response]
    def send_execute_script_request(body)
      http_connection.post('execute') do |req|
        req.body = body
      end
    end
  end
end
