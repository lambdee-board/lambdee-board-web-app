# frozen_string_literal: true

require 'test_helper'

class API::CommentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @task = ::FactoryBot.create(:task)
    @board = @task.list.board
    @workspace = @board.workspace
  end

  should 'create comment' do
    assert_difference('DB::Comment.count') do
      post api_comments_url, params: { comment: { body: 'new comment', task_id: @task.id, author_id: @user.id } }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created

    comment = ::DB::Comment.last
    assert_equal 'new comment', comment.body
    assert_equal @user.id, comment.author.id
    assert_equal @task.id, comment.task.id
  end

  context 'author of the comment' do
    setup do
      @comment = ::FactoryBot.create(:comment, author: @user)
      @task.comments << @comment
    end

    should 'get comments of task without author' do
      get api_task_comments_url(@task), as: :json, headers: auth_headers(@user)
      assert_response :success

      json = ::JSON.parse(response.body)
      assert_equal @comment.body, json.first['body']
      assert_equal @comment.author_id, json.first['author_id']
      assert_nil json.first['author']
    end

    should 'show comment' do
      get api_comment_url(@comment), as: :json, headers: auth_headers(@user)
      assert_response :success
    end

    should 'update comment' do
      patch api_comment_url(@comment), params: { comment: { body: 'after update' } }, as: :json, headers: auth_headers(@user)
      assert_response :success

      assert_equal 'after update', @comment.reload.body
    end

    should 'archive comment' do
      assert_difference('DB::Comment.count', -1) do
        delete api_comment_url(@comment), as: :json, headers: auth_headers(@user)
      end

      assert_response :no_content

      assert @comment.reload.deleted?
      assert_not @comment.reload.deleted_fully?
    end
  end

  context 'comment belongs to user workspace' do
    setup do
      @comment = ::FactoryBot.create(:comment)
      @user.workspaces << @workspace
      @task.comments << @comment
    end

    should 'get comments of task without author' do
      get api_task_comments_url(@task), as: :json, headers: auth_headers(@user)
      assert_response :success

      json = ::JSON.parse(response.body)
      assert_equal @comment.body, json.first['body']
      assert_equal @comment.author_id, json.first['author_id']
      assert_nil json.first['author']
    end

    should 'get comments of task with nested author' do
      get api_task_comments_url(@task), as: :json, params: { with_author: :true }, headers: auth_headers(@user)
      assert_response :success

      json = ::JSON.parse(response.body)
      assert_equal @comment.body, json.first['body']
      assert_equal @comment.author_id, json.first['author_id']
      assert_equal @comment.author.name, json.first['author']['name']
      assert_equal @comment.author.avatar_url, json.first['author']['avatar_url']
      assert_equal @comment.author.email, json.first['author']['email']
    end

    should 'show comment' do
      get api_comment_url(@comment), as: :json, headers: auth_headers(@user)
      assert_response :success
    end

    should 'not update comment if user is not an author' do
      comment = ::FactoryBot.create(:comment, body: 'jerry')

      patch api_comment_url(comment), params: { comment: { body: 'ton and jerry' } }, as: :json, headers: auth_headers(@user)
      assert_response :forbidden

      assert_equal 'jerry', comment.reload.body
    end

    should 'not archive comment when user is not an author' do
      @workspace.users << @user

      assert_no_difference('DB::Comment.count') do
        delete api_comment_url(@comment), as: :json, headers: auth_headers(@user)
      end

      assert_response :forbidden
    end
  end

  context 'comment does not belong to user workspace' do
    setup do
      @user.regular!
      @comment = ::FactoryBot.create(:comment)
    end

    should 'not show comments' do
      comment = ::FactoryBot.create(:comment, body: 'tom and jerry')
      @task.comments << comment

      get api_task_comments_url(@task), as: :json, headers: auth_headers(@user)
      assert_response :success

      json = ::JSON.parse(response.body)
      assert_equal 0, json.size
    end

    should 'not show comment' do
      comment = ::FactoryBot.create(:comment)

      get api_comment_url(comment), as: :json, headers: auth_headers(@user)
      assert_response :forbidden
    end
  end
end
