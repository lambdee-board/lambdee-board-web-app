# frozen_string_literal: true

json.extract! user, :id, :name, :avatar_url
json.url api_user_url(user, format: :json)

return if local_assigns[:short]

json.extract! user, :email, :created_at, :updated_at
