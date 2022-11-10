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
    authorisation_scheme, authorisation_token = request.headers[:authorization]&.split(' ')
    return super unless authorisation_scheme == 'ScriptService' && authorisation_token == ::Config::ENV_SETTINGS['script_service_secret']

    @current_ability = ::Ability.new(:god)
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
