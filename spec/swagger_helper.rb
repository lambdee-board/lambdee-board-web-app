# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

def generate_jwt_token(user)
  ::Devise::JWT::TestHelpers.auth_headers({}, user)['Authorization']
end

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
          authorization: {
            name: 'Authorization',
            in: :header,
            type: :string,
            description: 'JWT token',
            example: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiZGV2ZWxvcGVyIiwic3ViIjoiMSIsInNjcCI6InVzZXIiLCJhdWQiOm51bGwsImlhdCI6MTY2NjE4MDIzMiwiZXhwIjoxNjY3NDc2MjMyLCJqdGkiOiJhMzdlZTA5MC0zZGJmLTRhMzgtOTFiNy1mZTJlM2FiYjlkY2QifQ.tGGjFHfMszfGCfNZS6I-hQNLSu_2Xfs3W4hI8IT4CW0',
            required: true
          },
          include_associated_enum: {
            type: :string,
            enum: [
              'visible',
              'invisible',
              'non-archived',
              'archived',
              'all'
            ]
          },
          lambdee_models_enum: {
            type: :string,
            enum: %w[
              DB::User
              DB::Workspace
              DB::Board
              DB::List
              DB::Task
              DB::Comment
              DB::Tag
              DB::Sprint
              DB::UserWorkspace
              DB::TaskUser
              DB::TaskTag
              DB::SprintTask]
          },
          user_pages_response: {
            type: :object,
            properties: {
              users: { type: :array, items: { '$ref' => '#components/schemas/user_response'}},
              total_pages: { type: :integer },
            },
            required: %w[users]
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
              user: {
                type: :object,
                properties: {
                  name: { type: :string },
                  email: { type: :string },
                  password: { type: :string },
                  role: { type: :string, enum: %w[guest regular developer admin manager]},
                }
              }
            },
            required: %w[name email]
          },
          user_update_request: {
            type: :object,
            properties: {
              user: {
                type: :object,
                properties: {
                  name: { type: :string },
                  email: { type: :string },
                  password: { type: :string },
                  current_password: { type: :string },
                  role: { type: :string, enum: %w[guest regular developer admin manager]},
                }
              }
            },
            required: %w[current_password]
          },
          user_sign_in_request: {
            type: :object,
            properties: {
              user: {
                type: :object,
                properties: {
                  email: { type: :string },
                  password: { type: :string }
              }
              }
            },
            required: %w[email password]
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
          sprint_pages_response: {
            type: :object,
            properties: {
              sprints: { type: :array, items: { '$ref' => '#components/schemas/sprint_response'}},
              total_pages: { type: :integer },
            },
            required: %w[sprints]
          },
          sprint_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              board_id: { type: :integer },
              name: { type: :string },
              description: { type: %i[string null], },
              started_at: { type: :string, format: :date_time },
              expected_end_at: { type: :string, format: :date_time },
              ended_at: { type: %i[string null], format: :date_time },
              final_list_name: { type: :string },
              url: { type: :string },
              tasks: {
                type: :array,
                items: { '$ref' => '#/components/schemas/task_with_sprint_task_response' },
                nullable: true,
              }
            },
            required: %w[id name]
          },
          task_with_sprint_task_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              priority: { type: :string },
              spent_time: { type: :integer },
              points: { type: :integer },
              added_at: { type: :string, format: :date_time },
              completed_at: { type: %i[string null], format: :date_time },
              start_state: { type: :string },
              state: { type: :string }
            },
            required: %w[id]
          },
          sprint_request: {
            type: :object,
            properties: {
              board_id: { type: :integer },
              name: { type: :string },
              description: { type: :string },
              started_at: { type: :string, format: :date_time, example: '2025-12-11T23:00:00' },
              expected_end_at: { type: :string, format: :date_time, example: '2025-12-18T23:00:00' }
            },
            required: %w[name expected_end_at]
          },
          task_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              description: { type: %i[string null] },
              due_time: { type: %i[string null], format: :date_time },
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
              tags: { type: :array, items: { '$ref' => '#/components/schemas/tag_response' }, nullable: true },
              author: { type: :object, schema: { '$ref' => '#/components/schemas/user_response' }, nullable: true }
            },
            required: %w[id name pos priority points list_id deleted_at]
          },
          task_request: {
            type: :object,
            properties: {
              name: { type: :string },
              description: { type: :string },
              due_time: { type: :string, format: :date_time, example: '2025-12-18T23:00:00' },
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
              visible: { type: %i[boolean null] },
              deleted_at: { type: %i[string null], format: :date_time },
              board_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
              url: { type: :string },
              board_url: { type: :string },
              tasks: { type: :array, items: { '$ref' => '#/components/schemas/task_response' }, nullable: true }
            },
            required: %w[id name pos visible board_id created_at updated_at deleted_at]
          },
          list_request: {
            type: :object,
            properties: {
              name: { type: :string },
              pos: { type: :number, format: :float },
              visible: { type: :boolean },
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
          script_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              description: { type: :string },
              content: { type: :string },
              url: { type: :string },
              script_triggers: {
                type: :array,
                items: { '$ref' => '#/components/schemas/nested_script_trigger_response' }
              }
            },
            required: %w[]
          },
          script_request: {
            type: :object,
            properties: {
              name: { type: :string },
              description: { type: :string },
              content: { type: :string },
              script_triggers_attributes: {
                type: :array,
                items: { '$ref' => '#/components/schemas/nested_script_trigger_request' }
              }
            },
            required: %w[name]
          },
          nested_script_trigger_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              script_id: { type: %i[integer null] },
              subject_type: { type: %i[string null] },
              subject_id: { type: %i[integer null] },
              action: { type: :string },
              delay: { type: :integer },
              url: { type: :string }
            },
            required: %w[]
          },
          nested_script_trigger_request: {
            type: :object,
            properties: {
              id: { type: :integer, description: 'Needed only for updates and destroys.' },
              script_id: { type: :integer },
              subject_type: { '$ref' => '#/components/schemas/lambdee_models_enum' },
              subject_id: { type: :integer },
              action: { type: :string, enum: %w[create update destroy] },
              delay: { type: :integer, description: 'Number of seconds of script execution delay' },
              _destroy: { type: :boolean, description: 'If `true` callback for given `id` will be destroyed. Works only nested in sprint.' },
            },
            required: %w[action]
          },
          script_trigger_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              script_id: { type: :integer },
              subject_type: { type: %i[string null] },
              subject_id: { type: %i[integer null] },
              action: { type: :string },
              delay: { type: :integer },
              url: { type: :string }
            },
            required: %w[]
          },
          script_trigger_request: {
            type: :object,
            properties: {
              script_id: { type: :integer },
              subject_type: { '$ref' => '#/components/schemas/lambdee_models_enum' },
              subject_id: { type: :integer },
              action: { type: :string },
              delay: { type: :integer, description: 'Number of seconds of script execution delay' },
            },
            required: %w[script_id action]
          },
          script_run_response: {
            type: :object,
            properties: {
              id: { type: :integer },
              script_id: { type: :integer },
              script_name: { type: :string },
              initiator_id: { type: :integer },
              input: { type: %i[string null] },
              triggered_at: { type: :string, format: :date_time },
              executed_at: { type: %i[string null], format: :date_time },
              output: { type: :string },
              state: { type: :string },
              delay: { type: %i[integer null] },
              url: { type: :string }
            },
            required: %w[]
          },
          script_run_request: {
            type: :object,
            properties: {
              output: { type: :string },
              state: { type: :string, enum: %w[running executed failed timed_out connection_failed] },
            },
            required: %w[]
          }
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
