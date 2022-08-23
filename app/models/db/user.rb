# frozen_string_literal: true

# Contains the data of a user
# of the frontend interface.
class DB::User < ::ApplicationRecord
  acts_as_paranoid double_tap_destroys_fully: false

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :user_workspaces
  has_many :workspaces, through: :user_workspaces
  has_many :created_tasks, class_name: 'DB::Task', foreign_key: :author_id
  has_many :comments, class_name: 'DB::Comment', foreign_key: :author_id
  has_and_belongs_to_many :tasks

  default_scope { order(:id) }

  scope :role, ->(role) { where(role: role) }
  scope :created_at_from, ->(created_at) { where('created_at >= ?', created_at) }
  scope :created_at_to, ->(created_at) { where('created_at < ?', ::Time.parse(created_at).tomorrow) }
  scope :workspace_id, ->(workspace_id) { joins(:user_workspaces).where(user_workspaces: { workspace_id: workspace_id }) }
  scope :search, ->(string) { where('name LIKE ? OR email LIKE ?', "%#{string}%", "%#{string}%") }

  enum role: {
    guest: 0,
    regular: 1,
    developer: 2,
    admin: 3,
    manager: 4
  }

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, email: true, length: { maximum: 70 }

  alias deactivated? deleted?
  alias deactivate! destroy!
  alias activate! recover!

  # @return [Boolean]
  def active?
    !deleted?
  end

  # @return [String]
  def gravatar_url
    hash = ::Digest::MD5.hexdigest(email)
    ::URI::HTTPS.build(host: ::Config::ENV_SETTINGS['gravatar_host'], path: "/avatar/#{hash}").to_s
  end

  # @return [String]
  def avatar_url(size: nil)
    "#{gravatar_url}#{size && "?size=#{size}"}"
  end

  # @return [String]
  def activity_status
    active? ? 'active' : 'inactive'
  end

  # Prepends an user's array containing last viewed
  # boards with the `id` of given `DB::Board` and
  # saves the user record.
  #
  # @param board [DB::Board]
  # return [Void]
  def update_last_viewed_board(board)
    self.last_viewed_board = board
    save(validate: false)
  end

  # Prepends an user's array containing last viewed
  # boards with the `id` of given `DB::Board`.
  #
  # @param board [DB::Board]
  # return [Void]
  def last_viewed_board=(board)
    return unless board.id

    board_id = board.id.to_s
    return if recent_boards.first == board_id

    recent_boards.delete(board_id)
    recent_boards.prepend(board_id)
    self.recent_boards = recent_boards.first(5)
  end
end
