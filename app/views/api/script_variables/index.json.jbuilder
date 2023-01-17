json.script_variables @script_variables, partial: 'script_variable', as: :script_variable
json.total_pages @script_variables.total_pages if params[:page]
