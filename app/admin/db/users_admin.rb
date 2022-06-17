# frozen_string_literal: true

Trestle.resource(:users, scope: DB) do
  instance_eval(&::TrestleConcerns::Archiver::ENDPOINTS)

  menu do
    item :users, icon: 'fa fa-users'
  end

  table do
    instance_eval(&TrestleConcerns::User::COLUMNS)

    actions align: :center do |toolbar, user|
      toolbar.link 'Deactivate', user, admin: admin, action: :deactivate, method: :post, style: :danger if user.active? && user != current_user
      toolbar.link 'Activate', user, admin: admin, action: :activate, method: :post, style: :success if user.deactivated?
    end
  end

  form dialog: true, &TrestleConcerns::User::FORM

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
