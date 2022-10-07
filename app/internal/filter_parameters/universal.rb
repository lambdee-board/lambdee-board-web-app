# frozen_string_literal: true

module FilterParameters
  # Class which validates universal filter parameters.
  class Universal < Base
    self.filters = %i[created_at_from created_at_to per page limit]

    validates :limit, format: { with: /\A[0-9]*\z/, message: 'should be an Integer' }, allow_blank: true
    validates :created_at_from, :created_at_to, pg_date_format: true
    validates :per, per_param_along_with_page_param: true
  end
end
