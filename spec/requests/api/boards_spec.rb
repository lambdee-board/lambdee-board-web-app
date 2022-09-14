require 'swagger_helper'

::RSpec.describe 'api/boards', type: :request do

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/boards' do

    get('list boards') do
      tags 'Boards'
      produces 'application/json'
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned', example: 3

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/board_response' }

        before do
          5.times { ::FactoryBot.create :board }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('create board') do
      tags 'Boards'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :board, in: :body, schema: { '$ref' => '#/components/schemas/board_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/board_response'
        let(:workspace) { ::FactoryBot.create(:workspace) }
        let(:board) { { name: 'New Board', workspace_id: workspace.id } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/boards/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('show board') do
      tags 'Boards'
      produces 'application/json'
      parameter name: 'tasks',
                in: :query,
                type: :string,
                schema: { '$ref' => '#/components/schemas/include_associated_enum' },
                required: false
      parameter name: 'lists',
                in: :query,
                type: :string,
                schema: { '$ref' => '#/components/schemas/include_associated_enum' },
                required: false

      response(200, 'successful with `lists=all`') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) do
          board = ::FactoryBot.create(:board)
          board.lists << list = ::FactoryBot.create(:list)
          list.destroy
          board.lists << list = ::FactoryBot.create(:list)
          board.id
        end
        let(:lists) { 'all' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful with `lists=visible`') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) do
          board = ::FactoryBot.create(:board)
          board.lists << list = ::FactoryBot.create(:list)
          board.id
        end
        let(:lists) { 'visible' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful with `lists=archived`') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) do
          board = ::FactoryBot.create(:board)
          board.lists << list = ::FactoryBot.create(:list)
          list.destroy
          board.lists << list = ::FactoryBot.create(:list)
          list.destroy
          board.id
        end
        let(:lists) { 'archived' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) { ::FactoryBot.create(:board).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('update board') do
      tags 'Boards'
      parameter name: 'board', in: :body, schema: { '$ref' => '#/components/schemas/board_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) { ::FactoryBot.create(:board).id }
        let(:board) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('delete board') do
      tags 'Boards'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:board).id }
        run_test!
      end
    end
  end

  path '/api/boards/{id}/user_tasks' do
    parameter name: 'id', in: :path, type: :string, description: 'id'
    get('list current user tasks including board, lists, tags, users and author') do
      tags 'Boards'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) do
          user = ::DB::User.first
          board = ::FactoryBot.create(:board)
          list = ::FactoryBot.create(:list, board: board)
          task = ::FactoryBot.create(:task, list: list, author: user)
          task.tags << ::FactoryBot.create(:tag)
          task.users << user
          board.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/boards/recently_viewed' do
    get('list current user recently viewed boards (max 5)') do
      tags 'Boards'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/board_response' }

        before do
          5.times { ::FactoryBot.create :board }
          user = ::DB::User.first
          user.recent_boards = ::DB::Board.first(5).pluck(:id)
          user.save
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end
end
