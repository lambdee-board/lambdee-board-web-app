# frozen_string_literal: true

::Trestle.resource(:boards, scope: ::DB) do
  instance_eval(&::TrestleConcerns::Archiver::ENDPOINTS)

  menu do
    item :boards, icon: 'fa fa-square'
  end

  collection do
    model.with_deleted.includes(:workspace, :lists, lists: :tasks)
  end

  search do |query|
    query ? collection.pg_search(query) : collection
  end

  table do
    column :id
    column :name
    column :workspace
    column :lists, format: :tags do |ws|
      ws.lists.pluck(:name)
    end

    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'

    instance_eval(&::TrestleConcerns::Archiver::BUTTONS)
  end
  form do |board|
    sidebar do
      text_field :name
      color_field :colour
      collection_select :workspace_id, ::DB::Workspace.all, :id, :name
    end

    tab :lists, badge: board.lists.size do
      table ::DB::ListsAdmin.table, collection: board.lists
    end

    tab :tasks, badge: board.tasks.size do
      table ::DB::TasksAdmin.table, collection: board.tasks
    end
  end
end
