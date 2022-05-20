# frozen_string_literal: true

require "test_helper"

class DB::TaskTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 80 characters' do
    task = ::FactoryBot.build(:task, name: 'a' * 81)
    task.save
    assert_equal 'Name is too long (maximum is 80 characters)', task.errors.full_messages.first
    assert_not task.persisted?
  end

  should 'not save when description length is longer than 300 characters' do
    task = ::FactoryBot.build(:task, description: 'a' * 301)
    task.save
    assert_equal 'Description is too long (maximum is 300 characters)', task.errors.full_messages.first
    assert_not task.persisted?
  end

  should 'set last pos value for new record to be the last in the list' do
    task = ::FactoryBot.create(:task)
    assert_equal 65_536, task.pos

    task = ::FactoryBot.create(:task, list_id: task.list.id)
    assert_equal 65_536 + 1024, task.pos
  end
end
