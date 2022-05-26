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
      resources :boards do
        resources :tags, only: %i[index create]
      end
      resources :lists
      resources :tasks do
        resources :tags, only: %i[index create]
        post :attach_tag, on: :member
        post :detach_tag, on: :member

       resources :comments, only: %i[index]
      end
      resources :tags, except: %i[index]
      resources :comments, except: %i[index]
    end
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false, constraints: ->(req) { !req.path.match? %r{^/api/} }
end
