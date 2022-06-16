# frozen_string_literal: true

require "test_helper"

class DB::WorkspaceTest < ActiveSupport::TestCase
  should 'not save when name length is longer than 50 characters or is null' do
    workspace = ::FactoryBot.build(:workspace, name: 'a' * 51)
    workspace.save
    assert_equal 'Name is too long (maximum is 40 characters)', workspace.errors.full_messages.first
    assert_not workspace.persisted?

    workspace.name = nil
    workspace.save
    assert_equal "Name can't be blank", workspace.errors.full_messages.first
    assert_not workspace.persisted?
  end

  should 'return appropriate boards' do
    workspace = ::FactoryBot.create(:workspace)
    workspace.boards << board = ::FactoryBot.create(:board, name: 'normal_board')
    workspace.boards << deleted_board = ::FactoryBot.create(:board, name: 'deleted_board')
    deleted_board.destroy

    assert_equal 1, workspace.boards.size
    assert_equal 'normal_board', workspace.boards.first.name

    assert_equal 1, workspace.deleted_boards.size
    assert_equal 'deleted_board', workspace.deleted_boards.first.name

    assert_equal 2, workspace.boards_including_deleted.size
    assert_equal 'normal_board', workspace.boards_including_deleted.first.name
    assert_equal 'deleted_board', workspace.boards_including_deleted.last.name
  end
end
