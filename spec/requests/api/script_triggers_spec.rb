# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/script_triggers', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  path '/api/script_triggers' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    post('Create script trigger') do
      tags 'Script triggers'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :script_trigger, in: :body, schema: { '$ref' => '#/components/schemas/script_trigger_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/script_trigger_response'
        let(:script_trigger) do
          task = ::FactoryBot.create(:task)
          script = ::FactoryBot.create(:script)
          { action: 'destroy', subject_type: 'DB::Task', subject_id: task.id, script_id: script.id }
        end

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

  path '/api/script_triggers/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show script trigger') do
      tags 'Script triggers'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_trigger_response'

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:script_trigger).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update script trigger') do
      tags 'Script triggers'
      parameter name: 'script_trigger', in: :body, schema: { '$ref' => '#/components/schemas/script_trigger_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_trigger_response'

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:script_trigger).id }
        let(:script_trigger) { { action: 'destroy' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete script_trigger') do
      tags 'Script triggers'
      response(204, 'successful') do
        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:script_trigger).id }
        run_test!
      end
    end
  end
end
