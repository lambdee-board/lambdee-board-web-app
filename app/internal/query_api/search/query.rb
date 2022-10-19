# frozen_string_literal: true

module QueryAPI
  class Search
    # Contains classes which handle searching
    # through the Query API.
    class Query < BaseMapper
      self.nested_validations = %i[group_by join where]

      attribute :group_by, GroupBy
      attribute :join, Join
      # TODO
      # attribute :left_outer_join, Join
      # attribute :order, Order
      attribute :where, Where

      attribute :limit, ::Shale::Type::Integer, default: -> { 30 }
      attribute :offset, ::Shale::Type::Integer
      attribute :count, ::Shale::Type::Boolean
      attribute :distinct, ::Shale::Type::Boolean
      attribute :model, ::Shale::Type::Value

      forward :model, to: %i[join group_by where]

      validates :limit, numericality: { only_integer: true, in: 1..50 }
      validates :offset, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
    end
  end
end
