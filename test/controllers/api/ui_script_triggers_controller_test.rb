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
      post api_ui_script_triggers_url, params: {
        ui_script_trigger: {
          script_id: script.id, subject_type: 'DB::Task', scope_type: 'DB::Board', scope_id: board.id, author_id: @user.id, delay: 1, private: true, colour: '#ffffff', text: 'elo'
        }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)
    assert_equal script.id, json['script_id']
    assert_equal 'DB::Task', json['subject_type']
    assert_equal 'DB::Board', json['scope_type']
    assert_equal board.id, json['scope_id']
    assert_equal board.id, ::DB::UiScriptTrigger.last.scope.id
    assert_equal @user.id, json['author_id']
    assert_equal 1, json['delay']
    assert_equal true, json['private']
    assert_equal '#ffffff', json['colour']
    assert_equal 'elo', json['text']
  end


  should 'create ui_script_trigger without scope' do
    script = ::FactoryBot.create(:script)
    task = ::FactoryBot.create(:task)

    assert_difference('DB::UiScriptTrigger.count') do
      post api_ui_script_triggers_url, params: { ui_script_trigger: { script_id: script.id, subject_type: 'DB::Task', subject_id: task.id, author_id: @user.id } }, as: :json, headers: auth_headers(@user)
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

  should 'execute global script' do
    trigger = ::FactoryBot.create(:ui_script_trigger)

    assert_difference('DB::ScriptRun.count', 1) do
      post executions_api_ui_script_trigger_url(trigger), headers: auth_headers(@user)
    end

    assert_response :created
    run = ::DB::ScriptRun.last
    assert_equal "puts 'hello world'", run.input
    assert_equal 'waiting', run.state
    assert_equal @user.id, run.initiator.id
    assert run.triggered_at.today?
  end

  should 'execute script on task subject' do
    task = ::FactoryBot.create(:task)
    trigger = ::FactoryBot.create(:ui_script_trigger, subject: task)

    assert_difference('DB::ScriptRun.count', 1) do
      post executions_api_ui_script_trigger_url(trigger), headers: auth_headers(@user), params: { subject_id: task.id }, as: :json
    end

    assert_response :created
    run = ::DB::ScriptRun.last
    assert run.input.include?('context[:subject] = DB::Task.from_record')
    assert_equal 'waiting', run.state
    assert_equal @user.id, run.initiator.id
    assert run.triggered_at.today?
  end
end
