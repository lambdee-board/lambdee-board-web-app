Cypress.Commands.add('login', (email = 'b-spinka@example.com', password = 'password') => {
  cy.visit('/login')
  cy.get('#login-email').type(email)
  cy.get('input[type="password"]').type(password)
  cy.contains('Login').click()
})
