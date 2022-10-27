FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    data { [{state:"backlog", date: ::Time.now }] }
    association :sprint
    association :task
  end
end
