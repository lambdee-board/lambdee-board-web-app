FactoryBot.define do
  factory :sprint_task, class: 'DB::SprintTask' do
    data do
      Array.new(rand(1..4)) { {state: ::Faker::Color.color_name, date: ::Time.now } }
    end
    association :sprint
    association :task
  end
end
