# frozen_string_literal: true

require "test_helper"

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
end
