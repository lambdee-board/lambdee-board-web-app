# frozen_string_literal: true

require 'ostruct'

module QueryAPI
  # @abstract Subclass to define new parameters
  #   in the query API which can accept any arguments.
  class OpenMapper < ::OpenStruct # rubocop:disable Style/OpenStructUse
    extend Forwardable
    include NestedValidations
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

      def cast(val)
        return if val.nil?
        return val if val.is_a?(self)

        new(val)
      end

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

    # @return [Array<Symbol>]
    def declared_attribute_names
      self.class.declared_attribute_names
    end

    # @return [Array<Symbol>]
    def attribute_names
      singleton_methods.grep_v %r{=$}
    end

    # @return [Array<Symbol>]
    def dynamic_attribute_names
      attribute_names - declared_attribute_names
    end
  end
end
