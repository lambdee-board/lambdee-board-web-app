# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptsControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: 4
  end

  test "should get index" do
    get scripts_url, as: :json
    assert_response :success
  end

  should 'create script' do
    task = ::FactoryBot.create(:task)
    callback_script_global_params = { action: 'create' }
    callback_script_model_params = { subject_type: 'DB::Task', action: 'update' }
    callback_script_record_params = { subject_type: 'DB::Task', subject_id: task.id.to_s, action: 'delete' }
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
    assert_equal 'delete', json['callback_scripts'].last['action']
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

    assert_equal 'delete', script.callback_scripts.third.action
    assert_equal task.id, script.callback_scripts.third.subject.id
    assert_equal 'DB::Task', script.callback_scripts.third.subject_type
    assert_equal task.id, script.callback_scripts.third.subject_id
  end

  test "should show script" do
    get script_url(@script), as: :json
    assert_response :success
  end

  test "should update script" do
    patch script_url(@script), params: { script: { author_id: @script.author_id, content: @script.content, description: @script.description, name: @script.name } }, as: :json
    assert_response :success
  end

  test "should destroy script" do
    assert_difference("Script.count", -1) do
      delete script_url(@script), as: :json
    end

    assert_response :no_content
  end
end
