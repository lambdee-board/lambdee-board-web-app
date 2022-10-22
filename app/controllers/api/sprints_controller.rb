# frozen_string_literal: true

# Controller which provides a full CRUD for sprints
# through the JSON API.
class API::SprintsController < ::APIController
  before_action :set_sprint, only: %i[show update destroy end]

  # GET /api/sprints
  def index
    @sprints = DB::Sprint.all
  end

  # GET /api/sprints/1
  def show; end

  # POST /api/sprints
  def create
    @sprint = DB::Sprint.new(sprint_params)
    sprint_service = SprintManagementService.new(@sprint, params[:board_id])
    return render :show, status: :created, location: api_sprint_url(@sprint) if @sprint.save && sprint_service.create

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprints/1
  def update
    return render :show, status: :ok, location: api_sprint_url(@sprint) if @sprint.update(sprint_params)

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprints/1/end
  def end
    sprint_service = SprintManagementService.new(@sprint)
    return render :show, status: :ok, location: api_sprint_url(@sprint) if sprint_service.end

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # DELETE /api/sprints/1
  def destroy
    @sprint.destroy
  end

  private

  # @return [DB:Sprint]
  def set_sprint
    @sprint = DB::Sprint.find(params[:id])
  end

  # @return [Hash{Symbol => Object}]
  def sprint_params
    params.require(:sprint).permit(:name, :start_date, :due_date, :board_id)
  end
end
