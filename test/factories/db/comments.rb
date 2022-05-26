# frozen_string_literal: true

::FactoryBot.define do
  factory :comment, class: 'DB::Comment' do
    body { ::Faker::Markdown.sandwich(sentences: rand(1..3)) }
    deleted { false }
    association :author, factory: :user
    association :task
  end
end
