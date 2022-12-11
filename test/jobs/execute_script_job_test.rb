# frozen_string_literal: true

require 'test_helper'

class ExecuteScriptJobTest < ActiveJob::TestCase
  should 'successfully send request' do
    ::VCR.use_cassette('successful connection') do
      ::Config::SCRIPT_SERVICE_API['url'] = 'http://127.0.0.1:3001'
      script_run = ::FactoryBot.create(:script_run)
      ::ExecuteScriptJob.perform_now(script_run.id)
      assert script_run.reload.running?
      assert script_run.executed_at.today?
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

  should 'handle wrong credentials' do
    ::VCR.use_cassette('wrong credentials') do
      ::Config::SCRIPT_SERVICE_API['url'] = 'http://127.0.0.1:3001/api'
      script_run = ::FactoryBot.create(:script_run)
      ::ExecuteScriptJob.perform_now(script_run.id)
      assert script_run.reload.connection_failed?
      assert_equal 'the server responded with status 401', script_run.output
    end
  end
end
