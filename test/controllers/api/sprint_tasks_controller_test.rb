require "test_helper"

class API::SprintTasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sprint_tasks = sprint_tasks(:one)
  end

  test "should get index" do
    get sprint_tasks_url, as: :json
    assert_response :success
  end

  test "should create sprint_tasks" do
    assert_difference("DB::SprintTask.count") do
      post sprint_tasks_url, params: { sprint_tasks: { data: @sprint_tasks.data, sprint_id: @sprint_tasks.sprint_id, task_id: @sprint_tasks.task_id } }, as: :json
    end

    assert_response :created
  end

  test "should show sprint_tasks" do
    get sprint_tasks_url(@sprint_tasks), as: :json
    assert_response :success
  end

  test "should update sprint_tasks" do
    patch sprint_tasks_url(@sprint_tasks), params: { sprint_tasks: { data: @sprint_tasks.data, sprint_id: @sprint_tasks.sprint_id, task_id: @sprint_tasks.task_id } }, as: :json
    assert_response :success
  end

  test "should destroy sprint_tasks" do
    assert_difference("DB::SprintTask.count", -1) do
      delete sprint_tasks_url(@sprint_tasks), as: :json
    end

    assert_response :no_content
  end
end
