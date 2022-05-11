# frozen_string_literal: true

# Abstract controller class from which
# every single API controller in this app inherits.
class ApplicationAPIController < ::ApplicationController
  include JSONAPI::ActsAsResourceController

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
end
