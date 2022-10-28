# frozen_string_literal: true

::Trestle.resource(:sprints, model: ::DB::Sprint, scope: ::DB) do
  remove_action :destroy

  table do
    column :id
    column :name
    column :start_date
    column :due_date
    column :end_date
  end

  form do
    text_field :name
    row do
      col { datetime_field :start_date }
      col { datetime_field :due_date }
      col { datetime_field :end_date }
    end
  end
end
