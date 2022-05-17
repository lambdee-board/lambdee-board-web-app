require 'swagger_helper'

::RSpec.describe 'api/boards', type: :request do

  path '/api/boards' do

    get('list boards') do
      tags 'Boards'
      produces 'application/json'
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned', example: 3

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/board_response' }

        5.times { ::FactoryBot.create :board }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: ::JSON.parse(response.body, symbolize_names: true)
            }
          }
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
          example.metadata[:response][:content] = {
            'application/json' => {
              example: ::JSON.parse(response.body, symbolize_names: true)
            }
          }
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
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/board_response'

        let(:id) { ::FactoryBot.create(:board).id }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
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
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
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
end
