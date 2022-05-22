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
    if params[:tasks]
      set_board_with_tasks
    elsif params[:lists]
      set_board_with_lists
    else
      set_board
    end

    return render :show_with_tasks if @with_tasks
    return render :show_with_lists if @with_lists
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

  # @return [void]
  def set_board_with_lists
    @with_lists = true

    case params[:lists].to_s
    when 'visible'
      @board = ::DB::Board.find_with_visible_lists(params[:id])
    when 'all'
      @board = ::DB::Board.find_with_all_lists(params[:id])
    when 'archived'
      @board = ::DB::Board.find_with_archived_lists(params[:id])
    else
      @with_lists = false
      set_board
    end
  end

  # @return [void]
  def set_board_with_tasks
    @with_tasks = true

    case params[:tasks].to_s
    when 'visible'
      @board = ::DB::Board.find_with_visible_tasks(params[:id])
    when 'all'
      @board = ::DB::Board.find_with_all_tasks(params[:id])
    when 'archived'
      @board = ::DB::Board.find_with_archived_tasks(params[:id])
    else
      @with_tasks = false
      set_board
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  #
  # @return [DB::Board]
  def set_board
    @board = ::DB::Board.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  #
  # @return [Hash{Symbol => Object}]
  def board_params
    params.require(:board).permit(:name, :colour, :workspace_id)
  end
end
