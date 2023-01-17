# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptsControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: :admin
  end

  should 'get index' do
    4.times { ::FactoryBot.create(:script) }
    get api_scripts_url, params: { per: 3, page: 1, as: :json }, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body, symbolize_names: true)
    assert_equal 3, json[:scripts].size
    assert_equal 2, json[:total_pages]
  end

  should 'create script' do
    task = ::FactoryBot.create(:task)
    script_trigger_global_params = { action: 'create', delay: 60, author_id: @user.id }
    script_trigger_model_params = { subject_type: 'DB::Task', action: 'update', author_id: @user.id }
    script_trigger_record_params = { subject_type: 'DB::Task', subject_id: task.id.to_s, action: 'destroy', author_id: @user.id }
    script_trigger_params = [script_trigger_global_params, script_trigger_model_params, script_trigger_record_params]
    params = { script: { content: 'p 1', description: 'des', name: 'super script', script_triggers_attributes: script_trigger_params } }

    assert_difference('DB::Script.count') do
      post api_scripts_url, params: params, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)

    assert_equal 'p 1', json['content']
    assert_equal 'des', json['description']
    assert_equal 'super script', json['name']
    assert_equal 3, json['script_triggers'].size
    assert_equal 'destroy', json['script_triggers'].last['action']
    assert_equal 'DB::Task', json['script_triggers'].last['subject_type']
    assert_equal task.id, json['script_triggers'].last['subject_id']

    script = ::DB::Script.find(json['id'])
    assert_equal 3, script.script_triggers.size

    assert_equal 'create', script.script_triggers.first.action
    assert_equal 60, script.script_triggers.first.delay
    assert_nil script.script_triggers.first.subject
    assert_nil script.script_triggers.first.subject_type
    assert_nil script.script_triggers.first.subject_id

    assert_equal 'update', script.script_triggers.second.action
    assert_nil script.script_triggers.second.subject
    assert_equal 'DB::Task', script.script_triggers.second.subject_type
    assert_nil script.script_triggers.second.subject_id

    assert_equal 'destroy', script.script_triggers.third.action
    assert_equal task.id, script.script_triggers.third.subject.id
    assert_equal 'DB::Task', script.script_triggers.third.subject_type
    assert_equal task.id, script.script_triggers.third.subject_id
  end

  should 'show script' do
    @user.developer!

    script = ::FactoryBot.create(:script, :with_trigger_on_task_creation, author: @user)
    ::FactoryBot.create(:ui_script_trigger, author: @user, script: script, text: 'ok', private: true)
    ::FactoryBot.create(:ui_script_trigger, script: script, text: 'not ok', private: true)

    get api_script_url(script), as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal "puts 'hello world'", json['content']
    assert_equal 'My first Lambdee Script', json['name']
    assert_equal 'Description of the script', json['description']
    assert_equal @user.id, json['author_id']
    assert_equal 1, json['script_triggers'].size
    assert_equal 'create', json['script_triggers'].first['action']
    assert_equal 'DB::Task', json['script_triggers'].first['subject_type']

    assert_equal 1, json['ui_script_triggers'].count
    assert_equal 'ok', json['ui_script_triggers'].first['text']
  end

  should 'update script and create callback' do
    script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)

    assert_difference('DB::ScriptTrigger.count', 1) do
      patch api_script_url(script), params: { script: { name: 'new name', script_triggers_attributes: [{ action: 'destroy', author_id: @user.id }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 'destroy', json['script_triggers'].last['action']
  end

  should 'update script and update callback' do
    script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)
    callback = script.script_triggers.first

    assert_no_difference('DB::ScriptTrigger.count') do
      patch api_script_url(script), params: { script: { name: 'new name', script_triggers_attributes: [{ id: callback.id, action: 'destroy' }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 'destroy', json['script_triggers'].last['action']
  end

  should 'update script and destroy callback' do
    script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)
    callback = script.script_triggers.first

    assert_difference('DB::ScriptTrigger.count', -1) do
      patch api_script_url(script), params: { script: { name: 'new name', script_triggers_attributes: [{ id: callback.id, _destroy: '1' }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 0, json['script_triggers'].size
  end

  should 'destroy script' do
    script = ::FactoryBot.create(:script, :with_trigger_on_task_creation)

    assert_difference('DB::Script.count', -1) do
      assert_difference('DB::ScriptTrigger.count', -1) do
        delete api_script_url(script), as: :json, headers: auth_headers(@user)
      end
    end

    assert_response :no_content
  end
end
