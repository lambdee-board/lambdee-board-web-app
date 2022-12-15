# frozen_string_literal: true

require 'set'

module QueryAPI
  # @abstract Subclass to define new parameters
  #   in the query API.
  class BaseMapper < ::Shale::Mapper
    include ::ActiveModel::Validations
    extend Forwardable
    include NestedValidations

    class << self
      # @param params [Hash{String => Object}]
      # @return [self]
      def of_hash(params, *_args, **_kwargs) # rubocop:disable Metrics/MethodLength
        instance = model.new

        return instance unless params.is_a?(::Hash)

        received_params = params.keys.to_set
        used_params = ::Set.new

        attributes.each do |attr_symbol, attr_object|
          attr_name = attr_symbol.to_s
          if params.include?(attr_name) && params[attr_name].nil?
            val = nil
          elsif params.include?(attr_name)
            val = attr_object.type.cast(attr_object.type.of_hash(params[attr_name]))
          elsif attr_object.default
            val = attr_object.default.call
          else
            next
          end
          used_params << attr_name

          instance.__send__(attr_object.setter, val)
        end

        illegal_attributes = received_params - used_params
        instance.illegal_attributes = illegal_attributes.to_a if illegal_attributes.any?

        instance
      end
      alias from_hash of_hash
    end

    # @return [nil, Array<String>]
    attr_accessor :illegal_attributes

    validates :illegal_attributes, absence: { message: 'detected: %{value}' }
  end
end
