# frozen_string_literal: true

::Trestle.resource(:lists, model: ::DB::List, scope: ::DB) do
  remove_action :destroy

  table do
    column :id
    column :name
    column :visible
    column :deleted?, header: 'Archived?'
    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'
  end

  form dialog: true do |list|
    text_field :name
    check_box :visible
    collection_select :board_id, list.board.workspace.boards, :id, :name
  end
end
