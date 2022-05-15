require 'swagger_helper'

::RSpec.describe 'api/workspaces', type: :request do

  path '/api/workspaces' do

    get('list workspaces') do
      tags 'Workspaces'
      produces 'application/json'
      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/workspace_response' }

        5.times { ::FactoryBot.create :workspace }

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

    post('create workspace') do
      tags 'Workspaces'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :workspace, in: :body, schema: { '$ref' => '#/components/schemas/workspace_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/workspace_response'
        let(:workspace) { { name: 'New Workspace' } }

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
  end

  path '/api/workspaces/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('show workspace') do
      tags 'Workspaces'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/workspace_response'

        let(:id) { ::FactoryBot.create(:workspace).id }

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

    put('update workspace') do
      tags 'Workspaces'
      parameter name: 'workspace', in: :body, schema: { '$ref' => '#/components/schemas/workspace_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/workspace_response'

        let(:id) { ::FactoryBot.create(:workspace).id }
        let(:workspace) { { name: 'New Name' } }

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

    delete('delete workspace') do
      tags 'Workspaces'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:workspace).id }
        run_test!
      end
    end
  end
end
