# frozen_string_literal: true

# Mailer which handles account related mails
class AccountMailer < ::ApplicationMailer
  # send reset password instructions
  def reset_password_email
    @user = params[:user]
    @token = params[:token]
    @reset_password_url = ::AppRouter::BASE_URL +
                          'login/reset-password' \
                          "?reset_password_token=#{@token}"

    mail(to: @user.email, subject: 'Password reset instructions')
  end

  # send a generic email with custom content
  def custom_email
    to = params[:to]
    subject = params[:subject]
    @content = params[:content]

    mail(to:, subject:)
  end
end
