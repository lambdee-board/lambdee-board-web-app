# frozen_string_literal: true

# Controller which provides a full CRUD for tasks
# through the JSON API.
class API::TasksController < ::APIController
  before_action :set_task, only: %i[update destroy attach_tag detach_tag assign_user unassign_user add_time ui_script_triggers]
  authorize_resource only: %i[update destroy]

  # GET api/tasks
  def index
    @tasks = if params[:list_id]
               ::DB::Task.for_list(params[:list_id])
             else
               ::DB::Task.all
             end
    @tasks = @tasks.accessible_by(current_ability)
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
    authorize! :show, @task
  end

  # POST api/tasks
  def create
    @task = ::DB::Task.new(task_params)
    authorize! :create, @task
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
    authorize! :update, @task
    @task.tags << ::DB::Tag.find(params[:tag_id])
    head :no_content
  end

  # POST api/tasks/:task_id/detach_tag
  def detach_tag
    authorize! :update, @task
    @task.tags.delete(params[:tag_id])
    head :no_content
  end

  # POST api/tasks/:task_id/assign_user
  def assign_user
    authorize! :update, @task
    @task.users << ::DB::User.find(params[:user_id])
    head :no_content
  end

  # POST api/tasks/:task_id/unassign_user
  def unassign_user
    authorize! :update, @task
    @task.users.delete(params[:user_id])
    head :no_content
  end

  # GET api/tasks/:id/ui_script_triggers
  def ui_script_triggers
    authorize! :read, @task
    @ui_script_triggers = ::DB::UiScriptTrigger.regarding_record_and_user(@task, current_user)
    render 'api/ui_script_triggers/index'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_task
    @task = ::DB::Task.with_deleted.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def task_params
    params.require(:task).permit(:name, :pos, :description, :spent_time, :priority, :points, :due_time, :list_id, :author_id)
  end
end
