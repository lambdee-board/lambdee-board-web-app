# frozen_string_literal: true

require 'test_helper'

class ::DB::ScriptTriggerTest < ::ActiveSupport::TestCase
  should 'execute script on create' do
    ::VCR.use_cassette('execute script on create') do
      script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)
      assert_difference('DB::ScriptRun.count', 1) do
        ::FactoryBot.create(:task)
      end
    end
  end
end
