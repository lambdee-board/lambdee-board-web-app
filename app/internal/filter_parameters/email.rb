# frozen_string_literal: true

module FilterParameters
  # Class which validates universal filter parameters.
  class Email < Base
    self.filters = %i[to subject content]

    validates :to, email: true
    validates :subject, length: { in: 3..200 }
    validates :content, length: { minimum: 2 }
  end
end
