# frozen_string_literal: true

# Custom validator for checking if given string is
# in a valid date format for PG query.
class PgDateFormatValidator < ::ActiveModel::EachValidator
  def validate_each(object, attribute, value)
    return if value.blank?

    y, m, d = value.split('.')
    return if ::Date.valid_date?(y.to_i, m.to_i, d.to_i)

    object.errors.add attribute, 'invalid date format (YYYY.MM.DD required)'
  end
end
