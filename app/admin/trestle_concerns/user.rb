# frozen_string_literal: true

# Module which contains constants with procs
# which encapsulate common settings for all
# user related views.
module TrestleConcerns::User
  # @return [Hash]
  COLOURS_PER_ROLE = { 'admin' => :danger, 'manager' => :dark, 'developer' => :warning, 'regular' => :info, 'guest' => :secondary }.freeze

  COLUMNS = proc do
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
      status_tag(user.role, COLOURS_PER_ROLE[user.role] || :default)
    end
  end

  FORM = proc do
    text_field :name
    text_field :email
    select :role, ::DB::User.roles.keys
    collection_select :workspace_ids, ::DB::Workspace.all, :id, :name, { label: 'Workspaces' }, { multiple: true }

    row do
      col(sm: 6) { password_field :password }
      col(sm: 6) { password_field :password_confirmation }
    end
  end
end
