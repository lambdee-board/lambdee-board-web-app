# frozen_string_literal: true

require 'test_helper'

class ::API::ScriptRunsControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create :user, role: 4
  end

  should 'get index' do
    3.times { ::FactoryBot.create(:script_run) }
    get api_script_runs_url, as: :json, headers: auth_headers(@user)
    assert_response :success
  end

  should 'get index for sprint' do
    2.times { ::FactoryBot.create(:script_run) }
    my_script = ::FactoryBot.create(:script)
    3.times { ::FactoryBot.create(:script_run, script: my_script) }
    get "/api/scripts/#{my_script.id}/script_runs", as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 3, json.size
  end

  should 'show script_run' do
    run = ::FactoryBot.create(:script_run, delay: 30)
    get api_script_run_url(run), as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal "puts 'Hello world'", json['input']
    assert_equal 'Hello world', json['output']
    assert_equal 'running', json['state']
  end

  should 'update script_run' do
    run = ::FactoryBot.create(:script_run)
    patch api_script_run_url(run), params: { script_run: { output: 'new output', state: 'executed' } }, as: :json, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)
    assert_equal 'new output', json['output']
    assert_equal 'executed', json['state']
  end
end
