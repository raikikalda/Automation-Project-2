describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board').wait(25000);
        cy.contains('This is an issue of type: Task.').click();
        cy.get('textarea[placeholder="Short summary"]').should(
          'have.text',
          'This is an issue of type: Task.'
        );
      });
  });

  //Test Case 1: Issue Deletion
  it('Delete issue and assert the deletion', () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('button')
      .contains('Delete issue')
      .should('be.visible')
      .click()
      .wait(5000);
    cy.reload().wait(25000);
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]').should('have.length', '3');
        cy.contains('This is an issue of type: Task.').should('not.exist');
      });
  });
  //Test Case 2: Issue Deletion Cancellation
  it('Cancel Deletion of the Issue and assert that Issue is not deleted', () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('button').contains('Cancel').should('be.visible').click();
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="icon:close"]').first().should('be.visible').click();
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]').should('have.length', '4');
        cy.contains('This is an issue of type: Task.').should('be.visible');
      });
  });
});
