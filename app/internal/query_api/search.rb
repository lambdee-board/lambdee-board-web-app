# frozen_string_literal: true

module QueryAPI
  # Contains classes which handle searching
  # through the Query API.
  class Search < BaseMapper
    class << self
      alias call of_hash
    end

    self.nested_validations = %i[query]

    # @!attribute [rw] type
    #   @return [Class<ActiveRecord::Base>]
    attribute :type, Type
    # @!attribute [rw] query
    #   @return [Query]
    attribute :query, Query

    forward :type, to: :query, as: :model

    validates :type, presence: { message: 'does not exist!' }
    validates :query, presence: true

    # @return [ActiveRecord::Relation, Hash]
    def execute
      relation = type.all.reorder('')
      relation = apply_where(relation) if query.where
      relation = relation.distinct if query.distinct
      relation = relation.joins(query.join.value) if query.join
      relation = relation.left_outer_joins(query.left_outer_join.value) if query.left_outer_join
      relation = relation.limit(query.limit) if query.limit
      relation = relation.offset(query.offset) if query.offset
      relation = relation.group(query.group_by.value) if query.group_by
      relation = relation.count if query.count

      return wrap_relation(relation.load) if relation.respond_to?(:load)

      wrap_aggregation(relation)
    end

    private

    # @param records [ActiveRecord::Relation]
    # @return [Hash]
    def wrap_relation(records)
      {
        type: type.table_name,
        records:
      }
    end

    # @param aggregation [Hash]
    # @return [Hash]
    def wrap_aggregation(aggregation)
      {
        type: nil,
        aggregation:
      }
    end

    # Transforms the name of the field to be
    # used directly in a SQL string.
    #
    #   # with `DB::Comment.joins(:author)`
    #   sql_field_name(:'author.name') #=> %("users"."name")
    #
    # @param field_param [Symbol, String]
    # @return [String]
    def sql_field_name(field_name)
      return field_name unless query.join

      if Where.with_table?(field_name)
        table_name, field_name = field_name.to_s.split('.')
        real_table_name = query.join.association_map[table_name.to_sym]&.table_name
        return %("#{real_table_name}"."#{field_name}")
      end

      %("#{field_name}") if Where.field_name?(field_name)
    end

    # Transforms the name of the field to be
    # used as a keyword argument in a Rails `where` method.
    #
    #   # with `DB::Comment.joins(:author)`
    #   real_field_name(:'author.name') #=> :'users.name'
    #
    # @param field_param [Symbol, String]
    # @return [Symbol]
    def real_field_name(field_name)
      return field_name.to_sym unless query.join

      if Where.with_table?(field_name)
        table_name, field_name = field_name.to_s.split('.')
        real_table_name = query.join.association_map[table_name.to_sym]&.table_name
        return :"#{real_table_name}.#{field_name}"
      end

      field_name.to_sym if Where.field_name?(field_name)
    end

    # @param relation [ActiveRecord::Relation]
    # @return [ActiveRecord::Relation]
    def apply_where(relation)
      build_where(relation, query.where)
    end

    # @param relation [ActiveRecord::Relation]
    # @param where [QueryAPI::Search::Where]
    # @param logical [Symbol]
    # @return [ActiveRecord::Relation]
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
          %(#{sql_field_name(attr_name)} LIKE :like),
          {
            like:
          }
        ]
      in greater_than:
        { real_field_name(attr_name) => greater_than.. }
      in less_than:
        { real_field_name(attr_name) => ..less_than }
      in between: [left, right]
        { real_field_name(attr_name) => left..right }
      in not_equal:
        [
          %(#{sql_field_name(attr_name)} != :not_equal),
          {
            not_equal:
          }
        ]
      else
        { real_field_name(attr_name) => value }
      end
    end
  end
end
