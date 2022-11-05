# frozen_string_literal: true

module Charts
  # Helps generating multiple charts.
  class FilledHash < ::Hash
    # @return [self]
    def fill_nil_values!
      last_value = first.second
      transform_values! do |value|
        value ||= last_value
        last_value = value
      end
    end
  end
end
