# frozen_string_literal: true

# Contains the data of a task,
# which can contain multiple comments.
class DB::Task < ApplicationRecord
  belongs_to :list
  belongs_to :author, class_name: 'DB::User', foreign_key: :author_id
  has_and_belongs_to_many :users

  before_create :set_highest_pos_in_list

  enum priority: {
    very_low: 0,
    low: 1,
    medium: 2,
    high: 3,
    very_high: 4
  }

  validates :name, presence: true, length: { maximum: 80 }
  validates :description, length: { maximum: 300 }

  # Sets `pos` value to be the last in the list
  def set_highest_pos_in_list
    self.pos = list.tasks.order(:pos).last&.pos&.+(1024) || 65_536
  end
end
