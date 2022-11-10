# frozen_string_literal: true

require 'test_helper'

module QueryAPI
  class Search
    class WhereTest < ::ActiveSupport::TestCase
      should 'validate fields' do
        join = Join.new 'comments', model: ::DB::Task
        assert join.valid?
        w = Where.new('comments.body': 'coś tam', join:)
        assert w.valid?
        w = Where.new('comments.nonexistent': 'value', join:)
        assert_not w.valid?
        w = Where.new('another_table.field': 'value', join:)
        assert_not w.valid?

        join = Join.new %w[comments list], model: ::DB::Task
        assert join.valid?
        w = Where.new('comments.body': 'coś tam', join:)
        assert w.valid?
        w = Where.new('comments.nonexistent': 'value', join:)
        assert_not w.valid?
        w = Where.new('list.name': 'To do', join:)
        assert w.valid?
        w = Where.new('lists.name': 'To do', join:)
        assert_not w.valid?
        w = Where.new('list.something': 'value', join:)
        assert_not w.valid?
        w = Where.new('boards.name': 'value', join:)
        assert_not w.valid?

        join = Join.new [{ 'comments' => 'author' }, { 'author' => 'workspaces' }], model: ::DB::Task
        assert join.valid?
        w = Where.new('comments.body': 'coś tam', join:)
        assert w.valid?
        w = Where.new('comments.nonexistent': 'value', join:)
        assert_not w.valid?
        w = Where.new('author.email': 'email@example.com', join:)
        assert w.valid?
        w = Where.new('author.something': 'value', join:)
        assert_not w.valid?
        w = Where.new('workspaces.name': 'Netflyks', join:)
        assert w.valid?
        w = Where.new('workspaces.something': 'value', join:)
        assert_not w.valid?
        w = Where.new('boards.name': 'value', join:)
        assert_not w.valid?

        join = Join.new({ 'author' => 'workspaces' }, model: ::DB::Task)
        assert join.valid?
        w = Where.new('author.email': 'email@example.com', join:)
        assert w.valid?
        w = Where.new('author.something': 'value', join:)
        assert_not w.valid?
        w = Where.new('workspaces.name': 'Netflyks', join:)
        assert w.valid?
        w = Where.new('workspaces.something': 'value', join:)
        assert_not w.valid?
        w = Where.new('comments.body': 'value', join:)
        assert_not w.valid?
      end
    end
  end
end
