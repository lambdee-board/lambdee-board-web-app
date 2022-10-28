# frozen_string_literal: true

module QueryAPI
  class Search
    # Contains classes which handle searching
    # through the Query API.
    class Query < BaseMapper
      self.nested_validations = %i[group_by join left_outer_join where order]

      # @!attribute [rw] group_by
      #   @return [GroupBy]
      attribute :group_by, GroupBy
      # @!attribute [rw] join
      #   @return [Join]
      attribute :join, Join
      # @!attribute [rw] left_outer_join
      #   @return [Join]
      attribute :left_outer_join, Join
      # @!attribute [rw] where
      #   @return [Where]
      attribute :where, Where
      # @!attribute [rw] order
      #   @return [Order]
      attribute :order, Order

      # @!attribute [rw] limit
      #   @return [Integer]
      attribute :limit,    ::Shale::Type::Integer, default: -> { 30 }
      # @!attribute [rw] offset
      #   @return [Integer]
      attribute :offset,   ::Shale::Type::Integer
      # @!attribute [rw] count
      #   @return [Boolean]
      attribute :count,    ::Shale::Type::Boolean
      # @!attribute [rw] distinct
      #   @return [Boolean]
      attribute :distinct, ::Shale::Type::Boolean

      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model,    ::Shale::Type::Value

      forward :model, to: %i[join group_by where order]
      forward :join, to: :where

      validates :limit, numericality: { only_integer: true, in: 1..50 }
      validates :offset, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
    end
  end
end
