# frozen_string_literal: true

require "test_helper"

class API::BoardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user
    @board = ::FactoryBot.create :board
    @workspace = @board.workspace
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:board, name: "Board#{i}") }
    get '/api/boards'
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal @board.name, json.dig(0, 'name')
    3.times do |i|
      assert_equal "Board#{i}", json.dig(i + 1, 'name')
    end
  end

  should "not create board with a too long name" do
    assert_no_difference("DB::Board.count") do
      post api_boards_url, params: {
        board: { name: 'd' * 150, workspace_id: @workspace.id }
      }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 50 characters)', json.dig('name', 0)
  end

  should "not create board without a workspace" do
    assert_no_difference("DB::Board.count") do
      post api_boards_url, params: {
        board: { name: 'My board' }
      }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'must exist', json.dig('workspace', 0)
  end

  should "create board" do
    assert_difference("DB::Board.count") do
      post api_boards_url, params: {
        board: { name: 'Team 1', workspace_id: @workspace.id }
      }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Team 1', json['name']
  end

  should "show board" do
    get api_board_url(@board), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @board.name, json['name']
  end

  should "update board" do
    patch api_board_url(@board), params: {
      board: { name: 'New Name' }
    }, as: :json

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New Name', json['name']
  end

  should "destroy board" do
    assert_difference("DB::Board.count", -1) do
      delete api_board_url(@board), as: :json
    end

    assert_response :no_content
  end
end
