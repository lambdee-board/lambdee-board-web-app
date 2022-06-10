# frozen_string_literal: true

Trestle.resource(:limited_user, model: ::DB::User, scope: DB) do
  remove_action :destroy

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
    actions align: :center, header: 'Remove from WS' do |toolbar, user|
      toolbar.link 'Remove', user, admin: ::DB::LimitedUserAdmin, action: :remove_from_workspace, method: :post, style: :danger, params: { workspace_id: params[:id] }
    end
  end

  form dialog: true do
  end

  controller do
    def remove_from_workspace
      user = admin.find_instance(params)
      user.workspaces.delete(params[:workspace_id])
      flash[:message] = 'User has been removed from this workspace.'
      redirect_to "#{request.referrer}#!tab-users"
    end
  end

  routes do
    post :remove_from_workspace, on: :member
  end
end
