# frozen_string_literal: true

# Controller which provides a full CRUD for users
# through the JSON API.
class API::UsersController < ::APIController
  before_action :set_user, only: :show
  has_scope :role, :workspace_id, :search, :page, :per, :limit, :created_at_from, :created_at_to
  has_scope :role_collection, type: :array

  # GET /api/users
  # GET /api/workspaces/:workspace_id/users
  def index
    filters = ::FilterParameters::Universal.new(params)
    if filters.valid?(params)
      @users = apply_scopes(::DB::User).all
    else
      render json: filters.errors, status: :unprocessable_entity
    end
  end

  # GET /api/users/1
  def show; end

  # PATCH/PUT /api/users/1
  def update
    head :forbidden
  end

  # DELETE /api/users
  def destroy
    head :forbidden
  end

  # GET /api/users/current
  def current
    @user = current_user
    return head :no_content if current_user.nil?

    render :show, status: :ok
  end

  private

  def set_user
    @user = ::DB::User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :role, :password, :password_confirmation)
  end
end
