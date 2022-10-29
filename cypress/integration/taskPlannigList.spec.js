describe('TaskList', () => {
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
      .type('s3cr4t_p4ss')
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
      cy.get('.TaskListPlanning-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskListPlanning-new-task').should('exist')
      cy.get('.TaskListPlanning-new-task-cancel').should('exist').click({ multiple: true })
      cy.get('.TaskListPlanning-new-task-cancel').should('not.exist')
    })

    it('inputs string into add task input field and cancels', () => {
      cy.get('.TaskListPlanning-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskListPlanning-new-task textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
      cy.get('body').type('{esc}')
      cy.get('.TaskListPlanning-new-task-button').should('exist')
    })

    it('adds a new task', () => {
      cy.get('.TaskListPlanning-new-task-button').should('exist')
        .click({ multiple: true })
      cy.get('.TaskListPlanning-new-task textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('New Test Task{enter}')
      cy.wait(500)
      cy.contains('New Test Task')
    })
  })

  context('Drag and Drop', () => {
    it('can drag Backlog list to the middle', () => {
      cy.get('.TaskListPlanning-header-text').should('exist')

      cy.get('.TaskListPlanning-header').contains('To do').trigger('dragstart')
      cy.get('.TaskListPlanning-header').eq(1)
        .trigger('dragenter', 'top')
        .trigger('drop', 'bottom')

      cy.contains('To do')
    })

    it('can drag To do list to second position', () => {
      cy.get('.TaskListPlanning-header-text').should('exist')

      cy.get('.TaskListPlanning-header').contains('To do').trigger('dragstart')
      cy.get('.TaskListPlanning-header').eq(0)
        .trigger('dragenter', 'bottom')
        .trigger('drop')

      cy.contains('To do')
    })

    it('can drag Backlog list to last position', () => {
      cy.get('.TaskListPlanning-header-text').should('exist')

      cy.get('.TaskListPlanning-header').contains('To do').trigger('dragstart')
      cy.get('.TaskListPlanning-header').eq(-1)
        .trigger('dragenter', 'top')
        .trigger('drop')

      cy.contains('To do')
    })
  })
})
