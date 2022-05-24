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

  should 'get index' do
    get api_comments_url, as: :json
    assert_response :success
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
    assert_no_difference('DB::Comment.count') do
      delete api_comment_url(@comment), as: :json
    end

    assert_response :no_content
    assert_equal true, @comment.reload.deleted
  end
end
