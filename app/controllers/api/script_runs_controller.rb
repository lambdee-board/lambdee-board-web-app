# frozen_string_literal: true

class ::API::ScriptRunsController < ::APIController
  before_action :set_script_run, only: %i[show update destroy]
  authorize_resource only: %i[show update]
  has_scope :page, :per

  # GET /api/script_runs or /api/scripts/1/script_runs
  def index
    filters = ::FilterParameters::Universal.new(params)
    return render json: filters.errors, status: :unprocessable_entity unless filters.valid?(params)

    @script_runs = if params[:script_id]
                     ::DB::Script.find(params[:script_id]).script_runs
                   else
                     ::DB::ScriptRun.all
                   end
    @script_runs = apply_scopes(@script_runs.accessible_by(current_ability))
    @script_runs = @script_runs.includes(:script)
  end

  # GET /api/script_runs/1
  def show; end

  # PATCH/PUT /api/script_runs/1
  def update
    return render :show, status: :ok if @script_run.update(script_run_params)

    render json: @script_run.errors, status: :unprocessable_entity
  end

  private

  def set_script_run
    @script_run = ::DB::ScriptRun.find(params[:id])
  end

  def script_run_params
    params.require(:script_run).permit(:output, :state)
  end
end
