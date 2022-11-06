FactoryBot.define do
  factory :script do
    content { "MyText" }
    name { "MyString" }
    description { "MyText" }
    author_id { "" }
  end
end
