json.extract! list, :id, :name, :pos, :visible, :deleted_at, :board_id, :created_at, :updated_at
json.url api_list_url(list, format: :json)
json.board_url api_board_url(list.board, format: :json) if list.board
