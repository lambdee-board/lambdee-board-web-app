# frozen_string_literal: true

# Represents a many-to-many
# relation between `Task` and `User`.
class DB::TaskUser < ::ApplicationRecord
  include ::ScriptTriggerable

  belongs_to :task, class_name: 'DB::Task'
  belongs_to :user, class_name: 'DB::User'
end
