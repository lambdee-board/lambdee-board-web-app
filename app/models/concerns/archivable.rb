# Module which implements methods
# for soft deleting records
module Archivable
  extend ::ActiveSupport::Concern

  included do
    scope :not_archived, -> { where(deleted: false) }
  end

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
