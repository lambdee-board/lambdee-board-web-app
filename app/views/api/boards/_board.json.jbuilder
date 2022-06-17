# frozen_string_literal: true

json.extract! board,
              :id,
              :name,
              :colour,
              :workspace_id,
              :created_at,
              :updated_at,
              :deleted_at

json.url api_board_url(board, format: :json)
json.workspace_url api_workspace_url(board.workspace, format: :json) if board.workspace
