# frozen_string_literal: true

class ::API::ScriptsController < ::ApplicationController
  before_action :set_script, only: %i[show update destroy]

  # GET /scripts
  def index
    @scripts = ::DB::Script.all
  end

  # GET /scripts/1
  def show
    @script.includes(:callback_scripts, :ui_scripts)
  end

  # POST /scripts
  def create
    @script = ::DB::Script.new(script_params)
    @script.author = current_user
    return render :show, status: :created if @script.save

    render json: @script.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /scripts/1
  def update
    return render :show, status: :ok if @sprint.update(script_params)

    render json: @script.errors, status: :unprocessable_entity
  end

  # DELETE /scripts/1
  def destroy
    @script.destroy
  end

  private

  def set_script
    @script = ::DB::Script.find(params[:id])
  end

  def script_params
    params.require(:script).permit(:content, :name, :description, callback_scripts_attributes: %i[subject_type subject_id action])
  end
end
