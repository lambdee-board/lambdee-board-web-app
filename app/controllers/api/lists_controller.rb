# frozen_string_literal: true

# Controller which provides a full CRUD for lists
# through the JSON API.
class API::ListsController < ::APIController
  before_action :set_list, only: %i[show update destroy]

  # GET /lists or GET /lists.json
  def index
    @lists = ::DB::List.all
  end

  # GET /lists/1 or GET /lists/1.json
  def show
    if params[:tasks]
      set_list_with_tasks
    else
      set_list
    end

    return render :show_with_tasks if @with_tasks
  end

  # POST /lists or POST /lists.json
  def create
    @list = ::DB::List.new(list_params)
    return render :show, status: :created, location: api_list_url(@list) if @list.save

    render json: @list.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /lists/1 or PATCH/PUT /lists/1.json
  def update
    return render :show, status: :ok, location: api_list_url(@list) if @list.update(list_params)

    render json: @list.errors, status: :unprocessable_entity
  end

  # DELETE /lists/1 or DELETE /lists/1.json
  def destroy
    @list.archive!
  end

  private

  # @return [void]
  def set_list_with_tasks
    @with_tasks = true

    case params[:tasks].to_s
    when 'visible'
      @list = ::DB::List.find_with_visible_tasks(params[:id])
    when 'all'
      @list = ::DB::List.find_with_all_tasks(params[:id])
    when 'archived'
      @list = ::DB::List.find_with_archived_tasks(params[:id])
    else
      @with_tasks = false
      set_list
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
