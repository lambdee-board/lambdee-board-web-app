# frozen_string_literal: true

::FactoryBot.define do
  factory :sprint, class: 'DB::Sprint' do
    name { ::Faker::Australia.location }
    description { ::Faker::Lorem.paragraph }
    started_at { ::Time.now }
    expected_end_at { ::Time.now + 1.week }
    association :board

    trait :inactive do
      ended_at { ::Time.now + 1.week }
    end

    trait :with_list do
      after(:create) do |s|
        ::FactoryBot.create(:visible_list, board: s.board)
      end
    end

    trait :with_task do
      after(:create) do |s|
        task = ::FactoryBot.create(:task)
        ::FactoryBot.create(:sprint_task, task: task, sprint: s)
      end
    end
  end
end
