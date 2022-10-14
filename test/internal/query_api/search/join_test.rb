# frozen_string_literal: true

require 'test_helper'

module QueryAPI
  class Search
    class JoinTest < ::ActiveSupport::TestCase
      context 'string association' do
        should 'be valid' do
          join = Join.new 'comments', ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new 'list', ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new 'author', ::DB::Task
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid' do
          join = Join.new 'dupa', ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

          assert_equal ['Join inexistent relation: dupa'], join.errors.full_messages
        end
      end

      context 'array association' do
        should 'be valid' do
          join = Join.new ['comments', 'list'], ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new ['list', 'task_users', 'task_tags', 'author'], ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new ['author'], ::DB::Task
          assert join.valid?
          assert join.errors.empty?

          join = Join.new([{ 'comments' => 'author' }, { 'author' => 'workspaces' }], ::DB::Task)
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid' do
          join = Join.new ['lol'], ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

          assert_equal ['Join inexistent relation: lol'], join.errors.full_messages

          join = Join.new ['comments', 'list', 'hejo', 'pener'], ::DB::Task
          assert_not join.valid?
          assert_not join.errors.empty?

          assert_equal ['Join inexistent relation: hejo'], join.errors.full_messages
        end
      end

      context 'hash association' do
        should 'be valid' do
          join = Join.new({ 'comments' => 'author' }, ::DB::Task)
          assert join.valid?
          assert join.errors.empty?

          join = Join.new({ 'author' => 'workspaces' }, ::DB::Task)
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be nested and valid' do
          join = Join.new({ 'comments' => { 'author' => 'workspaces' } }, ::DB::Task)
          assert join.valid?
          assert join.errors.empty?

          join = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tags'] } } }, ::DB::Task)
          assert join.valid?
          assert join.errors.empty?
        end

        should 'be invalid in key' do
          join = Join.new({ 'lol' => 'author' }, ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?

          assert_equal ['Join inexistent relation: lol'], join.errors.full_messages
        end

        should 'be invalid in value' do
          join = Join.new({ 'author' => 'elo' }, ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?

          assert_equal ['Join inexistent relation: elo'], join.errors.full_messages
        end

        should 'be nested and invalid' do
          join = Join.new({ 'comments' => { 'author' => 'siema' } }, ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?
          assert_equal ['Join inexistent relation: siema'], join.errors.full_messages

          join = Join.new({ 'author' => { 'workspaces' => { 'boards' => ['lists', 'tag'] } } }, ::DB::Task)
          assert_not join.valid?
          assert_not join.errors.empty?
          assert_equal ['Join inexistent relation: tag'], join.errors.full_messages
        end
      end
    end
  end
end
