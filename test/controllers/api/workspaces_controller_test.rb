# frozen_string_literal: true

require 'test_helper'

class API::WorkspacesControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @workspace = ::FactoryBot.create :workspace
    @user = ::FactoryBot.create :user, role: :developer
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:workspace, name: "workspace#{i}").users << @user }
    get '/api/workspaces', headers: auth_headers(@user)
    assert_response 200
    json = ::JSON.parse(response.body)
    assert_equal 3, json.length
    3.times do |i|
      assert_equal "workspace#{i}", json.dig(i, 'name')
    end
  end

  should 'not create workspace with a too long name' do
    assert_no_difference('DB::Workspace.count') do
      post api_workspaces_url, params: {
        workspace: { name: 'd' * 50 }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is too long (maximum is 40 characters)', json.dig('name', 0)
  end

  should 'create workspace' do
    assert_difference('DB::Workspace.count') do
      post api_workspaces_url, params: {
        workspace: { name: 'Workspace 1' }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Workspace 1', json['name']
  end

  should 'show workspace' do
    get api_workspace_url(@workspace), as: :json, headers: auth_headers(@user)
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @workspace.name, json['name']
  end

  should 'update workspace' do
    patch api_workspace_url(@workspace), params: {
      workspace: { name: 'New Name' }
    }, as: :json, headers: auth_headers(@user)

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New Name', json['name']
  end

  should 'destroy workspace' do
    assert_difference('DB::Workspace.count', -1) do
      delete api_workspace_url(@workspace), as: :json, headers: auth_headers(@user)
    end

    assert_response :no_content

    assert @workspace.reload.deleted?
    assert_not @workspace.reload.deleted_fully?
  end

  should 'assign user to workspace' do
    post assign_user_api_workspace_url(@workspace), params: { user_id: @user.id }, headers: auth_headers(@user), as: :json

    assert_response :no_content

    assert_equal @user.id, @workspace.reload.users.last.id
  end

  should 'unassign user from workspace' do
    user2 = ::FactoryBot.create :user
    @workspace.users << @user
    @workspace.users << user2
    assert_equal 2, @workspace.users.size

    post unassign_user_api_workspace_url(@workspace), params: { user_id: @user.id }, headers: auth_headers(@user), as: :json

    assert_response :no_content

    assert_equal 1, @workspace.reload.users.size
    assert_equal user2.id, @workspace.reload.users.first.id
  end
end
