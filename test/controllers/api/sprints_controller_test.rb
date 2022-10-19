require "test_helper"

class API::SprintsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sprint = sprints(:one)
  end

  test "should get index" do
    get sprints_url, as: :json
    assert_response :success
  end

  test "should create sprint" do
    assert_difference("DB::Sprint.count") do
      post sprints_url, params: { sprint: { due_date: @sprint.due_date, end_date: @sprint.end_date, name: @sprint.name, start_date: @sprint.start_date } }, as: :json
    end

    assert_response :created
  end

  test "should show sprint" do
    get sprint_url(@sprint), as: :json
    assert_response :success
  end

  test "should update sprint" do
    patch sprint_url(@sprint), params: { sprint: { due_date: @sprint.due_date, end_date: @sprint.end_date, name: @sprint.name, start_date: @sprint.start_date } }, as: :json
    assert_response :success
  end

  test "should destroy sprint" do
    assert_difference("DB::Sprint.count", -1) do
      delete sprint_url(@sprint), as: :json
    end

    assert_response :no_content
  end
end
