# frozen_string_literal: true

::FactoryBot.define do
  factory :list, class: 'DB::List' do
    name { ::Faker::Color.color_name }
    association :board

    trait :random_pos do
      pos { rand(65000) }
    end
  end
end
