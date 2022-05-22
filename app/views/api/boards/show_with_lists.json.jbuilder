# frozen_string_literal: true

json.partial! 'api/boards/board', board: @board

json.lists do
  json.array! @board.lists do |list|
    json.partial! 'api/lists/list', list: list
  end
end
