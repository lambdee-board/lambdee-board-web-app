# frozen_string_literal: true

# Abstract controller class from which
# every single API controller inherits.
class APIController < ::ApplicationController
  skip_forgery_protection

  rescue_from ::ActiveRecord::RecordNotFound, with: :not_found

  before_action :authorize_user!

  helper_method :current_user

  protected

  def authorize_user!
    head(:unauthorized) unless user_signed_in?
  end

  # @return [Integer, nil]
  def limit
    @limit ||= params[:limit].to_i if limit?
  end

  # @return [Boolean]
  def limit?
    params[:limit] && params[:limit].to_i.to_s == params[:limit].to_s
  end

  # @return [DB::User]
  # @todo This should be fetched from a cookie or implemented by Devise
  def current_user
    @current_user ||= ::DB::User.first
  end

  # @return [Boolean]
  # @todo This should be fetched from a cookie or implemented by Devise
  def user_signed_in?
    current_user.present?
  end

  def not_found
    head :not_found
  end
end
