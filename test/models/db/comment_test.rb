# frozen_string_literal: true

require "test_helper"

class DB::CommentTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 500 characters' do
    comment = ::FactoryBot.build(:comment, body: 'a' * 501)
    comment.save
    assert_equal 'Body is too long (maximum is 500 characters)', comment.errors.full_messages.first
    assert_not comment.persisted?
  end
end
