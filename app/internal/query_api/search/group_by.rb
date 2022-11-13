# frozen_string_literal: true

module QueryAPI
  class Search
    # Type that wraps and validates a `group_by`
    # clause in the query.
    class GroupBy < ::Shale::Type::Value
      include ::ActiveModel::Validations

      class << self
        # Decode from JSON/Hash.
        #
        # @param [String, Object, nil]
        # @return [Object, nil]
        def cast(value)
          return if value.nil?
          return value if value.is_a?(self)

          new(value)
        end
      end

      # @return [Symbol, Array<Symbol>]
      attr_reader :value
      # @return [Class<ActiveRecord::Base>, nil]
      attr_accessor :model

      validates :value, presence: true
      validate :validate_value

      # @param value [Symbol, Array<Symbol>, String, Array<String>]
      # @param value [Class<ActiveRecord::Base>, nil]
      def initialize(value, model: nil)
        @value = value.is_a?(::Array) ? value.map(&:to_sym) : [value&.to_sym]
        @model = model
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
