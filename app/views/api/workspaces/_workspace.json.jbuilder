# frozen_string_literal: true

json.extract! workspace,
              :id,
              :name,
              :created_at,
              :updated_at
json.url api_workspace_url(workspace, format: :json)
