# frozen_string_literal: true

# Controller which provides a full CRUD for sprints
# through the JSON API.
class API::SprintsController < ::APIController
  before_action :set_sprint, only: %i[show update destroy]

  # GET /api/sprints
  def index
    @sprints = DB::Sprint.all
  end

  # GET /api/sprints/1
  def show
  end

  # POST /api/sprints
  def create
    puts params
    @sprint = DB::Sprint.new(sprint_params)
    sprint_service = SprintManagementService.new(@sprint, params[:board_id])

    return render :show, status: :created, location: api_sprint_url(@sprint) if @sprint.save && sprint_service.create

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprints/1
  def update
    if @sprint.update(sprint_params)
      render :show, status: :ok, location: @sprint
    else
      render json: @sprint.errors, status: :unprocessable_entity
    end
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
