# frozen_string_literal: true

# Controller which provides a full CRUD for tasks
# through the JSON API.
class API::TasksController < ::APIController
  before_action :set_task, only: %i[show update destroy]

  # GET /tasks or GET /tasks.json
  def index
    @tasks = ::DB::Task.all
  end

  # GET /tasks/1 or GET /tasks/1.json
  def show; end

  # POST /tasks or POST /tasks.json
  def create
    @task = ::DB::Task.new(task_params)
    return render :show, status: :created, location: api_task_url(@task) if @task.save

    render json: @task.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /tasks/1 or PATCH/PUT /tasks/1.json
  def update
    return render :show, status: :ok, location: api_task_url(@task) if @task.update(task_params)

    render json: @task.errors, status: :unprocessable_entity
  end

  # DELETE /tasks/1 or DELETE /tasks/1.json
  def destroy
    @task.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_task
    @task = ::DB::Task.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def task_params
    params.require(:task).permit(:name, :pos, :description, :list_id)
  end
end
