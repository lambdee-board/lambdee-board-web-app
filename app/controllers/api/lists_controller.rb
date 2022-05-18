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
  def show; end

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

  # Use callbacks to share common setup or constraints between actions.
  def set_list
    @list = ::DB::List.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def list_params
    params.require(:list).permit(:name, :pos, :deleted, :board_id)
  end
end
