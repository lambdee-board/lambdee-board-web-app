# frozen_string_literal: true

# Contains the data of a workspace,
# which can contain multiple boards.
class DB::Workspace < ApplicationRecord
  has_many :boards
  has_many :user_workspaces
  has_many :users, through: :user_workspaces

  validates :name, presence: true, length: { maximum: 40 }
end
