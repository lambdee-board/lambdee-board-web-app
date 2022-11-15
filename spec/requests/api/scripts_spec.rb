# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/scripts', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/scripts' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    get('List scripts') do
      tags 'Scripts'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/script_response' }

        before do
          3.times { ::FactoryBot.create(:script) }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('Create Script') do
      tags 'Scripts'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :script, in: :body, schema: { '$ref' => '#/components/schemas/script_request' }

      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/script_response'
        let(:script) do
           task = ::FactoryBot.create(:task)
           {
            name: 'New Script',
            description: 'What script does',
            content: "puts 'Hello world!'",
            script_triggers_attributes: [
              { action: 'create' },
              { subject_type: 'DB::Task', action: 'update' },
              { subject_type: 'DB::Task', subject_id: task.id.to_s, action: 'destroy' }
            ]
           }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/scripts/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show Script') do
      tags 'Scripts'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_response'

        let(:id) { ::FactoryBot.create(:script).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update Script') do
      tags 'Scripts'
      parameter name: 'script', in: :body, schema: { '$ref' => '#/components/schemas/script_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/script_response'

        let(:id) { ::FactoryBot.create(:script, :with_trigger_on_task_creation).id }
        let(:script) do
          {
            name: 'New Name',
            script_triggers_attributes: [
              { action: 'create' },
              { id: ::DB::ScriptTrigger.last.id, _destroy: true },
            ]
          }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete script') do
      tags 'Scripts'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:script).id }
        run_test!
      end
    end
  end
end
