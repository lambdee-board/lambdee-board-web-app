# frozen_string_literal: true

::Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # backend API endpoints
  namespace :api do
    resources :workspaces, defaults: { format: 'json' }
    resources :users, defaults: { format: 'json' }
    resources :boards, defaults: { format: 'json' }
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false
end
