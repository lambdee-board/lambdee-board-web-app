# frozen_string_literal: true

# Controller which provides a full CRUD for workspaces
# through the JSON API.
class API::WorkspacesController < ::APIController
  before_action :set_workspace, only: %i[show update destroy assign_user unassign_user]

  # GET /api/workspaces
  def index
    # @todo User should not see all workspaces!
    @workspaces = ::DB::Workspace.all

    @workspaces = @workspaces.limit(limit) if limit?
  end

  # GET /api/workspaces/1
  def show; end

  # POST /api/workspaces
  def create
    @workspace = ::DB::Workspace.new(workspace_params)
    return render :show, status: :created, location: api_workspace_url(@workspace) if @workspace.save

    render json: @workspace.errors, status: :unprocessable_entity
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
    @workspace.users << ::DB::User.find(params[:user_id])
    head :no_content
  end

  # POST api/workspaces/:id/unassign_user
  def unassign_user
    @workspace.users.delete(params[:user_id])
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_workspace
    @workspace = ::DB::Workspace.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def workspace_params
    params.require(:workspace).permit(:name)
  end
end
