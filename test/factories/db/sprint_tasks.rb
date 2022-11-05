# frozen_string_literal: true

::FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    add_date { ::Time.now }
    start_state { 'To Do' }
    state { 'Doing' }
    association :sprint
    association :task, factory: :task_in_visible_list
  end

  trait :completed do
    completion_date { ::Time.now }
  end
end
