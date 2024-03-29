# frozen_string_literal: true

::Trestle.resource(:users, scope: ::DB) do
  instance_eval(&::TrestleConcerns::Archiver::ENDPOINTS)

  menu do
    item :users, icon: 'fa fa-users', priority: :first
  end

  collection do
    model.with_deleted
  end

  search do |query|
    query ? collection.search(query) : collection
  end

  table do
    instance_eval(&::TrestleConcerns::User::COLUMNS)
    column :last_sign_in_at
    column :last_sign_in_ip
    column :current_sign_in_at
    column :current_sign_in_ip
    column :deleted_at, header: 'Deactivated at'

    actions align: :center do |toolbar, user|
      toolbar.link 'Deactivate', user, admin: admin, action: :deactivate, method: :post, style: :danger if user.active? && user != current_user
      toolbar.link 'Activate', user, admin: admin, action: :activate, method: :post, style: :success if user.deactivated?
    end
  end

  form dialog: true, &::TrestleConcerns::User::FORM

  controller do
    def index
      toolbar(:primary) do |t|
        t.link('Import from CSV', admin.path(:import), style: 'primary', data: { behavior: 'dialog' })
      end

      ::TrestleConcerns::User::COLOURS_PER_ROLE.each do |role, style|
        toolbar(:secondary) do |t|
          t.link("#{role}s", "users?q=#{::DB::User.roles[role]}", style: style)
        end
      end
    end

    def import
      render 'admin/db/users/import' and return if request.get?

      importer = ::UserImporter.new(params[:users_csv], params[:deactivated])
      importer.run
      importer.file_error? ? flash[:error] = importer.file_error_message : flash[:message] = importer.full_message
      redirect_to admin.path(:index)
    end
  end

  routes do
    match :import, on: :collection, via: %i[get post]
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
