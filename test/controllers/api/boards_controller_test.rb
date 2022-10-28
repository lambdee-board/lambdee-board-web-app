# frozen_string_literal: true

require "test_helper"

class API::BoardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: :manager
    @board = ::FactoryBot.create :board
    @workspace = @board.workspace
  end

  context 'user belongs to board' do
    setup do
      @user.workspaces << @workspace
    end

    should 'get index' do
      3.times { |i| ::FactoryBot.create(:board, name: "Board#{i}", workspace: @workspace) }
      get '/api/boards', headers: auth_headers(@user)
      assert_response 200
      json = ::JSON.parse(response.body)

      assert_equal @board.name, json.dig(0, 'name')
      3.times do |i|
        assert_equal "Board#{i}", json.dig(i + 1, 'name')
      end
    end

    should 'show board' do
      get api_board_url(@board), as: :json, headers: auth_headers(@user)
      assert_response :success

      json = ::JSON.parse response.body
      assert_equal @board.name, json['name']

      assert_equal [@board.id.to_s], @user.reload.recent_boards
    end

    should 'show board with visible lists' do
      @board.lists << ::FactoryBot.create(:list)
      @board.lists << list = ::FactoryBot.create(:list, visible: true)
      @board.lists << deleted_list = ::FactoryBot.create(:list, visible: true)
      deleted_list.destroy
      get api_board_url(@board), as: :json, params: { lists: :visible }, headers: auth_headers(@user)

      assert_response :success

      json = ::JSON.parse response.body
      assert_equal @board.name, json['name']
      assert_equal 1, json['lists'].size
      assert_equal list.name, json['lists'].first['name']
    end

    should 'show board with lists including deleted' do
      @board.lists << list = ::FactoryBot.create(:list)
      @board.lists << deleted_list = ::FactoryBot.create(:list)
      deleted_list.destroy
      get api_board_url(@board), as: :json, params: { lists: :all }, headers: auth_headers(@user)

      assert_response :success

      json = ::JSON.parse response.body
      assert_equal @board.name, json['name']
      assert_equal 2, json['lists'].size
      assert_equal list.name, json['lists'].first['name']
      assert_nil json['lists'].first['deleted_at']
      assert_not_nil json['lists'].second['deleted_at']
    end

    should 'show board with deleted lists' do
      @board.lists << list = ::FactoryBot.create(:list)
      @board.lists << deleted_list = ::FactoryBot.create(:list)
      deleted_list.destroy
      get api_board_url(@board), as: :json, params: { lists: :archived }, headers: auth_headers(@user)

      assert_response :success

      json = ::JSON.parse response.body
      assert_equal @board.name, json['name']
      assert_equal 1, json['lists'].size
      assert_equal deleted_list.name, json['lists'].first['name']
      assert_not_nil json['lists'].first['deleted_at']
    end

    should 'create board' do
      assert_difference("DB::Board.count") do
        post api_boards_url, params: {
          board: { name: 'Team 1', workspace_id: @workspace.id }
        }, as: :json, headers: auth_headers(@user)
      end

      assert_response :created
      json = ::JSON.parse response.body
      assert_equal 'Team 1', json['name']

      assert_equal [json['id'].to_s], @user.reload.recent_boards
    end

    should 'not create board with a too long name' do
      assert_no_difference("DB::Board.count") do
        post api_boards_url, params: {
          board: { name: 'd' * 150, workspace_id: @workspace.id  }
        }, as: :json, headers: auth_headers(@user)
      end

      assert_response :unprocessable_entity
      json = ::JSON.parse response.body
      assert_equal 'is too long (maximum is 50 characters)', json.dig('name', 0)
    end

    should 'not create board without a workspace' do
      assert_no_difference("DB::Board.count") do
        post api_boards_url, params: {
          board: { name: 'My board' }
        }, as: :json, headers: auth_headers(@user)
      end

      assert_response :unauthorized
    end

    should 'update board' do
      patch api_board_url(@board), params: {
        board: { name: 'New Name' }
      }, as: :json, headers: auth_headers(@user)

      assert_response :success

      json = ::JSON.parse response.body
      assert_equal 'New Name', json['name']
    end

    should 'destroy board' do
      assert_difference("DB::Board.count", -1) do
        delete api_board_url(@board), as: :json, headers: auth_headers(@user)
      end

      assert_response :no_content

      assert @board.reload.deleted?
      assert_not @board.reload.deleted_fully?
    end

    should 'get current user tasks' do
      ok_list = ::FactoryBot.create(:list, name: 'ok_list', board: @board)
      bad_list = ::FactoryBot.create(:list, name: 'bad_list', board: @board)

      ok_task = ::FactoryBot.create(:task, name: 'ok_task', list: ok_list, author: @user)
      bad_task1 = ::FactoryBot.create(:task, name: 'bad_task1', list: ok_list)
      bad_task2 = ::FactoryBot.create(:task, name: 'bad_task2', list: bad_list)

      ok_task.users << @user
      ok_task.tags << tag = ::FactoryBot.create(:tag)

      get "/api/boards/#{@board.id}/user_tasks", headers: auth_headers(@user)

      assert_response :ok

      json = ::JSON.parse(response.body)
      assert_equal @board.name, json['name']
      assert_equal 1, json['lists'].size
      assert_equal 'ok_list', json['lists'].first['name']
      assert_equal 1, json['lists'].first['tasks'].size
      assert_equal 'ok_task', json['lists'].first['tasks'].first['name']
      assert_equal @user.name, json['lists'].first['tasks'].first['users'].first['name']
      assert_equal tag.name, json['lists'].first['tasks'].first['tags'].first['name']
      assert_equal @user.name, json['lists'].first['tasks'].first['author']['name']
    end
  end

  context 'user does not belong to board' do
    setup do
      @user.regular!
    end

    should 'get index with no boards' do
      3.times { |i| ::FactoryBot.create(:board, name: "Board#{i}", workspace: @workspace) }
      get '/api/boards', headers: auth_headers(@user)
      assert_response 200
      json = ::JSON.parse(response.body)

      assert_equal 0, json.count
    end

    should 'not show board' do
      get api_board_url(@board), as: :json, headers: auth_headers(@user)
      assert_response :unauthorized
    end

    should 'not create board' do
      assert_no_difference('DB::Board.count') do
        post api_boards_url, params: {
          board: { name: 'Team 1', workspace_id: @workspace.id }
        }, as: :json, headers: auth_headers(@user)
      end

      assert_response :unauthorized
    end

    should 'not update board' do
      patch api_board_url(@board), params: {
        board: { name: 'New Name' }
      }, as: :json, headers: auth_headers(@user)

      assert_response :unauthorized
    end

    should 'not destroy board' do
      assert_no_difference('DB::Board.count') do
        delete api_board_url(@board), as: :json, headers: auth_headers(@user)
      end

      assert_response :unauthorized
    end
  end

  should 'get recent boards' do
    @user.recent_boards = [@board.id]
    @user.save
    get '/api/boards/recently_viewed', headers: auth_headers(@user)

    assert_response :ok

    json = ::JSON.parse(response.body)
    assert_equal @board.id, json.first['id']
    assert_equal @board.name, json.first['name']
    assert_equal @board.colour, json.first['colour']
    assert_equal @board.workspace_id, json.first['workspace_id']
    assert_nil json.first['deleted_at']
  end
end
