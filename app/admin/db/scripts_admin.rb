# frozen_string_literal: true

::Trestle.resource(:scripts, scope: ::DB) do
  menu do
    item :scripts, icon: 'fa fa-gem', priority: -8
  end

  collection do
    model.includes(:author, :script_triggers, :ui_script_triggers)
  end

  table do
    column :id
    column :name
    column :description do |s|
      s.description&.truncate(50)
    end
    column :content do |s|
      s.content&.truncate(30)
    end
    column :author, sort: false
    column :script_triggers, align: :center, header: 'ST Count' do |s|
      s.script_triggers.size
    end
    column :ui_script_triggers, align: :center, header: 'UI ST Count' do |s|
      s.ui_script_triggers.size
    end
    actions
  end

  form do |script|
    tab :script do
      text_field :name
      text_area :description
      text_area :content
      collection_select :author_id, ::DB::User.all, :id, :name
    end

    tab :script_triggers, badge: script.script_triggers.count do
      table ::DB::ScriptTriggersAdmin.table, collection: script.script_triggers
    end

    tab :ui_script_triggers, badge: script.ui_script_triggers.count do
      table ::DB::UiScriptTriggersAdmin.table, collection: script.ui_script_triggers
    end
  end
end
