# frozen_string_literal: true

# Send custom emails from lambdee.
class API::MailsController < ::APIController
  # POST /api/mails
  def create
    authorize! :read, current_user

    filters = ::FilterParameters::Email.new(params)
    return render json: filters.errors, status: :unprocessable_entity unless filters.valid?(params)

    ::AccountMailer.with(
      to: params[:to],
      subject: params[:subject],
      content: params[:content]
    ).custom_email.deliver_later

    head 200
  end
end
