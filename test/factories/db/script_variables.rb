# frozen_string_literal: true

::FactoryBot.define do
  factory :script_variable, class: 'DB::ScriptVariable' do
    name { "#{::Faker::Hacker.noun}-#{::Time.now.to_i}" }
    value { ::Faker::Hacker.abbreviation }
  end
end
