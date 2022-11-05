# frozen_string_literal: true

require 'test_helper'

class ::DB::SprintTaskTest < ::ActiveSupport::TestCase
  should 'build new record' do
    list_done = ::FactoryBot.create(:list, name: 'done')
    list_todo = ::FactoryBot.create(:list, name: 'todo')
    task_done = ::FactoryBot.create(:task, list: list_done)
    task_todo = ::FactoryBot.create(:task, list: list_todo)

    sprint = ::FactoryBot.create(:sprint, final_list_name: 'done')

    st = ::DB::SprintTask.new(sprint: sprint, task: task_todo)
    st.build_start_params
    assert_equal 'todo', st.start_state
    assert_equal 'todo', st.state
    assert st.added_at = ::Time.now.today?
    assert_nil st.completed_at

    st = ::DB::SprintTask.new(sprint: sprint, task: task_done)
    st.build_start_params
    assert_equal 'done', st.start_state
    assert_equal 'done', st.state
    assert st.added_at = ::Time.now.today?
    assert st.completed_at = ::Time.now.today?
  end
end
