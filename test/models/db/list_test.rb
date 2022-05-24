# frozen_string_literal: true

require "test_helper"

class DB::ListTest < ActiveSupport::TestCase
  should 'fetch with correct eager loading of tasks' do
    list = ::FactoryBot.create(:list, name: 'Backlog')
    3.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
    end

    fetched_list = ::DB::List.find_with_all_tasks(list.id)
    assert fetched_list.association_cached?(:tasks)
    assert fetched_list.tasks[0].association_cached?(:users)
    assert_equal 1, fetched_list.tasks[0].users.length

    fetched_list = ::DB::List.find_with_visible_tasks(list.id)
    assert fetched_list.association_cached?(:tasks)
    assert fetched_list.visible?
    assert fetched_list.tasks[0].association_cached?(:users)
    assert_equal 1, fetched_list.tasks[0].users.length

    assert_raises ::ActiveRecord::RecordNotFound do
      ::DB::List.find_with_archived_tasks(list.id)
    end
  end

  should 'not save when name length is longer than 50 characters or is null' do
    list = ::FactoryBot.build(:list, name: 'a' * 51)
    list.save
    assert_equal 'Name is too long (maximum is 50 characters)', list.errors.full_messages.first
    assert_not list.persisted?

    list.name = nil
    list.save
    assert_equal "Name can't be blank", list.errors.full_messages.first
    assert_not list.persisted?
  end

  should 'set deleted param as false' do
    list = ::FactoryBot.create(:list)
    list.archive!
    assert_equal true, list.deleted
  end

  should 'return true if record is archived and false if is not archived' do
    list = ::FactoryBot.create(:list)
    assert_equal false, list.deleted
    assert_equal false, list.archived?
    list.archive!
    assert_equal true, list.deleted
    assert_equal true, list.archived?
  end

  should 'set deleted params as true' do
    list = ::FactoryBot.create(:list, deleted: true)
    assert_equal true, list.deleted
    list.restore!
    assert_equal false, list.deleted
  end
end
