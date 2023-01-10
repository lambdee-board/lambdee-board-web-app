# frozen_string_literal: true

class ::API::UiScriptTriggersController < ::APIController
  before_action :set_ui_script_trigger, only: %i[show update destroy]

  # GET /api/ui_script_triggers/1
  def show; end

  # POST /api/ui_script_triggers
  def create
    @ui_script_trigger = ::DB::UiScriptTrigger.new(ui_script_trigger_params)
    return render :show, status: :created if @ui_script_trigger.save

    render json: @ui_script_trigger.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/ui_script_triggers/1
  def update
    return render :show, status: :ok if @ui_script_trigger.update(ui_script_trigger_params)

    render json: @ui_script_trigger.errors, status: :unprocessable_entity
  end

  # DELETE /api/ui_script_triggers/1
  def destroy
    @ui_script_trigger.destroy
  end

  private

  def set_ui_script_trigger
    @ui_script_trigger = ::DB::UiScriptTrigger.find(params[:id])
  end

  def ui_script_trigger_params
    params.require(:ui_script_trigger).permit(:script_id, :subject_type, :subject_id, :scope_type, :scope_id)
  end
end
