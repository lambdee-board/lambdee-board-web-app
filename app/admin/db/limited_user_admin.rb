# frozen_string_literal: true

::Trestle.resource(:limited_user, model: ::DB::User, scope: DB) do
  remove_action :destroy

  table do
    instance_eval(&::TrestleConcerns::User::COLUMNS)

    actions align: :center, header: 'Remove from WS' do |toolbar, user|
      toolbar.link 'Remove', user, admin: ::DB::LimitedUserAdmin, action: :remove_from_workspace, method: :post, style: :danger, params: { workspace_id: params[:id] }
    end
  end

  form dialog: true, &::TrestleConcerns::User::FORM

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
