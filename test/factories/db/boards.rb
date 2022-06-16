# frozen_string_literal: true

::FactoryBot.define do
  factory :board, class: 'DB::Board' do
    name { ::Faker::Science.element }
    colour { ::Faker::Color.hex_color }
    association :workspace
  end
end
