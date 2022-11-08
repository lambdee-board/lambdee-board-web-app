# frozen_string_literal: true

::FactoryBot.define do
  factory :task, class: 'DB::Task'  do
    name { ::Faker::Music.album }
    description { ::Faker::Markdown.sandwich(sentences: rand(3..6)) }
    priority { rand(5) }
    points { rand(5) + 1 }
    association :list
    association :author, factory: :user

    trait :random_pos do
      pos { rand(65000) }
    end
  end

  factory :task_in_visible_list, parent: :task do
    association :list, factory: :visible_list
  end
end
