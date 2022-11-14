# frozen_string_literal: true

class ::API::ScriptsController < ::ApplicationController
  before_action :set_script, only: %i[show update destroy]

  # GET /api/scripts
  def index
    @scripts = ::DB::Script.all
  end

  # GET /api/scripts/1
  def show; end

  # POST /api/scripts
  def create
    @script = ::DB::Script.new(script_params)
    @script.author = current_user
    return render :show, status: :created if @script.save

    render json: @script.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/scripts/1
  def update
    return render :show, status: :ok if @script.update(script_params)

    render json: @script.errors, status: :unprocessable_entity
  end

  # DELETE /api/scripts/1
  def destroy
    @script.destroy
  end

  private

  def set_script
    @script = ::DB::Script.find(params[:id])
  end

  def script_params
    params.require(:script).permit(:content, :name, :description, callback_scripts_attributes: %i[id subject_type subject_id action _destroy])
  end
end
