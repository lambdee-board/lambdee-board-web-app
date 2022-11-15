require "test_helper"

class UiScriptTriggersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ui_script = ui_scripts(:one)
  end

  # test "should get index" do
  #   get ui_scripts_url, as: :json
  #   assert_response :success
  # end

  # test "should create ui_script" do
  #   assert_difference("UiScript.count") do
  #     post ui_scripts_url, params: { ui_script: { scope_id: @ui_script.scope_id, scope_type: @ui_script.scope_type, script_id: @ui_script.script_id, subject_id: @ui_script.subject_id, subject_type: @ui_script.subject_type } }, as: :json
  #   end

  #   assert_response :created
  # end

  # test "should show ui_script" do
  #   get ui_script_url(@ui_script), as: :json
  #   assert_response :success
  # end

  # test "should update ui_script" do
  #   patch ui_script_url(@ui_script), params: { ui_script: { scope_id: @ui_script.scope_id, scope_type: @ui_script.scope_type, script_id: @ui_script.script_id, subject_id: @ui_script.subject_id, subject_type: @ui_script.subject_type } }, as: :json
  #   assert_response :success
  # end

  # test "should destroy ui_script" do
  #   assert_difference("UiScript.count", -1) do
  #     delete ui_script_url(@ui_script), as: :json
  #   end

  #   assert_response :no_content
  # end
end
