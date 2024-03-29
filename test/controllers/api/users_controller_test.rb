# frozen_string_literal: true

require "test_helper"

class API::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: :admin
  end

  should 'get index' do
    3.times { |i| ::FactoryBot.create(:user, name: "Person#{i}") }
    get '/api/users', headers: auth_headers(@user)
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal @user.name, json.dig('users', 0, 'name')
    3.times do |i|
      assert_equal "Person#{i}", json.dig('users', i + 1, 'name')
    end
  end

  should 'update user' do
    patch api_user_url(@user), params: {
      user: { name: 'New Name 2' }
    }, as: :json, headers: auth_headers(@user)

    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'New Name 2', json['name']
  end

  should 'not update another user' do
    @user.developer!
    user2 = ::FactoryBot.create(:user, name: 'name')
    patch api_user_url(user2), params: {
      user: { name: 'New Name 2' }
    }, as: :json, headers: auth_headers(@user)

    assert_response :forbidden

    assert_equal 'name', user2.reload.name
  end

  should 'return global ui script triggers' do
    global_private_trigger = ::FactoryBot.create(:ui_script_trigger, private: true, author: @user)
    global_trigger = ::FactoryBot.create(:ui_script_trigger, author: @user)

    ::FactoryBot.create(:ui_script_trigger, private: true)
    ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: ::FactoryBot.create(:board))
    ::FactoryBot.create(:ui_script_trigger, scope: ::FactoryBot.create(:task))

    get current_ui_script_triggers_api_users_url, headers: auth_headers(@user)

    json = ::JSON.parse response.body
    assert_equal 2, json.size
    assert_equal global_trigger.id, json[0]['id']
    assert json[0]['colour'].is_a?(::String)
    assert_equal 'Send a message', json[0]['text']
    assert_equal global_private_trigger.id, json[1]['id']
  end

  should 'get index with role param' do
    ::FactoryBot.create(:user, role: :guest,)
    ::FactoryBot.create(:user, role: :regular)
    get '/api/users?role=guest', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    json['users'].each do |user|
      assert_equal 'guest', user['role']
    end
  end

  should 'get index with role_collection param' do
    ::FactoryBot.create(:user, role: :guest,)
    ::FactoryBot.create(:user, role: :regular)
    ::FactoryBot.create(:user, role: :admin)
    # /api/users?role_collection[]=guest&role_collection[]=regular
    get '/api/users?role_collection%5B%5D=guest&role_collection%5B%5D=regular', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    json['users'].each do |user|
      assert %w[guest regular].include?(user['role']), "Returned user with incorrect role `#{user['role'].inspect}`"
    end
  end

  should 'get index with created_at param' do
    ::FactoryBot.create(:user, name: 'old', created_at: ::Time.parse('12.01.2000'))
    ::FactoryBot.create(:user, name: 'ok', created_at: ::Time.parse('12.01.2010 16:00'))
    ::FactoryBot.create(:user, name: 'ok2', created_at: ::Time.parse('20.10.2015 16:00'))
    ::FactoryBot.create(:user, name: 'young', created_at: ::Time.parse('12.01.2020'))
    get '/api/users?created_at_from=2010.01.12&created_at_to=2015.10.20', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 2, json['users'].size
    assert_equal 'ok', json['users'].first['name']
    assert_equal 'ok2', json['users'].second['name']
  end

  should 'get index with workspace_id param' do
    ok_user = ::FactoryBot.create(:user, name: 'ok')
    ::FactoryBot.create(:user)
    workspace = ::FactoryBot.create(:workspace)
    workspace.users << ok_user

    get "/api/users?workspace_id=#{workspace.id}", headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 1, json['users'].size
    assert_equal 'ok', json['users'].first['name']
  end

  should 'get index with pagination' do
    10.times { |i| ::FactoryBot.create(:user, name: "tom_jerry#{i}") }
    get '/api/users?page=2&per=3', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 3, json['users'].size
    assert_equal 'tom_jerry2', json['users'].first['name']
    assert_equal 'tom_jerry3', json['users'].second['name']
    assert_equal 'tom_jerry4', json['users'].third['name']
  end

  should 'get index with search param' do
    ::FactoryBot.create(:user, name: 'tom_jerry')
    ::FactoryBot.create(:user, email: 'jerry11@example.com')
    ::FactoryBot.create(:user, email: 'tom@example.com')
    get '/api/users?search=jerry', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 2, json['users'].size
    assert_equal 'tom_jerry', json['users'].first['name']
    assert_equal 'jerry11@example.com', json['users'].second['email']
  end

  should 'get index with limit param' do
    3.times { ::FactoryBot.create(:user) }
    get '/api/users?limit=2', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 2, json['users'].size
  end

  should 'return error when per param is given, but page param is not' do
    get '/api/users?per=5', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 'page parameter is required', json['per'].first
  end

  should 'return error if limit param is not valid integer' do
    get '/api/users?limit=tom', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 'should be an Integer', json['limit'].first
  end

  should 'return error if date format is invalid' do
    get '/api/users?created_at_from=22.02.2024&created_at_to=may', headers: auth_headers(@user)
    json = ::JSON.parse(response.body)

    assert_equal 'invalid date format (YYYY.MM.DD required)', json['created_at_from'].first
    assert_equal 'invalid date format (YYYY.MM.DD required)', json['created_at_to'].first
  end

  should 'get users of a workspace' do
    wrk = ::FactoryBot.create :workspace
    3.times { |i| wrk.users << ::FactoryBot.create(:user, name: "Person#{i}") }
    5.times { ::FactoryBot.create :user }

    get "/api/workspaces/#{wrk.id}/users", headers: auth_headers(@user)
    assert_response 200
    json = ::JSON.parse(response.body)

    assert_equal 3, json['users'].length
    assert_not_equal @user.name, json.dig('users', 0, 'name')
    3.times do |i|
      assert_equal "Person#{i}", json.dig('users', i, 'name')
    end
  end

  should "not create user with taken email" do
    assert_no_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: @user.email }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'has already been taken', json.dig('errors', 'email', 0)
  end

  should "not create user with invalid email" do
    assert_no_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: 'this!%$%is_not*an@email.example@com' }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :unprocessable_entity
    json = ::JSON.parse response.body
    assert_equal 'is invalid', json.dig('errors', 'email', 0)
  end

  should "create user" do
    assert_difference("DB::User.count") do
      post '/api/users', params: {
        user: { name: 'Andy McKee', email: 'andy.mckee@example.com', password: 'secret', password_confirmation: 'secret' }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Andy McKee', json['name']
    assert_equal 'andy.mckee@example.com', json['email']
  end

  should 'not create user by manager' do
    @user.manager!
    assert_no_difference("DB::User.count") do
      post '/api/users', params: {
        user: { name: 'Andy McKee', email: 'andy.mckee@example.com', password: 'secret', password_confirmation: 'secret' }
      }, as: :json, headers: auth_headers(@user)
    end

    assert_response :forbidden
  end

  should "show user" do
    get api_user_url(@user), as: :json, headers: auth_headers(@user)
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @user.name, json['name']
    assert_equal @user.email, json['email']
  end

  should 'destroy user' do
    delete api_user_path(@user), params: {
      user: { id: @user.id, name: 'new name', current_password: 'password'}
    }, as: :json, headers: auth_headers(@user)
    assert_response :forbidden
  end

  context 'reset password' do
    should 'not be found' do
      post api_user_url(:reset_password),
           params: {
             password: 'someNewPass1',
             password_confirmation: 'someNewPass1',
             reset_password_token: 'bollocks'
           },
           as: :json,
           headers: auth_headers(@user)

      assert_response :not_found
    end

    should 'be invalid' do
      token = @user.__send__(:set_reset_password_token)

      post api_user_url(:reset_password),
           params: {
             password: 'someNewPass1',
             password_confirmation: 'otherPass2',
             reset_password_token: token
           },
           as: :json,
           headers: auth_headers(@user)

      assert_response :unprocessable_entity
      json = ::JSON.parse @response.body, symbolize_names: true
      assert_equal 'is invalid', json.dig(:password, 0)
    end

    should 'be successful' do
      token = @user.__send__(:set_reset_password_token)

      post api_user_url(:reset_password),
           params: {
             password: 'someNewPass1',
             password_confirmation: 'someNewPass1',
             reset_password_token: token
           },
           as: :json,
           headers: auth_headers(@user)

      assert_response :ok
      json = ::JSON.parse @response.body, symbolize_names: true
      assert_equal @user.id, json[:id]
      assert_equal @user.name, json[:name]

      @user.reload
      assert @user.valid_password?('someNewPass1')
    end
  end
end
