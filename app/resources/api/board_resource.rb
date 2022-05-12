# frozen_string_literal: true

# Class which serves basic API requests of `BoardsController`
class API::BoardResource < JSONAPI::Resource
  model_name 'DB::Board'

  attributes :name
  has_one :workspace

  filter :workspace
end
