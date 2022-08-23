# frozen_string_literal: true

# Custom validator for checking if per parameter
# was send with page parameter.
class PerParamAlongWithPageParamValidator < ::ActiveModel::EachValidator
  def validate_each(object, attribute, value)
    return if value.blank? || object.page.present?

    object.errors.add attribute, 'page parameter is required'
  end
end
