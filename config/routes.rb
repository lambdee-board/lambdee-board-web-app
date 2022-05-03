# frozen_string_literal: true

::Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  scope '/api' do
    # backend API endpoints
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false
end
