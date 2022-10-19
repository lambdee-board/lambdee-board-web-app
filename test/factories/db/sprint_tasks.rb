FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    data { '[{"state":"backlog","date":"2022-12-12 15:14:13"}]' }
    association :sprint
    association :task
  end
end
