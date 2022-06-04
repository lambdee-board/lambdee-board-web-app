# frozen_string_literal: true

Trestle.resource(:workspaces, scope: DB) do
  instance_eval(&::TrestleExtensions::Archiver::ENDPOINTS)

  menu do
    item :workspaces, icon: 'fa fa-briefcase'
  end

  collection do
    model.includes(:users, :boards)
  end

  table do
    column :id
    column :name
    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'
    instance_eval(&::TrestleExtensions::Archiver::BUTTONS)
  end
end
