# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptsControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: 4
  end

  should 'get index' do
    3.times { ::FactoryBot.create(:script) }
    get api_scripts_url, as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 3, json.size
  end

  should 'create script' do
    task = ::FactoryBot.create(:task)
    callback_script_global_params = { action: 'create' }
    callback_script_model_params = { subject_type: 'DB::Task', action: 'update' }
    callback_script_record_params = { subject_type: 'DB::Task', subject_id: task.id.to_s, action: 'destroy' }
    callback_script_params = [callback_script_global_params, callback_script_model_params, callback_script_record_params]
    params = { script: { content: 'p 1', description: 'des', name: 'super script', callback_scripts_attributes: callback_script_params } }

    assert_difference('DB::Script.count') do
      post api_scripts_url, params: params, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse(response.body)

    assert_equal 'p 1', json['content']
    assert_equal 'des', json['description']
    assert_equal 'super script', json['name']
    assert_equal 3, json['callback_scripts'].size
    assert_equal 'destroy', json['callback_scripts'].last['action']
    assert_equal 'DB::Task', json['callback_scripts'].last['subject_type']
    assert_equal task.id, json['callback_scripts'].last['subject_id']

    script = ::DB::Script.find(json['id'])
    assert_equal 3, script.callback_scripts.size

    assert_equal 'create', script.callback_scripts.first.action
    assert_nil script.callback_scripts.first.subject
    assert_nil script.callback_scripts.first.subject_type
    assert_nil script.callback_scripts.first.subject_id

    assert_equal 'update', script.callback_scripts.second.action
    assert_nil script.callback_scripts.second.subject
    assert_equal 'DB::Task', script.callback_scripts.second.subject_type
    assert_nil script.callback_scripts.second.subject_id

    assert_equal 'destroy', script.callback_scripts.third.action
    assert_equal task.id, script.callback_scripts.third.subject.id
    assert_equal 'DB::Task', script.callback_scripts.third.subject_type
    assert_equal task.id, script.callback_scripts.third.subject_id
  end

  should 'show script' do
    script = ::FactoryBot.create(:script, :with_create_task_callback, author: @user)
    get api_script_url(script), as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal "puts 'hello world'", json['content']
    assert_equal 'My first Lambdee Script', json['name']
    assert_equal 'Description of the script', json['description']
    assert_equal @user.id, json['author_id']
    assert_equal 1, json['callback_scripts'].size
    assert_equal 'create', json['callback_scripts'].first['action']
    assert_equal 'DB::Task', json['callback_scripts'].first['subject_type']
  end

  should 'update script and create callback' do
    script = ::FactoryBot.create(:script, :with_create_task_callback)

    assert_difference('DB::CallbackScript.count', 1) do
      patch api_script_url(script), params: { script: { name: 'new name', callback_scripts_attributes: [{ action: 'destroy' }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 'destroy', json['callback_scripts'].last['action']
  end

  should 'update script and update callback' do
    script = ::FactoryBot.create(:script, :with_create_task_callback)
    callback = script.callback_scripts.first

    assert_no_difference('DB::CallbackScript.count') do
      patch api_script_url(script), params: { script: { name: 'new name', callback_scripts_attributes: [{ id: callback.id, action: 'destroy' }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 'destroy', json['callback_scripts'].last['action']
  end

  should 'update script and destroy callback' do
    script = ::FactoryBot.create(:script, :with_create_task_callback)
    callback = script.callback_scripts.first

    assert_difference('DB::CallbackScript.count', -1) do
      patch api_script_url(script), params: { script: { name: 'new name', callback_scripts_attributes: [{ id: callback.id, _destroy: '1' }] } }, as: :json, headers: auth_headers(@user)
    end
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new name', json['name']
    assert_equal 0, json['callback_scripts'].size
  end

  should 'destroy script' do
    script = ::FactoryBot.create(:script, :with_create_task_callback)

    assert_difference('DB::Script.count', -1) do
      assert_difference('DB::CallbackScript.count', -1) do
        delete api_script_url(script), as: :json, headers: auth_headers(@user)
      end
    end

    assert_response :no_content
  end
end
