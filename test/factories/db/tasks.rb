# frozen_string_literal: true

::FactoryBot.define do
  factory :task, class: 'DB::Task'  do
    name { ::Faker::Music.album }
    description { ::Faker::Lorem.paragraph(sentence_count: 4) }
    pos { rand(65000) }
    association :list
    association :author, factory: :user
  end
end
