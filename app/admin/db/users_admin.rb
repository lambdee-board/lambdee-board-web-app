# frozen_string_literal: true

Trestle.resource(:users, scope: DB) do
  instance_eval(&::TrestleExtensions::Archiver::ENDPOINTS)

  menu do
    item :users, icon: 'fa fa-users'
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
      toolbar.link 'Deactivate', user, action: :deactivate, method: :post, style: :danger if user.active? && user != current_user
      toolbar.link 'Activate', user, action: :activate, method: :post, style: :success if user.deactivated?
    end
  end

  form dialog: true do
    text_field :name
    text_field :email
    select :role, ::DB::User.roles.keys
    row do
      col(sm: 6) { password_field :password }
      col(sm: 6) { password_field :password_confirmation }
    end
  end

  # Ignore the password parameters if they are blank
  update_instance do |instance, attrs|
    if attrs[:password].blank?
      attrs.delete(:password)
      attrs.delete(:password_confirmation) if attrs[:password_confirmation].blank?
    end

    instance.assign_attributes(attrs)
  end

  # Log the current user back in if their password was changed
  after_action on: :update do
    login!(instance) if instance == current_user && instance.encrypted_password_previously_changed?
  end if ::Devise.sign_in_after_reset_password
end
