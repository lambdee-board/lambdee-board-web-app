# frozen_string_literal: true

# Represents a many-to-many
# relation between `Task` and `Tag`.
class DB::TaskTag < ::ApplicationRecord
  include ::ScriptTriggerable

  belongs_to :tag,  class_name: 'DB::Tag'
  belongs_to :task, class_name: 'DB::Task'
end
