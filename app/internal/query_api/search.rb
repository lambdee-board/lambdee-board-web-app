# frozen_string_literal: true

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

    validates :type, presence: { message: 'does not exist!' }
    validates :query, presence: true

    # @return [ActiveRecord::Relation]
    def execute
      relation = type.all
      relation = apply_where(relation) if query.where
      relation = relation.distinct if query.distinct
      relation = relation.joins(query.join.value) if query.join
      relation = relation.limit(query.limit) if query.limit
      relation = relation.offset(query.offset) if query.offset
      relation = relation.group(query.group_by.value) if query.group_by
      relation = relation.count if query.count

      relation.load
    end

    private

    # @param relation [ActiveRecord::Relation]
    # @return [ActiveRecord::Relation]
    def apply_where(relation)
      build_where(relation, query.where)
    end

    # @param relation [ActiveRecord]
    def build_where(relation, where, logical: :and)
      first_iteration = true
      where.dynamic_attribute_names.each do |attr_name|
        value = where.public_send(attr_name)
        nested_relation = type.where(where_argument(attr_name, value))
        if first_iteration
          relation = nested_relation
          first_iteration = false
          next
        end

        relation = relation.public_send(logical, nested_relation)
      end

      relation = relation.public_send(logical, build_where(relation, where.or, logical: :or)) if where.or
      relation = relation.public_send(logical, build_where(relation, where.and, logical: :and)) if where.and

      relation
    end

    # @param attr_name [Symbol]
    # @param value [Object]
    # @return [Array, Hash]
    def where_argument(attr_name, value)
      case value
      in like:
        [
          %("#{attr_name}" LIKE :like),
          {
            like:
          }
        ]
      in greater_than:
        { attr_name => greater_than.. }
      in less_than:
        { attr_name => ..less_than }
      in between: [left, right]
        { attr_name => left..right }
      in not_equal:
        [
          %("#{attr_name}" != :not_equal),
          {
            not_equal:
          }
        ]
      else
        { attr_name => value }
      end
    end
  end
end
