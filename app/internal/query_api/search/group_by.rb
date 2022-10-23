# frozen_string_literal: true

module QueryAPI
  class Search
    # Type that wraps and validates a `group_by`
    # clause in the query.
    class GroupBy < BaseMapper
      # @!attribute [rw] value
      #   @return [Symbol, Array]
      attribute :value, ::Shale::Type::Value
      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model, ::Shale::Type::Value

      validates :value, presence: true
      # validate :validate_value
      # TODO

      def value=(val)
        @value = val.is_a?(::Array) ? val : [val]
      end

      private

      def validate_value
        return if value&.all? { model.attribute_names.include? _1 }

        errors.add :group_by, 'invalid field names'
      end
    end
  end
end
