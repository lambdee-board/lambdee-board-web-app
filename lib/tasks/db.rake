namespace :db do
  task kill_connections: :environment do
    ActiveRecord::Base.connection.execute(<<~SQL)
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid <> pg_backend_pid()
    SQL
  end
end
