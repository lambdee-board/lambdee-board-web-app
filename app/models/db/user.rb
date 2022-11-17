# frozen_string_literal: true

# Contains the data of a user
# of the frontend interface.
class DB::User < ::ApplicationRecord
  include ::ScriptTriggerable
  include ::CustomDatable
  include ::PgSearch::Model

  acts_as_paranoid double_tap_destroys_fully: false

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: ::DB::JwtDenylist

  self.skip_session_storage = %i[http_auth params_auth]

  has_many :created_tasks, class_name: 'DB::Task', foreign_key: :author_id
  has_many :comments, class_name: 'DB::Comment', foreign_key: :author_id
  has_many :user_workspaces, dependent: :destroy
  has_many :task_users, class_name: 'DB::TaskUser', dependent: :destroy
  has_many :workspaces, through: :user_workspaces
  has_many :tasks, through: :task_users

  pg_search_scope :search,
                  against: %i[name email role],
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  default_scope { order(:id) }

  scope :role_collection, ->(roles) { where(role: roles) }
  scope :role, ->(role) { where(role: role) }
  scope :created_at_from, ->(created_at) { where('created_at >= ?', created_at) }
  scope :created_at_to, ->(created_at) { where('created_at < ?', ::Time.parse(created_at).tomorrow) }
  scope :workspace_id, ->(workspace_id) { joins(:user_workspaces).where(user_workspaces: { workspace_id: workspace_id }) }

  enum role: {
    guest: 0,
    regular: 1,
    developer: 2,
    manager: 3,
    admin: 4
  }

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, email: true, length: { maximum: 70 }

  delegate :can?, :cannot?, to: :ability

  # @return [Ability]
  def ability
    @ability ||= ::Ability.new(self)
  end

  # @return [Hash]
  def jwt_payload
    { role: role }
  end

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
  # return [void]
  def update_last_viewed_board(board)
    self.last_viewed_board = board
    save(validate: false)
  end

  # Prepends an user's array containing last viewed
  # boards with the `id` of given `DB::Board`.
  #
  # @param board [DB::Board]
  # return [void]
  def last_viewed_board=(board)
    return unless board.id

    board_id = board.id.to_s
    return if recent_boards.first == board_id

    recent_boards.delete(board_id)
    recent_boards.prepend(board_id)
    self.recent_boards = recent_boards.first(6)
  end
end
