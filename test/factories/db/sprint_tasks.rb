FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    task_id { 1 }
    sprint_id { 1 }
    data { "MyString" }
  end
end
