# frozen_string_literal: true

::FactoryBot.define do
  factory :user, class: 'DB::User' do
    name { "MyString" }
  end
end
