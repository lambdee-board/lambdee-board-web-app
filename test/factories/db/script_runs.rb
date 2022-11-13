# frozen_string_literal: true

::FactoryBot.define do
  factory :script_run, class: '::DB::ScriptRun' do
    output { 'Hello world' }
    association :script
  end
end
