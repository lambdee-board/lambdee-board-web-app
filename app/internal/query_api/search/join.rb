# frozen_string_literal: true

module QueryAPI
  class Search
    # Type that wraps and validates a `join` or `left_outer_join`
    # clause in a query.
    class Join < BaseMapper
      class << self
        # @return [self]
        def of_hash(value, *args, **kwargs)
          super if value.is_a?(::Hash)

          new(value:)
        end
      end

      attribute :value, ::Shale::Type::Value
      attribute :model, ::Shale::Type::Value

      validates :value, presence: true
      # TODO
      # validate :validate_value

      # @param val [Object, Array]
      def value=(val)
        @value = val.is_a?(::Array) ? val : [val]
      end

      private

      def validate_value
        invalid = catch :invalid do
          validate_associations(model, value)
        end

        return unless invalid

        errors.add :join, "inexistent relation: #{invalid}"
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Hash, Array, String, nil]
      # @return [Boolean] Whether the associations are invalid
      def validate_associations(klass, associations)
        throw :invalid, false if associations.nil?
        return validate_hash_association(klass, associations) if associations.is_a?(::Hash)
        return validate_array_association(klass, associations) if associations.is_a?(::Array)

        validate_string_association(klass, associations)
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Hash{String => String}, Hash{String => Hash}, Hash{String => Array<String>}]
      # @return [Boolean] Whether the associations are invalid
      def validate_hash_association(klass, associations)
        associations.each do |key, val|
          validate_associations(klass, key)
          associated_klass = klass._reflections[key].klass
          validate_associations(associated_klass, val)
        end

        false
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Array<String>, Array<Hash>]
      # @return [Boolean] Whether the associations are invalid
      def validate_array_association(klass, associations)
        associations.each { validate_associations(klass, _1) }

        false
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [String]
      # @return [Boolean] Whether the associations are invalid
      def validate_string_association(klass, associations)
        throw :invalid, associations unless klass&._reflections&.[](associations.to_s)
        false
      end
    end
  end
end
