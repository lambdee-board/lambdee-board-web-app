# frozen_string_literal: true

class ::API::ScriptsController < ::APIController
  before_action :set_script, only: %i[show update destroy]
  authorize_resource only: %i[show update destroy]

  has_scope :page, :per

  # GET /api/scripts
  def index
    filters = ::FilterParameters::Universal.new(params)
    return render json: filters.errors, status: :unprocessable_entity unless filters.valid?(params)

    @scripts = apply_scopes(::DB::Script.accessible_by(current_ability))
  end

  # GET /api/scripts/1
  def show; end

  # POST /api/scripts
  def create
    @script = ::DB::Script.new(script_params)
    @script.author = current_user
    authorize! :create, @script
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
    params.require(:script).permit(:content, :name, :description, script_triggers_attributes: %i[id subject_type subject_id action delay author_id _destroy])
  end
end
