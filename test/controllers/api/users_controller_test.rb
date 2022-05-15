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
    assert_equal 'is not an email', json.dig('email', 0)
  end

  should "create user" do
    assert_difference("DB::User.count") do
      post api_users_url, params: {
        user: { name: 'Andy McKee', email: 'andy.mckee@example.com' }
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

  should "destroy user" do
    assert_difference("DB::User.count", -1) do
      delete api_user_url(@user), as: :json
    end

    assert_response :no_content
  end
end
