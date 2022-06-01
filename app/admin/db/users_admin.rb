# frozen_string_literal: true

Trestle.resource(:users, scope: DB) do
  remove_action :destroy

  menu do
    item :users, icon: 'fa fa-user'
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
    actions align: :center do |toolbar, user|
      toolbar.link 'Deactivate', user, action: :deactivate, method: :post, style: :danger if user.active?
      toolbar.link 'Activate', user, action: :activate, method: :post, style: :success if user.deactivated?
    end
  end

  form dialog: true do
    text_field :name
    text_field :email
    select :role, ::DB::User.roles.keys
  end

  controller do
    def deactivate
      user = admin.find_instance(params)
      user.deactivate!
      flash[:message] = 'User has been deactivated'
      redirect_to admin.path(:index)
    end

    def activate
      user = admin.find_instance(params)
      user.activate!
      flash[:message] = 'User has been activated'
      redirect_to admin.path(:index)
    end
  end

  routes do
    post :deactivate, on: :member
    post :activate, on: :member
  end
end
