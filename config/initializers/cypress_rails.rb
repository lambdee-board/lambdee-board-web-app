return unless ::Rails.env.test?

require 'database_cleaner/active_record'

::CypressRails.hooks.before_server_start do
  # Called once, before either the transaction or the server is started
  ::DatabaseCleaner.strategy = :truncation
  ::DatabaseCleaner.clean
  ::Rails.application.load_seed
end

# ::CypressRails.hooks.after_transaction_start do
#   # Called after the transaction is started (at launch and after each reset)
# end

# ::CypressRails.hooks.after_state_reset do
#   # Triggered after `/cypress_rails_reset_state` is called
# end

::CypressRails.hooks.before_server_stop do
  # Called once, at_exit
  ::DatabaseCleaner.clean
end
