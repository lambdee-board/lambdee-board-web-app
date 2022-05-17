# frozen_string_literal: true

# Contains the data of a list,
# which can contain multiple tasks.
class DB::List < ApplicationRecord
  belongs_to :board

  validates :name, presence: true, length: { maximum: 50 }

  # Set `deleted: true` and save record with no validation.
  # @return [Boolean]
  def archive!
    self.deleted = true
    save(validate: false)
  end

  # Check if param `deleted: false`
  # @return [Boolean]
  def archived?
    deleted
  end

  # Set `deleted: false` and save record with no validation.
  # @return [Boolean]
  def restore!
    self.deleted = false
    save(validate: false)
  end
end
