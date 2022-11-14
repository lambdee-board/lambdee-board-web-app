# frozen_string_literal: true

# Allows triggering the callback scripts.
module ::ScriptTriggerable
  extend ::ActiveSupport::Concern

  included do
    attr_reader :previous_object_state

    before_update :save_previous_object_state
    after_create { execute_scripts_with_action(:create) }
    after_update { execute_scripts_with_action(:update) }
    after_destroy { execute_scripts_with_action(:destroy) }
  end

  private

  def save_previous_object_state
    @previous_object_state = self.class.new(as_json)
  end

  def execute_scripts_with_action(action)
    scripts = scripts_regarding_record.with_action(action).includes(:script)
    scripts.each { |c| c.script.execute(self) }
  end

  def scripts_regarding_record
    ::DB::ScriptTrigger.regarding_record(self)
  end
end
