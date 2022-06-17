# frozen_string_literal: true

json.extract! workspace, :id, :name, :created_at, :updated_at, :deleted_at
json.url api_workspace_url(workspace, format: :json)

json.boards workspace.boards, partial: 'api/boards/board', as: :board if local_assigns[:boards].present?
