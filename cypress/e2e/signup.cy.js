describe('Signup Flow', () => {
  beforeEach(() => {
    cy.visit('/signup'); // Navigate to the signup page
  });

  it('should successfully sign up a new user', () => {
    // Fill out the signup form
    cy.get('input#firstName').type('Francis');
    cy.get('input#lastName').type('Lavazelli');
    cy.get('input#email').type('francis.lavazelli+test@gmail.com');
    cy.get('input#password').type('TestPassword123!');
    cy.get('input#confirmPassword').type('TestPassword123!');

    // Submit the form
    cy.get('form').submit();

    // Verify success modal
    cy.get('.modal-content').should('be.visible');
    cy.contains('Check Your Email!').should('exist');
  });

  it('should show an error for mismatched passwords', () => {
    // Fill out the signup form with mismatched passwords
    cy.get('input#firstName').type('Francis');
    cy.get('input#lastName').type('Lavazelli');
    cy.get('input#email').type('francis.lavazelli+test@gmail.com');
    cy.get('input#password').type('TestPassword123!');
    cy.get('input#confirmPassword').type('DifferentPassword123!');

    // Submit the form
    cy.get('form').submit();

    // Verify error message
    cy.contains("Passwords don't match.").should('be.visible');
  });

  it('should show an error for an already registered email', () => {
    // Fill out the signup form with an existing email
    cy.get('input#firstName').type('Francis');
    cy.get('input#lastName').type('Lavazelli');
    cy.get('input#email').type('francis.lavazelli@gmail.com'); // Use an existing email
    cy.get('input#password').type('TestPassword123!');
    cy.get('input#confirmPassword').type('TestPassword123!');

    // Submit the form
    cy.get('form').submit();

    // Verify error message
    cy.contains('Something went wrong. Please try again.').should('be.visible');
  });
});