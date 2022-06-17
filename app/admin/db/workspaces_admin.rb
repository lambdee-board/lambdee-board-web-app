# frozen_string_literal: true

Trestle.resource(:workspaces, scope: DB) do
  instance_eval(&::TrestleConcerns::Archiver::ENDPOINTS)

  menu do
    item :workspaces, icon: 'fa fa-briefcase'
  end

  collection do
    model.includes(:users, :boards)
  end

  table do
    column :id
    column :name
    column :boards, format: :tags do |ws|
      ws.boards.map(&:name)
    end
    column :users, header: :PMs, format: :tags, class: 'info' do |ws|
      ws.users.map(&:name)
    end
    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'

    instance_eval(&::TrestleConcerns::Archiver::BUTTONS)
  end

  form do |ws|
    tab :workspace do
      text_field :name
    end

    tab :users, badge: ws.users.count do
      table ::DB::LimitedUserAdmin.table, collection: ws.users
    end
    tab :add_users, badge: ::DB::User.all.count do
      table ::DB::AddUserAdmin.table, collection: ::DB::User.all - ws.users
    end

    tab :boards, badge: ws.boards.count do
      table ::DB::LimitedBoardAdmin.table, collection: ws.boards
    end
  end
end
