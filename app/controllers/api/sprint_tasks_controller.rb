# frozen_string_literal: true

# Controller which provides a full CRUD for sprint tasks
# through the JSON API.
class API::SprintTasksController < ApplicationController
  before_action :check_for_admin_privileges
  before_action :set_sprint_tasks, only: %i[show update destroy]

  # GET /api/sprint_tasks or GET /api/sprint/1/tasks
  def index
    @sprint_tasks = if params[:sprint_id]
                      ::DB::Sprint.find(params[:sprint_id]).sprint_tasks
                    else
                      ::DB::SprintTask.all
                    end

    @sprint_tasks = @sprint_tasks.accessible_by(current_ability)
  end

  # GET /api/sprint_tasks/1
  def show; end

  # POST /api/sprint_tasks
  def create
    @sprint_task = ::DB::SprintTask.new(sprint_tasks_params)

    return  render :show, status: :created, location: api_sprint_tasks_url(@sprint_task) if @sprint_task.save

    render json: @sprint_task.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprint_tasks/1
  def update
    return render :show, status: :ok, location: api_sprint_tasks_url(@sprint_task) if @sprint_task.update(sprint_tasks_params)

    render json: @sprint_task.errors, status: :unprocessable_entity
  end

  # DELETE /api/sprint_tasks/1
  def destroy
    @sprint_task.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sprint_tasks
    @sprint_task = ::DB::SprintTask.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def sprint_tasks_params
    params.require(:sprint_tasks).permit(:task_id, :sprint_id, :added_at, :completed_at, :start_state, :state)
  end

  def check_for_admin_privileges
    head :unauthorized unless current_user&.admin?
  end
end
