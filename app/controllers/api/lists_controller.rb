# frozen_string_literal: true

# Controller which provides a full CRUD for lists
# through the JSON API.
class API::ListsController < ::APIController
  before_action :set_list, only: %i[update destroy]

  # GET api/lists
  def index
    @lists = ::DB::List.all
  end

  # GET api/lists/1
  def show
    set_list_and_tasks_scope

    return render :show_with_tasks, locals: { tasks: @tasks_scope } if @tasks_scope
  end

  # POST api/lists
  def create
    @list = ::DB::List.new(list_params)
    return render :show, status: :created, location: api_list_url(@list) if @list.save

    render json: @list.errors, status: :unprocessable_entity
  end

  # PATCH/PUT api/lists/1
  def update
    return render :show, status: :ok, location: api_list_url(@list) if @list.update(list_params)

    render json: @list.errors, status: :unprocessable_entity
  end

  # DELETE api/lists/1
  def destroy
    @list.destroy
  end

  private

  # @return [void]
  def set_list_and_tasks_scope
    @list, @tasks_scope = case params[:tasks].to_s
                          when 'visible'
                            [::DB::List.find_with_tasks(params[:id]), :tasks]
                          when 'all'
                            [::DB::List.find_with_tasks_including_deleted(params[:id]), :tasks_including_deleted]
                          when 'archived'
                            [::DB::List.find_with_deleted_tasks(params[:id]), :deleted_tasks]
                          else
                            [set_list, nil]
                          end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_list
    @list = ::DB::List.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def list_params
    params.require(:list).permit(:name, :pos, :deleted, :board_id)
  end
end
