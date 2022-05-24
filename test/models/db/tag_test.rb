# frozen_string_literal: true

require "test_helper"

class DB::TagTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 30 characters' do
    tag = ::FactoryBot.build(:tag, name: 'a' * 31)
    tag.save
    assert_equal 'Name is too long (maximum is 30 characters)', tag.errors.full_messages.first
    assert_not tag.persisted?
  end

  should 'not save when colour field length is not between 7 and 9 chars' do
    tag = ::FactoryBot.build(:tag, colour: 'a' * 6 )
    tag.save
    assert_equal 'Colour is too short (minimum is 7 characters)', tag.errors.full_messages.first
    tag.colour = 'a' * 10
    tag.save
    assert_equal 'Colour is too long (maximum is 9 characters)', tag.errors.full_messages.first
    assert_not tag.persisted?
  end
end
