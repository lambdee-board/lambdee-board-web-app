json.extract! sprint,
              :id,
              :board_id,
              :name,
              :description,
              :started_at,
              :expected_end_at,
              :ended_at,
              :final_list_name,
              :custom_data

json.url api_sprint_url(sprint, format: :json)
