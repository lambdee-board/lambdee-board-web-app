# frozen_string_literal: true

::Trestle.resource(:sprints, model: ::DB::Sprint, scope: ::DB) do
  remove_action :destroy

  table do
    column :id
    column :name
    column :started_at
    column :expected_end_at
    column :ended_at
  end

  form do
    text_field :name
    row do
      col { datetime_field :started_at }
      col { datetime_field :expected_end_at }
      col { datetime_field :ended_at }
    end
  end
end
