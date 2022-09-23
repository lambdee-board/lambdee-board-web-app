# frozen_string_literal: true

require 'test_helper'

class API::ListsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @list = ::FactoryBot.create(:list)
    @board = @list.board
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:list, name: "List#{i}") }
    get '/api/lists'
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal @list.name, json.dig(0, 'name')
    3.times do |i|
      assert_equal "List#{i}", json.dig(i + 1, 'name')
    end
  end

  should 'create list' do
    assert_difference('DB::List.count') do
      post api_lists_url, params: {
        list: {
          name: 'Backlog',
          visible: true,
          pos: @list.pos,
          board_id: @board.id,
          inexistent_field: :lol
        }
      }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Backlog', json['name']
    assert_equal true, json['visible']
    assert_equal @list.pos, json['pos']
    assert_equal @board.id, json['board_id']
    assert_nil json['inexistent_field']
  end

  should 'create list with default params' do
    assert_difference('DB::List.count') do
      post api_lists_url, params: {
        list: {
          name: 'Backlog',
          board_id: @board.id,
        }
      }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Backlog', json['name']
    assert_equal @board.id, json['board_id']
    assert_equal false, json['visible']
    assert json['pos'].is_a?(::Float)
  end

  should "not create list with a too long name" do
    assert_no_difference("DB::List.count") do
      post api_lists_url, params: { list: { name: 'd' * 150, board_id: @board.id } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 50 characters)', json.dig('name', 0)
  end

  should "not create list without a board" do
    assert_no_difference("DB::List.count") do
      post api_lists_url, params: { list: { name: 'Done' } }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'must exist', json.dig('board', 0)
  end

  should 'show list' do
    get api_list_url(@list), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @list.name, json['name']
  end

  should 'show list with tasks' do
    @list.tasks << task = ::FactoryBot.create(:task)
    task.users << user = ::FactoryBot.create(:user)
    task.tags << tag =  ::FactoryBot.create(:tag)
    @list.tasks << deleted_task = ::FactoryBot.create(:task)
    deleted_task.destroy
    get api_list_url(@list), as: :json, params: { tasks: :visible }

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @list.name, json['name']
    assert_equal 1, json['tasks'].size
    assert_equal task.name, json['tasks'].first['name']
    assert_equal user.name, json['tasks'].first['users'].first['name']
    assert_equal tag.name, json['tasks'].first['tags'].first['name']
  end

  should 'show list with tasks including deleted' do
    @list.tasks << task = ::FactoryBot.create(:task)
    @list.tasks << deleted_task = ::FactoryBot.create(:task)
    deleted_task.destroy
    get api_list_url(@list), as: :json, params: { tasks: :all }

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @list.name, json['name']
    assert_equal 2, json['tasks'].size
    assert_equal task.name, json['tasks'].first['name']
    assert_nil json['tasks'].first['deleted_at']
    assert_not_nil json['tasks'].second['deleted_at']
  end

  should 'show list with deleted tasks' do
    @list.tasks << task = ::FactoryBot.create(:task)
    @list.tasks << deleted_task = ::FactoryBot.create(:task)
    deleted_task.destroy
    get api_list_url(@list), as: :json, params: { tasks: :archived }

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @list.name, json['name']
    assert_equal 1, json['tasks'].size
    assert_equal deleted_task.name, json['tasks'].first['name']
    assert_not_nil json['tasks'].first['deleted_at']
  end

  should 'update list' do
    assert_not_equal 'New name', @list.name
    assert_not_equal true, @list.visible
    assert_not_equal 123.123, @list.pos

    patch api_list_url(@list), params: {
      list: {
        name: 'New name',
        visible: true,
        pos: 123.123
      }
    }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New name', json['name']
    assert_equal true, json['visible']
    assert_equal 123.123, json['pos']
  end

  should 'destroy list' do
    assert_difference('DB::List.count', -1) do
      delete api_list_url(@list), as: :json
    end

    assert_response :no_content

    assert @list.reload.deleted?
    assert_not @list.reload.deleted_fully?
  end
end
