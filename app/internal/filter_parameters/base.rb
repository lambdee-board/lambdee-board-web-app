# frozen_string_literal: true

require 'set'

module FilterParameters
  # An abstract class which enables one to validate filter parameters.
  #
  # Example:
  #
  #     class UserFilter < ::FilterParameters::Base
  #       self.filters = %i[role]
  #
  #       validates :role, inclusion: { in: ::Set['manager', 'guest'] }
  #     end
  #
  #     filters = UserFilter.new({ role: 'inexistent' })
  #     filters.valid? #=> false
  #     filters.errors #=> #<ActiveModel::Errors>
  #
  #     # you can also get only the errors
  #     UserFilter.errors({ role: 'inexistent' })
  #     #=> #<ActiveModel::Errors>
  #     UserFilter.errors({ role: 'manager' })
  #     #=> nil
  #
  # @abstract Subclass to define a new filter parameter validator
  class Base
    include ::ActiveModel::Validations

    class << self
      # A set containing the names of filter parameters
      # that this class should validate.
      #
      # @return [Set<Symbol>]
      def filters
        return @filters unless superclass < Base

        @filters + superclass.filters
      end

      # Set the name of filters that this class should validate.
      #
      # @param val [Set<Symbol>, Array<Symbol>]
      def filters=(val)
        @filters = val.to_set
        @filters_module ||= ::Module.new.tap { include _1 }
        @filters_module.attr_accessor(*@filters)
      end

      # @return [Module] Contains all dynamically
      #   generated methods for accessing filter parameters
      attr_reader :filters_module

      # Returns `nil` if there are no errors.
      # Otherwise it returns `ActiveModel::Errors`.
      #
      # @param params [Hash]
      # @return [ActiveModel::Errors, nil]
      def errors(params)
        obj = new(params)
        return if obj.valid?

        obj.errors
      end
    end

    # @param params [Hash]
    def initialize(params)
      @params = params
      self.class.filters.each do |filter|
        public_send(:"#{filter}=", params[filter])
      end
    end
  end
end
