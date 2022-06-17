# frozen_string_literal: true

Trestle.resource(:limited_board, model: ::DB::Board, scope: DB) do
  remove_action :destroy

  table do
    column :id
    column :name
    column :colour
    column :created_at, align: :center
  end

  form dialog: true
end
