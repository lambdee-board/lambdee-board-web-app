# frozen_string_literal: true

# Wraps the Script Service REST API.
module ScriptServiceAPI
  class << self
    # @return [Faraday::Connection]
    def http_connection
      ::Faraday.new(::Config::SCRIPT_SERVICE_API['url']) do |f|
        f.request :json
        f.request :authorization, 'basic', ::Config::SCRIPT_SERVICE_API['username'], ::Config::SCRIPT_SERVICE_API['password']
        f.adapter :net_http
      end
    end

    # @param script_run [DB::SprintRun]
    # @return [Faraday::Response]
    def send_execute_script_request(script_run)
      http_connection.post('execute') do |req|
        req.body = { script_run_id: script_run.id, content: script_run.input }
      end
    end
  end
end
