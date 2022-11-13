# frozen_string_literal: true

::FactoryBot.define do
  factory :callback_script, class: '::DB::CallbackScript' do
    action { 'create' }
  end
end
