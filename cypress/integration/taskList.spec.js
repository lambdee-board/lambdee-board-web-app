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
      cy.get('.TaskList-new-task-button').should('exist').click({ multiple: true })
      cy.get('.css-rhrbtd-MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
    })
  })
  //   it('can interact with dropdown buttons', () => {
  //     // Workspaces
  //     cy.get('div.MuiModal-root').should('not.exist')
  //     cy.contains('Workspaces').click()
  //     cy.get('div.MuiModal-root').should('exist')
  //     cy.get('div.MuiBackdrop-root').first().click()

  //     // Recent
  //     cy.get('div.MuiModal-root').should('not.exist')
  //     cy.contains('Recent').click()
  //     cy.get('div.MuiModal-root').should('exist')
  //     cy.get('div.MuiBackdrop-root').first().click()

  //     // Actions
  //     cy.get('div.MuiModal-root').should('not.exist')
  //     cy.contains('Actions').click()
  //     cy.get('div.MuiModal-root').should('exist')
  //     cy.get('div.MuiBackdrop-root').first().click()

//     // My account avatar
//     cy.get('div.MuiModal-root').should('not.exist')
//     cy.get('button.IconButton-user-avatar').click()
//     cy.get('div.MuiModal-root').should('exist')
//     cy.get('div.MuiBackdrop-root').first().click()
//   })
})
