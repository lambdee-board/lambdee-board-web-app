# frozen_string_literal: true

require "test_helper"

class API::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:user, name: "Person#{i}") }
    get '/api/users'
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal @user.name, json.dig(0, 'name')
    3.times do |i|
      assert_equal "Person#{i}", json.dig(i + 1, 'name')
    end
  end

  should 'get index with role param' do
    ::FactoryBot.create(:user, role: :guest,)
    ::FactoryBot.create(:user, role: :regular)
    get '/api/users?role=guest'
    json = ::JSON.parse(response.body)

    json.each do |user|
      assert_equal 'guest', user['role']
    end
  end

  should 'get index with role_collection param' do
    ::FactoryBot.create(:user, role: :guest,)
    ::FactoryBot.create(:user, role: :regular)
    ::FactoryBot.create(:user, role: :admin)
    # /api/users?role_collection[]=guest&role_collection[]=regular
    get '/api/users?role_collection%5B%5D=guest&role_collection%5B%5D=regular'
    json = ::JSON.parse(response.body)

    json.each do |user|
      assert %w[guest regular].include?(user['role']), "Returned user with incorrect role `#{user['role'].inspect}`"
    end
  end

  should 'get index with created_at param' do
    ::FactoryBot.create(:user, name: 'old', created_at: ::Time.parse('12.01.2000'))
    ::FactoryBot.create(:user, name: 'ok', created_at: ::Time.parse('12.01.2010 16:00'))
    ::FactoryBot.create(:user, name: 'ok2', created_at: ::Time.parse('20.10.2015 16:00'))
    ::FactoryBot.create(:user, name: 'young', created_at: ::Time.parse('12.01.2020'))
    get '/api/users?created_at_from=2010.01.12&created_at_to=2015.10.20'
    json = ::JSON.parse(response.body)

    assert_equal 2, json.size
    assert_equal 'ok', json.first['name']
    assert_equal 'ok2', json.second['name']
  end

  should 'get index with workspace_id param' do
    ok_user = ::FactoryBot.create(:user, name: 'ok')
    ::FactoryBot.create(:user)
    workspace = ::FactoryBot.create(:workspace)
    workspace.users << ok_user

    get "/api/users?workspace_id=#{workspace.id}"
    json = ::JSON.parse(response.body)

    assert_equal 1, json.size
    assert_equal 'ok', json.first['name']
  end

  should 'get index with pagination' do
    10.times { |i| ::FactoryBot.create(:user, name: "tom_jerry#{i}") }
    get '/api/users?page=2&per=3'
    json = ::JSON.parse(response.body)

    assert_equal 3, json.size
    assert_equal 'tom_jerry2', json.first['name']
    assert_equal 'tom_jerry3', json.second['name']
    assert_equal 'tom_jerry4', json.third['name']
  end

  should 'get index with search param' do
    ::FactoryBot.create(:user, name: 'tom_jerry')
    ::FactoryBot.create(:user, email: 'jerry11@example.com')
    ::FactoryBot.create(:user, email: 'tom@example.com')
    get '/api/users?search=jerry'
    json = ::JSON.parse(response.body)

    assert_equal 2, json.size
    assert_equal 'tom_jerry', json.first['name']
    assert_equal 'jerry11@example.com', json.second['email']
  end

  should 'get index with limit param' do
    3.times { ::FactoryBot.create(:user) }
    get '/api/users?limit=2'
    json = ::JSON.parse(response.body)

    assert_equal 2, json.size
  end

  should 'return error when per param is given, but page param is not' do
    get '/api/users?per=5'
    json = ::JSON.parse(response.body)

    assert_equal 'page parameter is required', json['per'].first
  end

  should 'return error if limit param is not valid integer' do
    get '/api/users?limit=tom'
    json = ::JSON.parse(response.body)

    assert_equal 'should be an Integer', json['limit'].first
  end

  should 'return error if date format is invalid' do
    get '/api/users?created_at_from=22.02.2024&created_at_to=may'
    json = ::JSON.parse(response.body)

    assert_equal 'invalid date format (YYYY.MM.DD required)', json['created_at_from'].first
    assert_equal 'invalid date format (YYYY.MM.DD required)', json['created_at_to'].first
  end

  should 'get users of a workspace' do
    wrk = ::FactoryBot.create :workspace
    3.times { |i| wrk.users << ::FactoryBot.create(:user, name: "Person#{i}") }
    5.times { ::FactoryBot.create :user }

    get "/api/workspaces/#{wrk.id}/users"
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal 3, json.length
    assert_not_equal @user.name, json.dig(0, 'name')
    3.times do |i|
      assert_equal "Person#{i}", json.dig(i, 'name')
    end
  end

  should "not create user with taken email" do
    assert_no_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: @user.email }
      }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'has already been taken', json.dig('email', 0)
  end

  should "not create user with invalid email" do
    assert_no_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: 'this!%$%is_not*an@email.example@com' }
      }, as: :json
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is invalid', json.dig('email', 0)
  end

  should "create user" do
    assert_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: 'andy.mckee@example.com', password: 'secret', password_confirmation: 'secret' }
      }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Andy McKee', json['name']
    assert_equal 'andy.mckee@example.com', json['email']
  end

  should "show user" do
    get api_user_url(@user), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @user.name, json['name']
    assert_equal @user.email, json['email']
  end

  should "update user" do
    patch api_user_url(@user), params: {
      user: { name: 'New Name', email: 'new_email@example.com' }
    }, as: :json

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New Name', json['name']
    assert_equal 'new_email@example.com', json['email']
  end

  should "archive user" do
    assert_difference('DB::User.count', -1) do
      delete api_user_url(@user), as: :json
    end

    assert_response :no_content
    assert @user.reload.deleted?
    assert_not @user.reload.deleted_fully?
  end
end
