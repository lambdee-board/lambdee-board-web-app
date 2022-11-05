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
    assert st.add_date = ::Time.now.today?
    assert_nil st.completion_date

    st = ::DB::SprintTask.new(sprint: sprint, task: task_done)
    st.build_start_params
    assert_equal 'done', st.start_state
    assert_equal 'done', st.state
    assert st.add_date = ::Time.now.today?
    assert st.completion_date = ::Time.now.today?
  end
end
