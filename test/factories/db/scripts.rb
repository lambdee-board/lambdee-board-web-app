# frozen_string_literal: true

::FactoryBot.define do
  factory :script, class: '::DB::Script' do
    content { "puts 'hello world'" }
    name { 'My first Lambdee Script' }
    description { 'Description of the script' }
    association :author, factory: :user

    trait :with_create_task_callback do
      after(:create) do |s|
        ::FactoryBot.create(:callback_script, script: s, action: :create, subject_type: ::DB::Task)
      end
    end
  end
end
