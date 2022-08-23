# frozen_string_literal: true

# Controller which provides a full CRUD for users
# through the JSON API.
class API::UsersController < ::APIController
  skip_before_action :authorize_user!, only: %i[create]
  before_action :set_user, only: %i[show edit update destroy]
  has_scope :role, :workspace_id, :search, :page, :per, :limit, :created_at_from, :created_at_to

  # GET /api/users
  # GET /api/workspaces/:workspace_id/users
  def index
    filter_parameters = ::FilterParameters.new(params)
    if filter_parameters.validate
      @users = apply_scopes(::DB::User).all
    else
      render json: filter_parameters.errors, status: :unprocessable_entity
    end
  end

  # GET /api/users/1
  def show; end

  def current
    @user = current_user
    render :show, status: :ok
  end

  # POST /api/users
  def create
    @user = ::DB::User.new(user_params)
    return render :show, status: :created, location: api_user_url(@user) if @user.save

    render json: @user.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/users/1
  def update
    return render :show, status: :ok, location: api_user_url(@user) if @user.update(user_params)

    render json: @user.errors, status: :unprocessable_entity
  end

  # DELETE /api/users/1
  def destroy
    @user.destroy
  end

  private

  def set_user
    @user = ::DB::User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :role, :password, :password_confirmation)
  end
end
