# frozen_string_literal: true

require 'test_helper'

module ::FilterParameters
  class BaseTest < ::ActiveSupport::TestCase
    class UniversalFilter < Base
      self.filters = %i[per page]

      validates :per, numericality: { in: 5..30 }, allow_nil: true
      validates :page, numericality: { in: 1..150 }, allow_nil: true
    end

    class UserFilter < UniversalFilter
      self.filters = ::Set[:role].freeze

      validates :role, inclusion: { in: ::Set['manager', 'guest'] }, allow_nil: true
    end

    should 'recursively evaluate filters' do
      assert_equal ::Set[:per, :page], UniversalFilter.filters
      assert_equal ::Set[:per, :page, :role], UserFilter.filters
    end

    should 'correctly validate in direct subclass' do
      f = UniversalFilter.new({ per: 1, page: 2 })
      assert_not f.valid?
      assert_equal ['Per must be in 5..30'], f.errors.full_messages

      f = UniversalFilter.new per: 1, page: -2
      assert_not f.valid?
      assert_equal ["Per must be in 5..30", "Page must be in 1..150"], f.errors.full_messages

      f = UniversalFilter.new per: 12, page: -2
      assert_not f.valid?
      assert_equal ["Page must be in 1..150"], f.errors.full_messages

      f = UniversalFilter.new per: 10, page: 5
      assert f.valid?
      assert_not f.errors.any?
    end

    should 'correctly validate in indirect subclass' do
      f = UserFilter.new role: 'manager'
      assert f.valid?
      assert_not f.errors.any?

      f = UserFilter.new role: 'inexistent'
      assert_not f.valid?
      assert_equal ["Role is not included in the list"], f.errors.full_messages

      f = UserFilter.new per: 1, page: 2, role: 'manager'
      assert_not f.valid?
      assert_equal ['Per must be in 5..30'], f.errors.full_messages

      f = UserFilter.new per: 1, page: -2, role: 'inne'
      assert_not f.valid?
      assert_equal ["Per must be in 5..30", "Page must be in 1..150", "Role is not included in the list"], f.errors.full_messages

      f = UserFilter.new per: 12, page: -2
      assert_not f.valid?
      assert_equal ["Page must be in 1..150"], f.errors.full_messages

      f = UserFilter.new per: 10, page: 5
      assert f.valid?
      assert_not f.errors.any?
    end
  end
end
