# frozen_string_literal: true

# Model needed for authentication in admin panel.
class ::DB::AdminUser < ::ApplicationRecord
  self.table_name = 'users'

  devise :rememberable, :trackable, :database_authenticatable

  default_scope -> { where role: 4 }
end
