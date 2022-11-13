# frozen_string_literal: true

module QueryAPI
  class Search
    # Type which wraps and validates a `where`, `and` or `or` clause
    # in a query.
    class Where < OpenMapper
      # @return [Regexp]
      FIELD_WITH_TABLE_NAME_REGEXP = /^[A-Za-z_]+\.[A-Za-z_]+$/
      # @return [Regexp]
      FIELD_NAME_REGEXP = /^[A-Za-z_]+$/

      class << self
        # @param field_name [Symbol, String]
        # @return [Boolean]
        def with_table?(field_name)
          field_name.match? FIELD_WITH_TABLE_NAME_REGEXP
        end

        # @param field_name [Symbol, String]
        # @return [Boolean]
        def field_name?(field_name)
          field_name.match? FIELD_NAME_REGEXP
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

      self.nested_validations = %i[and or not]

      # @!attribute [rw] and
      #   @return [self]
      attribute :and, self
      # @!attribute [rw] or
      #   @return [self]
      attribute :or, self
      # @!attribute [rw] not
      #   @return [self]
      attribute :not, self

      # @!attribute [rw] model
      #   @return [Class<ActiveRecord::Base>]
      attribute :model, ::Shale::Type::Value
      # @!attribute [rw] join
      #   @return [Join]
      attribute :join, ::Shale::Type::Value

      forward :model, to: %i[and or not]
      forward :join, to: %i[and or not]

      validate :validate_dynamic_attributes

      private

      # @return [void]
      def validate_dynamic_attributes
        inexistent_fields = []
        dynamic_attribute_names.each do |attr_name|
          if self.class.with_table?(attr_name)
            table_name, field_name = attr_name.to_s.split('.')
            klass = join.association_map&.[](table_name.to_sym)
          elsif self.class.field_name?(attr_name)
            klass = model
            field_name = attr_name
          else
            field_name = attr_name
          end

          next if self.class.model_has_field?(klass, field_name)

          inexistent_fields << [table_name, field_name].compact.join('.')
        end

        return unless inexistent_fields.any?

        errors.add :where, "inexistent fields: #{inexistent_fields}"
      end
    end
  end
end
