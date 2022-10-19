class API::SprintTasksController < ApplicationController
  before_action :set_sprint_tasks, only: %i[ show update destroy ]

  # GET /api/sprint_tasks
  # GET /api/sprint_tasks.json
  def index
    @sprint_tasks = DB::SprintTask.all
  end

  # GET /api/sprint_tasks/1
  # GET /api/sprint_tasks/1.json
  def show
  end

  # POST /api/sprint_tasks
  # POST /api/sprint_tasks.json
  def create
    @sprint_tasks = DB::SprintTask.new(sprint_tasks_params)

    if @sprint_tasks.save
      render :show, status: :created, location: @sprint_tasks
    else
      render json: @sprint_tasks.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/sprint_tasks/1
  # PATCH/PUT /api/sprint_tasks/1.json
  def update
    if @sprint_tasks.update(sprint_tasks_params)
      render :show, status: :ok, location: @sprint_tasks
    else
      render json: @sprint_tasks.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/sprint_tasks/1
  # DELETE /api/sprint_tasks/1.json
  def destroy
    @sprint_tasks.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_sprint_tasks
    @sprint_tasks = DB::SprintTask.find(params[:id])
  end

# Only allow a list of trusted parameters through.
  def sprint_tasks_params
    params.require(:sprint_tasks).permit(:task_id, :sprint_id, :data)
  end
end
