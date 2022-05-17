# frozen_string_literal: true

json.extract! user,
              :id,
              :name,
              :email,
              :avatar_url,
              :created_at,
              :updated_at

json.url api_user_url(user, format: :json)
