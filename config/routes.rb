# frozen_string_literal: true

::Rails.application.routes.draw do
  mount ::Rswag::Ui::Engine => '/api-docs'
  mount ::Rswag::Api::Engine => '/api-docs'

  devise_for :users,
  class_name: 'DB::User',
  path: 'api/users',
  defaults: {
    format: :json
  },
  controllers: {
    sessions: 'api/devise/sessions',
    registrations: 'api/devise/registrations',
    passwords: 'api/devise/passwords'
  }

  devise_for :admin_users,
  class_name: 'DB::AdminUser',
  path: 'admin'

  # backend API endpoints
  namespace :api do
    defaults format: :json do
      get 'search', to: 'search#search'

      resources :workspaces do
        post :assign_user, on: :member
        post :unassign_user, on: :member
        get :ui_script_triggers, on: :member

        resources :users, only: %i[index]
      end

      resources :users, only: %i[index show update destroy] do
        get :current, on: :collection
        get 'current/ui_script_triggers', on: :collection, to: 'users#ui_script_triggers'
      end

      resources :boards do
        resources :tags, only: %i[index create]
        get :recently_viewed, on: :collection
        get :user_tasks, on: :member
        resources :sprints, only: :index
        get :active_sprint, on: :member, controller: :sprints
        get :ui_script_triggers, on: :member
      end

      resources :lists do
        resources :tasks, only: %i[index create]
      end

      resources :tasks do
        resources :tags, only: %i[index create]
        post :attach_tag, on: :member
        post :detach_tag, on: :member
        post :assign_user, on: :member
        post :unassign_user, on: :member
        put :add_time, on: :member
        get :ui_script_triggers, on: :member

        resources :comments, only: %i[index]
      end

      resources :tags, except: %i[index]

      resources :comments, except: %i[index]

      resources :sprints do
        put :end, on: :member
        get :burn_up_chart, on: :member
        resources :sprint_tasks, only: :index
      end

      resources :sprint_tasks

      resources :scripts do
        resources :script_runs, only: :index
      end

      resources :script_triggers, only: %i[show create update destroy]

      resources :ui_script_triggers, only: %i[show create update destroy] do
        post 'executions', on: :member, to: 'ui_script_triggers#execute'
      end

      resources :script_runs, only: %i[index show update]
    end
  end

  # path to the frontend React app
  root ::ApplicationController::FRONTEND_ACTION, as: :frontend
  get '/*path', to: ::ApplicationController::FRONTEND_ACTION, format: false, constraints: ->(req) { !req.path.match? %r{^(/api/)|(/admin/)} }
end
