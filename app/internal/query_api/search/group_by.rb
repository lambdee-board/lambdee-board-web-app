# frozen_string_literal: true

module QueryAPI
  class Search
    class GroupBy < BaseMapper
      class << self
        def of_hash(value, *args, **kwargs)
          super if value.is_a?(::Hash)

          new(value:)
        end
      end

      attribute :value, ::Shale::Type::Value
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
