# frozen_string_literal: true

module QueryAPI
  # Provides methods for defining attributes
  # which should be forwarded to one of this objects
  # attributes.
  #
  # Note that forwarding will only work when the object that is
  # the target of forwarding in already initialized when the forwarded
  # value is set.
  #
  #     class Query < QueryAPI::BaseMapper
  #       # wouldn't work if those two
  #       # definitions were reversed
  #       attribute :where, Where
  #       attribute :join, Join
  #
  #       # `where` has to be present
  #       # when `join` is set (otherwise forwarding will not happen)
  #       forward :join, to: :where
  #     end
  #
  module Forwardable
    ForwardedAttribute = ::Struct.new(:name, :as, :to, keyword_init: true) do
      # @param name [Symbol]
      # @param as [Symbol]
      # @param to [Array<Symbol>, Symbol]
      def initialize(name:, as:, to:)
        to = *to
        super(name:, as:, to:)
      end
    end

    # @return [Hash{Symbol => QueryAPI::Forwardable::ForwardedAttribute}]
    attr_reader :forwarded_attributes

    # @param name [Symbol]
    # @param to [Array<Symbol>, Symbol]
    # @param as [Symbol]
    # @return [void]
    def forward(name, to:, as: name)
      to = *to
      @forwarded_attributes ||= {}
      @forwarded_attributes[name] = ForwardedAttribute.new name:, as:, to:

      @forwarded_attribute_methods ||= ::Module.new.tap { include _1 }

      @forwarded_attribute_methods.class_eval <<~RUBY, __FILE__, __LINE__ + 1 # rubocop:disable Style/DocumentDynamicEvalDefinition
        # def model=(val)
        #   super
        #   set_value = model
        #   [:query, :where].each do |forwarded_to_name|
        #     forwarded_to = public_send(forwarded_to_name)
        #     next unless forwarded_to

        #     forwarded_to.public_send(:model=, set_value)
        #   end
        # end

        def #{name}=(val)
          super
          set_value = #{name}
          #{to.inspect}.each do |forwarded_to_name|
            forwarded_to = public_send(forwarded_to_name)
            next unless forwarded_to

            forwarded_to.public_send(:#{as}=, set_value)
          end
        end
      RUBY
    end
  end
end
