# frozen_string_literal: true

::FactoryBot.define do
  factory :script_trigger, class: '::DB::ScriptTrigger' do
    association :script
    action { 'create' }
  end
end
