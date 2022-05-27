describe('TaskCardModal', () => {
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
  context('Shows task card modal with task information', () => {
    it('Display and close task card modal', () => {
      cy.get('.TaskCard-label').parent().last()
        .click()
      cy.get('div.TaskCardModal-wrapper').should('exist')
      cy.get('body').click(0, 0)
      cy.get('div.TaskCardModal-wrapper').should('not.exist')
    })
  })
})
