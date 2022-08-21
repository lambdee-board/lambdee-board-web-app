# frozen_string_literal: true

::Trestle.resource(:add_user, model: ::DB::User, scope: ::DB) do
  remove_action :destroy

  collection do
    model.includes(:user_workspaces, :workspaces)
  end

  table do
    instance_eval(&::TrestleConcerns::User::COLUMNS)

    actions align: :center, header: 'Add to WS' do |toolbar, user|
      toolbar.link 'Add', user, admin: ::DB::AddUserAdmin, action: :add_to_workspace, method: :post, style: :success, params: { workspace_id: params[:id] }
    end
  end

  form dialog: true, &::TrestleConcerns::User::FORM

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
