# frozen_string_literal: true

# Abstract controller class from which
# every single API controller inherits.
class APIController < ::ApplicationController
  skip_forgery_protection

  rescue_from ::ActiveRecord::RecordNotFound, with: :not_found

  protected

  def not_found
    head 404
  end
end
