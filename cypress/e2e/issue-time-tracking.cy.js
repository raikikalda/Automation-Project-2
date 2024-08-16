import { faker } from '@faker-js/faker';

// Variables
const randomWord = faker.word.noun();
const randomWords = faker.word.words(5, { separator: ' ' });
const issueModal = '[data-testid="modal:issue-create"]';
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const inputNumber = 'input[placeholder="Number"]';
const inputEstimateHours = 6;
const editedEstimateHours = 4;
const inputTimeSpent = 2;
const inputTimeRemaining = 2;
const buttonStopWatch = '[data-testid="icon:stopwatch"]';
const modalTracking = '[data-testid="modal:tracking"]';

// Functions
function fillInDiscription() {
  cy.get('.ql-editor').type(randomWords);
  cy.get('.ql-editor').should('have.text', randomWords);
}

function fillInTitle() {
  cy.get('input[name="title"]').type(randomWord);
  cy.get('input[name="title"]').should('have.value', randomWord);
}

function selectIssueBug() {
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]')
    .wait(1000)
    .trigger('mouseover')
    .trigger('click');
  cy.get('[data-testid="icon:bug"]').should('be.visible');
}

function selectPriorityLow() {
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Low"]').click();
}

function selectReporterBabyYoda() {
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Baby Yoda"]').click();
}

function clickCreateIssueButton() {
  cy.get('button[type="submit"]').click().wait(30000);
}

function createIssue() {
  cy.get(issueModal).within(() => {
    fillInDiscription();
    fillInTitle();
    selectIssueBug();
    selectPriorityLow();
    selectReporterBabyYoda();
    clickCreateIssueButton();
  });
}

function openCreatedIssue() {
  cy.contains(randomWord).should('be.visible').click();
}

function inputEstimateTime() {
  cy.get(inputNumber)
    .should('have.value', '')
    .type(inputEstimateHours)
    .should('have.value', inputEstimateHours);
  cy.get(buttonStopWatch)
    .siblings()
    .should('contain.text', 'No time logged')
    .should('contain.text', `${inputEstimateHours}h estimated`);
}

function openModalTracking() {
  cy.get(buttonStopWatch).click();
}

function fillInTimeSpent() {
  cy.get(inputNumber)
    .eq(0)
    .should('have.value', '')
    .type(inputTimeSpent)
    .should('have.value', inputTimeSpent);
}

function clearTimeSpent() {
  cy.get(inputNumber)
    .eq(0)
    .should('have.value', inputTimeSpent)
    .clear()
    .should('have.value', '');
}

function fillInTimeRemaining() {
  cy.get(inputNumber)
    .eq(1)
    .should('have.value', '')
    .type(inputTimeRemaining)
    .should('have.value', inputTimeRemaining);
}

function clearTimeRemaining() {
  cy.get(inputNumber)
    .eq(1)
    .should('have.value', inputTimeRemaining)
    .clear()
    .should('have.value', '');
}

function clickDone() {
  cy.contains('button', 'Done').click().should('not.exist');
}

function editedEstimateTime() {
  cy.get(inputNumber)
    .should('have.value', inputEstimateHours)
    .clear()
    .type(editedEstimateHours)
    .should('have.value', editedEstimateHours);
  cy.get(buttonStopWatch)
    .siblings()
    .should('contain.text', `${inputTimeSpent}h logged`);
  cy.get(buttonStopWatch)
    .siblings()
    .should('contain.text', `${inputTimeRemaining}h logged`);
}
// Test case

describe('Creating issue and testing time tracking', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create issue and test time tracking functionality', () => {
    createIssue();
    openCreatedIssue();
    getIssueDetailsModal().within(() => {
      inputEstimateTime();
      openModalTracking();
    });
    cy.get(modalTracking).within(() => {
      fillInTimeSpent();
      fillInTimeRemaining();
      clickDone();
    });
    getIssueDetailsModal().within(() => {
      editedEstimateTime();
      openModalTracking();
    });
    cy.get(modalTracking).within(() => {
      clearTimeSpent();
      clearTimeRemaining();
      clickDone();
    });
    getIssueDetailsModal().within(() => {
      cy.get(buttonStopWatch)
        .siblings()
        .should('contain.text', `No time logged`);
      cy.get(buttonStopWatch)
        .siblings()
        .should('contain.text', `${editedEstimateHours}h estimated`);
      cy.get(inputNumber)
        .should('have.value', editedEstimateHours)
        .clear()
        .should('have.value', '');
      cy.get(buttonStopWatch)
        .siblings()
        .should('contain.text', 'No time logged');
    });
  });
});
