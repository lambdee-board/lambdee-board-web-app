# frozen_string_literal: true

::FactoryBot.define do
  factory :board, class: 'DB::Board'  do
    name { ::Faker::Science.element }
    colour { '#03a9f4' }
    association :workspace
  end
end
