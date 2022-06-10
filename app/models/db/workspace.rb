# frozen_string_literal: true

# Contains the data of a workspace,
# which can contain multiple boards.
class DB::Workspace < ApplicationRecord
  include ::Archivable

  has_many :boards
  has_many :user_workspaces
  has_many :users, through: :user_workspaces

  default_scope { order(:id) }

  validates :name, presence: true, length: { maximum: 40 }
end
