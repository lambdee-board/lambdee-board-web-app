require 'swagger_helper'

::RSpec.describe 'api/lists', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  path '/api/lists' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    get('List lists') do
      tags 'Lists'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/list_response' }

        before do
          5.times { ::FactoryBot.create :list }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('Create List') do
      tags 'Lists'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :list, in: :body, schema: { '$ref' => '#/components/schemas/list_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/list_response'
        let(:board) { ::FactoryBot.create(:board) }
        let(:list) { { name: 'New List', pos: 1212, board_id: board.id } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/lists/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show List') do
      tags 'Lists'
      produces 'application/json'
      parameter name: 'tasks',
                in: :query,
                type: :string,
                schema: { '$ref' => '#/components/schemas/include_associated_enum' },
                required: false

      response(200, 'successful with `tasks=all`') do
        schema '$ref' => '#/components/schemas/list_response'

        let(:id) do
          list = ::FactoryBot.create(:list)
          list.tasks << task = ::FactoryBot.create(:task)
          task.users << ::FactoryBot.create(:user)
          task.users << ::FactoryBot.create(:user)
          task.tags << ::FactoryBot.create(:tag)
          task.tags << ::FactoryBot.create(:tag)
          list.tasks << task = ::FactoryBot.create(:task)
          task.destroy
          list.id
        end
        let(:tasks) { 'all' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful with `tasks=visible`') do
        schema '$ref' => '#/components/schemas/list_response'

        let(:id) do
          list = ::FactoryBot.create(:list)
          list.tasks << task = ::FactoryBot.create(:task)
          task.users << ::FactoryBot.create(:user)
          task.users << ::FactoryBot.create(:user)
          task.tags << ::FactoryBot.create(:tag)
          list.tasks << ::FactoryBot.create(:task)

          list.id
        end
        let(:tasks) { 'visible' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful with `tasks=archived`') do
        schema '$ref' => '#/components/schemas/list_response'

        let(:id) do
          list = ::FactoryBot.create(:list)
          list.tasks << task = ::FactoryBot.create(:task)
          task.destroy
          list.tasks << task = ::FactoryBot.create(:task)
          task.destroy
          task.users << ::FactoryBot.create(:user)
          task.tags << ::FactoryBot.create(:tag)

          list.id
        end
        let(:tasks) { 'archived' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/list_response'

        let(:id) { ::FactoryBot.create(:list).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update list') do
      tags 'Lists'
      parameter name: 'list', in: :body, schema: { '$ref' => '#/components/schemas/list_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/list_response'

        let(:id) { ::FactoryBot.create(:list).id }
        let(:list) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete list') do
      tags 'Lists'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:list).id }
        run_test!
      end
    end
  end
end
