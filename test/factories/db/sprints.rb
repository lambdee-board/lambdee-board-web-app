# frozen_string_literal: true

::FactoryBot.define do
  factory :sprint, class: 'DB::Sprint' do
    name { ::Faker::Australia.location }
    start_date { ::Time.now }
    due_date { ::Time.now + 1.week }
    final_list_name { ::Faker::Artist.name }
    association :board

    trait :inactive do
      end_date { ::Time.now + 1.week }
    end
  end

  factory :sprint_with_list, parent: :sprint do
    after(:create) { |s| ::FactoryBot.create(:visible_list, board: s.board) }
  end
end
