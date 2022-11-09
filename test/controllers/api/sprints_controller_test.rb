# frozen_string_literal: true

require 'test_helper'

class ::API::SprintsControllerTest < ::ActionDispatch::IntegrationTest
  setup do
    @user = ::FactoryBot.create(:user, role: 4)
    @board = ::FactoryBot.create(:board)
    2.times { ::FactoryBot.create(:visible_list, board: @board)}
    @sprint = ::FactoryBot.create(:sprint, board: @board)
  end

  should 'get index' do
    get api_sprints_url, headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal @sprint.name, json.dig(0, 'name')
  end

  should 'get index for board' do
    get api_board_sprints_url(@board), headers: auth_headers(@user)
    assert_response :success
    json = ::JSON.parse(response.body)

    assert_equal @sprint.name, json.dig(0, 'name')
  end

  should 'create sprint' do
    @sprint.ended_at = ::Time.now
    @sprint.save

    date = ::Time.now.in_time_zone('Warsaw').to_s
    assert_difference('DB::Sprint.count') do
      post api_sprints_url,
        headers: auth_headers(@user),
        params: {
          sprint: {
            name: 'Sprite',
            description: 'Opis sprintu',
            started_at: date,
            expected_end_at: date,
            board_id: @board.id
          }
        }, as: :json
    end

    assert_response :created
    json = ::JSON.parse response.body
    assert_equal 'Sprite', json['name']
    assert_equal 'Opis sprintu', json['description']
    assert_equal ::Time.parse(date), ::Time.parse(json['started_at'])
    assert_equal ::Time.parse(date), ::Time.parse(json['expected_end_at'])
    assert_equal @board.id, json['board_id']
    assert_equal @board.lists.last.name, json['final_list_name']
    assert_nil json['inexistent_field']
  end

  should 'show sprint' do
    get api_sprint_url(@sprint), headers: auth_headers(@user), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @sprint.name, json['name']
    assert_nil json['tasks']
  end

  should 'show sprint with tasks' do
    @sprint.tasks << task = ::FactoryBot.create(:task)
    st = @sprint.sprint_tasks.first
    st.build_start_params
    st.save!
    get api_sprint_url(@sprint), params: { tasks: 'all' }, headers: auth_headers(@user), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @sprint.name, json['name']
    assert_not_nil json['tasks']
    assert_equal task.name, json['tasks'].first['name']
    assert_equal task.priority, json['tasks'].first['priority']
    assert_equal task.spent_time, json['tasks'].first['spent_time']
    assert_equal task.points, json['tasks'].first['points']
    assert_equal st.start_state, json['tasks'].first['start_state']
    assert_equal st.state, json['tasks'].first['state']
    assert json['tasks'].first.key? 'added_at'
    assert json['tasks'].first.key? 'completed_at'
  end

  should 'update sprint' do
    date = Time.now.in_time_zone('Warsaw').to_s
    patch api_sprint_url(@sprint),
    headers: auth_headers(@user),
    params: {
      sprint: {
        name: 'Sprite',
        expected_end_at: date,
      }
    }, as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal 'Sprite', json['name']
    assert_equal ::Time.parse(date), ::Time.parse(json['expected_end_at'])
  end

  should 'destroy sprint' do
    assert_difference('DB::Sprint.count', -1) do
      delete api_sprint_url(@sprint), headers: auth_headers(@user), as: :json
    end

    assert_response :no_content
  end

  should 'show active sprint' do
    get active_sprint_api_board_url(@board), headers: auth_headers(@user), as: :json
    assert_response :success

    json = ::JSON.parse response.body
    assert_equal @sprint.name, json['name']
  end

  should 'show data for burn up chart' do
    get burn_up_chart_api_sprint_url(@sprint), headers: auth_headers(@user), as: :json
    assert_response :success
  end
end
