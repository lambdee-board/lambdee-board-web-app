# frozen_string_literal: true

# Wraps the Rails routing helper methods
# so they're available outside views and controllers
#
#     ::Rails.application.routes.draw do
#       get 'oauth/callback/:provider', to: 'oauth#callback', as: :oauth_callback
#     end
#
#     AppRouter.url(:oauth_callback, provider: :google)
#     #=> "http://localhost:3000/api/oauth/callback/google"
#
module AppRouter
  @url_helpers = ::Rails.application.routes.url_helpers
  @host = ::Rails.application.default_url_options[:host]
  @protocol = ::Rails.application.default_url_options[:protocol]

  class << self
    attr_reader :url_helpers, :host, :protocol

    # @param name [Symbol, String]
    # @param options [Hash]
    # @return [String, nil]
    def url(name, options = {})
      return unless name.respond_to?(:to_sym) && name.respond_to?(:to_s)

      @url_helpers.public_send(:"#{name}_url", host: @host, protocol: @protocol, **options)
    end
  end
end
