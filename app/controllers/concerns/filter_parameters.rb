# frozen_string_literal: true

# Class for checking proper format of
# the sent filter parameters.
class FilterParameters
  include ::ActiveModel::Validations

  validates :limit, format: { with: /\A[0-9]*\z/, message: 'should be an Integer' }, allow_blank: true
  validates :created_at_from, :created_at_to, pg_date_format: true
  validates :per, per_param_along_with_page_param: true

  FILTERS = ::Set[:created_at_from, :created_at_to, :per, :page, :limit]

  attr_reader(*FILTERS)

  # @param params [Hash]
  def initialize(params)
    @params = params
    FILTERS.each do |filter|
      instance_variable_set("@#{filter}", params[filter])
    end
  end
end
