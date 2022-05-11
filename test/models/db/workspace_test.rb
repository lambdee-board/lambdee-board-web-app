# frozen_string_literal: true

require "test_helper"

class DB::WorkspaceTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 50 characters or is null' do
    workspace = ::FactoryBot.build(:workspace, name: 'a' * 51)
    workspace.save
    assert_equal 'Name is too long (maximum is 50 characters)', workspace.errors.full_messages.first
    assert_not workspace.persisted?

    workspace.name = nil
    workspace.save
    assert_equal "Name can't be blank", workspace.errors.full_messages.first
    assert_not workspace.persisted?
  end
end
