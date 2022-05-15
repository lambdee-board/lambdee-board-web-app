# frozen_string_literal: true

json.extract! board,
              :id,
              :name,
              :created_at,
              :updated_at

json.url api_board_url(board, format: :json)
