# frozen_string_literal: true

# Abstract controller class from which
# every single API controller inherits.
class APIController < ::ApplicationController
  skip_forgery_protection

  rescue_from ::ActiveRecord::RecordNotFound, with: :not_found

  before_action :authenticate_user!, :disable_script_triggers_if_needed

  helper_method :current_user

  protected

  def authenticate_user!
    auth_scheme, auth_token = request.headers[:authorization]&.split(' ')
    if script_service_authenticated?(auth_scheme, auth_token)
      @current_ability = ::Ability.new(:god)
    else
      super
      ::Current.user = current_user
    end
  end

  # @param auth_scheme [String, nil]
  # @param auth_token [String, nil]
  # @return [Boolean]
  def script_service_authenticated?(auth_scheme, auth_token)
    auth_scheme == 'ScriptService' &&
      ::ActiveSupport::SecurityUtils.secure_compare(::Base64.decode64(auth_token), ::Config::ENV_SETTINGS['script_service_secret']) &&
      %w[localhost rails].include?(request.host)
  end

  def disable_script_triggers_if_needed
    ::Current.disable_script_triggers_for_this_request! if params[:trigger_scripts] == false
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
