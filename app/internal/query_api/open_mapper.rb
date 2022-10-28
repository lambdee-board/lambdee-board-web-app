# frozen_string_literal: true

require 'ostruct'

module QueryAPI
  # @abstract Subclass to define new parameters
  #   in the query API which can accept any arguments.
  class OpenMapper < ::OpenStruct # rubocop:disable Style/OpenStructUse
    extend Forwardable
    extend NestedValidations::ClassMethods
    include NestedValidations::InstanceMethods
    include ::ActiveModel::Validations

    Attribute = ::Struct.new(:name, :type, keyword_init: true)

    class << self
      # @param params [Hash]
      # @return [self]
      def of_hash(params, *_args, **_kwargs)
        new_obj = new

        forwarded_attributes&.each do |_key, forwarded|
          attribute = @attributes[forwarded.name]
          forwarded_val = params[forwarded.name.to_s]
          forwarded_val = attribute ? attribute.type.of_hash(forwarded_val) : forwarded_val
          new_obj[forwarded.name.to_s] = forwarded_val

          forwarded.to.each do |key|
            key = key.to_s
            next unless (val = params[key])

            val = params[key] = { 'value' => val } if val.is_a?(::String) || val.is_a?(::Numeric)
            next unless val.is_a?(::Hash)

            val[forwarded.as.to_s] = forwarded_val
          end
        end

        if forwarded_attributes
          already_set_attrs = forwarded_attributes.keys + forwarded_attributes.values.map(&:to)
          params = params.reject { |k, _| already_set_attrs.include?(k.to_sym) }
        end

        params.each do |key, val|
          attribute = @attributes[key&.to_sym]
          val = attribute ? attribute.type.of_hash(val) : val
          new_obj[key] = val
        end

        new_obj
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
      def attribute(name, type)
        @attributes ||= {}
        @attributes[name] = Attribute.new name:, type:
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
