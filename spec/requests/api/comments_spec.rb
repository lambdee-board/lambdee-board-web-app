require 'swagger_helper'

::RSpec.describe 'api/comments', type: :request do

  before(:each) do
    ::FactoryBot.create :user
  end

  path '/api/tasks/{id}/comments' do
    parameter name: 'id', in: :path, type: :string, description: 'Task id'

    get("List task's comments") do
      tags 'Comments'
      produces 'application/json'
      parameter name: 'with_author',
                in: :query,
                type: :string,
                required: false

      response(200, 'successful with `with_author=true`') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/comment_response' }

        let(:id) do
          task = ::FactoryBot.create(:task)
          author = ::FactoryBot.create(:user)
          5.times { ::FactoryBot.create(:comment, task: task, author: author) }
          task.id
        end
        let(:with_author) { 'true' }

        after do |example|
          save_response(example, response)
        end
        run_test!
      end

      response(200, 'successful') do
        schema type: :array,
          items: { '$ref' => '#/components/schemas/comment_response' }

        let(:id) do
          task = ::FactoryBot.create(:task)
          author = ::FactoryBot.create(:user)
          5.times { ::FactoryBot.create(:comment, task: task, author: author) }
          task.id
        end

        after do |example|
          save_response(example, response)
        end
        run_test!
      end
    end
  end
end
