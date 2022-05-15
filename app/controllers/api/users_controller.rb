# frozen_string_literal: true

# Controller which provides a full CRUD for users
# through the JSON API.
class API::UsersController < ::APIController
  before_action :set_user, only: %i[show edit update destroy]

  # GET /api/users or /api/users.json
  def index
    @users = ::DB::User.all
  end

  # GET /api/users/1 or /api/users/1.json
  def show; end

  # POST /api/users or /api/users.json
  def create
    @user = ::DB::User.new(user_params)
    return render :show, status: :created, location: api_user_url(@user) if @user.save

    render json: @user.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /api/users/1 or /api/users/1.json
  def update
    return render :show, status: :ok, location: api_user_url(@user) if @user.update(user_params)

    render json: @user.errors, status: :unprocessable_entity
  end

  # DELETE /api/users/1 or /api/users/1.json
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
    params.require(:user).permit(:name, :email)
  end
end
