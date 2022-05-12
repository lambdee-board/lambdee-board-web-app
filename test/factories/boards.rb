FactoryBot.define do
  factory :board, class: 'DB::Board'  do
    name { "MyString" }
    association :workspace
  end
end
