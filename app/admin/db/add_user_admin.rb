# frozen_string_literal: true

Trestle.resource(:add_user, model: ::DB::User, scope: DB) do
  remove_action :destroy

  collection do
    model.includes(:user_workspaces, :workspaces)
  end

  table do
    column :gravatar_url, header: nil, align: :center do |user|
      admin_link_to(image_tag(user.avatar_url(size: 35)), user)
    end
    column :id
    column :name
    column :email
    column :created_at, align: :center
    column :updated_at, align: :center, header: 'Last update at'
    column :active, sort: :role, align: :center, header: 'Active?' do |user|
      status_tag(user.activity_status, { true => :success, false => :default }[user.active?] || :default)
    end
    column :role, sort: :role, align: :center do |user|
      status_tag(user.role, { 'admin' => :danger, 'manager' => :primary, 'developer' => :warning, 'regular' => :info, 'guest' => :secondary }[user.role] || :default)
    end
    actions align: :center, header: 'Add to WS' do |toolbar, user|
      toolbar.link 'Add', user, action: :add_to_workspace, method: :post, style: :success, params: { workspace_id: params[:id] }
    end
  end

  form dialog: true do
  end

  controller do
    def add_to_workspace
      ::DB::Workspace.find(params[:workspace_id]).users << admin.find_instance(params)
      flash[:message] = 'User has been added to this workspace.'
      redirect_to "#{request.referrer}#!tab-add_users"
    end
  end

  routes do
    post :add_to_workspace, on: :member
  end
end
