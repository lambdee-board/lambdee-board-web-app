# frozen_string_literal: true

::Trestle.resource(:tasks, model: ::DB::Task, scope: ::DB) do
  remove_action :destroy

  table do
    column :id
    column :name
    column :deleted?, header: 'Archived?'
    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'
  end

  form dialog: true do
    text_field :name
  end
end
