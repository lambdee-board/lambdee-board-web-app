# frozen_string_literal: true

module QueryAPI
  module Forwardable
    ForwardedAttribute = ::Struct.new(:name, :as, :to, keyword_init: true) do
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
      to.each do |element|
        @forwarded_attributes[name] = ForwardedAttribute.new name:, as:, to: element
      end
    end
  end
end
