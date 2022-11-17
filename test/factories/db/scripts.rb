# frozen_string_literal: true

::FactoryBot.define do
  factory :script, class: '::DB::Script' do
    content { "puts 'hello world'" }
    name { 'My first Lambdee Script' }
    description { 'Description of the script' }
    association :author, factory: :user

    trait :with_trigger_on_task_creation  do
      after(:create) do |s|
        ::FactoryBot.create(:script_trigger, script: s, action: :create, subject_type: ::DB::Task)
      end
    end

    trait :with_trigger_on_task_update  do
      after(:create) do |s|
        ::FactoryBot.create(:script_trigger, script: s, action: :update, subject: ::FactoryBot.create(:task))
      end
    end

    trait :with_trigger_on_every_model_creation  do
      after(:create) do |s|
        ::FactoryBot.create(:script_trigger, script: s, action: :create)
      end
    end
  end
end
