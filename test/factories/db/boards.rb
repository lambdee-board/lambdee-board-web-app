# frozen_string_literal: true

::FactoryBot.define do
  factory :board, class: 'DB::Board' do
    name { ::Faker::Science.element }
    color { ::Faker::Color.hex_color }
    association :workspace
  end
end
