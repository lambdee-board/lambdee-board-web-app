require "test_helper"

class CallbackScriptsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @callback_script = callback_scripts(:one)
  end

  test "should get index" do
    get callback_scripts_url, as: :json
    assert_response :success
  end

  test "should create callback_script" do
    assert_difference("CallbackScript.count") do
      post callback_scripts_url, params: { callback_script: { action: @callback_script.action, script_id: @callback_script.script_id, subject_id: @callback_script.subject_id, subject_type: @callback_script.subject_type } }, as: :json
    end

    assert_response :created
  end

  test "should show callback_script" do
    get callback_script_url(@callback_script), as: :json
    assert_response :success
  end

  test "should update callback_script" do
    patch callback_script_url(@callback_script), params: { callback_script: { action: @callback_script.action, script_id: @callback_script.script_id, subject_id: @callback_script.subject_id, subject_type: @callback_script.subject_type } }, as: :json
    assert_response :success
  end

  test "should destroy callback_script" do
    assert_difference("CallbackScript.count", -1) do
      delete callback_script_url(@callback_script), as: :json
    end

    assert_response :no_content
  end
end
