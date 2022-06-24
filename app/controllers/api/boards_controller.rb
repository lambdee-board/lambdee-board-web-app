# frozen_string_literal: true

# Controller which provides a full CRUD for boards
# through the JSON API.
class API::BoardsController < ::APIController
  before_action :set_board, only: %i[update show destroy]

  # GET /api/boards
  def index
    @boards = ::DB::Board.all
    @boards = @boards.limit(limit) if limit?
  end

  def show
    set_lists_scope if params[:lists]

    return render :show_with_lists, locals: { lists_scope: @lists_scope } if @lists_scope
  end

  # POST /api/boards
  def create
    @board = ::DB::Board.new(board_params)
    return render :show, status: :created, location: api_board_url(@board) if @board.save

    render json: @board.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/boards/1
  def update
    return render :show, status: :ok, location: api_board_url(@board) if @board.update(board_params)

    render json: @board.errors, status: :unprocessable_entity
  end

  # DELETE /api/boards/1
  def destroy
    @board.destroy
  end

  private

  # @return [void]
  def set_lists_scope
    @lists_scope = {
      'visible' => :lists,
      'all' => :lists_including_deleted,
      'archived' => :deleted_lists
    }[params[:lists].to_s]
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
