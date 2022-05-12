# frozen_string_literal: true

::Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # backend API endpoints
  namespace :api do
    jsonapi_resources :users
    jsonapi_resources :workspaces
    jsonapi_resources :boards
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false
end
