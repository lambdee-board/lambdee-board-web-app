# frozen_string_literal: true

# Represents a single variable
# which may be used in scripts.
# It's value can only be set or overridden,
# not read by regular users.
# It can be only read from scripts.
class DB::ScriptVariable < ::ApplicationRecord
  belongs_to :owner, polymorphic: true, optional: true

  encrypts :value

  scope :global, -> { where(owner_type: nil) }

  # @return [Boolean]
  def global?
    owner_type.nil?
  end
end
