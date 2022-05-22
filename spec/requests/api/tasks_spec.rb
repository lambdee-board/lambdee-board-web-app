require 'swagger_helper'

::RSpec.describe 'api/lists', type: :request do

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/tasks' do

    get('List tasks') do
      tags 'Tasks'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/task_response' }

        before do
          5.times { ::FactoryBot.create :task }
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    post('Create Task') do
      tags 'Tasks'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :task, in: :body, schema: { '$ref' => '#/components/schemas/task_request' }
      response(201, 'successful') do
        schema '$ref' => '#/components/schemas/task_response'
        let(:list) { ::FactoryBot.create(:list) }
        let(:user) { ::FactoryBot.create(:user) }
        let(:task) { { name: 'New Task', list_id: list.id, author_id: user.id } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/tasks/{id}' do
    parameter name: 'id', in: :path, type: :string, description: 'id'

    get('Show Taks') do
      tags 'Tasks'
      produces 'application/json'
      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/task_response'

        let(:id) { ::FactoryBot.create(:task).id }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    put('Update Task') do
      tags 'Tasks'
      parameter name: 'task', in: :body, schema: { '$ref' => '#/components/schemas/task_request' }

      consumes 'application/json'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/task_response'

        let(:id) { ::FactoryBot.create(:task).id }
        let(:task) { { name: 'New Name' } }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end

    delete('Delete Task') do
      tags 'Tasks'
      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:task).id }
        run_test!
      end
    end
  end
end