# frozen_string_literal: true

# Represents a many-to-many
# relation between `Task` and `User`.
class DB::TaskUser < ::ApplicationRecord
  AVAILABLE_SCOPES = ::Set[:workspace, :board, :list, :task]

  belongs_to :task, class_name: 'DB::Task'
  belongs_to :user, class_name: 'DB::User'

  delegate :list, to: :task
  delegate :board, to: :list
  delegate :workspace, to: :board
end
