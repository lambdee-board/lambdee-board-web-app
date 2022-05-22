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
    it('switches between add task button and add task input field', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskList-new-task').should('exist')
      cy.get('.TaskList-new-task-cancel').should('exist').click({ multiple: true })
      cy.get('.TaskList-new-task-cancel').should('not.exist')
      cy.get('.TaskList-new-task-button').should('exist').click({ multiple: true })
      cy.get('.TaskList-new-task-button').should('not.exist')
    })
    it('inputs string into add task input field', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.css-rhrbtd-MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
    })

    it('can drag list between to the middle', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').eq(0).trigger('dragstart')
      cy.get('.TaskList-header').eq(2).trigger('dragenter', 'right')
      cy.get('.TaskList-header').eq(2).trigger('drop')

      cy.get('.TaskList-header-text').eq(2).contains('Backlog')
    })
    it('can drag list from the middle to first position', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').eq(2).trigger('dragstart')
      cy.get('.TaskList-header').eq(0).trigger('dragenter', 'left')
      cy.get('.TaskList-header').eq(0).trigger('drop')
    })
    it('can drag list from the middle to last position', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').eq(0).trigger('dragstart')
      cy.get('.TaskList-header').eq(-1).trigger('dragenter', 'right')
      cy.get('.TaskList-header').eq(-1).trigger('drop')

      cy.get('.TaskList-header-text').eq(-1).contains('Backlog')
    })
  })
})
