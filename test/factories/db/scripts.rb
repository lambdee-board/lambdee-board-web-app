# frozen_string_literal: true

::FactoryBot.define do
  factory :script, class: '::DB::Script' do
    content { "puts 'hello world'" }
    name { 'My first Lambdee Script' }
    description { 'Description of the script' }
    association :author, factory: :user
  end
end
