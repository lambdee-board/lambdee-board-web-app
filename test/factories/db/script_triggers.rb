# frozen_string_literal: true

::FactoryBot.define do
  factory :script_trigger, class: '::DB::ScriptTrigger' do
    association :script
    association :author, factory: :user
    action { 'create' }
    delay { 60 }

    trait :with_scope_on_board do
      association :scope, factory: :board
    end

    trait :with_subject_task do
      association :subject, factory: :task
    end
  end
end
