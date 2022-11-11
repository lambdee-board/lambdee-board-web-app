# # frozen_string_literal: true

require 'test_helper'

module QueryAPI
  class Search
    class JoinTest < ::ActiveSupport::TestCase
      should 'extract reflections' do
        j = Join.new 'comments', model: ::DB::Task
        j.valid?
        assert_equal({ comments: ::DB::Comment }, j.association_map)

        j = Join.new %w[comments list], model: ::DB::Task
        j.valid?
        association_map = {
          comments: ::DB::Comment,
          list: ::DB::List
        }
        assert_equal association_map, j.association_map

        j = Join.new [{ 'comments' => 'author' }, { 'author' => 'workspaces' }], model: ::DB::Task
        j.valid?
        association_map = {
          comments: ::DB::Comment,
          author: ::DB::User,
          workspaces: ::DB::Workspace
        }
        assert_equal association_map, j.association_map

        j = Join.new({ 'author' => 'workspaces' }, model: ::DB::Task)
        j.valid?
        association_map = {
          author: ::DB::User,
          workspaces: ::DB::Workspace
        }
        assert_equal association_map, j.association_map

        j = Join.new({ 'comments' => { 'author' => 'workspaces' } }, model: ::DB::Task)
        j.valid?
        association_map = {
          comments: ::DB::Comment,
          author: ::DB::User,
          workspaces: ::DB::Workspace
        }
        assert_equal association_map, j.association_map

        j = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tags'] } } }, model: ::DB::Task)
        j.valid?
        association_map = {
          author: ::DB::User,
          workspaces: ::DB::Workspace,
          boards: ::DB::Board,
          lists: ::DB::List,
          tags: ::DB::Tag
        }
        assert_equal association_map, j.association_map
      end

      should 'symbolize names' do
        j = Join.new 'comments'
        assert_equal :comments, j.value

        j = Join.new %w[comments list]
        assert_equal %i[comments list], j.value

        j = Join.new [{ 'comments' => 'author' }, { 'author' => 'workspaces' }]
        assert_equal [{ comments: :author }, { author: :workspaces }], j.value

        j = Join.new({ 'author' => 'workspaces' })
        assert_equal({ author: :workspaces }, j.value)

        j = Join.new({ 'comments' => { 'author' => 'workspaces' } })
        assert_equal({ comments: { author: :workspaces } }, j.value)

        j = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tags'] } } })
        assert_equal({ author: { workspaces: { boards: %i[lists tags] } } }, j.value)
      end

      context 'string association' do
        should 'be valid' do
          join = Join.new 'comments', model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new 'list', model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new 'author', model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid' do
          join = Join.new 'dupa', model: ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

#           assert_equal ['Join inexistent relation: dupa'], join.errors.full_messages
        end
      end

      context 'array association' do
        should 'be valid' do
          join = Join.new ['comments', 'list'], model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new ['list', 'task_users', 'task_tags', 'author'], model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new ['author'], model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new [{ 'comments' => 'author' }, { 'author' => 'workspaces' }], model: ::DB::Task
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid' do
          join = Join.new ['lol'], model: ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

#           assert_equal ['Join inexistent relation: lol'], join.errors.full_messages

          join = Join.new ['comments', 'list', 'hejo', 'pener'], model: ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

#           assert_equal ['Join inexistent relation: hejo'], join.errors.full_messages
        end
      end

      context 'hash association' do
        should 'be valid' do
          join = Join.new({ 'comments' => 'author' }, model: ::DB::Task)
          assert join.valid?
          assert join.errors.empty?

          join = Join.new({ 'author' => 'workspaces' }, model: ::DB::Task)
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be nested and valid' do
          join = Join.new({ 'comments' => { 'author' => 'workspaces' } }, model: ::DB::Task)
          assert join.valid?
          assert join.errors.empty?

          join = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tags'] } } }, model: ::DB::Task)
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid in key' do
          join = Join.new({ 'lol' => 'author' }, model: ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?

#           assert_equal ['Join inexistent relation: lol'], join.errors.full_messages
        end

        should 'be invalid in value' do
          join = Join.new({ 'author' => 'elo' }, model: ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?

#           assert_equal ['Join inexistent relation: elo'], join.errors.full_messages
        end

        should 'be nested and invalid' do
          join = Join.new({ 'comments' => { 'author' => 'siema' } }, model: ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?
          assert_equal ['Join inexistent relation: siema'], join.errors.full_messages

          join = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tag'] } } }, model: ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?
          assert_equal ['Join inexistent relation: tag'], join.errors.full_messages
        end
      end
    end
  end
end
