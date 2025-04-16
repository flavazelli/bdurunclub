describe('Login Flow', () => {
    beforeEach(() => {
      cy.visit('/login'); // Navigate to the login page
    });
  
    it('should successfully log in a user', () => {
      // Fill out the login form
      cy.get('input#email').type('francis.lavazelli@gmail.com');
      cy.get('input#password').type('password');
  
      // Submit the form
      cy.get('form').submit();
  
      // Verify redirection to the dashboard
      cy.url().should('include', '/members/dashboard');
      cy.contains('Your Registered Runs').should('exist');
    });
  
    it('should show an error for invalid credentials', () => {
      // Fill out the login form with invalid credentials
      cy.get('input#email').type('invalid.email@gmail.com');
      cy.get('input#password').type('WrongPassword123!');
  
      // Submit the form
      cy.get('form').submit();
  
      // Verify error message
      cy.contains('Something went wrong. Please try again.').should('be.visible');
    });
  
    it('should redirect to signup page when clicking "Sign Up"', () => {
      // Click the "Sign Up" link
      cy.contains('Sign Up').click();
  
      // Verify redirection to the signup page
      cy.url().should('include', '/signup');
      cy.contains('Join the Baie D\'Urfé Social Run Club').should('exist');
    });
  });