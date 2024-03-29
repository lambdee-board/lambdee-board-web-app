# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_01_16_104925) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "boards", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "workspace_id"
    t.string "colour", limit: 9
    t.datetime "deleted_at"
    t.jsonb "custom_data"
    t.index ["workspace_id"], name: "index_boards_on_workspace_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body"
    t.bigint "author_id", null: false
    t.bigint "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.jsonb "custom_data"
    t.index ["author_id"], name: "index_comments_on_author_id"
    t.index ["task_id"], name: "index_comments_on_task_id"
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "lists", force: :cascade do |t|
    t.string "name"
    t.float "pos"
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.boolean "visible", default: false
    t.jsonb "custom_data"
    t.index ["board_id"], name: "index_lists_on_board_id"
  end

  create_table "script_runs", force: :cascade do |t|
    t.bigint "script_id"
    t.text "output"
    t.bigint "initiator_id", null: false
    t.text "input"
    t.integer "state", limit: 2
    t.integer "delay"
    t.datetime "triggered_at"
    t.datetime "executed_at"
    t.index ["initiator_id"], name: "index_script_runs_on_initiator_id"
  end

  create_table "script_triggers", force: :cascade do |t|
    t.bigint "script_id"
    t.string "subject_type"
    t.bigint "subject_id"
    t.string "action"
    t.integer "delay"
    t.string "scope_type"
    t.bigint "scope_id"
    t.bigint "author_id"
    t.boolean "private"
    t.index ["author_id"], name: "index_script_triggers_on_author_id"
    t.index ["scope_type", "scope_id"], name: "index_script_triggers_on_scope"
    t.index ["subject_type", "subject_id"], name: "index_script_triggers_on_subject"
  end

  create_table "script_variables", force: :cascade do |t|
    t.string "owner_type"
    t.bigint "owner_id"
    t.string "name"
    t.string "description"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_script_variables_on_name", unique: true
    t.index ["owner_type", "owner_id", "name"], name: "unique_name_per_owner", unique: true
    t.index ["owner_type", "owner_id"], name: "index_script_variables_on_owner"
  end

  create_table "scripts", force: :cascade do |t|
    t.text "content"
    t.string "name"
    t.text "description"
    t.bigint "author_id", null: false
    t.index ["author_id"], name: "index_scripts_on_author_id"
  end

  create_table "sprint_tasks", force: :cascade do |t|
    t.integer "task_id"
    t.integer "sprint_id"
    t.datetime "added_at"
    t.datetime "completed_at"
    t.string "start_state"
    t.string "state"
    t.jsonb "custom_data"
    t.index ["sprint_id"], name: "index_sprint_tasks_on_sprint_id"
    t.index ["task_id"], name: "index_sprint_tasks_on_task_id"
  end

  create_table "sprints", force: :cascade do |t|
    t.string "name"
    t.datetime "started_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "expected_end_at"
    t.datetime "ended_at"
    t.bigint "board_id"
    t.string "final_list_name"
    t.text "description"
    t.jsonb "custom_data"
    t.index ["board_id"], name: "index_sprints_on_board_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.string "colour", limit: 9
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "custom_data"
    t.index ["board_id"], name: "index_tags_on_board_id"
  end

  create_table "task_tags", force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "task_id", null: false
  end

  create_table "task_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "task_id", null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.float "pos"
    t.bigint "list_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "author_id"
    t.integer "priority"
    t.integer "points"
    t.datetime "deleted_at"
    t.integer "spent_time", default: 0
    t.datetime "start_time"
    t.jsonb "custom_data"
    t.datetime "due_time"
    t.index ["author_id"], name: "index_tasks_on_author_id"
    t.index ["list_id"], name: "index_tasks_on_list_id"
  end

  create_table "ui_script_triggers", force: :cascade do |t|
    t.bigint "script_id"
    t.string "subject_type"
    t.bigint "subject_id"
    t.string "scope_type"
    t.bigint "scope_id"
    t.bigint "author_id"
    t.integer "delay"
    t.boolean "private"
    t.string "colour", limit: 9
    t.string "text", limit: 100
    t.index ["author_id"], name: "index_ui_script_triggers_on_author_id"
    t.index ["scope_type", "scope_id"], name: "index_ui_script_triggers_on_scope"
    t.index ["subject_type", "subject_id"], name: "index_ui_script_triggers_on_subject"
  end

  create_table "user_workspaces", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "workspace_id", null: false
    t.index ["user_id"], name: "index_user_workspaces_on_user_id"
    t.index ["workspace_id"], name: "index_user_workspaces_on_workspace_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.integer "role"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "deleted_at"
    t.text "recent_boards", default: [], array: true
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.jsonb "custom_data"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.jsonb "custom_data"
  end

  add_foreign_key "comments", "tasks"
  add_foreign_key "comments", "users", column: "author_id"
  add_foreign_key "lists", "boards"
  add_foreign_key "script_triggers", "users", column: "author_id"
  add_foreign_key "sprint_tasks", "sprints"
  add_foreign_key "sprint_tasks", "tasks"
  add_foreign_key "tags", "boards"
  add_foreign_key "tasks", "lists"
  add_foreign_key "tasks", "users", column: "author_id"
  add_foreign_key "ui_script_triggers", "users", column: "author_id"
  add_foreign_key "user_workspaces", "users"
  add_foreign_key "user_workspaces", "workspaces"
end
