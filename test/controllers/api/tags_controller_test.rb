# frozen_string_literal: true

require 'test_helper'

class API::TagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @task = ::FactoryBot.create(:task)
    @board = @task.list.board
    @workspace = @board.workspace
    @tag = ::FactoryBot.create(:tag, name: 'my name', board_id: @board.id)
    @task.tags << @tag
  end

  context 'user belongs to board' do
    setup do
      @user.workspaces << @workspace
    end

    context 'developer' do
      setup do
        @user.developer!
      end

      should 'create tag without task given' do
        assert_difference('DB::Tag.count') do
          post api_tags_url(@board), params: { tag: { colour: @tag.colour, name: @tag.name, board_id: @board.id } }, headers: auth_headers(@user), as: :json
        end

        assert_response :created
        json = ::JSON.parse(response.body)
        assert_equal @tag.colour, json['colour']
        assert_equal @tag.name, json['name']
        assert_equal @board.id, json['board_id']
      end

      should 'create tag without task_id given on /api/boards/:board_id/tags' do
        assert_difference('DB::Tag.count') do
          post api_board_tags_url(@board), params: { tag: { colour: @tag.colour, name: @tag.name } }, headers: auth_headers(@user), as: :json
        end

        assert_response :created
        json = ::JSON.parse(response.body)
        assert_equal @tag.colour, json['colour']
        assert_equal @tag.name, json['name']
        assert_equal @board.id, json['board_id']
      end

      should 'create tag without task_id given on /api/boards/:task_id/tags' do
        assert_difference('DB::Tag.count') do
          post api_task_tags_url(@task), params: { tag: { colour: @tag.colour, name: @tag.name } }, headers: auth_headers(@user), as: :json
        end

        assert_response :created
        json = ::JSON.parse(response.body)
        assert_equal @tag.colour, json['colour']
        assert_equal @tag.name, json['name']
        assert_equal @board.id, json['board_id']
      end

      should 'ignore board_id if task_id is given' do
        board2 = ::FactoryBot.create(:board)

        post api_task_tags_url(@task), params: { tag: { colour: @tag.colour, name: @tag.name, board_id: board2.id  } }, headers: auth_headers(@user), as: :json

        json = ::JSON.parse(response.body)
        assert_equal @board.id, json['board_id']
      end

      should 'update tag' do
        patch api_tag_url(@tag), params: { tag: { board_id: @tag.board_id, colour: @tag.colour, name: 'val de larmes' } }, headers: auth_headers(@user), as: :json
        assert_response :success

        json = ::JSON.parse(response.body)
        assert_equal 'val de larmes', json['name']
        assert_equal @tag.colour, json['colour']
        assert_equal @board.id, json['board_id']
      end

      should 'destroy tag' do
        assert_difference('DB::Tag.count', -1) do
          delete api_tag_url(@tag), headers: auth_headers(@user)
        end

        assert_response :no_content
      end
    end

    context 'guest' do
      setup do
        @user.guest!
      end

      should 'get index for board' do
        board2 = ::FactoryBot.create(:board)
        ::FactoryBot.create(:tag, board_id: board2.id)

        get api_board_tags_url(@board.id), headers: auth_headers(@user)
        assert_response :success
        json = ::JSON.parse(response.body)
        assert_equal 1, json.size
        assert_equal 'my name', json.first['name']
      end

      should 'get index for task' do
        task2 = ::FactoryBot.create(:task)
        task2.tags << ::FactoryBot.create(:tag, board_id: @board.id)

        get api_task_tags_url(@task.id), headers: auth_headers(@user)
        assert_response :success
        json = ::JSON.parse(response.body)
        assert_equal 1, json.size
        assert_equal 'my name', json.first['name']
      end

      should 'show tag' do
        get api_tag_url(@tag), headers: auth_headers(@user)
        assert_response :success

        json = ::JSON.parse(response.body)
        assert_equal 'my name', json['name']
        assert_equal @tag.colour, json['colour']
        assert_equal @board.id, json['board_id']
      end

      should 'not update tag' do
        patch api_tag_url(@tag), params: { tag: { board_id: @tag.board_id, colour: @tag.colour, name: 'val de larmes' } }, headers: auth_headers(@user), as: :json
        assert_response :forbidden
      end

      should 'not destroy tag' do
        assert_no_difference('DB::Tag.count') do
          delete api_tag_url(@tag), headers: auth_headers(@user)
        end

        assert_response :forbidden
      end
    end
  end

  context 'user doest not belong to tag' do
    setup do
      @user.regular!
    end

    should 'not get index for board' do
      board2 = ::FactoryBot.create(:board)
      ::FactoryBot.create(:tag, board_id: board2.id)

      get api_board_tags_url(@board.id), headers: auth_headers(@user)
      assert_response :success
      json = ::JSON.parse(response.body)
      assert_equal 0, json.size
    end

    should 'not show tag' do
      get api_tag_url(@tag), headers: auth_headers(@user)
      assert_response :forbidden
    end
  end
end
