# frozen_string_literal: true

json.array! @workspaces, partial: 'workspace', as: :workspace, locals: { boards: params[:boards] }
