# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/scripts', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/script_runs' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    get('List script runs') do
      tags 'ScriptRuns'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/script_run_response' }

        before do
          3.times { ::FactoryBot.create(:script_run) }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/scripts/{id}/script_runs' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'Script id'

    get("List script's script runs") do
      tags 'ScriptRuns'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/script_run_response' }

        let(:id) do
          script = ::FactoryBot.create(:script)
          ::FactoryBot.create(:script_run, script: script)
          script.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/script_runs/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show script run') do
      tags 'ScriptRuns'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_run_response'

        let(:id) { ::FactoryBot.create(:script_run).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update script run') do
      tags 'ScriptRuns'
      parameter name: 'script', in: :body, schema: { '$ref' => '#/components/schemas/script_run_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_run_response'

        let(:id) { ::FactoryBot.create(:script_run).id }
        let(:script) do
          {
            output: 'example output',
            state: 'executed',
          }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end
end
