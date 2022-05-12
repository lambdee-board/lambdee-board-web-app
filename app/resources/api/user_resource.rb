# frozen_string_literal: true

# Class which serves basic API requests of `UsersController`
class API::UserResource < JSONAPI::Resource
  model_name 'DB::User'

  attributes :name
end
