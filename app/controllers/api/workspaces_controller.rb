# frozen_string_literal: true

# Controller which provides a full CRUD for workspaces
# through the JSON API.
class API::WorkspacesController < ::APIController
  before_action :set_workspace, only: %i[show update destroy]

  # GET /api/workspaces
  # GET /api/workspaces.json
  def index
    @workspaces = if current_user.admin?
                    ::DB::Workspace.all
                  else
                    current_user.workspaces
                  end

    @workspaces = @workspaces.limit(limit) if limit?
  end

  # GET /api/workspaces/1
  # GET /api/workspaces/1.json
  def show; end

  # POST /api/workspaces
  # POST /api/workspaces.json
  def create
    @workspace = ::DB::Workspace.new(workspace_params)
    return render :show, status: :created, location: api_workspace_url(@workspace) if @workspace.save

    render json: @workspace.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/workspaces/1
  # PATCH/PUT /api/workspaces/1.json
  def update
    return render :show, status: :ok, location: api_workspace_url(@workspace) if @workspace.update(workspace_params)

    render json: @workspace.errors, status: :unprocessable_entity
  end

  # DELETE /api/workspaces/1
  # DELETE /api/workspaces/1.json
  def destroy
    @workspace.destroy
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
