# frozen_string_literal: true

module QueryAPI
  # Provides methods which enable
  # this class to define nested validated objects
  # whose errors will be merged.
  module NestedValidations
    extend ::ActiveSupport::Concern

    included do
      include InstanceMethods
      extend ClassMethods
    end

    # Instance methods
    module InstanceMethods
      # @return [Boolean]
      def valid?
        return super unless (validation_objects = nested_validations)

        all_valid = true
        all_valid = false unless super

        validation_objects.each do |obj|
          next if obj.valid?

          all_valid = false
        end

        merge_errors

        all_valid
      end

      # @return [Array<Object>]
      def nested_validations
        self.class.nested_validations&.filter_map do |method_name|
          public_send(method_name)
        end
      end

      private

      def merge_errors
        nested_validations&.each do |obj|
          errors.merge!(obj)
        end
      end
    end

    # Class methods
    module ClassMethods
      # Set the names of attributes of this class that contain
      # objects which should be validated as well.
      # The errors of their validation will be merged with this object's
      # errors.
      #
      # @return [Array<Symbol>]
      attr_accessor :nested_validations
    end
  end
end
