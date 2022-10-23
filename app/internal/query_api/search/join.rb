# frozen_string_literal: true

module QueryAPI
  class Search
    # Type that wraps and validates a `join` or `left_outer_join`
    # clause in a query.
    class Join < BaseMapper
      # @!attribute [rw] value
      #   @return [Symbol, Array, Hash]
      attribute :value, ::Shale::Type::Value
      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model, ::Shale::Type::Value

      validates :value, presence: true
      validate :validate_value

      # @param val [Object, Array]
      def value=(val)
        super symbolize_value(val)
      end

      # @return [Hash{Symbol => Class<ActiveRecord::Base>}]
      attr_reader :association_map

      private

      # @param val [Hash, Array, String, nil]
      # @return [Hash, Array, Symbol, nil]
      def symbolize_value(val)
        return symbolize_hash_value(val) if val.is_a?(::Hash)
        return symbolize_array_value(val) if val.is_a?(::Array)

        symbolize_string_value(val)
      end

      # @param val [Hash{String => Hash, Array, String}]
      # @return [Hash{String => Hash, Array, Symbol}]
      def symbolize_hash_value(val)
        val.transform_keys(&:to_sym)
           .transform_values! { symbolize_value(_1) }
      end

      # @param val [Array<Hash, String>]
      # @return [Array<Hash, Symbol>]
      def symbolize_array_value(val)
        val.map { symbolize_value(_1) }
      end

      # @param val [String, nil]
      # @return [Symbol, nil]
      def symbolize_string_value(val)
        val&.to_sym
      end

      # @return [void]
      def validate_value
        invalid = catch :invalid do
          validate_associations(model, value)
        end

        return unless invalid

        errors.add :join, "inexistent relation: #{invalid}"
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Hash, Array, Symbol, nil]
      # @return [Boolean] Whether the associations are invalid
      def validate_associations(klass, associations)
        throw :invalid, false if associations.nil?
        return validate_hash_association(klass, associations) if associations.is_a?(::Hash)
        return validate_array_association(klass, associations) if associations.is_a?(::Array)

        validate_string_association(klass, associations)
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Hash{Symbol => Symbol}, Hash{Symbol => Hash}, Hash{Symbol => Array<Symbol>}]
      # @return [Boolean] Whether the associations are invalid
      def validate_hash_association(klass, associations)
        associations.each do |key, val|
          validate_associations(klass, key)
          associated_klass = klass._reflections[key.to_s]&.klass
          validate_associations(associated_klass, val)
        end

        false
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Array<Symbol>, Array<Hash>]
      # @return [Boolean] Whether the associations are invalid
      def validate_array_association(klass, associations)
        associations.each { validate_associations(klass, _1) }

        false
      end

      # @param klass [Class<ActiveRecord::Base>]
      # @param associations [Symbol]
      # @return [Boolean] Whether the associations are invalid
      def validate_string_association(klass, associations)
        reflection = klass&._reflections&.[](associations.to_s)
        throw :invalid, associations unless reflection
        @association_map ||= {}
        @association_map[associations.to_sym] = reflection.klass

        false
      end
    end
  end
end
