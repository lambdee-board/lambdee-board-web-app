# frozen_string_literal: true

json.array! @tasks, partial: 'task', as: :task
