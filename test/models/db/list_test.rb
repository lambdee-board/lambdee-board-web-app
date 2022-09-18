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

  should 'fetch with correct eager loading tasks of given user' do
    ok_user = ::FactoryBot.create(:user, name: 'ok_user')
    bad_user = ::FactoryBot.create(:user, name: 'bad_user')

    ok_list1 = ::FactoryBot.create(:list, name: 'ok_list1')
    ok_list2 = ::FactoryBot.create(:list, name: 'ok_list2')
    bad_list = ::FactoryBot.create(:list, name: 'bad_list')

    ok_task1 = ::FactoryBot.create(:task, name: 'ok_task1', list: ok_list1)
    ok_task2 = ::FactoryBot.create(:task, name: 'ok_task2', list: ok_list2)
    ok_task3 = ::FactoryBot.create(:task, name: 'ok_task3', list: ok_list2)
    bad_task1 = ::FactoryBot.create(:task, name: 'bad_task1', list: ok_list2)
    bad_task2 = ::FactoryBot.create(:task, name: 'bad_task2', list: bad_list)

    ok_task1.users << ok_user
    ok_task2.users << ok_user
    ok_task3.users << ok_user
    bad_task1.users << bad_user
    bad_task2.users << bad_user

    ok_task1.tags << ::FactoryBot.create(:tag)

    lists = ::DB::List.include_user_tasks(ok_user)

    assert lists.first.association_cached?(:tasks)
    assert lists.first.tasks.first.association_cached?(:tags)
    assert lists.first.tasks.first.association_cached?(:users)
    assert lists.first.tasks.first.association_cached?(:author)

    assert_equal 2, lists.size
    assert_equal 'ok_list1', lists.first.name
    assert_equal 'ok_list2', lists.second.name

    assert_equal 1, lists.first.tasks.size
    assert_equal 2, lists.second.tasks.size
    assert_equal 'ok_task1', lists.first.tasks.first.name
    assert_equal 'ok_task2', lists.second.tasks.first.name
    assert_equal 'ok_task3', lists.second.tasks.second.name
  end
end
