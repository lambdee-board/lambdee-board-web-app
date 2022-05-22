# Module which implements methods
# for soft deleting records
module Archivable
  extend ::ActiveSupport::Concern

  included do
    scope :visible, -> { where(deleted: false) }
    scope :archived, -> { where(deleted: true) }
  end

  # Set `deleted: true` and save record with no validation.
  #
  # @return [Boolean]
  def archive!
    self.deleted = true
    save(validate: false)
  end

  # Check if param `deleted: false`
  #
  # @return [Boolean]
  def archived?
    deleted
  end

  # @return [Boolean]
  def visible?
    !archived?
  end

  alias archived archived?

  # Set `deleted: false` and save record with no validation.
  # @return [Boolean]
  def restore!
    self.deleted = false
    save(validate: false)
  end
end
