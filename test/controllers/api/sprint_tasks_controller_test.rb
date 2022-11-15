# frozen_string_literal: true

require "test_helper"

class API::SprintTasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user, role: :admin)
    @sprint_task = ::FactoryBot.create(:sprint_task)
    @sprint = @sprint_task.sprint
  end
  should 'get index' do
    get api_sprint_tasks_url, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal @sprint_task.id, json.dig(0, 'id')
  end

  should 'get index for sprint' do
    get api_sprint_sprint_tasks_url(@sprint), headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal @sprint_task.id, json.dig(0, 'id')
  end

  should 'create sprint_task' do
    task = ::FactoryBot.create(:task)
    date = ::Time.now.in_time_zone('Warsaw').to_s

    assert_difference('DB::SprintTask.count') do
      post api_sprint_tasks_url,
        headers: auth_headers(@user),
        params: {
          sprint_tasks: {
            added_at: date,
            start_state: 'To Be Or Not To Be',
            state: 'Doing Doing',
            sprint_id: @sprint.id,
            task_id: task.id
          }
        }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal ::Time.parse(date), ::Time.parse(json['added_at'])
    assert_nil :json['completed_at']
    assert_equal 'To Be Or Not To Be', json['start_state']
    assert_equal 'Doing Doing', json['state']
    assert_equal task.id, json['task_id']
    assert_equal @sprint.id, json['sprint_id']
    assert_nil json['inexistent_field']
  end

  should 'show sprint_task' do
    get api_sprint_task_url(@sprint_task), headers: auth_headers(@user), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @sprint_task.id, json["id"]
    assert_nil json['tasks']
  end

  should 'update sprint_task' do
    patch api_sprint_task_url(@sprint_task),
      headers: auth_headers(@user),
      params: {
        sprint_tasks: {
          start_state: 'To Be Or Not To Be',
          state: 'Doing Doing'
        }
      }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'To Be Or Not To Be', json['start_state']
    assert_equal 'Doing Doing', json['state']
  end

  should 'destroy sprint_task' do
    assert_difference('DB::SprintTask.count', -1) do
      delete api_sprint_task_url(@sprint_task), headers: auth_headers(@user), as: :json
    end

    assert_response :no_content
  end
end
