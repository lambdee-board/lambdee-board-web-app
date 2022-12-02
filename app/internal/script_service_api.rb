# frozen_string_literal: true

# Wraps the Script Service REST API.
module ScriptServiceAPI
  class << self
    # @return [Faraday::Connection]
    def http_connection
      ::Faraday.new(::Config::SCRIPT_SERVICE_API['url']) do |f|
        f.response :json
        f.request :json
        f.request :authorization, 'basic', ::Config::SCRIPT_SERVICE_API['username'], ::Config::SCRIPT_SERVICE_API['password']
        f.use ::Faraday::Response::RaiseError
        f.adapter :net_http
      end
    end

    # @param script_run [DB::SprintRun]
    # @return [Faraday::Response]
    def send_execute_script_request(script_run)
      http_connection.post('execute') do |req|
        req.body = { script_run_id: script_run.id, content: script_run.input }
      end
    rescue ::Faraday::ConnectionFailed
      script_run.output = "Couldn't connect with Script Service."
      script_run.connection_failed!
    rescue ::Faraday::ClientError => e
      script_run.output = e.message
      script_run.connection_failed!
    end
  end
end
