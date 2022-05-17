# frozen_string_literal: true

::Rails.application.routes.draw do
  mount ::Rswag::Ui::Engine => '/api-docs'
  mount ::Rswag::Api::Engine => '/api-docs'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # backend API endpoints
  namespace :api do
    defaults format: :json do
      resources :workspaces
      resources :users do
        get :current, on: :collection
      end
      resources :boards
      resources :lists
    end
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false
end
