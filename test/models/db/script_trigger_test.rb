# frozen_string_literal: true

require 'test_helper'

class ::DB::ScriptTriggerTest < ::ActiveSupport::TestCase
  should 'execute script on create' do
    ::VCR.use_cassette('execute script on create') do
      script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)
      assert_difference('DB::ScriptRun.count', 1) do
        ::FactoryBot.create(:task)
      end
      run = ::DB::ScriptRun.last
      assert run.waiting?
      assert_equal script.id, run.script_id
      assert run.input.include? 'context'
      assert run.triggered_at.today?
    end
  end

  should 'execute script on update' do
    ::VCR.use_cassette('execute script on update') do
      script = ::FactoryBot.create(:script, :with_trigger_on_task_update)
      assert_difference('DB::ScriptRun.count', 1) do
        script.script_triggers.first.subject.update!(name: 'what name')
      end
      run = ::DB::ScriptRun.last
      assert run.waiting?
      assert_equal script.id, run.script_id
      assert run.input.include? 'context'
      assert run.triggered_at.today?
    end
  end

  should 'execute script for null subject' do
    ::VCR.use_cassette('execute script for null subject') do
      script = ::FactoryBot.create(:script, :with_trigger_on_every_model_creation)
      assert_difference('DB::ScriptRun.count', 1) do
        ::FactoryBot.create(:workspace)
      end
      run = ::DB::ScriptRun.last
      assert run.waiting?
      assert_equal script.id, run.script_id
      assert run.input.include? 'context'
      assert run.triggered_at.today?
    end
  end

  should 'not execute script on create when script triggers are disabled' do
    ::Current.disable_script_triggers_for_this_request!
    ::FactoryBot.create(:script, :with_trigger_on_task_creation)
    assert_no_difference('DB::ScriptRun.count') do
      ::FactoryBot.create(:task)
    end
  end
end
