require "test_helper"

class ScriptRunsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @script_run = script_runs(:one)
  end

  test "should get index" do
    get script_runs_url, as: :json
    assert_response :success
  end

  test "should create script_run" do
    assert_difference("ScriptRun.count") do
      post script_runs_url, params: { script_run: { initiator_id: @script_run.initiator_id, output: @script_run.output, script_id: @script_run.script_id } }, as: :json
    end

    assert_response :created
  end

  test "should show script_run" do
    get script_run_url(@script_run), as: :json
    assert_response :success
  end

  test "should update script_run" do
    patch script_run_url(@script_run), params: { script_run: { initiator_id: @script_run.initiator_id, output: @script_run.output, script_id: @script_run.script_id } }, as: :json
    assert_response :success
  end

  test "should destroy script_run" do
    assert_difference("ScriptRun.count", -1) do
      delete script_run_url(@script_run), as: :json
    end

    assert_response :no_content
  end
end
