class ScriptRunsController < ApplicationController
  before_action :set_script_run, only: %i[ show update destroy ]

  # GET /script_runs
  # GET /script_runs.json
  def index
    @script_runs = ScriptRun.all
  end

  # GET /script_runs/1
  # GET /script_runs/1.json
  def show
  end

  # POST /script_runs
  # POST /script_runs.json
  def create
    @script_run = ScriptRun.new(script_run_params)

    if @script_run.save
      render :show, status: :created, location: @script_run
    else
      render json: @script_run.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /script_runs/1
  # PATCH/PUT /script_runs/1.json
  def update
    if @script_run.update(script_run_params)
      render :show, status: :ok, location: @script_run
    else
      render json: @script_run.errors, status: :unprocessable_entity
    end
  end

  # DELETE /script_runs/1
  # DELETE /script_runs/1.json
  def destroy
    @script_run.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_script_run
      @script_run = ScriptRun.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def script_run_params
      params.require(:script_run).permit(:script_id, :output, :initiator_id)
    end
end
