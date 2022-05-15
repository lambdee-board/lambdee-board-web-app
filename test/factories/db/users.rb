# frozen_string_literal: true

::FactoryBot.define do
  factory :user, class: 'DB::User' do
    name { ::Faker::Name.name }
    email { |u| "#{u.name.underscore.gsub('.', '').gsub(' ', '_')}.#{::Time.now.to_i}@example.com" }
  end
end
