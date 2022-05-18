# frozen_string_literal: true

::FactoryBot.define do
  factory :list, class: 'DB::List' do
    name { ::Faker::Color.color_name }
    pos { rand(65000) }
    deleted { false }
    association :board
  end
end
