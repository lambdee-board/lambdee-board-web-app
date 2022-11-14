# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptTriggersControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @script_trigger = script_triggers(:one)
  end

  test "should get index" do
    get script_triggers_url, as: :json
    assert_response :success
  end

  test "should create script_trigger" do
    assert_difference("CallbackScript.count") do
      post script_triggers_url, params: { script_trigger: { action: @script_trigger.action, script_id: @script_trigger.script_id, subject_id: @script_trigger.subject_id, subject_type: @script_trigger.subject_type } }, as: :json
    end

    assert_response :created
  end

  test "should show script_trigger" do
    get script_trigger_url(@script_trigger), as: :json
    assert_response :success
  end

  test "should update script_trigger" do
    patch script_trigger_url(@script_trigger), params: { script_trigger: { action: @script_trigger.action, script_id: @script_trigger.script_id, subject_id: @script_trigger.subject_id, subject_type: @script_trigger.subject_type } }, as: :json
    assert_response :success
  end

  test "should destroy script_trigger" do
    assert_difference("CallbackScript.count", -1) do
      delete script_trigger_url(@script_trigger), as: :json
    end

    assert_response :no_content
  end
end
