# frozen_string_literal: true

# Abstract controller class from which
# every single controller in this app inherits.
class ApplicationController < ::ActionController::Base
  rescue_from ::CanCan::AccessDenied, with: :unauthorized

  FRONTEND_ACTION = 'frontend#app'

  protected

  def unauthorized
    head(:unauthorized)
  end
end
