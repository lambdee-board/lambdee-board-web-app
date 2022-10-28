# frozen_string_literal: true

module QueryAPI
  # Provides methods for defining attributes
  # which should be forwarded to one of this objects
  # attributes.
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
    end
  end
end
