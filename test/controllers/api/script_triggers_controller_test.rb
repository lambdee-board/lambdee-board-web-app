# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptTriggersControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user, role: :admin)
  end

  should 'create script_trigger' do
    script = ::FactoryBot.create(:script)

    assert_difference('DB::ScriptTrigger.count') do
      post api_script_triggers_url, params: { script_trigger: { action: 'destroy', delay: 60, script_id: script.id } }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)
    assert_equal script.id, json['script_id']
    assert_equal 60, json['delay']
  end

  should 'show script_trigger' do
    task = ::FactoryBot.create(:task)
    trigger = ::FactoryBot.create(:script_trigger, subject: task)

    get api_script_trigger_url(trigger), as: :json, headers: auth_headers(@user), headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'DB::Task', json['subject_type']
    assert_equal task.id, json['subject_id']
    assert_equal 'create', json['action']
  end

  should 'update script_trigger' do
    task = ::FactoryBot.create(:task)
    trigger = ::FactoryBot.create(:script_trigger, subject: task)

    patch api_script_trigger_url(trigger), params: { script_trigger: { action: 'destroy', subject_id: task.id, subject_type: task.class } }, as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'DB::Task', json['subject_type']
    assert_equal task.id, json['subject_id']
    assert_equal 'destroy', json['action']
  end

  should 'destroy script_trigger' do
    trigger = ::FactoryBot.create(:script_trigger)

    assert_difference('DB::ScriptTrigger.count', -1) do
      delete api_script_trigger_url(trigger), as: :json, headers: auth_headers(@user)
    end

    assert_response :no_content
  end
end
