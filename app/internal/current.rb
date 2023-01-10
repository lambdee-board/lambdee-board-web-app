# frozen_string_literal: true

# Provides a thread-isolated attributes singleton.
# Should only be used for a few, top-level globals!
class ::Current < ::ActiveSupport::CurrentAttributes
  attribute :script_triggers_disabled, :user

  # @return [Boolean]
  def disable_script_triggers_for_this_request!
    self.script_triggers_disabled = true
  end

  # @return [Boolean]
  def script_triggers_disabled?
    script_triggers_disabled || false
  end
end
