# frozen_string_literal: true

# Controller which provides a full CRUD for boards
# through the JSON API.
class API::BoardsController < ::APIController
  before_action :set_board, only: %i[update destroy]

  # GET /api/boards
  # GET /api/boards.json
  def index
    @boards = ::DB::Board.all
    @boards = @boards.limit(limit) if limit?
  end

  # GET /api/boards/1
  # GET /api/boards/1.json
  def show
    case params[:tasks].to_s
    when 'visible'
      @board = ::DB::Board.find_with_visible_tasks(params[:id])
    when 'all'
      @board = ::DB::Board.find_with_all_tasks(params[:id])
    when 'archived'
      @board = ::DB::Board.find_with_archived_tasks(params[:id])
    else
      return set_board
    end

    render :show_with_tasks
  end

  # POST /api/boards
  # POST /api/boards.json
  def create
    @board = ::DB::Board.new(board_params)
    return render :show, status: :created, location: api_board_url(@board) if @board.save

    render json: @board.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/boards/1
  # PATCH/PUT /api/boards/1.json
  def update
    return render :show, status: :ok, location: api_board_url(@board) if @board.update(board_params)

    render json: @board.errors, status: :unprocessable_entity
  end

  # DELETE /api/boards/1
  # DELETE /api/boards/1.json
  def destroy
    @board.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_board
    @board = ::DB::Board.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def board_params
    params.require(:board).permit(:name, :workspace_id)
  end
end
