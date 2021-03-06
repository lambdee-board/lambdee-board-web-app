require 'swagger_helper'

::RSpec.describe 'api/users', type: :request do

  path '/api/workspaces/{id}/users' do
    get('List users of workspace') do
      tags 'Users'
      produces 'application/json'
      parameter name: 'id', in: :path, type: :string, description: 'Workspace id'
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned', example: 3

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/user_response' }

        let(:id) do
          workspace = ::FactoryBot.create(:workspace)
          3.times { workspace.users << ::FactoryBot.create(:user) }
          workspace.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/users' do
    get('List users') do
      tags 'Users'
      produces 'application/json'
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned', example: 3

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/user_response' }

        before do
          5.times { ::FactoryBot.create :user }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('Create a user') do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: { '$ref' => '#/components/schemas/user_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'
        let(:user) { { name: 'New User', email: 'new_user@example.com', role: 'developer', password: 's3cr3t_p4ssw0rd' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/users/current' do
    get('Show the currently signed in user') do
      tags 'Users'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        before do
          ::FactoryBot.create(:user)
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/users/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show a user') do
      tags 'Users'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        let(:id) { ::FactoryBot.create(:user).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update a user') do
      tags 'Users'
      parameter name: 'user', in: :body, schema: { '$ref' => '#/components/schemas/user_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        let(:id) { ::FactoryBot.create(:user).id }
        let(:user) { { name: 'New Name', email: 'new_email@example.com' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete a user') do
      tags 'Users'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:user).id }
        run_test!
      end
    end
  end
end
