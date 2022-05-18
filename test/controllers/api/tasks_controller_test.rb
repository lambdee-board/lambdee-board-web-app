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
      post api_tasks_url, params: { task: { name: 'New task', pos: @task.pos, list_id: @list.id, author_id: @user.id } }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'New task', json['name']
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
      post api_tasks_url, params: { task: { name: 'Task name', pos: 1111, description: 'a' * 1000, list_id: @list.id } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 300 characters)', json.dig('description', 0)
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
  end
end
