# frozen_string_literal: true

require "test_helper"

class DB::TaskTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 80 characters' do
    task = ::FactoryBot.build(:task, name: 'a' * 81)
    task.save
    assert_equal 'Name is too long (maximum is 80 characters)', task.errors.full_messages.first
    assert_not task.persisted?
  end

  should 'not save when description length is longer than 1000 characters' do
    task = ::FactoryBot.build(:task, description: 'a' * 10_001)
    task.save
    assert_equal 'Description is too long (maximum is 10000 characters)', task.errors.full_messages.first
    assert_not task.persisted?
  end

  should 'set last pos value for new record to be the last in the list if pos param is not declared' do
    task = ::FactoryBot.create(:task)
    assert_equal 65_536, task.pos

    5.times do |i|
      task = ::FactoryBot.create(:task, list_id: task.list.id)
      assert_equal 65_536 + 1024 * (i + 1), task.pos
    end

    task = ::FactoryBot.create(:task, list_id: task.list.id, pos: 1)
    assert_equal 1, task.pos
  end

  should 'get author of task even if author is soft deleted' do
    task = ::FactoryBot.create(:task)
    assert_not_nil task.author
    task.author.destroy
    assert_not_nil task.reload.author
  end
end
