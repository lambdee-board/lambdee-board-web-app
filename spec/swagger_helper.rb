# frozen_string_literal: true

require 'rails_helper'

def save_response(example, response)
  example.metadata[:response][:content] ||= { 'application/json' => { examples: {} } }

  example.metadata[:response][:content]['application/json'][:examples].merge!(
    {
      example.metadata[:response][:description] => {
        summary: example.metadata[:response][:description],
        value: ::JSON.parse(response.body, symbolize_names: true),
      }
    }
  )
end

::RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.swagger_root = ::Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under swagger_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a swagger_doc tag to the
  # the root example_group in your specs, e.g. describe '...', swagger_doc: 'v2/swagger.json'
  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'Lambdee API V1',
        version: 'v1'
      },
      paths: {},
      components: {
        schemas: {
          include_associated_enum: {
            type: :string,
            enum: [
              'visible',
              'archived',
              'all'
            ]
          },
          user_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              email: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              avatar_url: { type: :string },
              url: { type: :string },
              role: { type: :string },
            },
            required: %w[id name]
          },
          user_request: {
            type: :object,
            properties: {
              name: { type: :string },
              email: { type: :string },
              password: { type: :string },
              role: { type: :string, enum: %w[guest regular developer admin]},
            },
            required: %w[name email]
          },
          comment_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              body: { type: :string },
              deleted_at: { type: %i[string null], format: :date_time },
              author_id: { type: :integer },
              task_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              url: { type: :string },
              users: { type: :array, items: { '$ref' => '#/components/schemas/user_response' }, nullable: true }
            },
            required: %w[id body deleted_at url]
          },
          tag_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              colour: { type: :string },
              board_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              url: { type: :string },
              board_url: { type: :string }
            },
            required: %w[id]
          },
          tag_request: {
            type: :object,
            properties: {
              name: { type: :string },
              colour: { type: :string },
              board_id: { type: :integer },
              task_id: { type: :integer },
            },
            required: %w[]
          },
          task_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              description: { type: %i[string null] },
              pos: { type: %i[number null], format: :float },
              priority: { type: %i[string null] },
              points: { type: %i[number null], format: :float },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              deleted_at: { type: %i[string null], format: :date_time },
              list_id: { type: :integer },
              list_url: { type: :string },
              url: { type: :string },
              users: { type: :array, items: { '$ref' => '#/components/schemas/user_response' }, nullable: true },
              tags: { type: :array, items: { '$ref' => '#/components/schemas/tag_response' }, nullable: true }
            },
            required: %w[id name pos priority points list_id deleted_at]
          },
          task_request: {
            type: :object,
            properties: {
              name: { type: :string },
              description: { type: :string },
              pos: {
                type: :number,
                format: :float,
                description: 'If not given, value will be set as for the last item in the list.' },
              priority: { type: :string, enum: %w[very_low low medium high very_high] },
              points: { type: :number, format: :float },
              list_id: { type: :integer },
              author_id: { type: :integer },
            },
            required: %w[name list_id author_id]
          },
          list_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              pos: { type: :number, format: :float },
              deleted_at: { type: %i[string null], format: :date_time },
              board_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              url: { type: :string },
              board_url: { type: :string },
              tasks: { type: :array, items: { '$ref' => '#/components/schemas/task_response' }, nullable: true }
            },
            required: %w[id name board_id created_at updated_at deleted_at]
          },
          list_request: {
            type: :object,
            properties: {
              name: { type: :string },
              pos: { type: :number, format: :float },
              board_id: { type: :integer }
            },
            required: %w[name board_id]
          },
          board_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              workspace_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              deleted_at: { type: %i[string null], format: :date_time },
              url: { type: :string },
              workspace_url: { type: :string },
              lists: { type: :array, items: { '$ref' => '#/components/schemas/list_response' }, nullable: true  }
            },
            required: %w[id name workspace_id created_at updated_at deleted_at]
          },
          board_request: {
            type: :object,
            properties: {
              name: { type: :string },
              workspace_id: { type: :integer },
            },
            required: %w[name workspace_id]
          },
          workspace_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              deleted_at: { type: %i[string null], format: :date_time },
              url: { type: :string },
              boards: {
                type: :array,
                items: { '$ref' => '#/components/schemas/board_response' },
                nullable: true,
              }
            },
            required: %w[id name created_at updated_at deleted_at]
          },
          workspace_request: {
            type: :object,
            properties: {
              name: { type: :string },
            },
            required: %w[name]
          },
        }
      },
      servers: [
        {
          url: '{defaultProtocol}://{defaultHost}',
          variables: {
            defaultProtocol: {
              default: ::Rails.application.default_url_options[:protocol]
            },
            defaultHost: {
              default: ::Rails.application.default_url_options[:host]
            }
          }
        }
      ]
    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The swagger_docs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.swagger_format = :yaml
end
