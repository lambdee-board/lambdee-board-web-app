# frozen_string_literal: true

module QueryAPI
  class Search
    # Type which wraps and validates a `where`, `and` or `or` clause
    # in a query.
    class Where < OpenMapper
      FIELD_WITH_TABLE_NAME_REGEXP = /^[A-Za-z_]+\.[A-Za-z_]+$/
      FIELD_NAME_REGEXP = /^[A-Za-z_]+$/

      self.nested_validations = %i[and or]

      attribute :and, self
      attribute :or, self

      attribute :model, ::Shale::Type::Value
      attribute :join, ::Shale::Type::Value

      forward :model, to: %i[and or]
      forward :join, to: %i[and or]

      validate :validate_dynamic_attributes

      private

      def validate_dynamic_attributes
        inexistent_fields = []
        dynamic_attribute_names.each do |attr_name|
          if attr_name.match? FIELD_WITH_TABLE_NAME_REGEXP
            table_name, field_name = attr_name.to_s.split('.')
            klass = join.association_map[table_name.to_sym]
          elsif attr_name.match? FIELD_NAME_REGEXP
            klass = model
            field_name = attr_name
          else
            field_name = attr_name
          end

          next if model_has_field?(klass, field_name)

          inexistent_fields << [table_name, field_name].compact.join('.')
        end

        return unless inexistent_fields.any?

        errors.add :where, "inexistent fields: #{inexistent_fields}"
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param field_name [Symbol, String]
      # @return [Boolean]
      def model_has_field?(klass, field_name)
        return false unless klass
        return false unless field_name

        klass.attribute_names.include? field_name.to_s
      end
    end
  end
end
