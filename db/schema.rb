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

ActiveRecord::Schema[7.0].define(version: 2022_10_19_151631) do
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
    t.index ["workspace_id"], name: "index_boards_on_workspace_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body"
    t.bigint "author_id", null: false
    t.bigint "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["author_id"], name: "index_comments_on_author_id"
    t.index ["task_id"], name: "index_comments_on_task_id"
  end

  create_table "lists", force: :cascade do |t|
    t.string "name"
    t.float "pos"
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.boolean "visible", default: false
    t.index ["board_id"], name: "index_lists_on_board_id"
  end

  create_table "sprints", force: :cascade do |t|
    t.string "name"
    t.datetime "start_date"
    t.datetime "due_date"
    t.datetime "end_date"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.string "colour", limit: 9
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id"], name: "index_tags_on_board_id"
  end

  create_table "tags_tasks", id: false, force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "task_id", null: false
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
    t.index ["author_id"], name: "index_tasks_on_author_id"
    t.index ["list_id"], name: "index_tasks_on_list_id"
  end

  create_table "tasks_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "task_id", null: false
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
  end

  add_foreign_key "comments", "tasks"
  add_foreign_key "comments", "users", column: "author_id"
  add_foreign_key "lists", "boards"
  add_foreign_key "tags", "boards"
  add_foreign_key "tasks", "lists"
  add_foreign_key "tasks", "users", column: "author_id"
  add_foreign_key "user_workspaces", "users"
  add_foreign_key "user_workspaces", "workspaces"
end
