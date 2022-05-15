# frozen_string_literal: true

::FactoryBot.define do
  factory :board, class: 'DB::Board'  do
    name { ::Faker::Science.element }
    association :workspace
  end
end
