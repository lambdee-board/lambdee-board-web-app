# frozen_string_literal: true

class ::API::ScriptRunsController < ::ApplicationController
  before_action :set_script_run, only: %i[show destroy]

  # GET /script_runs
  # GET /script_runs.json
  def index
    @script_runs = ::DB::ScriptRun.all
  end

  # GET /script_runs/1
  def show; end

  # POST /script_runs
  def create
    @script = ::DB::ScriptRun.new(script_run_params)
    return render :show, status: :created, location: api_script_run_url(@script_run) if @script_run.save

    render json: @script_run.errors, status: :unprocessable_entity
  end

  private

  def set_script_run
    @script_run = ::DB::ScriptRun.find(params[:id])
  end

  def script_run_params
    params.require(:script_run).permit(:script_id, :output, :initiator_id)
  end
end
