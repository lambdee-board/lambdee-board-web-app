# frozen_string_literal: true

# Controller which provides a full CRUD for tasks
# through the JSON API.
class API::TasksController < ::APIController
  before_action :set_task, only: %i[show update destroy attach_tag detach_tag]

  # GET api/tasks
  def index
    @tasks = ::DB::Task.all
  end

  # GET api/tasks/1
  def show; end

  # POST api/tasks
  def create
    @task = ::DB::Task.new(task_params)
    return render :show, status: :created, location: api_task_url(@task) if @task.save

    render json: @task.errors, status: :unprocessable_entity
  end

  # PATCH/PUT api/tasks/1
  def update
    return render :show, status: :ok, location: api_task_url(@task) if @task.update(task_params)

    render json: @task.errors, status: :unprocessable_entity
  end

  # DELETE api/tasks/1
  def destroy
    @task.destroy
  end

  # POST api/tasks/:task_id/attach_tag
  def attach_tag
    @task.tags << ::DB::Tag.find(params[:tag_id])
    head :no_content
  end

  # POST api/tasks/:task_id/detach_tag
  def detach_tag
    @task.tags.delete(params[:tag_id])
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_task
    @task = ::DB::Task.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def task_params
    params.require(:task).permit(:name, :pos, :description, :priority, :points, :list_id, :author_id)
  end
end
