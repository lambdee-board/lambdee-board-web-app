# frozen_string_literal: true

json.workspaces @workspaces, partial: 'workspace', as: :workspace, locals: { boards: params[:boards] }
json.total_pages @workspaces.total_pages if params[:page]
