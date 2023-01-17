require 'swagger_helper'

::RSpec.describe 'api/workspaces', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  path '/api/workspaces' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    get('list workspaces') do
      tags 'Workspaces'
      produces 'application/json'
      security [Bearer: {}]

      parameter name: 'limit',
                in: :query,
                type: :integer,
                description: 'Decides how many entities should be returned',
                example: 3,
                required: false

      parameter name: 'boards',
                in: :query,
                type: :string,
                schema: { '$ref' => '#/components/schemas/include_associated_enum' },
                required: false

      response(200, 'successful with `boards=all`') do
        schema '$ref' => '#/components/schemas/workspace_pages_response'

        let(:boards) { 'all' }

        before do
          user = ::FactoryBot.create(:user)
          wrk = ::FactoryBot.create(:workspace)
          wrk.users << user
          5.times { ::FactoryBot.create :board, workspace: wrk }
          ::FactoryBot.create(:workspace)
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/workspace_pages_response'

        before do
          usr = ::FactoryBot.create(:user)
          5.times { ::FactoryBot.create(:workspace).users << usr }
        end

        after do |example|
          save_response(example, response)
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

        before do
          ::FactoryBot.create :user
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/workspaces/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('show workspace') do
      parameter name: 'boards',
                in: :query,
                type: :string,
                schema: { '$ref' => '#/components/schemas/include_associated_enum' },
                required: false

      tags 'Workspaces'
      produces 'application/json'

      response(200, 'successful with `boards=all`') do
        schema '$ref' => '#/components/schemas/workspace_response'

        before do
          ::FactoryBot.create :user
        end
        let(:boards) { 'all' }
        let(:id) do
          workspace = ::FactoryBot.create(:workspace)
          workspace.boards << ::FactoryBot.create(:board)
          workspace.boards << ::FactoryBot.create(:board)
          workspace.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/workspace_response'

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:workspace).id }

        after do |example|
          save_response(example, response)
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

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:workspace).id }
        let(:workspace) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('delete workspace') do
      tags 'Workspaces'
      response(204, 'successful') do
        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:workspace).id }
        run_test!
      end
    end
  end

  path '/api/workspaces/{id}/assign_user' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'Workspace id'

    post('Assign User') do
      tags 'Workspaces'
      parameter name: 'user', in: :body, schema: { type: :object, properties: { user_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:workspace).id }
        let(:user) { { user_id: ::FactoryBot.create(:user).id } }
        run_test!
      end
    end
  end

  path '/api/workspaces/{id}/unassign_user' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'Workspace id'

    post('Unassign User') do
      tags 'Workspaces'
      parameter name: 'user', in: :body, schema: { type: :object, properties: { user_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:new_user) { ::FactoryBot.create(:user) }
        let(:id) do
          workspace = ::FactoryBot.create(:workspace)
          workspace.users << new_user
          workspace.id
        end
        let(:user) { { user_id: new_user.id } }
        run_test!
      end
    end
  end
end
