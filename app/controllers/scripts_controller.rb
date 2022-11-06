class ScriptsController < ApplicationController
  before_action :set_script, only: %i[ show update destroy ]

  # GET /scripts
  # GET /scripts.json
  def index
    @scripts = Script.all
  end

  # GET /scripts/1
  # GET /scripts/1.json
  def show
  end

  # POST /scripts
  # POST /scripts.json
  def create
    @script = Script.new(script_params)

    if @script.save
      render :show, status: :created, location: @script
    else
      render json: @script.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scripts/1
  # PATCH/PUT /scripts/1.json
  def update
    if @script.update(script_params)
      render :show, status: :ok, location: @script
    else
      render json: @script.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scripts/1
  # DELETE /scripts/1.json
  def destroy
    @script.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_script
      @script = Script.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def script_params
      params.require(:script).permit(:content, :name, :description, :author_id)
    end
end
