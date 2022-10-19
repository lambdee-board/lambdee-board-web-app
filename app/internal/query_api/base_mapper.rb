# frozen_string_literal: true

module QueryAPI
  # @abstract Subclass to define new parameters
  #   in the query API.
  class BaseMapper < ::Shale::Mapper
    include ::ActiveModel::Validations
    extend Forwardable
    extend NestedValidations::ClassMethods
    include NestedValidations::InstanceMethods

    class << self
      # @param params [Hash{String => Object}]
      # @return [self]
      def of_hash(params, *args, **kwargs)
        instance = model.new

        attributes
          .values
          .select(&:default)
          .each { instance.__send__(_1.setter, _1.default.call) }

        return instance unless params.is_a?(::Hash)

        illegal_attributes = []

        forwarded_attributes&.each do |_key, forwarded|
          key = forwarded.name.to_s
          next unless (forwarded_val = params[key])

          attribute, forwarded_val = mapped_value(instance, key, forwarded_val, illegal_attributes)
          instance.__send__(attribute.setter, forwarded_val)

          forwarded.to.each do |key|
            key = key.to_s
            next unless (val = params[key])

            params[key] = { 'value' => val } if val.is_a?(::String) || val.is_a?(::Numeric)
            next unless params[key].is_a?(::Hash)

            params[key][forwarded.as.to_s] = forwarded_val
          end
        end

        if forwarded_attributes
          already_set_attrs = forwarded_attributes.keys + forwarded_attributes.values.map(&:to)
          params = params.reject { |k, _| already_set_attrs.include?(k.to_sym) }
        end

        params.each do |key, value|
          attribute, val = mapped_value(instance, key, value, illegal_attributes)
          next unless attribute

          instance.__send__(attribute.setter, val)
        end

        instance.illegal_attributes = illegal_attributes if illegal_attributes.any?

        instance
      end

      private

      # @param instance [self]
      # @param key [String]
      # @param value [Object]
      # @param illegal_attributes [Array<String>]
      # @return [Array(Shale::Attribute, Object)]
      def mapped_value(instance, key, value, illegal_attributes)
        mapping = hash_mapping.keys[key]
        unless mapping
          illegal_attributes << key
          return
        end

        attribute = attributes[mapping.attribute]
        return unless attribute
        return instance.__send__(attribute.setter, nil) if value.nil?

        [attribute, attribute.type.cast(attribute.type.of_hash(value))]
      end

      alias from_hash of_hash
    end

    # @return [nil, Array<String>]
    attr_accessor :illegal_attributes

    validates :illegal_attributes, absence: { message: 'detected: %{value}' }
  end
end
