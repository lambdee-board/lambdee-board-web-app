# frozen_string_literal: true

::FactoryBot.define do
  factory :user, class: 'DB::User' do
    name { ::Faker::Name.name }
    email { |u| "#{u.name.underscore.gsub('.', '').gsub(' ', '_')}.#{::Time.now.to_i}@example.com" }
    role { rand(4) }
    password { 's3cr4t_p4ss' }
  end
end
