require 'swagger_helper'

::RSpec.describe 'api/users', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  path '/api/workspaces/{id}/users' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    get('List users of workspace') do
      tags 'Users'
      produces 'application/json'
      parameter name: 'id', in: :path, type: :string, description: 'Workspace id'
      parameter name: 'role', in: 'query', schema: { '$ref' => '#/components/schemas/user_request/properties/role' }, example: 'admin'
      parameter name: 'created_at_from', in: 'query', type: 'string', description: 'Date with format YYYY.MM.DD', example: '2010.01.25'
      parameter name: 'created_at_to', in: 'query', type: 'string', description: 'Date with format YYYY.MM.DD', example: '2010.01.25'
      parameter name: 'search', in: 'query', type: 'string', description: 'Searches for users by name and e-mail.', example: 'michael'
      parameter name: 'page', in: 'query', type: 'integer', description: 'Decides which result page should be returned.', example: 2
      parameter name: 'per', in: 'query', type: 'integer', description: 'Decides how many entities should be returned per one page. **Works only, when `page` param is given.**', example: 2
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned.', example: 3
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
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    get('List users') do
      tags 'Users'
      produces 'application/json'
      parameter(
        name: 'role_collection',
        in: 'query',
        schema: {
          type: :array,
          items: { '$ref' => '#/components/schemas/user_request/properties/role' }
        },
        example: ["admin"]
      )
      parameter name: 'role', in: 'query', schema: { '$ref' => '#/components/schemas/user_request/properties/role' }, example: 'admin'
      parameter name: 'created_at_from', in: 'query', type: 'string', description: 'Date with format YYYY.MM.DD', example: '2010.01.25'
      parameter name: 'created_at_to', in: 'query', type: 'string', description: 'Date with format YYYY.MM.DD', example: '2010.01.25'
      parameter name: 'workspace_id', in: 'query', type: 'integer', example: 1
      parameter name: 'search', in: 'query', type: 'string', description: 'Searches for users by name and e-mail.', example: 'michael'
      parameter name: 'page', in: 'query', type: 'integer', description: 'Decides which result page should be returned.', example: 2
      parameter name: 'per', in: 'query', type: 'integer', description: 'Decides how many entities should be returned per one page. **Works only, when `page` param is given.**', example: 2
      parameter name: 'limit', in: 'query', type: 'integer', description: 'Decides how many entities should be returned.', example: 3

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
        let(:user) { { user: { name: 'New User', email: 'new_user@example.com', role: 'developer', password: 's3cr3t_p4ssw0rd' } } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update current user') do
      tags 'Users'
      parameter name: 'user', in: :body, schema: { '$ref' => '#/components/schemas/user_update_request' }

      consumes 'application/json'
      produces 'application/json'

      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:user).id }
        let(:user) { { user: { name: 'New Name', email: 'new_email@example.com', current_password: 's3cr4t_p4ss' } } }
        run_test!
      end
    end

    delete('Delete current user') do
      tags 'Users'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:user).id }
        run_test!
      end
    end
  end

  path '/api/users/current' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    get('Show the currently signed in user') do
      tags 'Users'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/users/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

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
  end

  path '/api/users/sign_in' do
    post('Sign in') do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'user', in: :body, schema: { '$ref' => '#/components/schemas/user_sign_in_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/user_response'

        let(:user) do
          ::FactoryBot.create(:user, email: 'email@example.com')
          { user: { email: 'email@example.com', password: 's3cr4t_p4ss' } }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/users/sign_out' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    delete('Sign out') do
      tags 'Users'
      response(204, 'successful') do
        run_test!
      end
    end
  end
end
