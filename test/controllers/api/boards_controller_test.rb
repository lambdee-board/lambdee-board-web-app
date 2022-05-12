# frozen_string_literal: true

require "test_helper"

class BoardsControllerTest < ActionDispatch::IntegrationTest
  should 'return all boards' do
    3.times { |i| ::FactoryBot.create(:board, name: "siema#{i}") }
    get '/api/boards'
    assert_response 200
    json = JSON.parse(response.body)
    assert_equal 'siema0', json['data'][0]['attributes']['name']
    assert_equal 'siema1', json['data'][1]['attributes']['name']
    assert_equal 'siema2', json['data'][2]['attributes']['name']
  end
end
