describe('Navbar', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
  })

  it('displays the navbar with the logo', () => {
    cy.get('header h6').first().should('have.text', 'Lambdee')
  })

  it('can interact with dropdown buttons', () => {
    // Workspaces
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Workspaces').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()

    // Recent
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Recent').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()

    // Actions
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Actions').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()

    // My account avatar
    cy.get('div.MuiModal-root').should('not.exist')
    cy.get('button.IconButton-user-avatar').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()
  })
})
