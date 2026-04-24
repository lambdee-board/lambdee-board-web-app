return unless Rails.env.test?

require 'database_cleaner/active_record'

CypressOnRails.configure do |c|
  c.install_folder = Rails.root.join('e2e/playwright')
  c.use_middleware  = true
  c.logger          = Rails.logger
end
