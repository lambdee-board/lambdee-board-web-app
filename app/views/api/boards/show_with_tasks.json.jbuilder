# frozen_string_literal: true

json.extract! @board,
              :id,
              :name,
              :workspace_id,
              :created_at,
              :updated_at

json.workspace_url api_workspace_url(@board.workspace, format: :json)
json.url api_board_url(@board, format: :json)
json.lists do
  json.array! @board.lists do |list|
    json.extract! list, :id, :name, :pos, :archived, :created_at, :updated_at
    json.tasks do
      json.array! list.tasks do |task|
        json.extract! task, :id, :name, :description, :pos, :created_at, :updated_at
        json.users do
          json.array! task.users do |user|
            json.extract! user, :id, :name, :avatar_url
          end
        end
      end
    end
  end
end
