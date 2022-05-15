# frozen_string_literal: true

# Custom Rails validator which validates emails.
class EmailValidator < ::ActiveModel::EachValidator
  # @return [Regexp]
  EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

  def validate_each(object, attribute, value)
    return if value.to_s.match?(EMAIL_REGEX)

    object.errors.add attribute, (options[:message] || 'is not an email')
  end
end
