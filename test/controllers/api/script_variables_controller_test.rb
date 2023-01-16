# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptVariablesControllerTest < ::ActionDispatch::IntegrationTest
  context 'underprivileged' do
    setup do
      @user = ::FactoryBot.create :user, role: :regular
    end

    should 'not get index' do
      4.times { ::FactoryBot.create(:script_variable) }
      get api_script_variables_url, params: { per: 3, page: 1, as: :json }, headers: auth_headers(@user)
      assert_response :forbidden
    end

    should 'not create script variable' do
      params = {
        script_variable: {
          name: 'CLOCKIFY_SECRET',
          value: 'some_secret_key_238yu9w8ufyiuoadfh02q8',
          description: 'Epic clockify secret'
        }
      }

      assert_no_difference 'DB::ScriptVariable.count' do
        post api_script_variables_url, params: params, as: :json, headers: auth_headers(@user)
      end

      assert_response :forbidden
    end

    should 'show script variable' do
      script_var = ::FactoryBot.create(:script_variable)
      get api_script_variable_url(script_var), as: :json, headers: auth_headers(@user)
      assert_response :forbidden
    end

    should 'update script variable' do
      script_var = ::FactoryBot.create(:script_variable)

      patch api_script_variable_url(script_var), params: { script_variable: { name: 'new name', description: 'new description', value: 'new value' } }, as: :json, headers: auth_headers(@user)
      assert_response :forbidden
    end

    should 'destroy script variable' do
      script_var = ::FactoryBot.create(:script_variable)

      assert_no_difference 'DB::ScriptVariable.count' do
        delete api_script_variable_url(script_var), as: :json, headers: auth_headers(@user)
      end

      assert_response :forbidden
    end
  end

  context 'admin' do
    setup do
      @user = ::FactoryBot.create :user, role: :admin
    end

    should 'get index' do
      4.times { ::FactoryBot.create(:script_variable) }
      get api_script_variables_url, params: { per: 3, page: 1, as: :json }, headers: auth_headers(@user)
      assert_response :success
      json = ::JSON.parse(response.body)
      assert_equal 3, json.size
    end

    should 'create script variable' do
      params = {
        script_variable: {
          name: 'CLOCKIFY_SECRET',
          value: 'some_secret_key_238yu9w8ufyiuoadfh02q8',
          description: 'Epic clockify secret'
        }
      }

      assert_difference('DB::ScriptVariable.count') do
        post api_script_variables_url, params: params, as: :json, headers: auth_headers(@user)
      end

      assert_response :created
      json = ::JSON.parse(response.body, symbolize_names: true)

      assert_equal 'CLOCKIFY_SECRET', json[:name]
      assert_equal 'Epic clockify secret', json[:description]
      assert_nil json[:value]
      assert json[:created_at]
      assert json[:updated_at]
    end

    should 'show script variable' do
      script_var = ::FactoryBot.create(:script_variable)
      get api_script_variable_url(script_var), as: :json, headers: auth_headers(@user)
      assert_response :success
      json = ::JSON.parse(response.body, symbolize_names: true)

      assert_equal script_var.name, json[:name]
      assert_equal script_var.description, json[:description]
      assert_nil json[:value]
      assert_not_nil json[:created_at]
      assert_not_nil json[:updated_at]
    end

    should 'update script variable' do
      script_var = ::FactoryBot.create(:script_variable)

      patch api_script_variable_url(script_var), params: { script_variable: { name: 'new name', description: 'new description', value: 'new value' } }, as: :json, headers: auth_headers(@user)
      assert_response :success
      json = ::JSON.parse(response.body, symbolize_names: true)
      assert_equal 'new name', json[:name]
      assert_equal 'new description', json[:description]
      assert_nil json[:value]

      script_var.reload
      assert_equal 'new value', script_var.value
    end

    should 'destroy script variable' do
      script_var = ::FactoryBot.create(:script_variable)

      assert_difference('DB::ScriptVariable.count', -1) do
        delete api_script_variable_url(script_var), as: :json, headers: auth_headers(@user)
      end

      assert_response :no_content
    end
  end
end
