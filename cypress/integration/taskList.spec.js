describe('TaskList', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
    cy.contains('Workspaces').click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('body').first().click()
    cy.get('div.Sidebar-wrapper').should('exist')
    cy.get('div.ListItem-board').first().click()
  })
  context('TaskList', () => {
    // tests for displaying tasklist properly
    // should be performed before this
    it('add new task', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskList-new-task').should('exist')
      cy.get('.TaskList-new-task-cancel').should('exist').click({ multiple: true })
      cy.get('.TaskList-new-task-cancel').should('not.exist')
      cy.get('.TaskList-new-task-button').should('exist').click({ multiple: true })
      cy.get('.TaskList-new-task-button').should('not.exist')
      cy.get('.css-rhrbtd-MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
    })
  })
})
