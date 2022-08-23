# frozen_string_literal: true

# Controller which provides a full CRUD for boards
# through the JSON API.
class API::BoardsController < ::APIController
  before_action :set_board, only: %i[update show destroy]
  after_action :set_last_viewed_board_for_user, only: %i[show create]

  # GET /api/boards
  def index
    @boards = ::DB::Board.all
    @boards = @boards.limit(limit) if limit?
  end

  # GET api/boards/1
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

  # GET /api/boards/recently_viewed
  def recently_viewed
    @boards = ::DB::Board.with_deleted.includes(:workspace).find(current_user.recent_boards)
    render :index
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

  # @return [DB::Board]
  def set_board
    @board = ::DB::Board.find(params[:id])
  end

  # @return [Hash{Symbol => Object}]
  def board_params
    params.require(:board).permit(:name, :colour, :workspace_id)
  end

  def set_last_viewed_board_for_user
    current_user.update_last_viewed_board(@board)
  end
end
