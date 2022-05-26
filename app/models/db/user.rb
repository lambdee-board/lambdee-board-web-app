# frozen_string_literal: true

# Contains the data of a user
# of the frontend interface.
class DB::User < ::ApplicationRecord
  has_many :user_workspaces
  has_many :workspaces, through: :user_workspaces
  has_many :created_tasks, class_name: 'DB::Task', foreign_key: :author_id
  has_and_belongs_to_many :tasks

  enum role: {
    guest: 0,
    regular: 1,
    developer: 2,
    admin: 3,
    manager: 4
  }

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, email: true, length: { maximum: 70 }

  # @return [String]
  def gravatar_url
    hash = ::Digest::MD5.hexdigest(email)
    ::URI::HTTPS.build(host: ::Config::ENV_SETTINGS['gravatar_host'], path: "/avatar/#{hash}").to_s
  end

  # @return [String]
  def avatar_url
    gravatar_url
  end
end
