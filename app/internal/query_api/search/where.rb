# frozen_string_literal: true
require 'debug'

module QueryAPI
  class Search
    # Type which wraps and validates a `where`, `and` or `or` clause
    # in a query.
    class Where < OpenMapper
      self.nested_validations = %i[and or]

      attribute :and, self
      attribute :or, self

      attribute :model, ::Shale::Type::Value
      attribute :join, ::Shale::Type::Value

      forward :model, to: %i[and or]

      validate :validate_dynamic_attributes

      private

      def validate_dynamic_attributes
        inexistent_fields = []
        dynamic_attribute_names.each do |attr_name|
          next if model.attribute_names.include? attr_name.to_s

          inexistent_fields << attr_name
        end

        return unless inexistent_fields.any?

        debugger
        errors.add :where, "inexistent fields: #{inexistent_fields}"
      end
    end
  end
end
