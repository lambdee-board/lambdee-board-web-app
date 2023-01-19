# frozen_string_literal: true

::Trestle.resource(:script_triggers, scope: ::DB) do
  collection do
    model.includes(:author)
  end

  table do
    column :id
    column :subject_type
    column :subject_id, header: 'Subject ID'
    column :scope_type
    column :scope_id, header: 'Scope ID'
    column :delay
    column :private
    column :author
    actions
  end

  form do
    text_field :subject_type
    number_field :subject_id, header: 'Subject ID'
    text_field :scope_type
    number_field :scope_id, header: 'Scope ID'
    number_field :delay
    check_box :private
    collection_select :author_id, ::DB::User.all, :id, :name
  end
end
