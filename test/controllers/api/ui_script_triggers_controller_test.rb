# frozen_string_literal: true

require 'test_helper'

class ::API::UiScriptTriggersControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user, role: :admin)
  end

  should 'create ui_script_trigger with scope' do
    script = ::FactoryBot.create(:script)
    board = ::FactoryBot.create(:board)

    assert_difference('DB::UiScriptTrigger.count') do
      post api_ui_script_triggers_url, params: { ui_script_trigger: { script_id: script.id, subject_type: 'DB::Task', scope_type: 'DB::Board', scope_id: board.id } }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)
    assert_equal script.id, json['script_id']
    assert_equal 'DB::Task', json['subject_type']
    assert_equal 'DB::Board', json['scope_type']
    assert_equal board.id, json['scope_id']
    assert_equal board.id, ::DB::UiScriptTrigger.last.scope.id
  end


  should 'create ui_script_trigger without scope' do
    script = ::FactoryBot.create(:script)
    task = ::FactoryBot.create(:task)

    assert_difference('DB::UiScriptTrigger.count') do
      post api_ui_script_triggers_url, params: { ui_script_trigger: { script_id: script.id, subject_type: 'DB::Task', subject_id: task.id } }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)
    assert_equal script.id, json['script_id']
    assert_equal 'DB::Task', json['subject_type']
    assert_equal task.id, json['subject_id']
    assert_equal task.id, ::DB::UiScriptTrigger.last.subject.id
  end

  should 'show ui_script_trigger' do
    task = ::FactoryBot.create(:task)
    trigger = ::FactoryBot.create(:ui_script_trigger, subject: task)

    get api_ui_script_trigger_url(trigger), as: :json, headers: auth_headers(@user), headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'DB::Task', json['subject_type']
    assert_equal task.id, json['subject_id']
  end

  should 'update ui_script_trigger' do
    task = ::FactoryBot.create(:task)
    trigger = ::FactoryBot.create(:ui_script_trigger, subject: task)

    patch api_ui_script_trigger_url(trigger), params: { ui_script_trigger: { subject_id: task.id, subject_type: task.class } }, as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'DB::Task', json['subject_type']
    assert_equal task.id, json['subject_id']
  end

  should 'destroy ui_script_trigger' do
    trigger = ::FactoryBot.create(:ui_script_trigger)

    assert_difference('DB::UiScriptTrigger.count', -1) do
      delete api_ui_script_trigger_url(trigger), as: :json, headers: auth_headers(@user)
    end

    assert_response :no_content
  end
end
