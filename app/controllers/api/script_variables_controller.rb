# frozen_string_literal: true

class ::API::ScriptVariablesController < ::APIController
  before_action :set_script_variable, only: %i[update destroy]
  has_scope :page, :per

  # GET /api/script_variables
  def index
    authorize! :read, ::DB::ScriptVariable

    filters = ::FilterParameters::Universal.new(params)
    return render json: filters.errors, status: :unprocessable_entity unless filters.valid?(params)

    @script_variables = apply_scopes(::DB::ScriptVariable.all)
  end

  # GET /api/script_variables/1
  def show
    authorize! :read, ::DB::ScriptVariable
    @script_variable =
      if params[:by_name]
        ::DB::ScriptVariable.find_by!(name: params[:id])
      else
        ::DB::ScriptVariable.find(params[:id])
      end

    @decrypt = can?(:decrypt, ::DB::ScriptVariable) && params[:decrypt]
  end

  # POST /api/script_variables
  def create
    authorize! :create, ::DB::ScriptVariable

    @script_variable = ::DB::ScriptVariable.new(script_variable_params)
    return render :show, status: :created if @script_variable.save

    render json: @script_variable.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/script_variables/1
  def update
    authorize! :update, ::DB::ScriptVariable

    return render :show, status: :ok if @script_variable.update(script_variable_params)

    render json: @script_variable.errors, status: :unprocessable_entity
  end

  # DELETE /api/script_variables/1
  def destroy
    authorize! :destroy, ::DB::ScriptVariable

    @script_variable.destroy
  end

  private

  def set_script_variable
    @script_variable = ::DB::ScriptVariable.find(params[:id])
  end

  def script_variable_params
    params.require(:script_variable).permit(:name, :value, :owner_id, :owner_type, :description)
  end
end
