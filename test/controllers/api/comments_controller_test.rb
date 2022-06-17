# frozen_string_literal: true

require 'test_helper'

class API::CommentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @task = ::FactoryBot.create(:task)
    @board = @task.list.board
    @comment = ::FactoryBot.create(:comment)
    @task.comments << @comment
  end

  should 'get comments of task without author' do
    get api_task_comments_url(@task), as: :json
    assert_response :success

    json = ::JSON.parse(response.body)
    assert_equal @comment.body, json.first['body']
    assert_equal @comment.author_id, json.first['author_id']
    assert_nil json.first['author']
  end

  should 'get comments of task with nested author' do
    get api_task_comments_url(@task), as: :json, params: { with_author: :true }
    assert_response :success

    json = ::JSON.parse(response.body)
    assert_equal @comment.body, json.first['body']
    assert_equal @comment.author_id, json.first['author_id']
    assert_equal @comment.author.name, json.first['author']['name']
    assert_equal @comment.author.avatar_url, json.first['author']['avatar_url']
    assert_equal @comment.author.email, json.first['author']['email']
  end

  should 'create comment' do
    assert_difference('DB::Comment.count') do
      post api_comments_url, params: { comment: { body: @comment.body, deleted: @comment.deleted, task_id: @comment.task_id, author_id: @comment.author_id } }, as: :json
    end

    assert_response :created
  end

  should 'show comment' do
    get api_comment_url(@comment), as: :json
    assert_response :success
  end

  should 'update comment' do
    patch api_comment_url(@comment), params: { comment: { body: @comment.body, deleted: @comment.deleted, task_id: @comment.task_id, author_id: @comment.author_id } }, as: :json
    assert_response :success
  end

  should 'archive comment' do
    assert_difference('DB::Comment.count', -1) do
      delete api_comment_url(@comment), as: :json
    end

    assert_response :no_content

    assert @comment.reload.deleted?
    assert_not @comment.reload.deleted_fully?
  end
end
