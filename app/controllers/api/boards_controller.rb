# frozen_string_literal: true

# Controller which provides a full CRUD for boards
# through the JSON API.
class API::BoardsController < ::APIController
  before_action :set_board, only: %i[update show destroy user_tasks ui_script_triggers]
  after_action :set_last_viewed_board_for_user, only: %i[show create]
  authorize_resource only: %i[show update destroy]

  # GET /api/boards
  def index
    @boards = ::DB::Board.all.accessible_by(current_ability)
    @boards = @boards.limit(limit) if limit?
  end

  # GET api/boards/1
  def show
    set_lists_scope if params[:lists]

    return render :show_with_lists, locals: { lists_scope: @lists_scope } if @lists_scope
  end

  # GET api/boards/1/user_tasks
  def user_tasks; end

  # POST /api/boards
  def create
    @board = ::DB::Board.new(board_params)
    authorize! :create, @board
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
    @boards =
      if current_user
        ::DB::Board.with_deleted.includes(:workspace).find(current_user.recent_boards)
      else
        []
      end
    render :recently_viewed
  end

  # GET api/boards/:id/ui_script_triggers
  def ui_script_triggers
    authorize! :read, @board
    @ui_script_triggers = ::DB::UiScriptTrigger.regarding_record_and_user(@board, current_user)
    render 'api/ui_script_triggers/index'
  end

  private

  # @return [void]
  def set_lists_scope
    @lists_scope = {
      'visible' => :visible_lists,
      'invisible' => :invisible_lists,
      'non-archived' => :lists,
      'all' => :lists_including_deleted,
      'archived' => :deleted_lists
    }[params[:lists].to_s]
  end

  # @return [DB::Board]
  def set_board
    @board = ::DB::Board.with_deleted.find(params[:id])
  end

  # @return [Hash{Symbol => Object}]
  def board_params
    params.require(:board).permit(:name, :colour, :workspace_id)
  end

  def set_last_viewed_board_for_user
    current_user&.update_last_viewed_board(@board)
  end
end
