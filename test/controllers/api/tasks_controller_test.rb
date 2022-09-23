# frozen_string_literal: true

require 'test_helper'

class DB::TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @task = ::FactoryBot.create(:task)
    @list = @task.list
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:task, name: "Task#{i}") }
    get '/api/tasks'
    assert_response 200
    json = ::JSON.parse(response.body)
    assert_equal @task.name, json.dig(0, 'name')
    3.times do |i|
      assert_equal "Task#{i}", json.dig(i + 1, 'name')
    end
  end

  should 'create task' do
    assert_difference('DB::Task.count') do
      post api_tasks_url, params: { task: { name: 'New task', priority: 4, points: 7, list_id: @list.id, author_id: @user.id } }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'New task', json['name']
    assert_equal 66560.0, json['pos']
    assert_equal 'very_high', json['priority']
    assert_equal 7, json['points']
  end

  should "not create task with a too long name" do
    assert_no_difference("DB::Task.count") do
      post api_tasks_url, params: { task: { name: 'a' * 150, pos: 1111, description: 'description', list_id: @list.id } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 80 characters)', json.dig('name', 0)
  end

  should "not create task with a too long description" do
    assert_no_difference("DB::Task.count") do
      post api_tasks_url, params: { task: { name: 'Task name', pos: 1111, description: 'a' * 10_001, list_id: @list.id } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 10000 characters)', json.dig('description', 0)
  end

  should "not create task without a list" do
    assert_no_difference("DB::Task.count") do
      post api_tasks_url, params: { task: { name: 'New task' } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'must exist', json.dig('list', 0)
  end

  should 'show task' do
    get api_task_url(@task), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @task.name, json['name']
    assert_equal @task.description, json['description']
    assert_equal @task.pos, json['pos']
  end

  should 'show task with all associations' do
    @task.users << user = ::FactoryBot.create(:user)
    @task.tags << tag = ::FactoryBot.create(:tag)

    get api_task_url(@task), as: :json, params: { include_associations: :true }
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @task.name, json['name']
    assert_equal @task.description, json['description']
    assert_equal @task.pos, json['pos']
    assert_equal @task.points, json['points']
    assert_equal @task.priority, json['priority']

    assert_equal @task.list.name, json['list']['name']
    assert_equal @task.list.pos, json['list']['pos']

    assert_equal @task.author.name, json['author']['name']
    assert_equal @task.author.avatar_url, json['author']['avatar_url']
    assert_equal @task.author.email, json['author']['email']

    assert_equal user.name, json['users'].first['name']

    assert_equal tag.name, json['tags'].first['name']
    assert_equal tag.colour, json['tags'].first['colour']
  end

  should 'update task' do
    patch api_task_url(@task), params: { task: { name: 'New name' } }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New name', json['name']
    assert_equal @task.description, json['description']
  end

  should 'destroy task' do
    assert_difference('DB::Task.count', -1) do
      delete api_task_url(@task), as: :json
    end

    assert_response :no_content

    assert @task.reload.deleted?
    assert_not @task.reload.deleted_fully?
  end

  should 'attach a tag to the task' do
    tag = ::FactoryBot.create(:tag)
    post attach_tag_api_task_url(@task), params: { tag_id: tag.id }

    assert_response :no_content

    @task.reload
    assert_equal tag.name, @task.tags.first.name
  end

  should 'detach a tag from the task' do
    tag = ::FactoryBot.create(:tag)
    @task.tags << tag
    assert_not_nil @task.tags.first

    post detach_tag_api_task_url(@task), params: { tag_id: tag.id }

    assert_response :no_content

    @task.reload
    assert_nil @task.tags.first
  end

  should 'assign a user to the task' do
    user = ::FactoryBot.create(:user)
    post assign_user_api_task_url(@task), params: { user_id: user.id }

    assert_response :no_content

    @task.reload
    assert_equal user.name, @task.users.first.name
  end

  should 'unassign a user from the task' do
    user = ::FactoryBot.create(:user)
    @task.users << user
    assert_not_nil @task.users.first

    post unassign_user_api_task_url(@task), params: { user_id: user.id }

    assert_response :no_content

    @task.reload
    assert_nil @task.users.first
  end
end
