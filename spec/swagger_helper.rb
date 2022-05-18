# frozen_string_literal: true

require 'rails_helper'

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
        title: 'API V1',
        version: 'v1'
      },
      paths: {},
      components: {
        schemas: {
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
            },
            required: %w[id name email created_at updated_at]
          },
          user_request: {
            type: :object,
            properties: {
              name: { type: :string },
              email: { type: :string },
            },
            required: %w[name email]
          },
          list_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              pos: { type: :number },
              deleted: { type: :boolean },
              board_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              url: { type: :string },
              board_url: { type: :string },
            },
            required: %w[id name board_id created_at updated_at]
          },
          list_request: {
            type: :object,
            properties: {
              name: { type: :string },
              pos: { type: :number },
              deleted: { type: :boolean },
              board_id: { type: :integer },
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
              url: { type: :string },
              workspace_url: { type: :string },
            },
            required: %w[id name workspace_id created_at updated_at]
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
              url: { type: :string },
              boards: {
                '$ref' => '#/components/schemas/board_response',
                nullable: true
              }
            },
            required: %w[id name created_at updated_at]
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
