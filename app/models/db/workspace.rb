# frozen_string_literal: true

# Contains the data of a workspace,
# which can contain multiple boards.
class DB::Workspace < ApplicationRecord
  include ::PgSearch::Model

  acts_as_paranoid double_tap_destroys_fully: false

  has_many :boards, dependent: :destroy
  has_many :boards_including_deleted, -> { with_deleted }, class_name: 'DB::Board'
  has_many :deleted_boards, -> { only_deleted }, class_name: 'DB::Board'
  has_many :user_workspaces, dependent: :destroy
  has_many :users, through: :user_workspaces

  pg_search_scope :pg_search,
                  against: %i[name],
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  default_scope { order(:id) }

  validates :name, presence: true, length: { maximum: 40 }
end
