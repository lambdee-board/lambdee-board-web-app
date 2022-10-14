# frozen_string_literal: true

json.users @users, partial: 'user', as: :user
json.total_pages @users.total_pages if params[:page]
