class API::SprintsController < ApplicationController
  before_action :set_sprint, only: %i[ show update destroy ]

  # GET /api/sprints
  # GET /api/sprints.json
  def index
    @sprints = DB::Sprint.all
  end

  # GET /api/sprints/1
  # GET /api/sprints/1.json
  def show
  end

  # POST /api/sprints
  # POST /api/sprints.json
  def create
    @sprint = DB::Sprint.new(sprint_params)

    if @sprint.save
      render :show, status: :created, location: @sprint
    else
      render json: @sprint.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/sprints/1
  # PATCH/PUT /api/sprints/1.json
  def update
    if @sprint.update(sprint_params)
      render :show, status: :ok, location: @sprint
    else
      render json: @sprint.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/sprints/1
  # DELETE /api/sprints/1.json
  def destroy
    @sprint.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
  def set_sprint
    @sprint = DB::Sprint.find(params[:id])
  end

    # Only allow a list of trusted parameters through.
  def sprint_params
    params.require(:sprint).permit(:name, :start_date, :due_date, :end_date)
  end
end
