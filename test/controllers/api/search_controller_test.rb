# frozen_string_literal: true

require 'test_helper'

class API::SearchControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
  end

  context 'users with comments' do
    setup do
      @task = ::FactoryBot.create(:task)
    end

    should 'return authors of comments' do
      user1 = author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, body: 'Cos tam Perferendis elo', author:)
      user2 = author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, body: 'Perferendis is awesome', author:)
      author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, body: 'Something else', author:)
      ::FactoryBot.create(:user)
      ::FactoryBot.create(:user)

      get '/api/search', params: {
        search: {
          type: "users",
          query: {
            join: "comments",
            where: {
              "comments.body": {
                  like: "%Perferendis%"
              }
            },
          }
        }
      }, headers: script_service_auth_headers
      assert_response 200
      json = ::JSON.parse(response.body)
      assert_equal 'users', json['type']
      records = json['records']
      assert_equal 2, records.length
      assert_equal records[0], user1.as_json
      assert_equal records[1], user2.as_json
    end

    should 'return validation errors when inexistent field' do
      get '/api/search', params: {
        search: {
          type: "users",
          query: {
            join: "comment",
            where: {
              "comments.body": {
                  like: "%Perferendis%"
              }
            },
          }
        }
      }, headers: script_service_auth_headers
      assert_response 422
      json = ::JSON.parse(response.body)
      result = {
        "join" => ["inexistent relation: comment"],
        "where"=>[%(inexistent fields: ["comments.body"])]
      }
      assert_equal result, json
    end

    should 'count comments per author_id' do
      user1 = author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      user2 = author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      ::FactoryBot.create(:comment, author:)
      user3 = author = ::FactoryBot.create(:user)
      ::FactoryBot.create(:comment, author:)

      get '/api/search', params: {
        search: {
          type: "comments",
          query: {
            group_by: 'author_id',
            count: true
          }
        }
      }, headers: script_service_auth_headers
      assert_response 200
      json = ::JSON.parse(response.body)
      assert json.include?('type')
      assert_nil json['type']
      assert json['aggregation']
      result = { user1.id.to_s => 3, user2.id.to_s => 5, user3.id.to_s => 1 }
      assert_equal result, json['aggregation']
    end
  end
end
