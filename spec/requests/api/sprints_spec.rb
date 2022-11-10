# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/sprints', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/boards/{id}/sprints' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'Board id'

    get("List board's sprints") do
      tags 'Sprints'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/sprint_response' }

        let(:id) do
          board = ::FactoryBot.create(:board)
          3.times { ::FactoryBot.create(:sprint, board: board) }
          board.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/sprints' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    post('Create sprint') do
      tags 'Sprints'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :sprint, in: :body, schema: { '$ref' => '#/components/schemas/sprint_request' }

      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/sprint_response'
        let(:sprint) do
           {
            name: 'New Sprint',
            description: 'Example description of new sprint',
            description: 'Example description of new sprint',
            expected_end_at: '2025-12-11T23:00:00',
            board_id: ::FactoryBot.create(:board).id
           }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/sprints/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    parameter name: 'id', in: :path, type: :string, description: 'id'
    parameter name: 'tasks',
              in: :query,
              type: :string,
              example: 'all',
              required: false

    get('Show Sprint') do
      tags 'Sprints'
      produces 'application/json'

      response(200, 'successful with `tasks=all`') do
        schema '$ref' => '#/components/schemas/sprint_response'

        let(:id) { ::FactoryBot.create(:sprint, :with_task).id }
        let(:tasks) { 'all' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/sprint_response'

        let(:id) { ::FactoryBot.create(:sprint).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update Sprint') do
      tags 'Sprints'
      parameter name: 'sprint', in: :body, schema: { '$ref' => '#/components/schemas/sprint_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/sprint_response'

        let(:id) { ::FactoryBot.create(:sprint).id }
        let(:sprint) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete sprint') do
      tags 'Sprints'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:sprint).id }
        run_test!
      end
    end
  end

  path '/api/sprints/{id}/end' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    parameter name: 'id', in: :path, type: :string, description: 'id'

    put('End sprint') do
      tags 'Sprints'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/sprint_response'

        let(:id) { ::FactoryBot.create(:sprint).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/boards/{id}/active_sprint' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show active sprint') do
      tags 'Sprints'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/sprint_response'

        let(:id) { ::FactoryBot.create(:sprint).board.id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/sprints/{id}/burn_up_chart' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show data for burn up chart') do
      tags 'Sprints'
      produces 'application/json'
      response(200, 'successful') do
        let(:id) { ::FactoryBot.create(:sprint).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end
end
