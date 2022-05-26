# frozen_string_literal: true

::FactoryBot.define do
  factory :comment, class: 'DB::Comment' do
    body { ::Faker::Quotes::Shakespeare.romeo_and_juliet_quote }
    deleted { false }
    association :author, factory: :user
    association :task
  end
end
