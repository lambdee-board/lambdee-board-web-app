# frozen_string_literal: true

module QueryAPI
  class Search
    # Type that wraps and validates a `group_by`
    # clause in the query.
    class GroupBy < BaseMapper
      # @!attribute [rw] value
      #   @return [Symbol, Array<Symbol>]
      attribute :value, ::Shale::Type::Value
      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model, ::Shale::Type::Value

      validates :value, presence: true
      validate :validate_value

      # @param val [String, Symbol, Array]
      def value=(val)
        return unless val

        val = [val] unless val.is_a?(::Array)
        val = val.map(&:to_sym)
        super val
      end

      private

      # @return [void]
      def validate_value
        invalid_fields = []
        value.each do |field_name|
          next if model.attribute_names.include? field_name.to_s

          invalid_fields << field_name
        end
        return if invalid_fields.empty?

        errors.add :group_by, "invalid field names: #{invalid_fields}"
      end
    end
  end
end
