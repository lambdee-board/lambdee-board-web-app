# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if ::Rails.env.production?
  require_relative 'seeds.prod'
  exit
end

def create_board(workspace)
  tags_amount = 5
  workspace.boards << board = ::FactoryBot.create(:board)
  list = ::FactoryBot.create(:list, board:, name: 'Backlog')

  frontend_tag = ::FactoryBot.create(:tag, name: 'Frontend', board:)
  backend_tag = ::FactoryBot.create(:tag, name: 'Backend', board:)
  devops_tag = ::FactoryBot.create(:tag, name: 'DevOps', board:)

  tags_amount.times { ::FactoryBot.create(:tag, board:) }
  task = ::FactoryBot.create(:task, list:, name: 'Add a login system', priority: :medium, points: 15, description: "## Nostrum\nDeserunt nemo dignissimos. Aliquam voluptas consectetur. Ad dolore eaque. Deserunt enim reprehenderit.\nearum | cumque | totam\n---- | ---- | ----\nquisquam | voluptas | eos\naut | eaque | dolorum")
  task.users << ::DB::User.find(2)
  task.users << ::DB::User.find(3)
  task.tags << frontend_tag
  task.tags << backend_tag
  ::FactoryBot.create(:comment, task:, author_id: 1, body: "#### Eaque\nQuasi natus sapiente.\nVero qui eum. Harum iusto accusantium. Ut **exercitationem** sunt.")

  task = ::FactoryBot.create(:task, list:, name: 'Add CI tests', priority: :low, points: 2, description: "#### Molestiae\nLaudantium temporibus repellendus. Enim iste qui. Modi necessitatibus fugiat. Iure recusandae amet.\n###### Praesentium\nId dolorem laborum. Dolorem laudantium quo. Ipsum exercitationem dolorem.\n```ruby\nAut.\n```")
  task.tags << devops_tag
  task.users << ::DB::User.find(1)
  ::FactoryBot.create(:comment, task:, author_id: 3, body: "##### Laborum\nFacilis ullam commodi. Natus molestiae deserunt. Harum omnis maxime.\nmolestiae | excepturi | ab\n---- | ---- | ----\net | iusto | quos\ncum | ea | minima")
  ::FactoryBot.create(:comment, task:, author_id: 2, body: "# Consequuntur\nLaboriosam voluptas vel. Eveniet delectus deleniti.\n```ruby\nVoluptas.\n```")

  task = ::FactoryBot.create(:task, list:, name: 'Refactor the REST API', priority: :high, points: 10, description: "### Quae\nAmet ex sed. Consequuntur numquam esse. Soluta ab eaque. Dolores veniam laborum. Ipsa assumenda iure.\nQui cupiditate iusto. Doloremque voluptatem in. **Voluptas** dolores quisquam.")
  task.tags << backend_tag

  5.times do |i|
    list = ::FactoryBot.create(:list, board:)
    rand(5).times do
      task = ::FactoryBot.create(:task, list:)
      rand(4).times { task.users << ::FactoryBot.create(:user) }
      task.tags << board.tags.order("RANDOM()").last(rand(tags_amount))
      rand(2).times { task.comments << ::FactoryBot.create(:comment) }
    end
  end

  board
end

wrk = ::FactoryBot.create :workspace
wrk.users << usr = ::FactoryBot.create(:user)
wrk.users << ::FactoryBot.create(:user, name: 'Madonna Berge', role: :regular)
wrk.users << ::FactoryBot.create(:user, name: 'Brice Spinka', role: :developer)
wrk.users << ::FactoryBot.create(:user, name: 'Rupert Reichel', role: :manager)
wrk.users << ::FactoryBot.create(:user, name: 'Bee Trantow', role: :admin)

10.times { |index| wrk.users <<  ::FactoryBot.create(:user, name: "Abcdef #{index}", role: :admin)}

2.times { create_board(wrk) }

2.times { ::FactoryBot.create(:board, workspace: wrk) }

wrk = ::FactoryBot.create :workspace
wrk.users << usr
3.times { create_board(wrk) }
wrk = ::FactoryBot.create :workspace
wrk.users << usr
create_board(wrk)
4.times { wrk.users << ::FactoryBot.create(:user) }

3.times { ::FactoryBot.create(:workspace) }
