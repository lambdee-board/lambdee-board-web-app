# frozen_string_literal: true

::FactoryBot.define do
  factory :tag, class: 'DB::Tag' do
    name { ::Faker::Job.field }
    colour { ::Faker::Color.hex_color }
    association :board
  end
end
