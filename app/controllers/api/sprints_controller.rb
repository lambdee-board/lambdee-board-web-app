# frozen_string_literal: true

# Controller which provides a full CRUD for sprints
# through the JSON API.
class API::SprintsController < ::APIController
  before_action :set_sprint, only: %i[show update destroy end burn_up_chart]
  has_scope :page, :per
  authorize_resource only: %i[show update destroy]

  # GET /api/sprints or GET /api/boards/1/sprints
  def index
    filters = ::FilterParameters::Universal.new(params)
    return render json: filters.errors, status: :unprocessable_entity unless filters.valid?(params)

    @sprints = if params[:board_id]
                 ::DB::Board.find(params[:board_id]).sprints
               else
                 ::DB::Sprint.all
               end
    @sprints = apply_scopes(@sprints.accessible_by(current_ability))
  end

  # GET /api/sprints/1
  def show
    render :show, locals: { tasks: params[:tasks] }
  end

  # POST /api/sprints
  def create
    @sprint = ::DB::Sprint.new(sprint_params)
    authorize! :create, @sprint
    return render :show, status: :created, location: api_sprint_url(@sprint) if @sprint.save

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprints/1
  def update
    return render :show, status: :ok, location: api_sprint_url(@sprint) if @sprint.update(sprint_params)

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/sprints/1/end
  def end
    authorize! :update, @sprint
    return render :show, status: :ok, location: api_sprint_url(@sprint) if @sprint.end

    render json: @sprint.errors, status: :unprocessable_entity
  end

  # DELETE /api/sprints/1
  def destroy
    @sprint.destroy
  end

  # GET /api/boards/1/active_sprint
  def active_sprint
    @sprint = ::DB::Board.find(params[:id]).active_sprint
    if @sprint
      authorize! :read, @sprint
      render :show
    else
      head :not_found
    end
  end

  # GET /api/sprints/1/burn_up_chart
  def burn_up_chart
    authorize! :read, @sprint
    render json: @sprint.burn_up_chart_data
  end

  private

  # @return [DB::Sprint]
  def set_sprint
    @sprint = ::DB::Sprint.find(params[:id])
  end

  # @return [Hash{Symbol => Object}]
  def sprint_params
    params.require(:sprint).permit(:name, :description, :started_at, :expected_end_at, :board_id)
  end
end
