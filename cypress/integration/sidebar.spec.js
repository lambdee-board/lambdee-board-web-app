describe('Sidebar', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
    cy.contains('Workspaces').click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('body').first().click()
  })
  // tests for displaying sidebar properly should be performed before this
  context('Add new Board', () => {
    it('switches between add board button and add board input field', () => {
      cy.get('.Sidebar-new-board-button').should('exist')
        .click()
      cy.get('.Sidebar-new-board').should('exist')
      cy.get('.Sidebar-new-board-cancel').should('exist').click()
      cy.get('.Sidebar-new-board-cancel').should('not.exist')
    })

    it('inputs string into add board input field and cancels', () => {
      cy.get('.Sidebar-new-board-button').should('exist')
        .click({ multiple: true })
      cy.get('.Sidebar-new-board textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
      cy.get('body').type('{esc}')
      cy.get('.Sidebar-new-board-button').should('exist')
    })

    it('adds a new board', () => {
      cy.get('.Sidebar-new-board-button').should('exist')
        .click()
      cy.get('.Sidebar-new-board textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('New Board Board{enter}')
      cy.wait(500)
      cy.get('.Sidebar').contains('New Board Board')
    })
  })
})
