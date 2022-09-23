# frozen_string_literal: true

json.partial! 'api/boards/board', board: board
json.workspace_name board.workspace&.name
