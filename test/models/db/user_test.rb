# frozen_string_literal: true

require 'test_helper'

class DB::UserTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 50 characters or is null' do
    user = ::FactoryBot.build(:user, name: 'a' * 51)
    user.save
    assert_equal 'Name is too long (maximum is 50 characters)', user.errors.full_messages.first
    assert_not user.persisted?

    user.name = nil
    user.save
    assert_equal "Name can't be blank", user.errors.full_messages.first
    assert_not user.persisted?
  end

  context 'setting last viewed board' do
    setup do
      @user = ::FactoryBot.build(:user)
      @board = ::FactoryBot.create(:board)
    end

    should 'prepend recent_boards array with id for an empty array' do
      assert_equal [], @user.recent_boards
      @user.update_last_viewed_board(@board)
      assert_equal [@board.id.to_s], @user.recent_boards
      assert @user.persisted?
    end

    should 'prepend recent_boards array with id and delete this id from other positions' do
      @user.recent_boards = ['111', '222', @board.id.to_s, '333', '444']
      @user.update_last_viewed_board(@board)
      assert_equal [ @board.id.to_s, '111', '222', '333', '444'], @user.recent_boards
      assert @user.persisted?
    end

    should 'left only last 5 ids' do
      @user.recent_boards = ['111', '222', '333', '444', '555']
      @user.update_last_viewed_board(@board)
      assert_equal [ @board.id.to_s, '111', '222', '333', '444'], @user.recent_boards
      assert @user.persisted?
    end

    should 'work with an unsaved board' do
      board = ::FactoryBot.build(:board)
      assert_equal [], @user.recent_boards
      @user.update_last_viewed_board  board
      assert_equal [], @user.recent_boards
    end
  end
end
