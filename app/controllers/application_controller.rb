# frozen_string_literal: true

# Abstract controller class from which
# every single controller in this app inherits.
class ApplicationController < ::ActionController::Base
  FRONTEND_ACTION = 'frontend#app'
end
