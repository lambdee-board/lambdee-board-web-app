
describe('LoginView', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')
    // clear cookies!
    cy.clearCookies()
    // clear localStorage
    cy.clearLocalStorage()
    cy.visit('/login')
  })
  context('Login', () => {
    it('logs into account', () => {
      cy.contains('Lambdee')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('b-spinka@example.com')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('s3cr4t_p4ss')
      cy.contains('Login').click()
    })

    it('displays error message', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('email')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('password')
      cy.contains('Login').click()
      cy.contains('Incorrect credentials!')
    })
    it('resets password', () => {
      cy.contains('Forgot password?').click()
      cy.contains('Reset Password').click()
      cy.contains('Back to login').click()
    })
    it('logs out of account', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('b-spinka@example.com')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('s3cr4t_p4ss')
      cy.contains('Login').click()
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.contains('Logout').click()
    })
    it('resets password from account view', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('b-spinka@example.com')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('s3cr4t_p4ss')
      cy.contains('Login').click()
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.contains('Account').click()
      cy.contains('Reset Password').click()
    })
  })
})
