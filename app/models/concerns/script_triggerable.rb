# frozen_string_literal: true

# Allows triggering the callback scripts.
module ::ScriptTriggerable
  extend ::ActiveSupport::Concern

  included do
    attr_reader :previous_object_state

    after_create :run_scripts_with_action_create
    before_update :save_previous_object_state
    # after_update :run_after_update_scripts
    # after_destroy :run_after_destroy_scripts
  end

  private

  def save_previous_object_state
    @previous_object_state = self.class.new(as_json)
  end

  def run_scripts_with_action_create
    scripts = scripts_regarding_record.with_action_create
    execute_scripts(scripts)
  end

  def scripts_regarding_record
    ::DB::CallbackScript.regarding_record(self)
  end

  def execute_scripts(scripts)
    scripts.each { |s| s.execute(self) }
  end
end
