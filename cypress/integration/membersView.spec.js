
describe('Members View', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')
    // clear cookies!
    cy.clearCookies()
    // clear localStorage
    cy.clearLocalStorage()
    cy.visit('/login')
    cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
      .type('b-spinka@example.com')
    cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
      .type('password')
    cy.contains('Login').click()
  })
  context('Accessing view', () => {
    it('opens members view from from navbar', () => {
      cy.contains('.Button span', 'Members').click()
      cy.contains('#UserFilter-select-label', 'None')
      cy.get('.UserListItem-dates').should('exist')
    })

    it('opens members view from from workspace', () => {
      cy.contains('Workspaces').click()
      cy.get('.Workspace-menu-item').first().click()
      cy.get('body').first().click()


      cy.contains('.List div', 'Members').click()
      cy.get('#UserFilter-select-label').should('not.have.text', 'None')
      cy.contains('#UserFilter-select-label', 'Netflux')
      cy.get('.UserListItem-dates').should('exist')
    })
  })

  context.only('Filters and pagination functionality', () => {
    beforeEach(() => {
      cy.visit('/members')
    })
    it('can switch to second page', () => {
      cy.get('button[aria-label="Go to page 2"]').click({ force: true })
      cy.contains('.UserListItem-base', 'Herman Schmidt')
    })

    it('can search by name after enter press', () => {
      cy.get('input#UserFilter-search-input').click().type('Herman{enter}')
      cy.contains('.UserListItem-base', 'Herman Schmidt')
    })

    it('can search by name after button press', () => {
      cy.get('input#UserFilter-search-input').click().type('Herman')
      cy.get('button.UserFilter-search-button').click()
      cy.contains('.UserListItem-base', 'Herman Schmidt')
    })

    it('can search by workspace', () => {
      cy.contains('#UserFilter-select-label', 'None').click()
      cy.contains('.UserFilter-select-item', 'Netflux').click()
      cy.contains('.UserListItem-base', 'Brice Spinka')
    })

    it('can search by admin role after button press', () => {
      cy.get('.RoleChip').click({ multiple: true })
      cy.contains('.RoleChip', 'admin').click()
      cy.get('button.UserFilter-search-button').click()
      cy.contains('.UserListItem-base', 'Bee Trantow')
      cy.contains('.UserListItem-base', 'admin')
    })

    it('can search by manager role after button press', () => {
      cy.get('.RoleChip').click({ multiple: true })
      cy.contains('.RoleChip', 'manager').click()
      cy.get('button.UserFilter-search-button').click()
      cy.contains('.UserListItem-base', 'Herman Schmidt')
      cy.contains('.UserListItem-base', 'manager')
    })

    it('can search by developer role after button press', () => {
      cy.get('.RoleChip').click({ multiple: true })
      cy.contains('.RoleChip', 'developer').click()
      cy.get('button.UserFilter-search-button').click()
      cy.contains('.UserListItem-base', 'Thorsten Andersson')
      cy.contains('.UserListItem-base', 'developer')
    })

    it('can search by regular role after button press', () => {
      cy.get('.RoleChip').click({ multiple: true })
      cy.contains('.RoleChip', 'regular').click()
      cy.get('button.UserFilter-search-button').click()
      cy.contains('.UserListItem-base', 'Madonna Berge')
      cy.contains('.UserListItem-base', 'regular')
    })

    it('can search by guest role after button press', () => {
      cy.get('.RoleChip').click({ multiple: true })
      cy.contains('.RoleChip', 'guest').click()
      cy.get('button.UserFilter-search-button').click()
      cy.contains('No users found')
    })

    it('displays appropriate message when no users found with filter', () => {
      cy.get('input#UserFilter-search-input').click().type('Th3r3 1s n0 w4y th1s 3x1st{enter}')
      cy.contains('No users found')
    })
  })
})
