# frozen_string_literal: true

json.extract! board,
              :id,
              :name,
              :workspace_id,
              :created_at,
              :updated_at

json.workspace_url api_workspace_url(board.workspace, format: :json)
json.url api_board_url(board, format: :json)
