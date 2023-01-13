# frozen_string_literal: true

# Controller which provides a full CRUD for users
# through the JSON API.
class API::UsersController < ::APIController
  before_action :set_user, only: :show
  has_scope :role, :workspace_id, :search, :page, :per, :limit, :created_at_from, :created_at_to
  has_scope :role_collection, type: :array

  skip_before_action :authenticate_user!, only: %i[send_reset_password valid_reset_password reset_password]

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

  # POST /api/users/send_reset_password
  def send_reset_password
    @user =
      if params[:email]
        ::DB::User.find_by(email: params[:email])
      else
        authenticate_user!
        current_user
      end

    return head :not_found if @user.nil?

    token = @user.__send__(:set_reset_password_token)
    ::AccountMailer.with(token:, user: @user).reset_password_email.deliver_now

    render :show, status: :ok
  end

  # GET /api/users/valid_reset_password
  def valid_reset_password
    hashed_token = ::Devise.token_generator.digest(
      ::DB::User,
      :reset_password_token,
      params[:reset_password_token]
    )

    @user = ::DB::User.find_by!(reset_password_token: hashed_token)
    render json: { valid: true }, status: :ok
  end

  # POST /api/users/reset_password
  def reset_password
    hashed_token = ::Devise.token_generator.digest(
      ::DB::User,
      :reset_password_token,
      params[:reset_password_token]
    )

    @user = ::DB::User.find_by!(reset_password_token: hashed_token)

    if @user.reset_password(params[:password], params[:password_confirmation])
      render :'api/users/show'
    else
      render json: { password: ['is invalid'] }, status: 422
    end
  end

  private

  def set_user
    @user = ::DB::User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :role, :password, :password_confirmation)
  end
end
