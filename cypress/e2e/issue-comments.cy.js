describe('Issue comments creating, editing and deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .wait(30000)
      .then((url) => {
        cy.visit(url + '/board').wait(30000);
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it('Should create a comment successfully', () => {
    const comment = 'TEST_COMMENT';

    getIssueDetailsModal().within(() => {
      cy.contains('Add a comment...').click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.contains('Add a comment...').should('exist');
      cy.get('[data-testid="issue-comment"]').should('contain', comment);
    });
  });

  it('Should edit a comment successfully', () => {
    const previousComment = 'An old silent pond...';
    const comment = 'TEST_COMMENT_EDITED';

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains('Edit')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Add a comment..."]')
        .should('contain', previousComment)
        .clear()
        .type(comment);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.get('[data-testid="issue-comment"]')
        .should('contain', 'Edit')
        .and('contain', comment);
    });
  });

  it('Should delete a comment successfully', () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains('Delete')
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Delete comment')
      .click()
      .should('not.exist');

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should('not.exist');
  });
});

// Variables
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const issueComment = '[data-testid="issue-comment"]';
const comment = 'RAIKI_COMMENT';
const commentEdited = 'RAIKI_COMMENT_EDITED';
const fieldAddComment = 'textarea[placeholder="Add a comment..."]';
const deleteConfirmWindow = '[data-testid="modal:confirm"]';

// Functions
function clickAddComment() {
  cy.contains('Add a comment...').click();
}

function clickSaveAndAssertNotVisible() {
  cy.contains('button', 'Save').click().should('not.exist');
}

function clickEditCommentAssertEditButtonNotVisible() {
  cy.get(issueComment).first().contains('Edit').click().should('not.exist');
}

function addNewComment() {
  cy.get(fieldAddComment).type(comment);
}

function assertAddCommentFieldIsVisible() {
  cy.contains('Add a comment...').should('exist');
}

function assertAddedCommentIsVisible() {
  cy.get(issueComment).should('contain', comment);
}

function assertEditedCommentIsVisible() {
  cy.get(issueComment).should('contain', commentEdited);
}

function editComment() {
  cy.get(fieldAddComment)
    .should('contain', comment)
    .clear()
    .type(commentEdited);
}

function clickDeleteAddedComment() {
  cy.get(issueComment)
    .contains(commentEdited)
    .parent()
    .contains('Delete')
    .click();
}

function clickDeleteCommentAndAssert() {
  cy.get(deleteConfirmWindow)
    .contains('button', 'Delete comment')
    .click()
    .should('not.exist');
}

function assertCommentDeleted() {
  getIssueDetailsModal();
  cy.get(issueComment).should('not.contain', commentEdited);
}

// Test case
describe('Create, edit and delete comment in one test case', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .wait(30000)
      .then((url) => {
        cy.visit(url + '/board').wait(30000);
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  it('Should create, edit and delete a comment successfully', () => {
    getIssueDetailsModal().within(() => {
      //Add comment
      clickAddComment();
      addNewComment();
      clickSaveAndAssertNotVisible();
      assertAddCommentFieldIsVisible();
      assertAddedCommentIsVisible();
      //Edit comment
      clickEditCommentAssertEditButtonNotVisible();
      editComment();
      clickSaveAndAssertNotVisible();
      assertAddCommentFieldIsVisible();
      assertEditedCommentIsVisible();
    });
    //Delete comment
    clickDeleteAddedComment();
    clickDeleteCommentAndAssert();
    assertCommentDeleted();
  });
});
