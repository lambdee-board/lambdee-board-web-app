FactoryBot.define do
  factory :sprint, class: 'DB::Sprint' do
    name { "MyString" }
    start_date { "2022-10-19 17:16:35" }
    due_date { "2022-10-19 17:16:35" }
    end_date { "2022-10-19 17:16:35" }
  end
end
