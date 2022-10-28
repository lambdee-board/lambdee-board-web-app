require 'test_helper'

class API::SprintsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user)
    @board = ::FactoryBot.create(:board)
    2.times { ::FactoryBot.create(:list, board: @board)}
    @sprint = ::FactoryBot.create(:sprint, board: @board)
  end

  should 'get index' do
    get api_sprints_url
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal @sprint.name, json.dig(0, 'name')
  end

  should 'create sprint' do
    @sprint.end_date = ::Time.now
    @sprint.save

    date = Time.now.in_time_zone('Warsaw').to_s
    assert_difference('DB::Sprint.count') do
      post api_sprints_url, params: {
        sprint: {
          name: 'Sprite',
          start_date: date,
          due_date: date,
          board_id: @board.id,
          final_list_id: @board.lists.last.id
          }
        }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Sprite', json['name']
    assert_equal Time.parse(date), Time.parse(json['start_date'])
    assert_equal Time.parse(date), Time.parse(json['due_date'])
    assert_equal @board.id, json['board_id']
    assert_equal @board.lists.last.id, json['final_list_id']
    assert_nil json['inexistent_field']
  end

  should 'show sprint' do
    get api_sprint_url(@sprint), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @sprint.name, json['name']
  end

  should 'update sprint' do
    date = Time.now.in_time_zone('Warsaw').to_s
    patch api_sprint_url(@sprint), params: {
      sprint: {
        name: 'Sprite',
        due_date: date,
        }
      }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'Sprite', json['name']
    assert_equal Time.parse(date), Time.parse(json['due_date'])
  end

  should 'destroy sprint' do
    assert_difference('DB::Sprint.count', -1) do
      delete api_sprint_url(@sprint), as: :json
    end

    assert_response :no_content
  end
end
