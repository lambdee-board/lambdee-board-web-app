# frozen_string_literal: true

class ::API::ScriptRunsController < ::APIController
  before_action :set_script_run, only: %i[show update destroy]

  # GET /api/script_runs or /api/scripts/1/script_runs
  def index
    @script_runs = if params[:script_id]
                     ::DB::Script.find(params[:script_id]).script_runs
                   else
                     ::DB::ScriptRun.all
                   end
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
