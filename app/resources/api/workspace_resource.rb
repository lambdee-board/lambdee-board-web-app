# frozen_string_literal: true

# Class which serves basic API requests of `WorkspacesController`

class API::WorkspaceResource < JSONAPI::Resource
  model_name 'DB::Workspace'

  attributes :name
  has_many :boards
end
