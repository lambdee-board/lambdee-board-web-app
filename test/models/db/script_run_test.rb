# frozen_string_literal: true

require 'test_helper'

class ::DB::ScriptRunTest < ::ActiveSupport::TestCase
  should 'handle connection error' do
    ::VCR.use_cassette('connection failed') do
      ::Config::SCRIPT_SERVICE_API['url'] = 'http://127.0.0.1:3001'
      script_run = ::FactoryBot.create(:script_run)
      ::ScriptServiceAPI.send_execute_script_request(script_run)
      assert script_run.reload.connection_failed?
      assert_equal "Couldn't connect with Script Service.", script_run.output
    end
  end
end
