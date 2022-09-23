describe('TaskList', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
    cy.contains('Login').click()
    cy.contains('Workspaces').click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('body').first().click()
    cy.get('div.Sidebar-wrapper').should('exist')
    cy.get('div.ListItem-board').first().click()
  })

  context('Add new Task', () => {
    // tests for displaying tasklist properly
  // should be performed before this
    it('switches between add task button and add task input field', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskList-new-task').should('exist')
      cy.get('.TaskList-new-task-cancel').should('exist').click({ multiple: true })
      cy.get('.TaskList-new-task-cancel').should('not.exist')
    })

    it('inputs string into add task input field and cancels', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskList-new-task textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
      cy.get('body').type('{esc}')
      cy.get('.TaskList-new-task-button').should('exist')
    })

    it('adds a new task', () => {
      cy.get('.TaskList-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskList-new-task textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('New Test Task{enter}')
      cy.wait(500)
      cy.get('.TaskCard').contains('New Test Task')
    })
  })

  context('Drag and Drop', () => {
    it('can drag Backlog list to the middle', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').contains('Backlog').trigger('dragstart')
      cy.get('.TaskList-header').eq(3)
        .trigger('dragenter', 'left')
        .trigger('drop', 'right')

      cy.contains('Backlog')
    })

    it('can drag Backlog list to second position', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').contains('Backlog').trigger('dragstart')
      cy.get('.TaskList-header').eq(0)
        .trigger('dragenter', 'right')
        .trigger('drop')

      cy.contains('Backlog')
    })

    it('can drag Backlog list to last position', () => {
      cy.get('.TaskList-header-text').should('exist')

      cy.get('.TaskList-header').contains('Backlog').trigger('dragstart')
      cy.get('.TaskList-header').eq(-1)
        .trigger('dragenter', 'left')
        .trigger('drop')

      cy.contains('Backlog')
    })
  })
})
