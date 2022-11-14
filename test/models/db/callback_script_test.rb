# frozen_string_literal: true

require 'test_helper'

class ::DB::CallbackScriptTest < ::ActiveSupport::TestCase
  should 'execute script on create' do
    ::VCR.use_cassette('execute script on create') do
      script = ::FactoryBot.create(:script, :with_create_task_callback)
      assert_difference('DB::ScriptRun.count', 1) do
        ::FactoryBot.create(:task)
      end
    end
  end
end
