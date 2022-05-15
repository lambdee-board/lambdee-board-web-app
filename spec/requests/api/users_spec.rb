require 'swagger_helper'

::RSpec.describe 'api/users', type: :request do

  path '/api/users' do

    get('list users') do
      tags 'Users'
      produces 'application/json'
      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/user_response' }

        5.times { ::FactoryBot.create :user }

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

    post('create user') do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: { '$ref' => '#/components/schemas/user_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'
        let(:user) { { name: 'New User', email: 'new_user@example.com' } }

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

  path '/api/users/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('show user') do
      tags 'Users'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        let(:id) { ::FactoryBot.create(:user).id }

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

    put('update user') do
      tags 'Users'
      parameter name: 'user', in: :body, schema: { '$ref' => '#/components/schemas/user_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        let(:id) { ::FactoryBot.create(:user).id }
        let(:user) { { name: 'New Name', email: 'new_email@example.com' } }

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

    delete('delete user') do
      tags 'Users'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:user).id }
        run_test!
      end
    end
  end
end
