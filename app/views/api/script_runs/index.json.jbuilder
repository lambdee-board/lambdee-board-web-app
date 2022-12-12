# frozen_string_literal: true

json.runs @script_runs, partial: 'script_run', as: :script_run
json.total_pages @script_runs.total_pages if params[:page]
