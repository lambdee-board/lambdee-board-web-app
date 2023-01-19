# frozen_string_literal: true

require 'swagger_helper'

::RSpec.describe 'api/ui_script_triggers', type: :request do
  let(:Authorization) { generate_jwt_token(::FactoryBot.create(:user, role: :admin)) }

  path '/api/ui_script_triggers' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

    post('Create ui script trigger') do
      tags 'UI Script triggers'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :ui_script_trigger, in: :body, schema: { '$ref' => '#/components/schemas/ui_script_trigger_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/ui_script_trigger_response'
        let(:ui_script_trigger) do
          task = ::FactoryBot.create(:task)
          user = ::FactoryBot.create(:user)
          script = ::FactoryBot.create(:script)
          { subject_type: 'DB::Task', subject_id: task.id, script_id: script.id, delay: 1, colour: '#ffffff', private: false, author_id: user.id, text: 'click me'  }
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

  path '/api/ui_script_triggers/{id}' do
    parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show ui script trigger') do
      tags 'UI Script triggers'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/ui_script_trigger_response'

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:ui_script_trigger).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update ui script trigger') do
      tags 'UI Script triggers'
      parameter name: 'ui_script_trigger', in: :body, schema: { '$ref' => '#/components/schemas/ui_script_trigger_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/ui_script_trigger_response'

        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:ui_script_trigger).id }
        let(:ui_script_trigger) { { action: 'destroy' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete ui_script_trigger') do
      tags 'UI Script triggers'
      response(204, 'successful') do
        before do
          ::FactoryBot.create :user
        end
        let(:id) { ::FactoryBot.create(:ui_script_trigger).id }
        run_test!
      end
    end

    path '/api/ui_script_triggers/{id}/executions' do
      parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

      post('Execute script connected with ui script trigger') do
        tags 'UI Script triggers'
        consumes 'application/json'
        produces 'application/json'
        parameter name: 'id', in: :path, type: :string, description: 'id'
        parameter name: :ui_script_trigger, in: :body, schema: { '$ref' => '#/components/schemas/ui_script_trigger_execution_request' }
        response(201, 'successful') do
          let(:task) { ::FactoryBot.create(:task) }
          let(:ui_script_trigger) { { subject_id: task.id } }
          let(:id) { ::FactoryBot.create(:ui_script_trigger, subject: task).id }
          run_test!
        end
      end
    end

    path '/api/tasks/{id}/ui_script_triggers' do
      parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

      get('List ui script triggers of a single task') do
        tags 'UI Script triggers'
        consumes 'application/json'
        produces 'application/json'
        parameter name: 'id', in: :path, type: :string, description: 'id'
        response(200, 'successful') do
          schema type: :array, items: { '$ref' => '#/components/schemas/ui_script_trigger_response' }
          let(:id) do
            task = ::FactoryBot.create(:task)
            ::FactoryBot.create(:ui_script_trigger, subject: task)
            ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: task.board)
            task.id
          end
          run_test!
        end
      end
    end

    path '/api/boards/{id}/ui_script_triggers' do
      parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

      get('List ui script triggers of a single board') do
        tags 'UI Script triggers'
        consumes 'application/json'
        produces 'application/json'
        parameter name: 'id', in: :path, type: :string, description: 'id'
        response(200, 'successful') do
          schema type: :array, items: { '$ref' => '#/components/schemas/ui_script_trigger_response' }
          let(:id) do
            board = ::FactoryBot.create(:board)
            ::FactoryBot.create(:ui_script_trigger, subject: board)
            ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: board.workspace)
            board.id
          end
          run_test!
        end
      end
    end

    path '/api/workspaces/{id}/ui_script_triggers' do
      parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

      get('List ui script triggers of a single workspace') do
        tags 'UI Script triggers'
        consumes 'application/json'
        produces 'application/json'
        parameter name: 'id', in: :path, type: :string, description: 'id'
        response(200, 'successful') do
          schema type: :array, items: { '$ref' => '#/components/schemas/ui_script_trigger_response' }
          let(:id) do
            workspace = ::FactoryBot.create(:workspace)
            ::FactoryBot.create(:ui_script_trigger, subject: workspace)
            workspace.id
          end
          run_test!
        end
      end
    end

    path '/api/users/current/ui_script_triggers' do
      parameter name: 'Authorization', in: :header, schema: { '$ref' => '#/components/schemas/authorization' }

      get('List global ui script triggers of the current user') do
        tags 'UI Script triggers'
        consumes 'application/json'
        produces 'application/json'
        response(200, 'successful') do
          schema type: :array, items: { '$ref' => '#/components/schemas/ui_script_trigger_response' }
          let(:id) do
            ::FactoryBot.create(:ui_script_trigger, author: @user)
          end
          run_test!
        end
      end
    end
  end
end
