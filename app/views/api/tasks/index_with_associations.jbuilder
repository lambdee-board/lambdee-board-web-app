# frozen_string_literal: true

json.array! @tasks, partial: 'task_with_users_and_tags', as: :task
