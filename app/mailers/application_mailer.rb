# frozen_string_literal: true

# Main mailer class of the app
class ApplicationMailer < ::ActionMailer::Base
  default from: ::ENV['SMTP_MAIL_FROM'] || 'from@example.com'
  layout 'mailer'
end
