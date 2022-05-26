require 'swagger_helper'

::RSpec.describe 'api/tags', type: :request do

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/boards/{id}/tags' do
    parameter name: 'id', in: :path, type: :string, description: 'Board id'

    get("List board's tags") do
      tags 'Tags'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/tag_response' }

        let(:id) do
          board = ::FactoryBot.create(:board)
          5.times { ::FactoryBot.create(:tag, board: board) }
          board.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('Create tag') do
      tags 'Tags'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'id', in: :path, type: :string, description: 'Board id'
      parameter name: :tag, in: :body, schema: { '$ref' => '#/components/schemas/tag_request' }

      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/tag_response'
        let(:id) { ::FactoryBot.create(:board).id }
        let(:tag) { { name: 'New Tag', colour: '#fff000' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/tags' do
    post('Create tag') do
      tags 'Tags'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :tag, in: :body, schema: { '$ref' => '#/components/schemas/tag_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/tag_response'
        let(:task) { ::FactoryBot.create(:task) }
        let(:tag) { { name: 'New Tag', colour: '#fff000', task_id: task.id } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/tasks/{id}/tags' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    get("List task's tags") do
      tags 'Tags'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/tag_response' }

        let(:id) do
          list = ::FactoryBot.create(:list)
          board = list.board
          task = ::FactoryBot.create(:task, list: list)
          5.times { task.tags << ::FactoryBot.create(:tag, board: board) }
          task.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post("Create tag (associated with given task and task's board)") do
      tags 'Tags'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'id', in: :path, type: :string, description: 'Task id'
      parameter name: :tag, in: :body, schema: { '$ref' => '#/components/schemas/tag_request' }

      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/tag_response'
        let(:id) { ::FactoryBot.create(:task).id }
        let(:tag) { { name: 'New Tag', colour: '#fff000' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/tags/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show Tags') do
      tags 'Tags'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/tag_response'

        let(:id) { ::FactoryBot.create(:tag).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update Tag') do
      tags 'Tags'
      parameter name: 'tag', in: :body, schema: { '$ref' => '#/components/schemas/tag_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/tag_response'

        let(:id) { ::FactoryBot.create(:tag).id }
        let(:tag) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete tag') do
      tags 'Tags'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:tag).id }
        run_test!
      end
    end
  end
end
