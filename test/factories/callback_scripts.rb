FactoryBot.define do
  factory :callback_script do
    script_id { "" }
    subject_type { "MyString" }
    subject_id { "" }
    action { "MyString" }
  end
end
