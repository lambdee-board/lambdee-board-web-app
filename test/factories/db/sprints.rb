FactoryBot.define do
  factory :sprint, class: 'DB::Sprint' do
    name { ::Faker::Australia.location }
    start_date { rand(rand(1..5).days).seconds.ago }
    due_date { rand(rand(1..3).days).seconds.from_now }
    end_date { nil }
    final_list { board.lists.last }

    trait :active do
      end_date { rand(rand(4..7).days).seconds.from_now }
    end
    association :board
  end
end
