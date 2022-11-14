# frozen_string_literal: true

# Abstract controller class from which
# every single API controller inherits.
class APIController < ::ApplicationController
  skip_forgery_protection

  rescue_from ::ActiveRecord::RecordNotFound, with: :not_found

  before_action :authenticate_user!

  helper_method :current_user

  protected

  def authenticate_user!
    auth_scheme, auth_token = request.headers[:authorization]&.split(' ')
    return super unless script_service_authenticated?(auth_scheme, auth_token)

    @current_ability = ::Ability.new(:god)
  end

  # @param auth_scheme [String, nil]
  # @param auth_token [String, nil]
  # @return [Boolean]
  def script_service_authenticated?(auth_scheme, auth_token)
    auth_scheme == 'ScriptService' &&
      auth_token == ::Config::ENV_SETTINGS['script_service_secret'] &&
      %w[localhost rails].include?(request.host)
  end

  # @return [Integer, nil]
  def limit
    @limit ||= params[:limit].to_i if limit?
  end

  # @return [Boolean]
  def limit?
    params[:limit] && params[:limit].to_i.to_s == params[:limit].to_s
  end

  def not_found
    head :not_found
  end
end
