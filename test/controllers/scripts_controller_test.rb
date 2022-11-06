require "test_helper"

class ScriptsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @script = scripts(:one)
  end

  test "should get index" do
    get scripts_url, as: :json
    assert_response :success
  end

  test "should create script" do
    assert_difference("Script.count") do
      post scripts_url, params: { script: { author_id: @script.author_id, content: @script.content, description: @script.description, name: @script.name } }, as: :json
    end

    assert_response :created
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
