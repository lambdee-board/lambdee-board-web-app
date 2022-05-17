# frozen_string_literal: true

json.extract! workspace,
              :id,
              :name,
              :created_at,
              :updated_at
json.url api_workspace_url(workspace, format: :json)

return unless include_association?

json.boards workspace.boards, partial: 'api/boards/board', as: :board if include_association == :boards
