class AddPgExtensions < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'unaccent'
    enable_extension 'pg_trgm'
  end
end
