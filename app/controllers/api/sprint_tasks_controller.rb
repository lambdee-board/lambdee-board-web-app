# frozen_string_literal: true

# Controller which provides a full CRUD for sprint tasks
# through the JSON API.
class API::SprintTasksController < ApplicationController
  before_action :set_sprint_tasks, only: %i[show update destroy]

  # GET /api/sprint_tasks
  def index
    @sprint_tasks = ::DB::SprintTask.all
  end

  # GET /api/sprint_tasks/1
  def show; end

  # POST /api/sprint_tasks
  def create
    @sprint_tasks = ::DB::SprintTask.new(sprint_tasks_params)

    return  render :show, status: :created, location: api_sprint_tasks_url(@sprint_tasks) if @sprint_tasks.save

    render json: @sprint_tasks.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprint_tasks/1
  def update
    return render :show, status: :ok, location: api_sprint_tasks_url(@sprint_tasks) if @sprint_tasks.update(sprint_tasks_params)

    render json: @sprint_tasks.errors, status: :unprocessable_entity
  end

  # DELETE /api/sprint_tasks/1
  def destroy
    @sprint_tasks.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sprint_tasks
    @sprint_tasks = ::DB::SprintTask.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def sprint_tasks_params
    params.require(:sprint_tasks).permit(:task_id, :sprint_id, :data)
  end
end
