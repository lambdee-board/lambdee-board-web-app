# frozen_string_literal: true

require 'ostruct'

module QueryAPI
  # @abstract Subclass to define new parameters
  #   in the query API which can accept any arguments.
  class OpenMapper < ::OpenStruct # rubocop:disable Style/OpenStructUse
    include ::ActiveModel::Validations
    extend Forwardable
    extend NestedValidations::ClassMethods
    include NestedValidations::InstanceMethods

    Attribute = ::Struct.new(:name, :type, :default, keyword_init: true) do
      # @return [Symbol]
      def setter
        :"#{name}="
      end
    end

    class << self
      # @param params [Hash{String => Object}]
      # @return [self]
      def of_hash(params, *_args, **_kwargs) # rubocop:disable Metrics/MethodLength
        instance = new

        return instance unless params.is_a?(::Hash)

        dynamic_params = params.dup

        attributes.each do |attr_symbol, attr_object|
          attr_name = attr_symbol.to_s
          dynamic_params.delete attr_name
          if params.include?(attr_name) && params[attr_name].nil?
            val = nil
          elsif params.include?(attr_name)
            val = attr_object.type.cast(attr_object.type.of_hash(params[attr_name]))
          elsif attr_object.default
            val = attr_object.default.call
          else
            next
          end

          instance.__send__(attr_object.setter, val)
        end

        dynamic_params.each do |attr_name, value|
          instance[attr_name] = value
        end

        instance
      end

      alias from_hash of_hash

      # @return [self, nil]
      def cast(val)
        return if val.nil?
        return val if val.is_a?(self)

        new(val)
      end

      # Names of attributes defined on the class.
      #
      # @return [Array<Symbol>]
      def declared_attribute_names
        @attributes.keys
      end

      # @return [Hash{Symbol => QueryAPI::OpenMapper::Attribute}]
      attr_reader :attributes

      # @param name [Symbol]
      # @param type [Class]
      # @param default [Proc, nil]
      def attribute(name, type, default: nil)
        @attributes ||= {}
        @attributes[name] = Attribute.new name:, type:, default:
      end
    end

    # Names of all attributes, both defined in the class,
    # and dynamically set on this object.
    #
    # @return [Array<Symbol>]
    def attribute_names
      # Since Ruby 3.0, OpenStruct instances define singleton methods
      # (setters and getters) for each new dynamic attribute.
      # Hence, we can get the names of all dynamically set attributes by inspecting
      # the object's singleton methods.
      singleton_methods.grep_v %r{=$}
    end
    alias attribute_names! attribute_names

    # @return [Hash{Symbol => Object}]
    def attributes
      attrs = {}
      attribute_names.each do |name|
        attrs[name] = public_send(name)
      end

      attrs
    end
    alias attributes! attributes

    # Names of attributes which were not defined in
    # the class, but were set dynamically.
    #
    # @return [Array<Symbol>]
    def dynamic_attribute_names
      attribute_names - self.class.declared_attribute_names
    end
    alias dynamic_attribute_names! dynamic_attribute_names

    # @return [Hash{Symbol => Object}]
    def dynamic_attributes
      attrs = {}
      dynamic_attribute_names.each do |name|
        attrs[name] = public_send(name)
      end

      attrs
    end
    alias dynamic_attributes! dynamic_attributes
  end
end
