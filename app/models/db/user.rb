# frozen_string_literal: true

# Contains the data of a user
# of the frontend interface.
class DB::User < ::ApplicationRecord
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, email: true, length: { maximum: 70 }
end
