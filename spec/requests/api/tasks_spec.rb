require 'swagger_helper'

::RSpec.describe 'api/tasks', type: :request do

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
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    get('Show Taks') do
      parameter name: 'include_associations', in: :query, type: :string, required: false, description: 'If true, extended object with all associations is returned.'
      tags 'Tasks'
      produces 'application/json'

      response(200, 'successful with `include_associations=true`') do
        schema '$ref' => '#/components/schemas/task_response'

        let(:id) do
          task = ::FactoryBot.create(:task)
          2.times { task.users << ::FactoryBot.create(:user) }
          3.times { task.tags << ::FactoryBot.create(:tag) }
          task.id
        end
        let(:include_associations) { 'true' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

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

  path '/api/tasks/{id}/add_time' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    put('Add time') do
      tags 'Tasks'
      parameter name: 'add_time', in: :body, schema: {
        type: :object,
        properties: {
          time: { type: :integer },
          unit: { type: :string, enum: ::AddTaskTimeService::TIME_UNITS }
        }
      }

      consumes 'application/json'

      response(200, 'successful') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:add_time) { { time: 1200 } }
        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(422, 'incorrect unit') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:add_time) { { time: 1, unit: :inexistent } }
        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(422, 'negative time') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:add_time) { { time: -20 } }
        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(422, 'non integer time') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:add_time) { { time: 'dupa' } }
        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end

  path '/api/tasks/{id}/attach_tag' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    post('Attach Tag') do
      tags 'Tasks'
      parameter name: 'tag', in: :body, schema: { type: :object, properties: { tag_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:tag) { { tag_id: ::FactoryBot.create(:tag).id } }
        run_test!
      end
    end
  end


  path '/api/tasks/{id}/detach_tag' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    post('Detach Tag') do
      tags 'Tasks'
      parameter name: 'tag', in: :body, schema: { type: :object, properties: { tag_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:new_tag) { ::FactoryBot.create(:tag) }
        let(:id) do
          task = ::FactoryBot.create(:task)
          task.tags << new_tag
          task.id
        end
        let(:tag) { { tag_id: new_tag.id } }
        run_test!
      end
    end
  end

  path '/api/tasks/{id}/assign_user' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    post('Assign User') do
      tags 'Tasks'
      parameter name: 'user', in: :body, schema: { type: :object, properties: { user_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:id) { ::FactoryBot.create(:task).id }
        let(:user) { { user_id: ::FactoryBot.create(:user).id } }
        run_test!
      end
    end
  end


  path '/api/tasks/{id}/unassign_user' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    post('Unassign User') do
      tags 'Tasks'
      parameter name: 'user', in: :body, schema: { type: :object, properties: { user_id: { type: :integer } } }

      consumes 'application/json'

      response(204, 'successful') do
        let(:new_user) { ::FactoryBot.create(:user) }
        let(:id) do
          task = ::FactoryBot.create(:task)
          task.users << new_user
          task.id
        end
        let(:user) { { user_id: new_user.id } }
        run_test!
      end
    end
  end
end
