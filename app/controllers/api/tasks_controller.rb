# frozen_string_literal: true

# Controller which provides a full CRUD for tasks
# through the JSON API.
class API::TasksController < ::APIController
  before_action :set_task, only: %i[update destroy attach_tag detach_tag assign_user unassign_user add_time]

  # GET api/tasks
  def index
    @tasks = if params[:list_id]
               ::DB::Task.for_list(params[:list_id])
             else
               ::DB::Task.all
             end

    return unless params[:include_associations] == 'true'

    @tasks = @tasks.with_users_and_tags
    render :index_with_associations
  end

  # GET api/tasks/1
  def show
    case params[:include_associations]
    when 'true'
      @task = ::DB::Task.find_with_all_associations(params[:id])
      render :show_with_associations and return
    else
      set_task
    end
  end

  # POST api/tasks
  def create
    @task = ::DB::Task.new(task_params)
    return render :show, status: :created, location: api_task_url(@task) if @task.save

    render json: @task.errors, status: :unprocessable_entity
  end

  # PATCH/PUT api/tasks/1
  def update
    @task.new_task_state params[:list_id] if @task.board.active_sprint

    return render :show, status: :ok, location: api_task_url(@task) if @task.update(task_params)

    render json: @task.errors, status: :unprocessable_entity
  end

  # DELETE api/tasks/1
  def destroy
    @task.destroy
  end

  # PUT api/tasks/1/add_time
  def add_time
    set_task
    add_time = AddTaskTimeService.new(@task, params[:time], params[:unit])
    if add_time.valid? && add_time.save
      render :show, status: 200
    else
      render json: add_time.errors, status: :unprocessable_entity
    end
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

  # POST api/tasks/:task_id/assign_user
  def assign_user
    @task.users << ::DB::User.find(params[:user_id])
    head :no_content
  end

  # POST api/tasks/:task_id/unassign_user
  def unassign_user
    @task.users.delete(params[:user_id])
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_task
    @task = ::DB::Task.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def task_params
    params.require(:task).permit(:name, :pos, :description, :spent_time, :priority, :points, :list_id, :author_id)
  end
end
