# frozen_string_literal: true

module QueryAPI
  class Search
    # Type which wraps and validates a `order` clause
    # in a query.
    class Order < OpenMapper
      # @return [Set<Symbol>]
      VALID_ORDERS = ::Set[:asc, :desc].freeze

      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model, ::Shale::Type::Value

      validate :validate_dynamic_attributes

      private

      # @return [void]
      def validate_dynamic_attributes
        inexistent_fields = []
        incorrect_values = []
        dynamic_attribute_names.each do |attr_name|
          inexistent_fields << attr_name if !Where.field_name?(attr_name) || !Where.model_has_field?(model, attr_name)

          value = public_send(attr_name)
          incorrect_values << "#{attr_name}: #{value}" unless VALID_ORDERS.include?(value.to_sym)
        end

        errors.add :order, "inexistent fields: #{inexistent_fields}" if inexistent_fields.any?
        errors.add :order, "incorrect values: #{incorrect_values}" if incorrect_values.any?
      end
    end
  end
end
