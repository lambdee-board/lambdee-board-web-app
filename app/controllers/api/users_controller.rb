# frozen_string_literal: true

# Controller which provides a full CRUD for users
# through the JSON API.
class API::UsersController < ::APIController
  skip_before_action :authorize_user!, only: %i[create]
  before_action :set_user, only: %i[show edit update destroy]

  # GET /api/users
  # GET /api/workspaces/:workspace_id/users
  def index
    if params[:workspace_id]
      @users = ::DB::Workspace.find(params[:workspace_id]).users
      return
    end

    @users = ::DB::User.all
    @users = @users.limit(limit) if limit?
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

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = ::DB::User.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:name, :email, :role, :password, :password_confirmation)
  end
end
