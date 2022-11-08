# frozen_string_literal: true

require 'test_helper'

class ::DB::SprintTest < ::ActiveSupport::TestCase
  should 'be invalid when there are two visible lists with the same name in one board' do
    board = ::FactoryBot.create(:board)
    2.times { ::FactoryBot.create(:visible_list, name: 'same', board: board) }
    sprint = ::FactoryBot.build(:sprint, board: board, final_list_name: 'same')
    assert_not sprint.valid?
    assert_equal 'Final list name is not unique', sprint.errors.full_messages.first
  end

  should 'be invalid when an active sprint for given board already exists' do
    board = ::FactoryBot.create(:board)
    ::FactoryBot.create(:sprint, board: board)
    board.reload
    sprint = ::FactoryBot.build(:sprint, board: board)
    assert_not sprint.valid?
    assert_equal 'Board already has an active sprint', sprint.errors.full_messages.first
  end

  should 'set final list name' do
    board = ::FactoryBot.create(:board)
    ::FactoryBot.create(:list, board: board, pos: 1, name: 'backlog')
    ::FactoryBot.create(:visible_list, board: board, pos: 3, name: 'done')
    ::FactoryBot.create(:visible_list, board: board, pos: 2, name: 'todo')
    sprint = ::FactoryBot.create(:sprint, board: board)

    assert_equal 'done', sprint.final_list_name
  end

  should 'end sprint' do
    board = ::FactoryBot.create(:board)
    list = ::FactoryBot.create(:visible_list, board: board)
    task = ::FactoryBot.create(:task, list: list)
    sprint = ::FactoryBot.create(:sprint, board: board)

    assert_not task.deleted?
    assert_nil sprint.ended_at
    sprint.end
    assert sprint.ended_at.today?
    assert_not task.deleted?
  end

  should 'add all not deleted tasks from visible lists' do
    board = ::FactoryBot.create(:board)
    list = ::FactoryBot.create(:list, board: board)
    visible_list = ::FactoryBot.create(:visible_list, board: board)
    visible_list2 = ::FactoryBot.create(:visible_list, board: board)
    ::FactoryBot.create(:task, list: list, name: 'not ok')
    ::FactoryBot.create(:task, list: list, name: 'not ok').destroy
    ::FactoryBot.create(:task, list: visible_list, name: 'ok')
    ::FactoryBot.create(:task, list: visible_list, name: 'ok')
    ::FactoryBot.create(:task, list: visible_list2, name: 'ok')
    ::FactoryBot.create(:task, list: visible_list, name: 'not ok').destroy

    board = list.board.reload
    sprint = ::FactoryBot.create(:sprint, board: board)
    assert_equal 3, sprint.tasks.size
    sprint.tasks.each { assert_equal 'ok', _1.name }
  end
end
