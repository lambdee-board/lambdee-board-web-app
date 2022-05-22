# frozen_string_literal: true

require "test_helper"

class DB::BoardTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 50 characters or is null' do
    board = ::FactoryBot.build(:board, name: 'a' * 51)
    board.save
    assert_equal 'Name is too long (maximum is 50 characters)', board.errors.full_messages.first
    assert_not board.persisted?

    board.name = nil
    board.save
    assert_equal "Name can't be blank", board.errors.full_messages.first
    assert_not board.persisted?
  end

  should 'fetch with correct eager loading of tasks' do
    board = ::FactoryBot.create(:board)
    board.lists << list = ::FactoryBot.create(:list, name: 'Backlog')
    3.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
    end

    board.lists << list = ::FactoryBot.create(:list, name: 'Archived list', deleted: true)
    2.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
    end

    fetched_board = ::DB::Board.find_with_all_tasks(board.id)
    assert fetched_board.association_cached?(:lists)
    assert fetched_board.lists[0].association_cached?(:tasks)
    assert fetched_board.lists[0].tasks[0].association_cached?(:users)
    assert_equal 1, fetched_board.lists[0].tasks[0].users.length
    assert_equal 2, fetched_board.lists.length

    fetched_board = ::DB::Board.find_with_visible_tasks(board.id)
    assert fetched_board.association_cached?(:lists)
    assert fetched_board.lists[0].association_cached?(:tasks)
    assert fetched_board.lists[0].visible?
    assert fetched_board.lists[0].tasks[0].association_cached?(:users)
    assert_equal 1, fetched_board.lists[0].tasks[0].users.length
    assert_equal 1, fetched_board.lists.length

    fetched_board = ::DB::Board.find_with_archived_tasks(board.id)
    assert fetched_board.association_cached?(:lists)
    assert fetched_board.lists[0].association_cached?(:tasks)
    assert fetched_board.lists[0].archived?
    assert fetched_board.lists[0].tasks[0].association_cached?(:users)
    assert_equal 1, fetched_board.lists[0].tasks[0].users.length
    assert_equal 1, fetched_board.lists.length
  end

  should 'fetch with correct eager loading of lists' do
    board = ::FactoryBot.create(:board)
    board.lists << list = ::FactoryBot.create(:list, name: 'Backlog')
    3.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
    end

    board.lists << list = ::FactoryBot.create(:list, name: 'Archived list', deleted: true)
    2.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
    end

    fetched_board = ::DB::Board.find_with_all_lists(board.id)
    assert fetched_board.association_cached?(:lists)
    assert_not fetched_board.lists[0].association_cached?(:tasks)
    assert_equal 2, fetched_board.lists.length

    fetched_board = ::DB::Board.find_with_visible_lists(board.id)
    assert fetched_board.association_cached?(:lists)
    assert_not fetched_board.lists[0].association_cached?(:tasks)
    assert_equal 1, fetched_board.lists.length

    fetched_board = ::DB::Board.find_with_archived_lists(board.id)
    assert fetched_board.association_cached?(:lists)
    assert_not fetched_board.lists[0].association_cached?(:tasks)
    assert_equal 1, fetched_board.lists.length
  end
end
