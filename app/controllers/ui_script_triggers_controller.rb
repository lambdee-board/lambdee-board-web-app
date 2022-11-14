class UiScriptTriggersController < ApplicationController
  before_action :set_ui_script, only: %i[ show update destroy ]

  # GET /ui_scripts
  # GET /ui_scripts.json
  def index
    @ui_scripts = UiScript.all
  end

  # GET /ui_scripts/1
  # GET /ui_scripts/1.json
  def show
  end

  # POST /ui_scripts
  # POST /ui_scripts.json
  def create
    @ui_script = UiScript.new(ui_script_params)

    if @ui_script.save
      render :show, status: :created, location: @ui_script
    else
      render json: @ui_script.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /ui_scripts/1
  # PATCH/PUT /ui_scripts/1.json
  def update
    if @ui_script.update(ui_script_params)
      render :show, status: :ok, location: @ui_script
    else
      render json: @ui_script.errors, status: :unprocessable_entity
    end
  end

  # DELETE /ui_scripts/1
  # DELETE /ui_scripts/1.json
  def destroy
    @ui_script.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ui_script
      @ui_script = UiScript.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ui_script_params
      params.require(:ui_script).permit(:script_id, :subject_type, :subject_id, :scope_type, :scope_id)
    end
end
