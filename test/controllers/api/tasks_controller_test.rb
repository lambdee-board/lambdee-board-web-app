# frozen_string_literal: true

require 'test_helper'

class DB::TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @task = ::FactoryBot.create(:task)
    @list = @task.list
    @board = @list.board
    @workspace = @board.workspace
  end

  context 'user belongs to board' do
    setup do
      @user.workspaces << @workspace
    end

    context 'developer' do
      setup do
        @user.developer!
      end

      should 'create task' do
        params = { task: { name: 'New task', priority: 4, points: 7, due_time: ::Time.at(1669459006), list_id: @list.id, author_id: @user.id } }
        assert_difference('DB::Task.count') do
          post api_tasks_url, params: params, as: :json, headers: auth_headers(@user)
        end

        assert_response :created
        json = ::JSON.parse response.body
        assert_equal 'New task', json['name']
        assert_equal 66560.0, json['pos']
        assert_equal 'very_high', json['priority']
        assert_equal 7, json['points']
        assert_equal '2022-11-26T10:36:46.000Z', json['due_time']
      end

      should "not create task with a too long name" do
        params = { task: { name: 'a' * 150, pos: 1111, description: 'description', list_id: @list.id } }
        assert_no_difference("DB::Task.count") do
          post api_tasks_url, params: params, as: :json, headers: auth_headers(@user)
        end

        assert_response :unprocessable_entity
        json = ::JSON.parse response.body
        assert_equal 'is too long (maximum is 80 characters)', json.dig('name', 0)
      end

      should "not create task with a too long description" do
        params = { task: { name: 'Task name', pos: 1111, description: 'a' * 10_001, list_id: @list.id } }
        assert_no_difference("DB::Task.count") do
          post api_tasks_url, params: params, as: :json, headers: auth_headers(@user)
        end

        assert_response :unprocessable_entity
        json = ::JSON.parse response.body
        assert_equal 'is too long (maximum is 10000 characters)', json.dig('description', 0)
      end

      should "not create task without a list" do
        assert_no_difference("DB::Task.count") do
          post api_tasks_url, params: { task: { name: 'New task' } }, as: :json, headers: auth_headers(@user)
        end

        assert_response :forbidden
      end

      should 'update task' do
        patch api_task_url(@task), params: { task: { name: 'New name' } }, as: :json, headers: auth_headers(@user)
        assert_response :success

        json = ::JSON.parse response.body
        assert_equal 'New name', json['name']
        assert_equal @task.description, json['description']
      end

      should 'destroy task' do
        assert_difference('DB::Task.count', -1) do
          delete api_task_url(@task), as: :json, headers: auth_headers(@user)
        end

        assert_response :no_content

        assert @task.reload.deleted?
        assert_not @task.reload.deleted_fully?
      end

      should 'attach a tag to the task' do
        tag = ::FactoryBot.create(:tag)
        post attach_tag_api_task_url(@task), params: { tag_id: tag.id }, headers: auth_headers(@user), as: :json

        assert_response :no_content

        @task.reload
        assert_equal tag.name, @task.tags.first.name
      end

      should 'detach a tag from the task' do
        tag = ::FactoryBot.create(:tag)
        @task.tags << tag
        assert_not_nil @task.tags.first

        post detach_tag_api_task_url(@task), params: { tag_id: tag.id }, headers: auth_headers(@user), as: :json

        assert_response :no_content

        @task.reload
        assert_nil @task.tags.first
      end

      should 'assign a user to the task' do
        user = ::FactoryBot.create(:user)
        post assign_user_api_task_url(@task), params: { user_id: user.id }, headers: auth_headers(@user), as: :json

        assert_response :no_content

        @task.reload
        assert_equal user.name, @task.users.first.name
      end

      should 'unassign a user from the task' do
        user = ::FactoryBot.create(:user)
        @task.users << user
        assert_not_nil @task.users.first

        post unassign_user_api_task_url(@task), params: { user_id: user.id }, headers: auth_headers(@user), as: :json

        assert_response :no_content

        @task.reload
        assert_nil @task.users.first
      end

      context 'sprint' do
        setup do
          @sprint = ::FactoryBot.create(:sprint, :with_list, board: @board)
          @list_in_sprint = @sprint.lists.last
        end

        should 'create new task in the active sprint' do
          params = { task: { name: 'New task', priority: 4, points: 7, list_id: @list_in_sprint.id, author_id: @user.id } }
          assert_difference('DB::Task.count') do
            post api_tasks_url, params: params, as: :json, headers: auth_headers(@user)
          end

          assert_response :created
          assert @sprint.reload.tasks.include?(::DB::Task.last)

          sprint_task = @sprint.sprint_tasks.last

          assert_not_nil sprint_task.added_at
          assert_equal @list_in_sprint.name, sprint_task.start_state
          assert_equal @list_in_sprint.name, sprint_task.state
        end

        should 'create new task beyond the active sprint' do
          params = { task: { name: 'New task', priority: 4, points: 7, list_id: @list.id, author_id: @user.id } }
          assert_difference('DB::Task.count') do
            post api_tasks_url, params: params, as: :json, headers: auth_headers(@user)
          end

          assert_response :created
          assert_not @sprint.reload.tasks.include?(::DB::Task.last)
        end

        should 'move task to the active sprint' do
          assert_not @sprint.reload.tasks.include?(@task)

          patch api_task_url(@task), params: { task: { list_id: @list_in_sprint.id } }, as: :json, headers: auth_headers(@user)

          assert_response :success
          json = ::JSON.parse response.body
          assert_equal @list_in_sprint.id, json['list_id']
          assert @sprint.reload.tasks.include?(@task)

          sprint_task = @sprint.sprint_tasks.last

          assert_not_nil sprint_task.added_at
          assert_equal @list_in_sprint.name, sprint_task.start_state
          assert_equal @list_in_sprint.name, sprint_task.state
        end

        should 'move task to another list in sprint' do
          @task.list_id = @list_in_sprint.id
          @task.save!
          assert @sprint.reload.tasks.include?(@task)

          @board.lists << new_list = ::FactoryBot.create(:visible_list)

          patch api_task_url(@task), params: { task: { list_id: new_list.id } }, as: :json, headers: auth_headers(@user)

          assert_response :success
          json = ::JSON.parse response.body
          assert @sprint.reload.tasks.include?(@task)

          sprint_task = @sprint.sprint_tasks.last

          assert_not_nil sprint_task.added_at
          assert_equal @list_in_sprint.name, sprint_task.start_state
          assert_equal new_list.name, sprint_task.state
        end

        should 'move task to another list in beyond the sprint' do
          assert_not @sprint.reload.tasks.include?(@task)

          @board.lists << new_list = ::FactoryBot.create(:list)

          patch api_task_url(@task), params: { task: { list_id: new_list.id } }, as: :json, headers: auth_headers(@user)

          assert_response :success
          json = ::JSON.parse response.body
          assert_not @sprint.reload.tasks.include?(@task)
        end
      end

      context 'time' do
        should 'add to a task' do
          put add_time_api_task_url(@task), params: { time: 180 }, headers: auth_headers(@user), as: :json
          assert_response :success

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 180, json[:spent_time]
        end

        should 'add in minutes to a task' do
          put add_time_api_task_url(@task), params: { time: 3, unit: 'minute' }, headers: auth_headers(@user), as: :json
          assert_response :success

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 180, json[:spent_time]
        end

        should 'add in hours to a task' do
          put add_time_api_task_url(@task), params: { time: 2, unit: 'hour' }, headers: auth_headers(@user), as: :json
          assert_response :success

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 7_200, json[:spent_time]
        end

        should 'add in days to a task' do
          put add_time_api_task_url(@task), params: { time: 1, unit: 'day' }, headers: auth_headers(@user), as: :json
          assert_response :success

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 86_400, json[:spent_time]
        end

        should 'not add when negative time' do
          put add_time_api_task_url(@task), params: { time: -60 }, headers: auth_headers(@user), as: :json
          assert_response :unprocessable_entity

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 'must be greater than 0', json[:time][0]
        end

        should 'not add when non integer time' do
          put add_time_api_task_url(@task), params: { time: 'dupa' }, headers: auth_headers(@user), as: :json
          assert_response :unprocessable_entity

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 'must be greater than 0', json[:time][0]
        end

        should 'not add when invalid unit' do
          put add_time_api_task_url(@task), params: { time: 20, unit: 'dupa' }, headers: auth_headers(@user), as: :json
          assert_response :unprocessable_entity

          json = ::JSON.parse response.body, symbolize_names: true
          assert_equal 'is not included in the list', json[:unit][0]
        end
      end
    end

    context 'guest' do
      setup do
        @user.guest!
      end

      should 'get index' do
        3.times { |i| ::FactoryBot.create(:task, name: "Task#{i}", list: @list) }
        get '/api/tasks', headers: auth_headers(@user)
        assert_response 200
        json = ::JSON.parse(response.body)
        assert_equal @task.name, json.dig(0, 'name')
        3.times do |i|
          assert_equal "Task#{i}", json.dig(i + 1, 'name')
        end
      end

      should 'show task' do
        get api_task_url(@task), as: :json, headers: auth_headers(@user)
        assert_response :success

        json = ::JSON.parse response.body
        assert_equal @task.name, json['name']
        assert_equal @task.description, json['description']
        assert_equal @task.pos, json['pos']
      end

      should 'show task with all associations' do
        @task.users << user = ::FactoryBot.create(:user)
        @task.tags << tag = ::FactoryBot.create(:tag)

        get api_task_url(@task), as: :json, params: { include_associations: :true }, headers: auth_headers(user)
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

      should 'not update task' do
        patch api_task_url(@task), params: { task: { name: 'New name' } }, as: :json, headers: auth_headers(@user)
        assert_response :forbidden

        assert_not_equal 'New name', @task.reload.name
      end

      should 'not destroy task' do
        assert_no_difference('DB::Task.count') do
          delete api_task_url(@task), as: :json, headers: auth_headers(@user)
        end

        assert_response :forbidden
      end

      should 'not attach a tag to the task' do
        tag = ::FactoryBot.create(:tag)
        post attach_tag_api_task_url(@task), params: { tag_id: tag.id }, headers: auth_headers(@user), as: :json

        assert_response :forbidden

        @task.reload
        assert_equal 0, @task.tags.count
      end

      should 'not detach a tag from the task' do
        tag = ::FactoryBot.create(:tag)
        @task.tags << tag
        assert_not_nil @task.tags.first

        post detach_tag_api_task_url(@task), params: { tag_id: tag.id }, headers: auth_headers(@user), as: :json

        assert_response :forbidden

        @task.reload
        assert_not_nil @task.tags.first
      end

      should 'not assign a user to the task' do
        user = ::FactoryBot.create(:user)
        post assign_user_api_task_url(@task), params: { user_id: user.id }, headers: auth_headers(@user), as: :json

        assert_response :forbidden

        @task.reload
        assert_equal 0, @task.users.count
      end

      should 'unassign a user from the task' do
        user = ::FactoryBot.create(:user)
        @task.users << user
        assert_not_nil @task.users.first

        post unassign_user_api_task_url(@task), params: { user_id: user.id }, headers: auth_headers(@user), as: :json

        assert_response :forbidden

        @task.reload
        assert_not_nil @task.users.first
      end
    end
  end

  context 'user doest not belong to board' do
    setup do
      @user.regular!
    end
    should 'not get index' do
      3.times { |i| ::FactoryBot.create(:task, name: "Task#{i}") }
      get '/api/tasks', headers: auth_headers(@user)
      assert_response 200
      json = ::JSON.parse(response.body)
      assert_equal 0, json.count
    end

    should 'not show task' do
      get api_task_url(@task), as: :json, headers: auth_headers(@user)
      assert_response :forbidden
    end
  end
end
