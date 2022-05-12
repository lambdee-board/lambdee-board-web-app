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
end
