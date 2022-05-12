FactoryBot.define do
  factory :user, class: 'DB::User' do
    name { "MyString" }
  end
end
