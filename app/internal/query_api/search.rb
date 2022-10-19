# frozen_string_literal: true

require 'debug'

module QueryAPI
  # Contains classes which handle searching
  # through the Query API.
  class Search < BaseMapper
    class << self
      alias call of_hash
    end

    self.nested_validations = %i[query]

    attribute :type, Type
    attribute :query, Query

    forward :type, to: :query, as: :model

    validates :type, presence: true
    validates :query, presence: true

    # @return [ActiveRecord::Relation]
    def execute
      relation = type

      if query.where
        relation = apply_where(relation)
      end

      if query.distinct
        relation = relation.distinct
      end

      if query.join
        relation = relation.joins(query.join.value.to_sym)
      end

      if query.limit
        relation = relation.limit(query.limit)
      end

      if query.offset
        relation = relation.offset(query.offset)
      end

      if query.group_by
        relation = relation.group(query.group_by.value)
      end

      if query.count
        relation = relation.count
      end

      relation.load
    end

    private

    def apply_where(relation)
      result = build_where(relation, query.where)
      result
    end

    def build_where(relation, where, logical: :and)
      first_iteration = true
      where.dynamic_attribute_names.each do |attr_name|
        value = where.public_send(attr_name)
        nested_relation = type.where(where_argument(attr_name, value))
        # debugger
        if first_iteration
          relation = nested_relation
          first_iteration = false
          next
        end

        relation = relation.public_send(logical, nested_relation)
      end

      if where.or
        relation = relation.public_send(logical, build_where(relation, where.or, logical: :or))
      end

      if where.and
        relation = relation.public_send(logical, build_where(relation, where.and, logical: :and))
      end

      relation
    end

    # @param attr_name [Symbol]
    # @param value [Object]
    # @return [Array, Hash]
    def where_argument(attr_name, value)
      case value
      in like: like
        [
          %("#{attr_name}" LIKE :like),
          {
            like:
          }
        ]
      in greater_than: gt
        { attr_name => gt.. }
      in less_than: lt
        { attr_name => ..lt }
      in between: [left, right]
        { attr_name => left..right }
      in not_equal: neq
        [
          %("#{attr_name}" != :neq),
          {
            neq:
          }
        ]
      else
        { attr_name => value }
      end
    end
  end
end
