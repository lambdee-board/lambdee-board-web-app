# frozen_string_literal: true

# User permissions are defined in this class.
class Ability
  include ::CanCan::Ability

  # @param user [DB::User]
  def initialize(user)
    # Define abilities for the user here. For example:
    #
    #   return unless user.present?
    #   can :read, :all
    #   return unless user.admin?
    #   can :manage, :all
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, published: true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/blob/develop/docs/define_check_abilities.md
    return unless user

    @user = user
    set_guest_abilities if user.guest?
    set_regular_abilities if user.regular?
    set_developer_abilities if user.developer? || user.manager?
    set_admin_abilities if user.admin?
  end

  private

  # @return [void]
  def set_guest_abilities
    abilities_for_basic_models(:read)
  end

  # @return [void]
  def set_regular_abilities
    abilities_for_basic_models(%i[read create update])
  end

  # @return [void]
  def set_developer_abilities
    abilities_for_basic_models(:manage)
  end

  # @return [void]
  def set_admin_abilities
    can :manage, :all
  end

  # @param actions [Symbol, Array<Symbol>]
  # @return [void]
  def abilities_for_basic_models(actions)
    can actions,         ::DB::Workspace, users: { id: @user.id }
    can actions,         ::DB::Board,     workspace: { users: { id: @user.id } }
    can actions,         ::DB::List,      board: { workspace: { users: { id: @user.id } } }
    can actions,         ::DB::Tag,       board: { workspace: { users: { id: @user.id } } }
    can actions,         ::DB::Task,      list: { board: { workspace: { users: { id: @user.id } } } }
    can :read,           ::DB::Comment,   task: { list: { board: { workspace: { users: { id: @user.id } } } } }
    can :manage,         ::DB::Comment,   author: @user
    can %i[read update], ::DB::User,      id: @user.id
  end
end
