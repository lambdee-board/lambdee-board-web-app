# frozen_string_literal: true

class ::API::ScriptTriggersController < ::APIController
  before_action :set_script_trigger, only: %i[show update destroy]
  authorize_resource only: %i[show update destroy]

  # GET /api/script_triggers/1
  def show; end

  # POST /api/script_triggers
  def create
    @script_trigger = ::DB::ScriptTrigger.new(script_trigger_params)
    authorize! :create, @script_trigger
    return render :show, status: :created if @script_trigger.save

    render json: @script_trigger.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/script_triggers/1
  def update
    return render :show, status: :ok if @script_trigger.update(script_trigger_params)

    render json: @script_trigger.errors, status: :unprocessable_entity
  end

  # DELETE /api/script_triggers/1
  def destroy
    @script_trigger.destroy
  end

  private

  def set_script_trigger
    @script_trigger = ::DB::ScriptTrigger.find(params[:id])
  end

  def script_trigger_params
    params.require(:script_trigger).permit(:script_id, :subject_type, :subject_id, :action, :delay, :author_id)
  end
end
