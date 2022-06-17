# frozen_string_literal: true

require "test_helper"

class DB::CommentTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 500 characters' do
    comment = ::FactoryBot.build(:comment, body: 'a' * 501)
    comment.save
    assert_equal 'Body is too long (maximum is 500 characters)', comment.errors.full_messages.first
    assert_not comment.persisted?
  end

  should 'get author of comment even if author is soft deleted' do
    comment = ::FactoryBot.create(:comment)
    assert_not_nil comment.author
    comment.author.destroy
    assert_not_nil comment.reload.author
  end
end
