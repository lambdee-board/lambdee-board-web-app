# frozen_string_literal: true

require "test_helper"

class DB::ListTest < ActiveSupport::TestCase
  should 'fetch with correct eager loading of tasks' do
    list = ::FactoryBot.create(:list, name: 'Backlog')
    3.times do
      list.tasks << task = ::FactoryBot.create(:task)
      task.users << ::FactoryBot.create(:user)
      task.tags << ::FactoryBot.create(:tag)
    end

    fetched_list = ::DB::List.find_with_tasks(list.id)
    assert fetched_list.association_cached?(:tasks)
    assert fetched_list.tasks[0].association_cached?(:users)

    fetched_list = ::DB::List.find_with_tasks_including_deleted(list.id)
    assert fetched_list.association_cached?(:tasks_including_deleted)
    assert fetched_list.tasks_including_deleted[0].association_cached?(:users)

    list.tasks.first.destroy
    fetched_list = ::DB::List.find_with_deleted_tasks(list.id)
    assert fetched_list.association_cached?(:deleted_tasks)
    assert fetched_list.deleted_tasks[0].association_cached?(:users)
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
end
