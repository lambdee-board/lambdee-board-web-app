# frozen_string_literal: true

# Controller which provides a full CRUD for workspaces
# through the JSON API.
class API::WorkspacesController < ::APIController
  before_action :set_workspace, only: %i[show update destroy assign_user unassign_user ui_script_triggers]
  authorize_resource only: %i[show update destroy]

  # GET /api/workspaces
  def index
    @workspaces = ::DB::Workspace.accessible_by(current_ability)
    @workspaces = @workspaces.limit(limit) if limit?
  end

  # GET /api/workspaces/1
  def show; end

  # POST /api/workspaces
  def create
    authorize! :create, ::DB::Workspace

    @workspace = ::DB::Workspace.new(workspace_params)
    if @workspace.save
      current_user.workspaces << @workspace if current_user
      render :show, status: :created, location: api_workspace_url(@workspace)
    else
      render json: @workspace.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/workspaces/1
  def update
    return render :show, status: :ok, location: api_workspace_url(@workspace) if @workspace.update(workspace_params)

    render json: @workspace.errors, status: :unprocessable_entity
  end

  # DELETE /api/workspaces/1
  def destroy
    @workspace.destroy
  end

  # POST api/workspaces/:id/assign_user
  def assign_user
    authorize! :update, @workspace
    @workspace.users << ::DB::User.find(params[:user_id])
    head :no_content
  end

  # POST api/workspaces/:id/unassign_user
  def unassign_user
    authorize! :update, @workspace
    @workspace.users.delete(params[:user_id])
    head :no_content
  end

  # GET api/workspaces/:id/ui_script_triggers
  def ui_script_triggers
    authorize! :read, @workspace
    @ui_script_triggers = ::DB::UiScriptTrigger.regarding_record_and_user(@workspace, current_user)
    render 'api/ui_script_triggers/index'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_workspace
    @workspace = ::DB::Workspace.with_deleted.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def workspace_params
    params.require(:workspace).permit(:name)
  end
end
