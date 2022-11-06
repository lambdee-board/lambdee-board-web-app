class CallbackScriptsController < ApplicationController
  before_action :set_callback_script, only: %i[ show update destroy ]

  # GET /callback_scripts
  # GET /callback_scripts.json
  def index
    @callback_scripts = CallbackScript.all
  end

  # GET /callback_scripts/1
  # GET /callback_scripts/1.json
  def show
  end

  # POST /callback_scripts
  # POST /callback_scripts.json
  def create
    @callback_script = CallbackScript.new(callback_script_params)

    if @callback_script.save
      render :show, status: :created, location: @callback_script
    else
      render json: @callback_script.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /callback_scripts/1
  # PATCH/PUT /callback_scripts/1.json
  def update
    if @callback_script.update(callback_script_params)
      render :show, status: :ok, location: @callback_script
    else
      render json: @callback_script.errors, status: :unprocessable_entity
    end
  end

  # DELETE /callback_scripts/1
  # DELETE /callback_scripts/1.json
  def destroy
    @callback_script.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_callback_script
      @callback_script = CallbackScript.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def callback_script_params
      params.require(:callback_script).permit(:script_id, :subject_type, :subject_id, :action)
    end
end
