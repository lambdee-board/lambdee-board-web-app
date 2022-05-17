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
      post api_lists_url, params: { list: { name: 'Backlog', pos: @list.pos, board_id: @board.id } }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Backlog', json['name']
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

  should 'update list' do
    patch api_list_url(@list), params: { list: { name: 'New name' } }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New name', json['name']
  end

  should 'destroy list' do
    assert_no_difference('DB::List.count') do
      delete api_list_url(@list), as: :json
    end

    assert true, ::DB::List.last.archived?

    assert_response :no_content
  end
end
