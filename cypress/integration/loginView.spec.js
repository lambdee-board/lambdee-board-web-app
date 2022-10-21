
describe('LoginView', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')
    // clear cookies!
    cy.clearCookies()
    cy.visit('/login')
  })
  context('Login', () => {
    it('shows LoginView', () => {
      cy.contains('Lambdee')
      cy.contains('Login')
    })

    it('displays error massage', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('email')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('password')
      cy.contains('Login').click()
      cy.contains('Incorrect credentials')
    })
    it('resets password', () => {
      cy.contains('Forgot password?').click()
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('email')
      cy.contains('Reset Password').click()
      cy.contains('Back to login').click()
    })
    it('logs out of account', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('email')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('password')
      cy.contains('Login').click()
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.contains('Logout').click()
    })
    it('resets password from account view', () => {
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
        .type('email')
      cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
        .type('password')
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
