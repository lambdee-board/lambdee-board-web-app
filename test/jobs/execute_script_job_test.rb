# frozen_string_literal: true

require 'test_helper'

class ExecuteScriptJobTest < ActiveJob::TestCase
  should 'successfully send request' do
    ::VCR.use_cassette('successful connection') do
      ::Config::SCRIPT_SERVICE_API['url'] = 'http://127.0.0.1:3001'
      script_run = ::FactoryBot.create(:script_run)
      ::ExecuteScriptJob.perform_now(script_run.id)
      assert script_run.reload.running?
    end
  end

  should 'handle connection error' do
    ::VCR.use_cassette('connection failed') do
      ::Config::SCRIPT_SERVICE_API['url'] = 'http://127.0.0.1:3002'
      script_run = ::FactoryBot.create(:script_run)
      ::ExecuteScriptJob.perform_now(script_run.id)
      assert script_run.reload.connection_failed?
      assert_equal "Couldn't connect with Script Service.", script_run.output
    end
  end
end
