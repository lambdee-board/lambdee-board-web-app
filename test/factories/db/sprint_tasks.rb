# frozen_string_literal: true

::FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    added_at { ::Time.now }
    start_state { 'To Do' }
    state { 'Doing' }
    association :sprint
    association :task, factory: :task_in_visible_list
  end

  trait :completed do
    completed_at { ::Time.now }
  end
end
