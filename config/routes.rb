# frozen_string_literal: true

::Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  scope '/api' do
    # backend API endpoints
    resources :workspaces, only: %i[index show]
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false
end
