# frozen_string_literal: true

# Model using to store revoked JWT tokens.
class ::DB::JwtDenylist < ::ApplicationRecord
  include ::Devise::JWT::RevocationStrategies::Denylist

  self.table_name = 'jwt_denylist'
end
