# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/scripts', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/scripts' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

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
            description: 'What sprint does',
            content: "puts 'Hello world!'",
            callback_scripts_attributes: [
              { action: 'create' },
              { subject_type: 'DB::Task', action: 'update' },
              { subject_type: 'DB::Task', subject_id: task.id.to_s, action: 'delete' }
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
end
