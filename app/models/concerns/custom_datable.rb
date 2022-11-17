# frozen_string_literal: true

# Adds a custom_data serialized field for use by users in scripts.
module ::CustomDatable
  extend ::ActiveSupport::Concern

  included do
    attribute :custom_data, default: -> { ::Hash.new }
  end
end
